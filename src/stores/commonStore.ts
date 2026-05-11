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
    const isCountrySupported = (code: string) => countries.value.some(c => c.code === code);

    const formatMoney = (amount: number | string, currencyCode: string): string => {
        const cur = getCurrency(currencyCode);
        if (!cur) {
            const n = typeof amount === 'string' ? parseFloat(amount) : amount;
            return n.toFixed(2);
        }
        const decimals = cur.decimal_places ?? 2;
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;

        try {
            return cur.symbol + new Intl.NumberFormat(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            }).format(num);
        } catch {
            return cur.symbol + num.toFixed(decimals);
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
        isLanguageSupported, isCurrencySupported, isTimezoneSupported,isCountrySupported,
        formatMoney,
        initMainConfig,
    };
});