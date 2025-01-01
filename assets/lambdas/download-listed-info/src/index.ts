import type { Handler } from 'aws-lambda';
import { authUser, authRefresh } from 'j-quants';

import { registOfCodePerDate } from './registors';
import { listedInfo } from './requests';
import { convertParams } from './utils';

export const handler: Handler = async (event, context): Promise<string> => {
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
    }

    return 'success';
};
