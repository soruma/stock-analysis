import type { Handler } from 'aws-lambda';
import { info } from 'j-quants/listed';
import { authRefresh, authUser } from 'j-quants/token';
import { wait } from 'stock-analysis-utils';

import { registOfCodePerDate } from './registors';
import { convertParams } from './utils';

export const handler: Handler = async (event, _context): Promise<string> => {
  console.log(`Input event data: ${JSON.stringify(event)}`);

  const params = convertParams(event);

  const authUserResponse = await authUser();
  const authRefreshResponse = await authRefresh(authUserResponse.refreshToken);

  for (const date of params) {
    console.info(`execute listed info: ${date}`);
    const response = await info({
      idToken: authRefreshResponse.idToken,
      date: date,
    });
    await registOfCodePerDate(response);

    wait(1000);
  }

  return 'success';
};
