import type { Handler } from 'aws-lambda';
import { authRefresh, authUser, listedInfo } from 'j-quants';
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
    const listInfo = await listedInfo({
      idToken: authRefreshResponse.idToken,
      date: date,
    });
    await registOfCodePerDate(listInfo);

    wait(1000);
  }

  return 'success';
};
