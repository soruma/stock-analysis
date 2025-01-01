import { describe, expect, it } from 'vitest';

import { ResourceName, camelToKebabCase, kebabToCamelCase } from '../lib/resource-name';

describe('ResourceName', () => {
  const systemName = 'my-system';
  const systemEnv = 'dev';
  const resourceName = new ResourceName(systemName, systemEnv);

  it('should generate the correct base name', () => {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const baseName = resourceName['baseName']('my-resource');
    expect(baseName).toBe('MySystemMyResourceDev');
  });

  it('should generate the correct S3 name in kebab-case', () => {
    const s3Name = resourceName.s3Name('my-bucket');
    expect(s3Name).toBe('my-system-my-bucket-dev-01941fc5-033f-7488-9a8c-8921a4298acc');
  });

  it('should generate the correct lambda layer version name', () => {
    const layerName = resourceName.lambdaLayerVersionName('my-lambda-layer');
    expect(layerName).toBe('MySystemMyLambdaLayerDev');
  });

  it('should generate the correct Lambda name', () => {
    const lambdaName = resourceName.lambdaName('my-function');
    expect(lambdaName).toBe('MySystemMyFunctionDev');
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
