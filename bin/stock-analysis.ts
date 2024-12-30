#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StockAnalysisStack } from '../lib/stock-analysis-stack';
import { ResourceName, kebabToCamelCase } from '../lib/resource-name';

const systemEnv = process.env.SYSTEM_ENV ? kebabToCamelCase(process.env.SYSTEM_ENV, { capitalizeFirst: true }) : 'Dev';
const resourceName = new ResourceName('StockSnalysis', systemEnv);

const app = new cdk.App();
new StockAnalysisStack(app, `StockAnalysis${systemEnv}Stack`, {
    resourceName,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
});
