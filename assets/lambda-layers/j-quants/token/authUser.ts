import { getEnvVariable } from 'stock-analysis-utils';

export type AuthUserResponse = {
  refreshToken: string;
};

export const authUser = async () => {
  const mailaddress = getEnvVariable('JQUANTS_API_MAIL_ADDRESS');
  const password = getEnvVariable('JQUANTS_API_PASSWORD');

  const headers = {
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({ mailaddress, password });

  return fetch('https://api.jquants.com/v1/token/auth_user', {
    method: 'POST',
    headers,
    body,
  }).then((res) => res.json() as Promise<AuthUserResponse>);
};
