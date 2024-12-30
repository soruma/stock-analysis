export class ResourceName {
    public readonly systemName: string;
    public readonly systemEnv: string;

    constructor(systemName: string, systemEnv: string) {
        this.systemName = systemName;
        this.systemEnv = systemEnv;
    }

    private baseName(name: string): string {
        return `${this.systemName}${name}${this.systemEnv}`;
    }

    public s3Name(name: string) {
        return camelToKebabCase(this.baseName(name));
    }

    public lambdaName(name: string) {
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
