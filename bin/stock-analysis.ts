#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { getEnvVariable } from '../assets/lambda-layers/j-quants/src/utils/getEnvVariable';
import { ResourceName, kebabToCamelCase } from '../lib/resource-name';
import { StockAnalysisStack } from '../lib/stock-analysis-stack';

const systemEnv = process.env.SYSTEM_ENV ? process.env.SYSTEM_ENV : 'dev';
const resourceName = new ResourceName('stock-snalysis', systemEnv);
const abacusRoleArn = getEnvVariable('ABACUS_IAM_ROLE_ARN');

const app = new cdk.App();
new StockAnalysisStack(app, resourceName.stackName('base'), {
  resourceName,
  abacusRoleArn,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
