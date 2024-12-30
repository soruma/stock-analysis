#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StockAnalysisStack } from '../lib/stock-analysis-stack';
import { ResourceName, kebabToCamelCase } from '../lib/resource-name';

const systemEnv = process.env.SYSTEM_ENV ? process.env.SYSTEM_ENV : 'dev';
const resourceName = new ResourceName('stock-snalysis', systemEnv);

const app = new cdk.App();
new StockAnalysisStack(app, resourceName.stackName('base'), {
    resourceName,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
});
