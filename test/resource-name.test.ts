import { describe, expect, it } from 'vitest';

import { camelToKebabCase, ResourceName } from '../lib/resource-name';

describe('ResourceName', () => {
    const systemName = 'MySystem';
    const systemEnv = 'Dev';
    const resourceName = new ResourceName(systemName, systemEnv);

    it('should generate the correct base name', () => {
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        const baseName = resourceName['baseName']('MyResource');
        expect(baseName).toBe('MySystemMyResourceDev');
    });

    it('should generate the correct S3 name in kebab-case', () => {
        const s3Name = resourceName.s3Name('MyBucket');
        expect(s3Name).toBe('my-system-my-bucket-dev');
    });

    it('should generate the correct Lambda name', () => {
        const lambdaName = resourceName.lambdaName('MyFunction');
        expect(lambdaName).toBe('MySystemMyFunctionDev');
    });

    it('should generate the correct Stack name', () => {
        const stackName = resourceName.stackName('MyStack');
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