interface PricesDailyQuotesProps {
    idToken: string;
    code?: string;
    from?: string;
    to?: string;
    date?: string;
    paginationKey?: string;
}

export interface PricesDailyQuotes {
    daily_quotes: PricesDailyQuote[];
}

/**
 * 株価四本値
 * - ※1  過去の分割等を考慮した調整済みの項目です
 * - ※2  Premiumプランのみ取得可能な項目です
 */
export interface PricesDailyQuote {
    /**
     * 日付 (YYYY-MM-DD形式)
     */
    Date: string;
    /**
     * 銘柄コード
     */
    Code: string;
    /**
     * 始値(調整前)
     */
    Open: number;
    /**
     * 高値(調整前)
     */
    High: number;
    /**
     * 安値(調整前)
     */
    Low: number; 
    /**
     * 終値(調整前)
     */
    Close: number;
    /**
     * 日通ストップ高を記録したか、否かを表すフラグ
     * - 0：ストップ高以外
     * - 1：ストップ高
     */
    UpperLimit: string;
    /**
     * 日通ストップ安を記録したか、否かを表すフラグ
     * - 0：ストップ安以外
     * -  1：ストップ安
     */
    LowerLimit: string;
    /**
     * 取引高(調整前)
     */
    Volume: number;
    /**
     * 取引代金
     */
    TurnoverValue: number;
    /**
     * 調整係数
     * 株式分割1:2の場合、権利落ち日のレコードにおいて本項目に”0 .5”が収録されます
     */
    AdjustmentFactor: number;
    /**
     * 調整済み始値
     * ※1
     */
    AdjustmentOpen: number;
    /**
     * 調整済み高値
     * ※1
     */
    AdjustmentHigh: number;
    /**
     * 調整済み安値
     * ※1
     */
    AdjustmentLow: number;
    /**
     * 整済み終値調
     * ※1
     */
    AdjustmentClose: number;
    /**
     * 調整済み取引高
     * ※1
     */
    AdjustmentVolume: number;
    /**
     * 前場始値
     * ※2
     */
    MorningOpen: number;
    /**
     * 前場高値
     * ※2
     */
    MorningHigh: number;
    /**
     * 前場安値
     * ※2
     */
    MorningLow: number;
    /**
     * 前場終値
     * ※2
     */
    MorningClose: number;
    /**
     * 前場ストップ高を記録したか、否かを表すフラグ
     * ※2
     * - 0：ストップ高以外
     * - 1：ストップ高
     */
    MorningUpperLimit: string;
    /**
     * 前場ストップ安を記録したか、否かを表すフラグ
     * ※2
     * - 0：ストップ安以外
     * - 1：ストップ安
     */
    MorningLowerLimit: string;
    /**
     * 前場売買高
     * ※2
     */
    MorningVolume: number;
    /**
     * 前場取引代金
     * ※2
     */
    MorningTurnoverValue: number;
    /**
     * 調整済み前場始値
     * ※1, ※2
     */
    MorningAdjustmentOpen: number;
    /**
     * 調整済み前場高値
     * ※1, ※2
     */
    MorningAdjustmentHigh: number;
    /**
     * 調整済み前場安値
     * ※1, ※2
     */
    MorningAdjustmentLow: number;
    /**
     * 調整済み前場終値
     * ※1, ※2
     */
    MorningAdjustmentClose: number;
    /**
     * 調整済み前場売買高
     * ※1, ※2
     */
    MorningAdjustmentVolume: number;
    /**
     * 後場始値
     * ※2
     */
    AfternoonOpen: number;
    /**
     * 後場高値
     * ※2
     */
    AfternoonHigh: number;
    /**
     * 後場安値
     * ※2
     */
    AfternoonLow: number
    /**
     * 後場終値
     * ※2
     */
    AfternoonClose: number;
    /**
     * 後場ストップ高を記録したか、否かを表すフラグ
     * ※2
     * - 0：ストップ高以外
     * - 1：ストップ高
     */
    AfternoonUpperLimit: string;
    /**
     * 後場ストップ安を記録したか、否かを表すフラグ
     * ※2
     * - 0：ストップ安以外
     * - 1：ストップ安
     */
    AfternoonLowerLimit: string;
    /**
     * 後場売買高
     * ※2
     */
    AfternoonVolume: number;
    /**
     * 後場取引代金
     * ※2
     */
    AfternoonTurnoverValue: number;
    /**
     * 調整済み後場始値
     * ※1, ※2
     */
    AfternoonAdjustmentOpen: number;
    /**
     * 調整済み後場高値
     * ※1, ※2
     */
    AfternoonAdjustmentHigh: number;
    /**
     * 調整済み後場安値
     * ※1, ※2
     */
    AfternoonAdjustmentLow: number;
    /**
     * 調整済み後場終値
     * ※1, ※2
     */
    AfternoonAdjustmentClose: number;
    /**
     * 調整済み後場売買高
     * ※1, ※2
     */
    AfternoonAdjustmentVolume: number;
}

export const pricesDailyQuotes = async (props: PricesDailyQuotesProps): Promise<PricesDailyQuotes> => {
    const headers = {
        Authorization: `Bearer ${props.idToken}`,
        'Content-Type': 'application/json',
    };
    const queryParams = new URLSearchParams();
    if (props.code) queryParams.append('code', props.code);
    if (props.date) queryParams.append('date', props.date);
    if (props.from && props.to) {
        queryParams.append('from', props.from);
        queryParams.append('to', props.to);
    }

    const url = queryParams.toString()
        ? `https://api.jquants.com/v1/prices/daily_quotes?${queryParams.toString()}`
        : 'https://api.jquants.com/v1/prices/daily_quotes';

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
