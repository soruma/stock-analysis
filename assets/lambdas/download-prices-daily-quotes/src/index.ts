import { SSMClient } from '@aws-sdk/client-ssm';
import type { Handler } from 'aws-lambda';
import { dailyQuotes } from 'j-quants/prices';
import { authRefresh } from 'j-quants/token';
import { getEnvVariable, getRefreshToken, wait } from 'stock-analysis-utils';

import { registOfCodePerDate } from './registors';
import { convertParams } from './utils';

const ssmClient = new SSMClient();

const refreshTokenParameterKey = getEnvVariable('JQUANTS_API_REFRESH_TOKEN_PARAMETER_KEY');

export const handler: Handler = async (event, _context): Promise<string> => {
  console.log(`Input event data: ${JSON.stringify(event)}`);

  const params = convertParams(event);

  const refreshToken = (await getRefreshToken(ssmClient, refreshTokenParameterKey)) || '';
  const authRefreshResponse = await authRefresh(refreshToken);

  for (const date of params) {
    console.info(`execute daily quotes: ${date}`);
    const response = await dailyQuotes({
      idToken: authRefreshResponse.idToken,
      date: date,
    });
    await registOfCodePerDate(response);

    wait(1000);
  }

  return 'success';
};
