import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { authRefresh } from '../../src/requests';

describe('authRefresh', () => {
  const mockResponse = { idToken: 'id_token' };

  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation(async () => new Response(JSON.stringify(mockResponse)));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('http request parameters are being passed as expected', async () => {
    const response = await authRefresh('refresh_token');

    expect(fetch).toBeCalledWith('https://api.jquants.com/v1/token/auth_refresh?refreshtoken=refresh_token', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    expect(response).toEqual(mockResponse);
  });
});
