import type { Handler } from 'aws-lambda';
import { registOfCodePerDate } from './registors';
import { authUser, authRefresh, listedInfo, type AuthUserResponse, type AuthRefreshResponse } from './requests';
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
