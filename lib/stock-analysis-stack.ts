import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { Runtime, Architecture } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket } from 'aws-cdk-lib/aws-s3';

import * as path from 'node:path';
import * as dotenv from 'dotenv';

import type { ResourceName } from './resource-name';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Rule, RuleTargetInput, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

dotenv.config({ path: path.resolve(__dirname, '../.jquants.env') });

interface StockAnalysisLambdaStackProps extends cdk.StackProps {
    resourceName: ResourceName;
}

export class StockAnalysisStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: StockAnalysisLambdaStackProps) {
        super(scope, id, props);

        /***
         * S3
         */
        const s3 = new Bucket(this, props.resourceName.s3Name(), {
            bucketName: props.resourceName.s3Name(),
        });

        /***
         * Lambda
         */
        const downloadListedInfoFunction = new NodejsFunction(
            this,
            props.resourceName.lambdaName('download-listed-info'),
            {
                entry: 'assets/lambdas/download-listed-info/index.ts',
                handler: 'handler',
                architecture: Architecture.ARM_64,
                runtime: Runtime.NODEJS_22_X,
                timeout: cdk.Duration.seconds(30),
                environment: {
                    JQUANTS_API_MAIL_ADDRESS: process.env.JQUANTS_API_MAIL_ADDRESS || '',
                    JQUANTS_API_PASSWORD: process.env.JQUANTS_API_PASSWORD || '',
                    S3_BUCKET_NAME: s3.bucketName,
                },
                logRetention: RetentionDays.THIRTEEN_MONTHS,
            },
        );

        s3.grantPut(downloadListedInfoFunction);

        /***
         * EventBridge
         */
        const rule = new Rule(this, 'DailyRule', {
            schedule: Schedule.cron({ minute: '0', hour: '15' }),
        });

        rule.addTarget(
            new LambdaFunction(downloadListedInfoFunction, {
                event: RuleTargetInput.fromObject({
                    message: 'Scheduled Event',
                }),
            }),
        );
    }
}
