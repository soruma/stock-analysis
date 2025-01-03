import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const client = new S3Client();

export const putObject = async (bucketName: string, key: string, data: string): Promise<void> => {
  console.debug(`Putting object to S3. Key: ${key}, Data length: ${data.length}`);

  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: data,
  });
  try {
    await client.send(putObjectCommand);
    console.info(`Successfully put object to S3. Key: ${key}`);
  } catch (error) {
    console.error(`Failed to put object to S3. Key: ${key}`, error);
    throw error;
  }
};
