import type { SupportedLocale } from './i18n';

export interface UserDetail {
    id: number;
    username: string;          // 前端看到的是 local 部分（后端 Resource 已剥 sign 前缀）
    nickname?: string;
    avatar?: string;
    language: SupportedLocale;
    currency: string;
    timezone: string;
    country: string;
    vip_level?: number;
    type?: number;
    status?: number;
    created_at?: string;
    updated_at?: string;
}

export interface UserBalanceItem {
    amount: string;             // 用 string 保留精度（后端 decimal:8）
    frozen: string;
}

export interface UserBalance {
    main: Record<string, UserBalanceItem>;                         // currency -> balance
    third: Record<string, Record<string, UserBalanceItem>>;        // platform -> currency -> balance
}

export interface UserPreference {
    language?: SupportedLocale;
    currency?: string;
    timezone?: string;
}