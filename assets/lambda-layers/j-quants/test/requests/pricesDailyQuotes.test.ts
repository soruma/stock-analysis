import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { pricesDailyQuotes } from '../../src/requests';

describe('pricesDailyQuotes', () => {
  const mockResponse = {
    daily_quotes: [
      {
        Date: '2022-11-11',
        Code: '86970',
        Open: 4375,
        High: 4400,
        Low: 4345,
        Close: 4365,
        UpperLimit: '0',
        LowerLimit: '0',
        Volume: 45900,
        TurnoverValue: 200593000,
        AdjustmentFactor: 1,
        AdjustmentOpen: 4375,
        AdjustmentHigh: 4400,
        AdjustmentLow: 4345,
        AdjustmentClose: 4365,
        AdjustmentVolume: 45900,
      },
    ],
  };

  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation(async () => new Response(JSON.stringify(mockResponse)));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('limited items by code', () => {
    it('http request parameters are being passed as expected', async () => {
      const code = '86970';
      const response = await pricesDailyQuotes({ idToken: 'id_token', code });

      expect(fetch).toBeCalledWith(`https://api.jquants.com/v1/prices/daily_quotes?code=${code}`, {
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
      const response = await pricesDailyQuotes({ idToken: 'id_token', date });

      expect(fetch).toBeCalledWith(`https://api.jquants.com/v1/prices/daily_quotes?date=${date}`, {
        headers: {
          Authorization: 'Bearer id_token',
          'Content-Type': 'application/json',
        },
      });
      expect(response).toEqual(mockResponse);
    });
  });

  describe('limited items by from and to', () => {
    it('http request parameters are being passed as expected', async () => {
      const from = '2022-11-11';
      const to = '2022-11-13';
      const response = await pricesDailyQuotes({
        idToken: 'id_token',
        from,
        to,
      });

      expect(fetch).toBeCalledWith(`https://api.jquants.com/v1/prices/daily_quotes?from=${from}&to=${to}`, {
        headers: {
          Authorization: 'Bearer id_token',
          'Content-Type': 'application/json',
        },
      });
      expect(response).toEqual(mockResponse);
    });
  });

  describe('limited items by paginationKey', () => {
    it('http request parameters are being passed as expected', async () => {
      const paginationKey = 'next_page_key';
      const response = await pricesDailyQuotes({ idToken: 'id_token', paginationKey });

      expect(fetch).toBeCalledWith(`https://api.jquants.com/v1/prices/daily_quotes?pagination_key=${paginationKey}`, {
        headers: {
          Authorization: 'Bearer id_token',
          'Content-Type': 'application/json',
        },
      });
      expect(response).toEqual(mockResponse);
    });
  });
});

describe('pricesDailyQuotes with pagination', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches all pages of data recursively', async () => {
    const mockResponsePage1 = {
      daily_quotes: [{ Date: '2022-11-11', Code: '86970', Open: 4375, High: 4400, Low: 4345, Close: 4365 }],
      pagination_key: 'next_page_key',
    };

    const mockResponsePage2 = {
      daily_quotes: [{ Date: '2022-11-11', Code: '86971', Open: 4380, High: 4410, Low: 4350, Close: 4370 }],
      pagination_key: null,
    };

    vi.spyOn(global, 'fetch')
      .mockImplementationOnce(async () => new Response(JSON.stringify(mockResponsePage1)))
      .mockImplementationOnce(async () => new Response(JSON.stringify(mockResponsePage2)));

    const response = await pricesDailyQuotes({ idToken: 'id_token', date: '2022-11-11' });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith('https://api.jquants.com/v1/prices/daily_quotes?date=2022-11-11', {
      headers: {
        Authorization: 'Bearer id_token',
        'Content-Type': 'application/json',
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.jquants.com/v1/prices/daily_quotes?date=2022-11-11&pagination_key=next_page_key',
      {
        headers: {
          Authorization: 'Bearer id_token',
          'Content-Type': 'application/json',
        },
      },
    );

    expect(response.daily_quotes).toEqual([
      { Date: '2022-11-11', Code: '86970', Open: 4375, High: 4400, Low: 4345, Close: 4365 },
      { Date: '2022-11-11', Code: '86971', Open: 4380, High: 4410, Low: 4350, Close: 4370 },
    ]);
  });
});
