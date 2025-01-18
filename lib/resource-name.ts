export class ResourceName {
  private readonly systemName: string;
  private readonly systemEnv: string;
  private readonly bucketNameSuffix: string;

  constructor(systemName: string, systemEnv: string, bucketNameSuffix: string) {
    this.systemName = kebabToCamelCase(systemName, { capitalizeFirst: true });
    this.systemEnv = kebabToCamelCase(systemEnv, { capitalizeFirst: true });
    this.bucketNameSuffix = bucketNameSuffix;
  }

  private baseName(name: string): string {
    const str = kebabToCamelCase(name, { capitalizeFirst: true });
    return `${this.systemName}${str}${this.systemEnv}`;
  }

  public s3Name(name: string): string {
    return `${camelToKebabCase(this.baseName(name))}-${this.bucketNameSuffix}`;
  }

  public bucketPolicyName(name: string): string {
    return this.baseName(name);
  }

  public parameterStoreName(name: string): string {
    return this.baseName(name);
  }

  public parameterStoreKey(name: string): string {
    return camelToSnakeCase(`/${this.systemName}/${this.systemEnv}/${name}`);
  }

  public glueDatabaseId(): string {
    return this.baseName('GlueDatabase');
  }

  public glueDatabaseName(): string {
    return camelToSnakeCase(this.baseName(''));
  }

  public glueTableId(name: string): string {
    return `${this.baseName(name)}GlueTable`;
  }

  public glueTableName(name: string): string {
    return camelToSnakeCase(this.baseName(name));
  }

  public kmsName(name: string): string {
    return this.baseName(name);
  }

  public lambdaLayerVersionName(name: string): string {
    return this.baseName(name);
  }

  public eventRoleName(name: string): string {
    return this.baseName(name);
  }

  public functionPath(type: 'refreshToken' | 'downloadListedInfo' | 'downloadPricesDailyQuotes'): string {
    return camelToKebabCase(type);
  }

  public functionName(type: 'refreshToken' | 'downloadListedInfo' | 'downloadPricesDailyQuotes'): string {
    return `${type}-${camelToKebabCase(this.systemEnv)}`;
  }

  public functionId(type: 'refreshToken' | 'downloadListedInfo' | 'downloadPricesDailyQuotes'): string {
    return `${this.systemName}${capitalizeFirst(type)}${this.systemEnv}Function`;
  }

  public stackName(name: string): string {
    return this.baseName(name);
  }
}

// Utility functions
export const camelToKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
};

export const kebabToCamelCase = (input: string, options?: { capitalizeFirst?: boolean }): string => {
  const result = input
    .replace(/^-+|-+$/g, '')
    .split('-')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');

  if (options?.capitalizeFirst) {
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  return result;
};

export const camelToSnakeCase = (input: string): string => {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z0-9])/g, '$1_$2')
    .toLowerCase();
};

export const capitalizeFirst = (input: string): string => {
  if (!input) return '';
  return input.charAt(0).toUpperCase() + input.slice(1);
};
