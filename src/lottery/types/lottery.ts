// base
export interface LanguageOption {
    label: string;
    value: string;
    symbol: string;
    order: number;
}

export interface CurrencyOption {
    label: string;
    value: string;
    symbol: string;
    order: number;
}

export interface UnitOption {
    label: string;
    value: number;
    order: number;
}

export interface TimesOption {
    label: string;
    value: number;
    order: number;
}

export interface AmountOption {
    label: string;
    value: number;
    order: number;
}

export interface LotteryItem {
    sign: string;
    name: string;
    status: number;
    img_on: string;
    img_off: string;
    remark: string;
    trend: string;
    is_hot: number;
    is_new: number;
    default_method: string;
    type: string;
    type_desc: string;
}

export interface LotteryList {
    d3: Record<string, LotteryItem>;
    ks: Record<string, LotteryItem>;
    pk10: Record<string, LotteryItem>;
    ssc: Record<string, LotteryItem>;
    syxw: Record<string, LotteryItem>;
}

export interface BetHistoryItem {
    d3: Record<string, LotteryItem>;
    ks: Record<string, LotteryItem>;
    pk10: Record<string, LotteryItem>;
    ssc: Record<string, LotteryItem>;
    syxw: Record<string, LotteryItem>;
}

