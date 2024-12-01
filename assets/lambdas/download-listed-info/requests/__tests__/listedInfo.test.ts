import { expect, describe, it, vi, afterEach, beforeEach, type MockInstance } from 'vitest';

import { listedInfo } from '..';

describe('listedInfo', () => {
    let mockedFetch: MockInstance;
    const mockResponse = {
        info: [
            {
                Date: '2022-11-11',
                Code: '86970',
                CompanyName: '日本取引所グループ',
                CompanyNameEnglish: 'Japan Exchange Group,Inc.',
                Sector17Code: '16',
                Sector17CodeName: '金融（除く銀行）',
                Sector33Code: '7200',
                Sector33CodeName: 'その他金融業',
                ScaleCategory: 'TOPIX Large70',
                MarketCode: '0111',
                MarketCodeName: 'プライム',
                MarginCode: '1',
                MarginCodeName: '信用',
            },
        ],
    };

    beforeEach(() => {
        mockedFetch = vi
            .spyOn(global, 'fetch')
            .mockImplementation(async () => new Response(JSON.stringify(mockResponse)));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('all items', () => {
        it('http request parameters are being passed as expected', async () => {
            const response = await listedInfo({ idToken: 'id_token' });

            expect(fetch).toBeCalledWith('https://api.jquants.com/v1/listed/info', {
                headers: {
                    Authorization: 'Bearer id_token',
                    'Content-Type': 'application/json',
                },
            });
            expect(response).toEqual(mockResponse);
        });
    });

    describe('limited items by date', () => {
        it('http request parameters are being passed as expected', async () => {
            const date = '2022-11-11';
            const response = await listedInfo({ idToken: 'id_token', date });

            expect(fetch).toBeCalledWith(`https://api.jquants.com/v1/listed/info?date=${date}`, {
                headers: {
                    Authorization: 'Bearer id_token',
                    'Content-Type': 'application/json',
                },
            });
            expect(response).toEqual(mockResponse);
        });
    });

    describe('limited items by code', () => {
        it('http request parameters are being passed as expected', async () => {
            const code = '86970';
            const response = await listedInfo({ idToken: 'id_token', code });

            expect(fetch).toBeCalledWith(`https://api.jquants.com/v1/listed/info?code=${code}`, {
                headers: {
                    Authorization: 'Bearer id_token',
                    'Content-Type': 'application/json',
                },
            });
            expect(response).toEqual(mockResponse);
        });
    });

    describe('limited items by code and date', () => {
        it('http request parameters are being passed as expected', async () => {
            const code = '86970';
            const date = '2022-11-11';
            const response = await listedInfo({ idToken: 'id_token', date, code });

            expect(fetch).toBeCalledWith(`https://api.jquants.com/v1/listed/info?date=${date}&code=${code}`, {
                headers: {
                    Authorization: 'Bearer id_token',
                    'Content-Type': 'application/json',
                },
            });
            expect(response).toEqual(mockResponse);
        });
    });
});
