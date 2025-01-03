import { ListedInfo } from 'j-quants/listed';
import { getEnvVariable, putObject } from 'stock-analysis-utils';

const s3Prefix = 'listed/info';

const bucketName = getEnvVariable('S3_BUCKET_NAME');

export const registOfCodePerDate = async (listedInfo: ListedInfo) => {
  await putObject(bucketName, `${s3Prefix}/${listedInfo.info[0].Date}.json`, JSON.stringify(listedInfo));
};
