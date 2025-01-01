export interface ListedInfoProps {
  idToken: string;
  date?: string;
  code?: string;
}

export interface ListedInfo {
  info: CompanyInfo[];
}

export interface CompanyInfo {
  Date: string; // 日付 (YYYY-MM-DD形式)
  Code: string; // 会社コード
  CompanyName: string; // 会社名
  CompanyNameEnglish: string; // 英語の会社名
  Sector17Code: string; // 17業種コード
  Sector17CodeName: string; // 17業種コード名
  Sector33Code: string; // 33業種コード
  Sector33CodeName: string; // 33業種コード名
  ScaleCategory: string; // 規模カテゴリ
  MarketCode: string; // 市場コード
  MarketCodeName: string; // 市場コード名
  MarginCode: string; // 信用区分コード
  MarginCodeName: string; // 信用区分コード名
}

export const listedInfo = async (props: ListedInfoProps): Promise<ListedInfo> => {
  const headers = {
    Authorization: `Bearer ${props.idToken}`,
    'Content-Type': 'application/json',
  };
  const queryParams = new URLSearchParams();
  if (props.date) queryParams.append('date', props.date);
  if (props.code) queryParams.append('code', props.code);

  const url = queryParams.toString()
    ? `https://api.jquants.com/v1/listed/info?${queryParams.toString()}`
    : 'https://api.jquants.com/v1/listed/info';

  try {
    console.debug(`Fetching URL: ${url}`);

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
