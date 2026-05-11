import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as systemService from '@/api/systemService';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import type {
    PartnerConfig,
    LanguageOption,
    CurrencyOption,
    CountryOption,
    TimezoneOption,
    BetConfigPerCurrency,
} from '@/types/common';

export const useCommonStore = defineStore('common', () => {
    /* ---------- state ---------- */
    const dataVersion   = ref<string>(storage.get(STORAGE_KEYS.DATA_VERSION) ?? '');
    const partner       = ref<PartnerConfig | null>(null);
    const languages     = ref<LanguageOption[]>([]);
    const currencies    = ref<CurrencyOption[]>([]);
    const countries     = ref<CountryOption[]>([]);
    const timezones     = ref<TimezoneOption[]>([]);
    const betConfig     = ref<Record<string, BetConfigPerCurrency>>({});
    const lotteryList   = ref<Record<string, unknown>>({});
    const thirdGameList = ref<Record<string, unknown>>({});
    const featureFlags  = ref<Record<string, boolean>>({});
    const isLoaded      = ref(false);

    /* ---------- getters ---------- */
    const getCurrency = (code: string) => currencies.value.find(c => c.code === code);
    const getLanguage = (code: string) => languages.value.find(l => l.code === code);
    const getCountry  = (code: string) => countries.value.find(c => c.code === code);
    const getTimezone = (code: string) => timezones.value.find(t => t.code === code);
    const getBetConfig = (currency: string) => betConfig.value[currency] ?? null;

    const isLanguageSupported = (code: string) => languages.value.some(l => l.code === code);
    const isCurrencySupported = (code: string) => currencies.value.some(c => c.code === code);
    const isTimezoneSupported = (code: string) => timezones.value.some(t => t.code === code);

    /** 把分位数（minor units，整数）按币种格式化成 "¥1,234.56" */
    const formatMoney = (minorAmount: number | string, currencyCode: string): string => {
        const cur = getCurrency(currencyCode);
        if (!cur) return String(minorAmount);
        const decimals = cur.decimal_places ?? 2;
        const num = typeof minorAmount === 'string' ? parseFloat(minorAmount) : minorAmount;
        const major = num / Math.pow(10, decimals);
        try {
            return cur.symbol + new Intl.NumberFormat(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            }).format(major);
        } catch {
            return cur.symbol + major.toFixed(decimals);
        }
    };

    /* ---------- actions ---------- */
    async function initMainConfig(force = false): Promise<void> {
        if (isLoaded.value && !force) return;

        const cfg = await systemService.fetchSystemConfig();

        dataVersion.value   = cfg.data_version;
        partner.value       = cfg.partner;
        languages.value     = cfg.languages ?? [];
        currencies.value    = cfg.currencies ?? [];
        countries.value     = cfg.countries ?? [];
        timezones.value     = cfg.timezones ?? [];
        betConfig.value     = cfg.bet_config?.per_currency ?? {};
        lotteryList.value   = cfg.lottery_list ?? {};
        thirdGameList.value = cfg.third_game_list ?? {};
        featureFlags.value  = cfg.feature_flags ?? {};

        storage.set(STORAGE_KEYS.DATA_VERSION, cfg.data_version);

        if (cfg.partner?.title) document.title = cfg.partner.title;
        if (cfg.partner?.favicon) {
            let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = cfg.partner.favicon;
        }

        isLoaded.value = true;
    }

    return {
        dataVersion, partner, languages, currencies, countries, timezones,
        betConfig, lotteryList, thirdGameList, featureFlags, isLoaded,
        getCurrency, getLanguage, getCountry, getTimezone, getBetConfig,
        isLanguageSupported, isCurrencySupported, isTimezoneSupported,
        formatMoney,
        initMainConfig,
    };
});