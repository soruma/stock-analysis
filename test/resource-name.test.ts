import { describe, expect, it } from 'vitest';

import {
  ResourceName,
  camelToKebabCase,
  camelToSnakeCase,
  capitalizeFirst,
  kebabToCamelCase,
} from '../lib/resource-name';

describe('ResourceName', () => {
  const systemName = 'my-system';
  const systemEnv = 'dev';
  const bucketNameSuffix = '111111-ffffff';
  const resourceName = new ResourceName(systemName, systemEnv, bucketNameSuffix);

  it('should generate the correct base name', () => {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const baseName = resourceName['baseName']('my-resource');
    expect(baseName).toBe('MySystemMyResourceDev');
  });

  it('should generate the correct S3 name in kebab-case', () => {
    const s3Name = resourceName.s3Name('my-bucket');
    expect(s3Name).toBe('my-system-my-bucket-dev-111111-ffffff');
  });

  it('should generate the correct Bucket policy name', () => {
    const s3Name = resourceName.s3Name('my-bucket');
    expect(s3Name).toBe('my-system-my-bucket-dev-111111-ffffff');
  });

  it('should generate the correct Parameter store name', () => {
    const parameterStoreName = resourceName.parameterStoreName('my-parameter-store');
    expect(parameterStoreName).toBe('MySystemMyParameterStoreDev');
  });

  it('should generate the correct Parameter store key', () => {
    const parameterStoreKey = resourceName.parameterStoreKey('my-parameter-store');
    expect(parameterStoreKey).toBe('/my_system/dev/my-parameter-store');
  });

  it('should generate the correct Glue database id', () => {
    const glueDatabaseId = resourceName.glueDatabaseId();
    expect(glueDatabaseId).toBe('MySystemGluedatabaseDev');
  });

  it('should generate the correct Glue database name', () => {
    const glueDatabaseName = resourceName.glueDatabaseName();
    expect(glueDatabaseName).toBe('my_system_dev');
  });

  it('should generate the correct Glue table id', () => {
    const glueDatabaseName = resourceName.glueTableId('my-glue-table');
    expect(glueDatabaseName).toBe('MySystemMyGlueTableDevGlueTable');
  });

  it('should generate the correct Glue table name', () => {
    const glueDatabaseName = resourceName.glueTableName('my-glue-table');
    expect(glueDatabaseName).toBe('my_system_my_glue_table_dev');
  });

  it('should generate the correct Lambda layer version name', () => {
    const layerName = resourceName.lambdaLayerVersionName('my-lambda-layer');
    expect(layerName).toBe('MySystemMyLambdaLayerDev');
  });

  it('should generate the correct Event role name', () => {
    const eventRoleName = resourceName.eventRoleName('my-event-role');
    expect(eventRoleName).toBe('MySystemMyEventRoleDev');
  });

  it('should generate the correct refreshToken function path', () => {
    const functionName = resourceName.functionPath('refreshToken');
    expect(functionName).toBe('refresh-token');
  });

  it('should generate the correct refreshToken function name', () => {
    const functionName = resourceName.functionName('refreshToken');
    expect(functionName).toBe('refreshToken-dev');
  });

  it('should generate the correct downloadListedInfo function name', () => {
    const functionName = resourceName.functionName('downloadListedInfo');
    expect(functionName).toBe('downloadListedInfo-dev');
  });

  it('should generate the correct downloadListedInfo function name', () => {
    const functionName = resourceName.functionName('downloadPricesDailyQuotes');
    expect(functionName).toBe('downloadPricesDailyQuotes-dev');
  });

  it('should generate correct functionId', () => {
    expect(resourceName.functionId('refreshToken')).toBe('MySystemRefreshTokenDevFunction');
  });

  it('should generate the correct downloadListedInfo id', () => {
    expect(resourceName.functionId('downloadListedInfo')).toBe('MySystemDownloadListedInfoDevFunction');
  });

  it('should generate the correct downloadPricesDailyQuotes id', () => {
    expect(resourceName.functionId('downloadPricesDailyQuotes')).toBe('MySystemDownloadPricesDailyQuotesDevFunction');
  });

  it('should generate the correct Stack name', () => {
    const stackName = resourceName.stackName('my-stack');
    expect(stackName).toBe('MySystemMyStackDev');
  });
});

describe('camelToKebabCase', () => {
  it('should convert camelCase to kebab-case', () => {
    expect(camelToKebabCase('camelCase')).toBe('camel-case');
  });

  it('should convert PascalCase to kebab-case', () => {
    expect(camelToKebabCase('PascalCase')).toBe('pascal-case');
  });

  it('should handle consecutive uppercase letters', () => {
    expect(camelToKebabCase('HTMLParser')).toBe('html-parser');
  });

  it('should handle already kebab-case strings', () => {
    expect(camelToKebabCase('already-kebab-case')).toBe('already-kebab-case');
  });

  it('should handle single words', () => {
    expect(camelToKebabCase('word')).toBe('word');
  });
});

describe('kebabToCamelCase', () => {
  it('should convert a simple kebab-case string to camelCase', () => {
    expect(kebabToCamelCase('hello-world')).toBe('helloWorld');
  });

  it('should handle multiple hyphens correctly', () => {
    expect(kebabToCamelCase('this-is-a-test')).toBe('thisIsATest');
  });

  it('should handle single-word strings', () => {
    expect(kebabToCamelCase('hello')).toBe('hello');
  });

  it('should handle empty strings', () => {
    expect(kebabToCamelCase('')).toBe('');
  });

  it('should handle uppercase letters in the input', () => {
    expect(kebabToCamelCase('HELLO-WORLD')).toBe('helloWorld');
  });

  it('should handle strings with trailing hyphens', () => {
    expect(kebabToCamelCase('hello-world-')).toBe('helloWorld');
  });

  it('should handle strings with leading hyphens', () => {
    expect(kebabToCamelCase('-hello-world')).toBe('helloWorld');
  });

  it('should handle strings with multiple consecutive hyphens', () => {
    expect(kebabToCamelCase('hello--world')).toBe('helloWorld');
  });

  it('should capitalize the first letter when capitalizeFirst option is true', () => {
    expect(kebabToCamelCase('hello-world', { capitalizeFirst: true })).toBe('HelloWorld');
  });

  it('should handle single-word strings with capitalizeFirst option', () => {
    expect(kebabToCamelCase('hello', { capitalizeFirst: true })).toBe('Hello');
  });
});

describe('camelToSnakeCase', () => {
  it('should convert camelCase to snake_case', () => {
    expect(camelToSnakeCase('camelCase')).toBe('camel_case');
  });

  it('should handle multiple uppercase letters', () => {
    expect(camelToSnakeCase('thisIsATest')).toBe('this_is_a_test');
  });

  it('should handle single word inputs', () => {
    expect(camelToSnakeCase('word')).toBe('word');
  });

  it('should handle empty strings', () => {
    expect(camelToSnakeCase('')).toBe('');
  });

  it('should handle strings with no uppercase letters', () => {
    expect(camelToSnakeCase('lowercase')).toBe('lowercase');
  });

  it('should handle strings with numbers', () => {
    expect(camelToSnakeCase('test123Case')).toBe('test123_case');
  });
});

describe('capitalizeFirst', () => {
  it('should capitalize the first letter of a lowercase word', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
  });

  it('should capitalize the first letter of an uppercase word (no change)', () => {
    expect(capitalizeFirst('World')).toBe('World');
  });

  it('should handle single character strings', () => {
    expect(capitalizeFirst('a')).toBe('A');
    expect(capitalizeFirst('B')).toBe('B');
  });

  it('should handle empty strings', () => {
    expect(capitalizeFirst('')).toBe('');
  });

  it('should handle strings with numbers', () => {
    expect(capitalizeFirst('123abc')).toBe('123abc');
  });

  it('should handle strings with special characters', () => {
    expect(capitalizeFirst('!hello')).toBe('!hello');
    expect(capitalizeFirst('@world')).toBe('@world');
  });

  it('should handle strings with spaces', () => {
    expect(capitalizeFirst(' hello')).toBe(' hello');
  });
});
