import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import * as systemService from '@shared/api/systemService';
import { storage, STORAGE_KEYS } from '@shared/utils/storage';
import { useUserStore } from '@shared/stores/userStore';
import type {
    BetConfigPerCurrency,
    CountryOption,
    CurrencyOption,
    LanguageOption,
    LotteryListMap,
    TenantConfig,
    SystemConfig,
    TimezoneOption,
} from '@shared/types/common';

/* =========================================================
 *  彩票相关的默认 options（无后端配置时回退）
 * ========================================================= */
const DEFAULT_TIMES_OPTIONS: Array<{ value: number; order: number }> = [
    { value: 1,   order: 1 },
    { value: 5,   order: 2 },
    { value: 10,  order: 3 },
    { value: 50,  order: 4 },
    { value: 100, order: 5 },
];

const DEFAULT_UNIT_OPTIONS: Array<{ label: string; value: number; calc: number; order: number }> = [
    { label: '元', value: 1,     calc: 1,     order: 1 },
    { label: '角', value: 0.1,   calc: 0.1,   order: 2 },
    { label: '分', value: 0.01,  calc: 0.01,  order: 3 },
    { label: '厘', value: 0.001, calc: 0.001, order: 4 },
];

const DEFAULT_CURRENCY_OPTIONS: Array<{ label: string; value: string; symbol: string }> = [
    { label: '人民币', value: 'cny',  symbol: '¥' },
    { label: 'USDT',  value: 'usdt', symbol: 'U' },
];

// 用户自定义的快捷倍数：单独 key，跟 SystemConfig 数据隔离
const TIMES_OPTIONS_STORAGE_KEY = 'lc_times_options';

// 读「当前货币」= userStore 的单一来源。抽成模块级函数并**显式声明返回类型**:
// 这样 useCommonStore 推断自身类型时无需钻进 useUserStore,切断 common↔user 的类型环(TS7022)。
const readCurrentCurrency = (): string => useUserStore().currentCurrency;

export const useCommonStore = defineStore('common', () => {
    /* ---------- state ---------- */
    const dataVersion   = ref<string>(storage.get(STORAGE_KEYS.DATA_VERSION) ?? '');
    const tenant       = ref<TenantConfig | null>(null);
    const languages     = ref<LanguageOption[]>([]);
    const currencies    = ref<CurrencyOption[]>([]);
    const countries     = ref<CountryOption[]>([]);
    const timezones     = ref<TimezoneOption[]>([]);
    const betConfig     = ref<Record<string, BetConfigPerCurrency>>({});
    const thirdGameList = ref<Record<string, unknown>>({});
    const featureFlags  = ref<Record<string, boolean>>({});
    const isLoaded      = ref(false);
    const lotteryList   = ref<LotteryListMap>({});

    // 用户自定义的快捷倍数（持久化到 localStorage）
    const userTimesOptions = ref<Array<{ value: number; order: number }>>(
        storage.getJSON<Array<{ value: number; order: number }>>(TIMES_OPTIONS_STORAGE_KEY)
        ?? [...DEFAULT_TIMES_OPTIONS],
    );

    /* ---------- 基础 getter ---------- */
    const getCurrency  = (code: string) => currencies.value.find(c => c.code === code);
    const getLanguage  = (code: string) => languages.value.find(l => l.code === code);
    const getCountry   = (code: string) => countries.value.find(c => c.code === code);
    const getTimezone  = (code: string) => timezones.value.find(t => t.code === code);
    const getBetConfig = (currency: string) => betConfig.value[currency] ?? null;

    const getCurrencyInfo = (code?: string): CurrencyOption | null => {
        const target = code ?? storage.get(STORAGE_KEYS.CURRENCY) ?? '';
        if (!target) return currencies.value[0] ?? null;
        return currencies.value.find(c => c.code === target) ?? currencies.value[0] ?? null;
    };

    /* =========================================================
     *  彩票模块依赖的 options
     *  （被 Currency.vue / Unit.vue / OrderList.vue
     *   / OfficialBetCart.vue 直接消费）
     * ========================================================= */

    // 当前货币：单一来源 —— 统一走 userStore（已综合 用户/匿名 偏好 + 后端支持列表收敛）。
    // 经 readCurrentCurrency(模块级、显式返回类型)间接取值,避免 common↔user 循环推断。
    const currentCurrency = computed<string>(readCurrentCurrency);

    // 货币下拉项 - [{label, value, symbol}]
    const currencyOptions = computed<Array<{ label: string; value: string; symbol: string }>>(() => {
        if (!currencies.value.length) return [...DEFAULT_CURRENCY_OPTIONS];
        return currencies.value.map(c => ({
            label: c.label,
            value: c.code,
            symbol: c.symbol,
        }));
    });

    // 单注金额选项 - 优先取当前货币的 betConfig.unit_options，否则用默认
    const unitOptions = computed<Array<{ label: string; value: number; calc: number; order: number }>>(() => {
        const cfg = betConfig.value[currentCurrency.value];
        const opts = cfg?.unit_options;
        if (Array.isArray(opts) && opts.length > 0) {
            return [...opts].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }
        return [...DEFAULT_UNIT_OPTIONS];
    });

    // 默认的快捷倍数（用于"恢复默认"按钮）
    const timesDefaultOptions = computed<Array<{ value: number; order: number }>>(() => {
        const cfg = betConfig.value[currentCurrency.value];
        const fromServer = cfg?.times_options;
        if (Array.isArray(fromServer) && fromServer.length > 0) {
            return [...fromServer].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }
        return [...DEFAULT_TIMES_OPTIONS];
    });

    // 当前生效的快捷倍数：用户自定义 > 后端默认 > 内置默认
    const timesOptions = computed<Array<{ value: number; order: number }>>(() => {
        if (Array.isArray(userTimesOptions.value) && userTimesOptions.value.length > 0) {
            return [...userTimesOptions.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }
        return timesDefaultOptions.value;
    });

    // 设置并持久化用户自定义快捷倍数
    const setTimesOptions = (opts: Array<{ value: number; order?: number }>): void => {
        const cleaned = (Array.isArray(opts) ? opts : [])
            .filter(o => o && Number(o.value) > 0)
            .map((o, idx) => ({ value: Number(o.value), order: o.order ?? idx + 1 }));
        userTimesOptions.value = cleaned.length > 0 ? cleaned : [...DEFAULT_TIMES_OPTIONS];
        storage.setJSON(TIMES_OPTIONS_STORAGE_KEY, userTimesOptions.value);
    };

    /* =========================================================
     *  其他工具
     * ========================================================= */
    const getLotteriesByCategory = (categorySign: string) => {
        const arr = lotteryList.value[categorySign];
        return Array.isArray(arr) ? arr : [];
    };
    const getAllLotteryCategories = () => Object.keys(lotteryList.value);

    const isLanguageSupported = (code: string) => languages.value.some(l => l.code === code);
    const isCurrencySupported = (code: string) => currencies.value.some(c => c.code === code);
    const isTimezoneSupported = (code: string) => timezones.value.some(t => t.code === code);
    const isCountrySupported  = (code: string) => countries.value.some(c => c.code === code);

    const formatMoney = (amount: number | string, currencyCode: string): string => {
        const cur = getCurrency(currencyCode);
        if (!cur) {
            const n = typeof amount === 'string' ? parseFloat(amount) : amount;
            return Number.isFinite(n) ? n.toFixed(2) : '0.00';
        }
        const decimals = cur.decimal_places ?? 2;
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        const safeNum = Number.isFinite(num) ? num : 0;
        try {
            return cur.symbol + new Intl.NumberFormat(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            }).format(safeNum);
        } catch {
            return cur.symbol + safeNum.toFixed(decimals);
        }
    };

    // 把一份 config 落进 store（首拉与刷新共用）
    function applyConfig(cfg: SystemConfig): void {
        dataVersion.value   = cfg.data_version;
        tenant.value       = cfg.tenant;
        languages.value     = cfg.languages   ?? [];
        currencies.value    = cfg.currencies  ?? [];
        countries.value     = cfg.countries   ?? [];
        timezones.value     = cfg.timezones   ?? [];
        betConfig.value     = cfg.bet_config?.per_currency ?? {};
        lotteryList.value   = (cfg.lottery_list ?? {}) as LotteryListMap;
        // 后端空 map 会序列化成 []（PHP 空关联数组）。归一成 {}，保证按分类读取 thirdGameList[cat] 恒有效。
        thirdGameList.value = (cfg.third_game_list && !Array.isArray(cfg.third_game_list))
            ? cfg.third_game_list
            : {};
        featureFlags.value  = cfg.feature_flags   ?? {};

        storage.set(STORAGE_KEYS.DATA_VERSION, cfg.data_version);

        if (cfg.tenant?.title) document.title = cfg.tenant.title;
        if (cfg.tenant?.favicon) {
            let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = cfg.tenant.favicon;
        }
    }

    async function initMainConfig(force = false): Promise<void> {
        if (isLoaded.value && !force) return;
        applyConfig(await systemService.fetchSystemConfig());
        isLoaded.value = true;
    }

    /**
     * 重新拉取配置:仅当 data_version 变化(总后台改过商户配置/支持项)时才应用,返回是否变化。
     * 供「回到页面 / 定时」时调用,让用户端不刷新也能同步总后台的最新支持语言/币种/国家。
     */
    async function refreshConfig(): Promise<boolean> {
        if (!isLoaded.value) return false;
        const cfg = await systemService.fetchSystemConfig();
        if (cfg.data_version === dataVersion.value) return false;
        applyConfig(cfg);
        return true;
    }

    return {
        // state
        dataVersion, tenant, languages, currencies, countries, timezones,
        betConfig, lotteryList, thirdGameList, featureFlags, isLoaded,

        // 基础 getter
        getCurrency, getLanguage, getCountry, getTimezone, getBetConfig,
        getCurrencyInfo,
        getLotteriesByCategory, getAllLotteryCategories,
        isLanguageSupported, isCurrencySupported, isTimezoneSupported, isCountrySupported,
        formatMoney,
        initMainConfig,
        refreshConfig,

        // === 彩票模块依赖（新增）===
        currentCurrency,
        currencyOptions,
        unitOptions,
        timesOptions,
        timesDefaultOptions,
        setTimesOptions,
    };
});