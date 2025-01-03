import { type DailyQuotes } from 'j-quants/prices';
import { getEnvVariable, putObject } from 'stock-analysis-utils';

const s3Prefix = 'prices/daily_quotes';

const bucketName = getEnvVariable('S3_BUCKET_NAME');

export const registOfCodePerDate = async (dailyQuotes: DailyQuotes) => {
  await putObject(bucketName, `${s3Prefix}/${dailyQuotes.daily_quotes[0].Date}.json`, JSON.stringify(dailyQuotes));
};
