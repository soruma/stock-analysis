export class ResourceName {
  public readonly systemName: string;
  public readonly systemEnv: string;
  public readonly bucketNameSuffix: string;

  constructor(systemName: string, systemEnv: string, bucketNameSuffix: string) {
    this.systemName = kebabToCamelCase(systemName, { capitalizeFirst: true });
    this.systemEnv = kebabToCamelCase(systemEnv, { capitalizeFirst: true });
    this.bucketNameSuffix = bucketNameSuffix;
  }

  private baseName(name: string): string {
    const str = kebabToCamelCase(name, { capitalizeFirst: true });
    return `${this.systemName}${str}${this.systemEnv}`;
  }

  public s3Name(name: string) {
    return `${camelToKebabCase(this.baseName(name))}-${this.bucketNameSuffix}`;
  }

  public bucketPolicyName(name: string) {
    return this.baseName(name);
  }

  public parameterStoreName(name: string) {
    return this.baseName(name);
  }

  public parameterStoreKey(name: string) {
    return camelToSnakeCase(`/${this.systemName}/${this.systemEnv}/${name}`);
  }

  public glueDatabaseId() {
    return `${this.baseName('GlueDatabase')}`;
  }

  public glueDatabaseName() {
    return camelToSnakeCase(this.baseName(''));
  }

  public glueTableId(name: string) {
    return `${this.baseName(name)}GlueTable`;
  }

  public glueTableName(name: string) {
    return camelToSnakeCase(this.baseName(name));
  }

  public kmsName(name: string) {
    return this.baseName(name);
  }

  public lambdaLayerVersionName(name: string) {
    return this.baseName(name);
  }

  public lambdaName(name: string) {
    return `${this.baseName(name)}Function`;
  }

  public eventRoleName(name: string) {
    return this.baseName(name);
  }

  public stackName(name: string) {
    return this.baseName(name);
  }
}

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
