import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getEnvVariable } from '../../src/utils';

describe('getEnvVariable', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return the value of the environment variable if it is set', () => {
    process.env.TEST_KEY = 'test_value';
    const result = getEnvVariable('TEST_KEY');
    expect(result).toBe('test_value');
  });

  it('should throw an error if the environment variable is not set', () => {
    process.env.TEST_KEY = undefined;
    expect(() => getEnvVariable('TEST_KEY')).toThrowError('Environment variable TEST_KEY is not set.');
  });
});
