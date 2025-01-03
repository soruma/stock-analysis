import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

export const getRefreshToken = async (ssmClient: SSMClient, parameterName: string): Promise<string | undefined> => {
  const command = new GetParameterCommand({
    Name: parameterName,
  });

  try {
    const parameterStore = await ssmClient.send(command);

    return parameterStore.Parameter?.Value;
  } catch {
    console.warn(`Error fetching parameter from Parameter Store: ${parameterName}`);
    throw new Error('Error fetching parameter from Parameter Store');
  }
};
