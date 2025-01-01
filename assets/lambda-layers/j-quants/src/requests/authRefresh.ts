export type AuthRefreshResponse = {
  idToken: string;
};

export const authRefresh = (refreshtoken: string) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const params = { refreshtoken };
  const query = new URLSearchParams(params);

  return fetch(`https://api.jquants.com/v1/token/auth_refresh?${query}`, {
    method: 'POST',
    headers,
  }).then((res) => res.json() as Promise<AuthRefreshResponse>);
};
