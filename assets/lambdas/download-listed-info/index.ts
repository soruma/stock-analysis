import type { Handler } from 'aws-lambda';
import { registOfCodePerDate } from './registors';
import { authUser, authRefresh, listedInfo, type AuthUserResponse, type AuthRefreshResponse } from './requests';
import { weeksAgo } from './utils';

export const handler: Handler = async (event, context): Promise<string> => {
    console.log(`Input event data: ${JSON.stringify(event)}`);

    let date: string;
    if (event.date) {
        date = event.date;
    } else {
        date = weeksAgo(12);
    }

    console.log(`Date two weeks ago: ${date}`);

    const authUserResponse = await authUser();
    const authRefreshResponse = await authRefresh(authUserResponse.refreshToken);
    const listInfo = await listedInfo({
        idToken: authRefreshResponse.idToken,
        date: event.date,
    });

    await registOfCodePerDate(listInfo);

    return 'success';
};
