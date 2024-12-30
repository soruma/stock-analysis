import { expect, describe, it, vi, afterEach, beforeEach, type MockInstance } from 'vitest';

import { authUser } from '../../src/requests';

describe('authUser', () => {
    let mockedFetch: MockInstance;
    const mockResponse = { refreshToken: 'refresh_token' };

    beforeEach(() => {
        mockedFetch = vi
            .spyOn(global, 'fetch')
            .mockImplementation(async () => new Response(JSON.stringify(mockResponse)));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('http request parameters are being passed as expected', async () => {
        const response = await authUser();

        const mailaddress = process.env.JQUANTS_API_MAIL_ADDRESS;
        const password = process.env.JQUANTS_API_PASSWORD;

        expect(fetch).toBeCalledWith('https://api.jquants.com/v1/token/auth_user', {
            body: JSON.stringify({
                mailaddress,
                password,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });
        expect(response).toEqual(mockResponse);
    });
});
