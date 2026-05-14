import type { SupportedLocale } from './i18n';

export type FabButtonKey =
    | 'support'    // 客服
    | 'app'        // APP 下载
    | 'recharge'   // 充值
    | 'account'    // 我的账户
    | 'tutorial'   // 教程
    | 'sound'      // 声音开关
    | 'promotion'  // 优惠（可选）
    | 'agent';     // 代理（可选）

export interface PartnerConfig {
    sign: string;
    title: string;
    logo?: string;
    favicon?: string;
    country: string;
    default_language: SupportedLocale;
    default_currency: string;
    default_timezone: string;
    support_url?: string;
    theme_color?: string;
    fab_buttons: FabButtonKey[];
}

export interface LanguageOption {
    code: SupportedLocale;
    label: string;
    flag?: string;
    native_label: string;
}

export interface CurrencyOption {
    code: string;
    label: string;
    symbol: string;
    decimal_places: number;
    thousands_separator: string;
    decimal_separator: string;
    min_bet?: number;
    max_bet?: number;
}

export interface CountryOption {
    code: string;
    label: string;
    dial_code?: string;
}

export interface TimezoneOption {
    code: string;
    label: string;
    offset: string;
}

export interface BetConfigPerCurrency {
    unit_options: Array<{ label: string; value: number; calc: number; order: number }>;
    times_options: Array<{ value: number; order: number }>;
    amount_options: Array<{ label: string; value: number; order: number }>;
}

export interface ThirdGameItem {
    sign: string;
    account_sign: string;
    title: string;
    logo: string | null;
}

export interface SystemConfig {
    data_version: string;
    partner: PartnerConfig;
    languages: LanguageOption[];
    currencies: CurrencyOption[];
    countries: CountryOption[];
    timezones: TimezoneOption[];
    bet_config: { per_currency: Record<string, BetConfigPerCurrency> };
    lottery_list: Record<string, unknown>;
    third_game_list: Record<string, ThirdGameItem[]>;
    feature_flags?: Record<string, boolean>;
}

export interface NoticeItem {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

export interface LotteryListItem {
    sign: string;
    title: string;
    is_hot: boolean;
    is_new: boolean;
    odds?: number;
    sort?: number;
}

export type LotteryListMap = Record<string, LotteryListItem[]>;