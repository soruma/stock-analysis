import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';

import { Duration } from 'aws-cdk-lib';
import { Rule, RuleTargetInput, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { CfnDatabase, CfnTable } from 'aws-cdk-lib/aws-glue';
import { ArnPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Architecture, Code, IFunction, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Bucket, BucketPolicy } from 'aws-cdk-lib/aws-s3';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import type { Construct } from 'constructs';

import { ResourceName } from './resource-name';

interface StockAnalysisLambdaStackProps extends cdk.StackProps {
  resourceName: ResourceName;
  abacusRoleArn: string;
  previousRefreshToken: string;
}

export class StockAnalysisStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StockAnalysisLambdaStackProps) {
    super(scope, id, props);

    /**
     * S3
     */
    const dataBucket = this.createDataBucket(props);
    this.createQueryBucket(props);

    /**
     * Parameter Store
     */
    const refreshTokenParameterStore = new StringParameter(
      this,
      props.resourceName.parameterStoreName('refresh-token'),
      {
        parameterName: props.resourceName.parameterStoreKey('refresh-token'),
        stringValue: props.previousRefreshToken,
      },
    );

    /**
     * Glue
     */
    this.createGlue(props, dataBucket);

    /**
     * Lambda Layer
     */
    const modulesLambdaLayer = new LayerVersion(
      this,
      props.resourceName.lambdaLayerVersionName('stock-analysis-modules'),
      {
        code: Code.fromAsset(this.lambdaLayerPath('stock-analysis-modules')),
        compatibleArchitectures: [Architecture.ARM_64],
      },
    );
    const utilsLambdaLayer = new LayerVersion(this, props.resourceName.lambdaLayerVersionName('stock-analysis-utils'), {
      code: Code.fromAsset(this.lambdaLayerPath('stock-analysis-utils')),
      compatibleArchitectures: [Architecture.ARM_64],
    });
    const jQuantsLambdaLayer = new LayerVersion(this, props.resourceName.lambdaLayerVersionName('j-quants'), {
      code: Code.fromAsset(this.lambdaLayerPath('j-quants')),
      compatibleArchitectures: [Architecture.ARM_64],
    });

    /**
     * Lambda
     */
    const refreshTokenFunction = this.createRefreshTokenFunction(props, [
      modulesLambdaLayer,
      utilsLambdaLayer,
      jQuantsLambdaLayer,
    ]);
    refreshTokenParameterStore.grantWrite(refreshTokenFunction);

    const downloadListedInfoFunction = this.createDownloadListedInfoFunction(props, dataBucket, [
      modulesLambdaLayer,
      utilsLambdaLayer,
      jQuantsLambdaLayer,
    ]);
    dataBucket.grantPut(downloadListedInfoFunction);
    refreshTokenParameterStore.grantRead(downloadListedInfoFunction);

    const downloadPricesDailyQuotesFunction = this.createDownloadPricesDailyQuotesFunction(props, dataBucket, [
      modulesLambdaLayer,
      utilsLambdaLayer,
      jQuantsLambdaLayer,
    ]);
    dataBucket.grantPut(downloadPricesDailyQuotesFunction);
    refreshTokenParameterStore.grantRead(downloadPricesDailyQuotesFunction);

    /**
     * EventBridge
     */
    this.createRefreshTokenEventRule(props, refreshTokenFunction);
    this.createDownloadEventRule(props, [downloadListedInfoFunction, downloadPricesDailyQuotesFunction]);
  }

  createDataBucket(props: StockAnalysisLambdaStackProps): Bucket {
    const dataBucketName = props.resourceName.s3Name('data');

    const dataBucketKey = new Key(this, props.resourceName.kmsName('data-bucket-key'), {
      alias: 'alias/data-bucket-key',
      enableKeyRotation: true,
    });
    dataBucketKey.addToResourcePolicy(
      new PolicyStatement({
        sid: 'Grant Abacus.AI KMS access',
        effect: Effect.ALLOW,
        principals: [new ArnPrincipal(props.abacusRoleArn)],
        actions: ['kms:Decrypt', 'kms:GenerateDataKey*'],
        resources: ['*'],
      }),
    );

    const dataBucket = new Bucket(this, dataBucketName, {
      bucketName: dataBucketName,
      encryptionKey: dataBucketKey,
    });

    const bucketPolicy = new BucketPolicy(this, props.resourceName.bucketPolicyName('data-bucket-policy'), {
      bucket: dataBucket,
    });
    bucketPolicy.document.addStatements(
      new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new ArnPrincipal(props.abacusRoleArn)],
        actions: ['s3:GetObject', 's3:ListBucket'],
        resources: [`${dataBucket.bucketArn}/*`, dataBucket.bucketArn],
      }),
    );

    return dataBucket;
  }

  createQueryBucket(props: StockAnalysisLambdaStackProps): Bucket {
    return new Bucket(this, props.resourceName.s3Name('query'), {
      bucketName: props.resourceName.s3Name('query'),
    });
  }

  createRefreshTokenFunction(props: StockAnalysisLambdaStackProps, layers: LayerVersion[]) {
    const lambdaName = 'refresh-token';

    return new NodejsFunction(this, props.resourceName.lambdaName(lambdaName), {
      entry: this.lambdaPath(lambdaName, ['src', 'index.ts']),
      handler: 'handler',
      architecture: Architecture.ARM_64,
      runtime: Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      environment: {
        JQUANTS_API_MAIL_ADDRESS: process.env.JQUANTS_API_MAIL_ADDRESS || '',
        JQUANTS_API_PASSWORD: process.env.JQUANTS_API_PASSWORD || '',
        JQUANTS_API_REFRESH_TOKEN_PARAMETER_KEY: props.resourceName.parameterStoreKey(lambdaName),
      },
      logRetention: RetentionDays.THIRTEEN_MONTHS,
      layers,
      bundling: {
        externalModules: ['@aws-sdk', 'j-quants', 'stock-analysis-utils'],
      },
    });
  }

  createDownloadListedInfoFunction(props: StockAnalysisLambdaStackProps, dataBucket: Bucket, layers: LayerVersion[]) {
    const lambdaName = 'download-listed-info';

    return new NodejsFunction(this, props.resourceName.lambdaName(lambdaName), {
      entry: this.lambdaPath(lambdaName, ['src', 'index.ts']),
      handler: 'handler',
      architecture: Architecture.ARM_64,
      runtime: Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(30),
      environment: {
        JQUANTS_API_REFRESH_TOKEN_PARAMETER_KEY: props.resourceName.parameterStoreKey('refresh-token'),
        S3_BUCKET_NAME: dataBucket.bucketName,
      },
      logRetention: RetentionDays.THIRTEEN_MONTHS,
      layers,
      bundling: {
        externalModules: ['@aws-sdk', 'j-quants', 'stock-analysis-utils'],
      },
    });
  }

  createDownloadPricesDailyQuotesFunction(
    props: StockAnalysisLambdaStackProps,
    dataBucket: Bucket,
    layers: LayerVersion[],
  ) {
    const lambdaName = 'download-prices-daily-quotes';

    return new NodejsFunction(this, props.resourceName.lambdaName(lambdaName), {
      entry: this.lambdaPath(lambdaName, ['src', 'index.ts']),
      handler: 'handler',
      architecture: Architecture.ARM_64,
      runtime: Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(30),
      environment: {
        JQUANTS_API_REFRESH_TOKEN_PARAMETER_KEY: props.resourceName.parameterStoreKey('refresh-token'),
        S3_BUCKET_NAME: dataBucket.bucketName,
      },
      logRetention: RetentionDays.THIRTEEN_MONTHS,
      layers,
      bundling: {
        externalModules: ['@aws-sdk', 'j-quants', 'stock-analysis-utils'],
      },
    });
  }

  createRefreshTokenEventRule(props: StockAnalysisLambdaStackProps, refreshTokenFunction: IFunction): void {
    const rule = new Rule(this, props.resourceName.eventRoleName('refresh-token-role'), {
      schedule: Schedule.rate(Duration.days(6)),
    });

    rule.addTarget(
      new LambdaFunction(refreshTokenFunction, {
        event: RuleTargetInput.fromObject({
          message: `Scheduled event for ${refreshTokenFunction.functionName} to run at intervals shorter than one week`,
        }),
      }),
    );
  }

  createDownloadEventRule(props: StockAnalysisLambdaStackProps, targetFunctions: IFunction[]): void {
    const rule = new Rule(this, props.resourceName.eventRoleName('daily-role'), {
      schedule: Schedule.cron({ minute: '0', hour: '17' }),
    });

    for (const targetFunction of targetFunctions) {
      rule.addTarget(
        new LambdaFunction(targetFunction, {
          event: RuleTargetInput.fromObject({
            message: `Scheduled event for ${targetFunction.functionName}`,
          }),
        }),
      );
    }
  }

  createGlue(props: StockAnalysisLambdaStackProps, dataBucket: Bucket): void {
    const glueDatabase = new CfnDatabase(this, props.resourceName.glueDatabaseName(), {
      catalogId: this.account,
      databaseInput: {
        name: props.resourceName.glueDatabaseName(),
      },
    });

    new CfnTable(this, props.resourceName.glueTableId('info'), {
      catalogId: this.account,
      databaseName: glueDatabase.ref,
      tableInput: {
        name: props.resourceName.glueTableName('info'),
        tableType: 'EXTERNAL_TABLE',
        storageDescriptor: {
          columns: [
            {
              name: 'info',
              type: 'array<struct<Date:string,Code:string,CompanyName:string,CompanyNameEnglish:string,Sector17Code:string,Sector17CodeName:string,Sector33Code:string,Sector33CodeName:string,ScaleCategory:string,MarketCode:string,MarketCodeName:string>>',
            },
          ],
          location: `s3://${dataBucket.bucketName}/listed/info/`,
          inputFormat: 'org.apache.hadoop.mapred.TextInputFormat',
          outputFormat: 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat',
          serdeInfo: {
            serializationLibrary: 'org.openx.data.jsonserde.JsonSerDe',
            parameters: {
              'ignore.malformed.json': 'FALSE',
              'dots.in.keys': 'FALSE',
              'case.insensitive': 'TRUE',
              mapping: 'TRUE',
            },
          },
        },
        parameters: {
          classification: 'json',
        },
      },
    });

    new CfnTable(this, props.resourceName.glueTableId('daily-quotes'), {
      catalogId: this.account,
      databaseName: glueDatabase.ref,
      tableInput: {
        name: props.resourceName.glueTableName('daily-quotes'),
        tableType: 'EXTERNAL_TABLE',
        storageDescriptor: {
          columns: [
            {
              name: 'daily_quotes',
              type: 'array<struct<Date:string,Code:string,Open:double,High:double,Low:double,Close:double,UpperLimit:string,LowerLimit:string,Volume:int,TurnoverValue:double,AdjustmentFactor:double,AdjustmentOpen:double,AdjustmentHigh:double,AdjustmentLow:double,AdjustmentClose:double,AdjustmentVolume:double>>',
            },
          ],
          location: `s3://${dataBucket.bucketName}/prices/daily_quotes/`,
          inputFormat: 'org.apache.hadoop.mapred.TextInputFormat',
          outputFormat: 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat',
          serdeInfo: {
            serializationLibrary: 'org.openx.data.jsonserde.JsonSerDe',
            parameters: {
              'ignore.malformed.json': 'FALSE',
              'dots.in.keys': 'FALSE',
              'case.insensitive': 'TRUE',
              mapping: 'TRUE',
            },
          },
        },
        parameters: {
          classification: 'json',
        },
      },
    });
  }

  private lambdaPath(lambdaName: string, handlerPath: string[]): string {
    return path.join(__dirname, '..', 'assets', 'lambdas', lambdaName, ...handlerPath);
  }

  private lambdaLayerPath(layerName: string): string {
    return path.join(__dirname, '..', 'assets', 'lambda-layers', layerName, 'dist', 'layer');
  }
}
