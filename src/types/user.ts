import type { SupportedLocale } from './i18n';

export interface UserDetail {
    id: number;
    username: string;
    nickname?: string;
    avatar?: string;
    language: SupportedLocale;
    currency: string;
    timezone: string;
    country: string;
    vip_level?: number;
    is_test?: boolean;
    type?: number;
    status?: number;
    created_at?: string;
    updated_at?: string;
}

export interface UserBalanceItem {
    amount: string;
    frozen: string;
}

export type UserBalance = Record<string, UserBalanceItem>;

export interface UserPreference {
    language?: SupportedLocale;
    currency?: string;
    timezone?: string;
    country?: string;
}