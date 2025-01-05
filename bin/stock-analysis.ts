#!/usr/bin/env node
import * as path from 'node:path';
import { SSMClient } from '@aws-sdk/client-ssm';
import { fromEnv } from '@aws-sdk/credential-providers';
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import { getEnvVariable, getRefreshToken } from 'stock-analysis-utils';

import { ResourceName } from '../lib/resource-name';
import { StockAnalysisStack } from '../lib/stock-analysis-stack';

dotenv.config({ path: path.resolve(__dirname, '../.stock-analysis.env') });
dotenv.config({ path: path.resolve(__dirname, '../.jquants.env') });
dotenv.config({ path: path.resolve(__dirname, '../.abacus.env') });

const systemEnv = process.env.SYSTEM_ENV ? process.env.SYSTEM_ENV : 'dev';
const bucketNameSuffix = getEnvVariable('BUCKET_NAME_SUFFIX');
const abacusRoleArn = getEnvVariable('ABACUS_IAM_ROLE_ARN');
const resourceName = new ResourceName('stock-snalysis', systemEnv, bucketNameSuffix);

const app = new cdk.App();

(async () => {
  const credentials = fromEnv();
  const ssmClient = new SSMClient({ credentials });

  let previousRefreshToken: string;
  try {
    previousRefreshToken =
      (await getRefreshToken(ssmClient, resourceName.parameterStoreKey('refresh-token'))) ?? 'dummy-value';
  } catch {
    previousRefreshToken = 'dummy-value';
  }

  new StockAnalysisStack(app, resourceName.stackName('base'), {
    resourceName,
    abacusRoleArn,
    previousRefreshToken,
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  });
})();
