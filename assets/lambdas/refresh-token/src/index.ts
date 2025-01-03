import { ParameterType, PutParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import type { Handler } from 'aws-lambda';
import { authUser } from 'j-quants/token';
import { getEnvVariable } from 'stock-analysis-utils';

const ssmClient = new SSMClient();

const parameterKey = getEnvVariable('JQUANTS_API_REFRESH_TOKEN_PARAMETER_KEY');

export const handler: Handler = async (_event, _context): Promise<string> => {
  const authUserResponse = await authUser();

  console.log('Successfully logged in to J-Quants');

  const ssmPutTestCommand = new PutParameterCommand({
    Name: parameterKey,
    Value: authUserResponse.refreshToken,
    Type: ParameterType.STRING,
    Overwrite: true,
  });
  await ssmClient.send(ssmPutTestCommand);

  console.log('Successfully parameter store');

  return 'success';
};
