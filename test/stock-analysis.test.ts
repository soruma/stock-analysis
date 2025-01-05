import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { expect, it } from 'vitest';

import { ResourceName } from '../lib/resource-name';
import { StockAnalysisStack } from '../lib/stock-analysis-stack';

const systemEnv = 'test';
const bucketNameSuffix = 'dummy-suffix';
const resourceName = new ResourceName('stock-snalysis', systemEnv, bucketNameSuffix);
const abacusRoleArn = 'arn:aws:iam::123456789012:role/example-role';
const previousRefreshToken = 'previousRefreshToken';

it('snapshot test', () => {
  const app = new cdk.App();
  const stackName = resourceName.stackName('base');
  const stack = new StockAnalysisStack(app, stackName, {
    resourceName,
    previousRefreshToken,
    abacusRoleArn,
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
