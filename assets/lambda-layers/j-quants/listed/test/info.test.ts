import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ListedInfo, InfoProps, info } from '../info';

describe('info', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch data with correct URL and headers when date and code are provided', async () => {
    const mockResponse: ListedInfo = {
      info: [
        {
          Date: '2025-01-01',
          Code: '1234',
          CompanyName: 'Test Company',
          CompanyNameEnglish: 'Test Company Ltd.',
          Sector17Code: '01',
          Sector17CodeName: 'Sector 17 Name',
          Sector33Code: '001',
          Sector33CodeName: 'Sector 33 Name',
          ScaleCategory: 'Large',
          MarketCode: 'M1',
          MarketCodeName: 'Market Name',
          MarginCode: 'C1',
          MarginCodeName: 'Margin Name',
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const props: InfoProps = {
      idToken: 'test-token',
      date: '2025-01-01',
      code: '1234',
    };

    const result = await info(props);

    expect(mockFetch).toHaveBeenCalledWith('https://api.jquants.com/v1/listed/info?date=2025-01-01&code=1234', {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should fetch data with correct URL and headers when only date is provided', async () => {
    const mockResponse: ListedInfo = { info: [] };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const props: InfoProps = {
      idToken: 'test-token',
      date: '2025-01-01',
    };

    const result = await info(props);

    expect(mockFetch).toHaveBeenCalledWith('https://api.jquants.com/v1/listed/info?date=2025-01-01', {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should fetch data with correct URL and headers when only code is provided', async () => {
    const mockResponse: ListedInfo = { info: [] };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const props: InfoProps = {
      idToken: 'test-token',
      code: '1234',
    };

    const result = await info(props);

    expect(mockFetch).toHaveBeenCalledWith('https://api.jquants.com/v1/listed/info?code=1234', {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should fetch data with correct URL and headers when no query parameters are provided', async () => {
    const mockResponse: ListedInfo = { info: [] };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const props: InfoProps = {
      idToken: 'test-token',
    };

    const result = await info(props);

    expect(mockFetch).toHaveBeenCalledWith('https://api.jquants.com/v1/listed/info', {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if the API response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const props: InfoProps = {
      idToken: 'test-token',
    };

    await expect(info(props)).rejects.toThrowError('API Error: 500 Internal Server Error');

    expect(mockFetch).toHaveBeenCalledWith('https://api.jquants.com/v1/listed/info', {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });
  });

  it('should throw an error if fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const props: InfoProps = {
      idToken: 'test-token',
    };

    await expect(info(props)).rejects.toThrowError('Network Error');

    expect(mockFetch).toHaveBeenCalledWith('https://api.jquants.com/v1/listed/info', {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
    });
  });
});
