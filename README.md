# Stock analysis

## Useful commands

* `pnpm cleanup-generated-files`
  * Cleans up generated files.
* `pnpm create-renge-date <startDate> <endDate> <outputPath>`
  * Creates a file for the specified outputPath with a date range from startDate to endDate.

## Build modules

The following commands will install dependencies, build the project, and synthesize the AWS CDK stack:

```shell
pnpm install
pnpm stock-analysis-modules install
pnpm stock-analysis-modules build
pnpm stock-analysis-utils install
pnpm stock-analysis-utils build
pnpm j-quants install
pnpm j-quants build
pnpm build
pnpm dlx cdk synth
```

## Test

The following commands will build the project and run the test suite to ensure everything is working as expected:

```shell
pnpm build
pnpm test
```

## Deploy

The following command will deploy the AWS CDK stack to your cloud environment:

```
pnpm dlx cdk deploy
```
