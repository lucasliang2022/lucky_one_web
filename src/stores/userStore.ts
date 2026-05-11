import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import router from '@/router';
import { switchLanguage as switchI18nLocale } from '@/i18n';
import * as userService from '@/api/userService';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { useCommonStore } from '@/stores/commonStore';
import {
    detectBrowserLanguage,
    detectBrowserCountry,
    detectBrowserTimezone,
} from '@/utils/detect';
import type { UserBalance, UserDetail, UserPreference } from '@/types/user';
import type { SupportedLocale } from '@/types/i18n';


const ENV_DEFAULTS = {
    language: import.meta.env.VITE_DEFAULT_LANG     || 'en',
    currency: import.meta.env.VITE_DEFAULT_CURRENCY || 'usdt',
    timezone: import.meta.env.VITE_DEFAULT_TIMEZONE || 'UTC',
    country:  import.meta.env.VITE_DEFAULT_COUNTRY  || '',
};

const emptyBalance = (): UserBalance => ({});

export const useUserStore = defineStore('user', () => {
    /* ---------- state ---------- */
    const userInfo     = ref<UserDetail | null>(null);
    const token        = ref<string | null>(storage.get(STORAGE_KEYS.TOKEN));
    const refreshToken = ref<string | null>(storage.get(STORAGE_KEYS.REFRESH_TOKEN));
    const balance      = ref<UserBalance>(emptyBalance());

    const isUserLoaded    = ref(false);
    const isBalanceLoaded = ref(false);

    /** 匿名（未登录）偏好 */
    const anonLanguage = ref<string>(storage.get(STORAGE_KEYS.LANGUAGE) ?? '');
    const anonCurrency = ref<string>(storage.get(STORAGE_KEYS.CURRENCY) ?? '');
    const anonTimezone = ref<string>(storage.get(STORAGE_KEYS.TIMEZONE) ?? '');
    const anonCountry  = ref<string>(storage.get(STORAGE_KEYS.COUNTRY)  ?? '');

    /* ---------- getters ---------- */
    const isLoggedIn    = computed(() => !!token.value);
    const username      = computed(() => userInfo.value?.username ?? '');
    const vipLevel      = computed(() => userInfo.value?.vip_level ?? 0);
    const isTest        = computed(() => userInfo.value?.is_test ?? false);

    const currentLanguage = computed<string>(() => {
        const cs = useCommonStore();
        return userInfo.value?.language
            || anonLanguage.value
            || cs.partner?.default_language
            || ENV_DEFAULTS.language;
    });

    const currentCurrency = computed<string>(() => {
        const cs = useCommonStore();
        return userInfo.value?.currency
            || anonCurrency.value
            || cs.partner?.default_currency
            || ENV_DEFAULTS.currency;
    });

    const currentTimezone = computed<string>(() => {
        const cs = useCommonStore();
        return userInfo.value?.timezone
            || anonTimezone.value
            || cs.partner?.default_timezone
            || ENV_DEFAULTS.timezone;
    });

    const currentCountry = computed<string>(() => {
        const cs = useCommonStore();
        return userInfo.value?.country
            || anonCountry.value
            || cs.partner?.country
            || ENV_DEFAULTS.country;
    });

    function setTokens(access: string, refresh: string): void {
        token.value = access;
        refreshToken.value = refresh;
        storage.set(STORAGE_KEYS.TOKEN, access);
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, refresh);
    }

    function clearTokens(): void {
        token.value = null;
        refreshToken.value = null;
        storage.remove(STORAGE_KEYS.TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    }

    async function doRefreshToken(): Promise<string> {
        if (!refreshToken.value) throw new Error('no refresh token');
        const res = await userService.refreshTokenRequest(refreshToken.value);
        setTokens(res.access_token, res.refresh_token);
        return res.access_token;
    }

    /* ---------- auth ---------- */
    async function login(params: { username: string; password: string; captcha?: string }): Promise<void> {
        const { access_token, refresh_token } = await userService.loginUser(params);
        setTokens(access_token, refresh_token);
        await fetchUserInfo();
        await applyLanguageSideEffect(currentLanguage.value);
        await router.push('/');
    }

    async function register(params: {
        username: string;
        password: string;
        password_confirm: string;
        captcha?: string;
    }): Promise<void> {
        // 注册时把当前偏好一并带过去，新用户落库就有正确偏好
        const enriched = {
            ...params,
            language: currentLanguage.value,
            currency: currentCurrency.value,
            timezone: currentTimezone.value,
            country:  currentCountry.value,
        };
        const { access_token, refresh_token } = await userService.registerUser(enriched);
        setTokens(access_token, refresh_token);
        await fetchUserInfo();
        await router.push('/');
    }

    function logout(): void {
        clearTokens();
        userInfo.value = null;
        balance.value = emptyBalance();
        isUserLoaded.value = false;
        isBalanceLoaded.value = false;
        storage.remove(STORAGE_KEYS.USER_INFO);
        // anon* 故意保留：登出后界面仍然按用户之前的偏好显示
        if (router.currentRoute.value.path !== '/login') {
            router.push('/login');
        }
    }

    /* ---------- data fetch ---------- */
    async function fetchUserInfo(): Promise<void> {
        if (!token.value) return;
        userInfo.value = await userService.fetchUserInfo();
        storage.setJSON(STORAGE_KEYS.USER_INFO, userInfo.value);
        isUserLoaded.value = true;
    }

    async function fetchBalance(): Promise<void> {
        if (!isLoggedIn.value) return;
        balance.value = await userService.fetchUserBalance();
        isBalanceLoaded.value = true;
    }

    async function initUserInfo(): Promise<void> {
        if (token.value && !userInfo.value) {
            try {
                await fetchUserInfo();
                await applyLanguageSideEffect(currentLanguage.value);
            } catch {
                logout();
            }
        }
    }

    /* ---------- 首次进入：浏览器探测偏好 ---------- */
    /**
     * 调用时机：commonStore.initMainConfig() 之后、用户交互之前。
     * - 已有 anon* 值（localStorage 残留）则保留
     * - 否则从浏览器探测；探测值不在 partner 支持列表内时 fallback 到 partner default → env default
     * - 币种特殊：不走浏览器探测，直接 partner default → env default
     */
    async function initAnonPreferences(): Promise<void> {
        const cs = useCommonStore();

        // 1. Language —— 浏览器探测优先
        if (!anonLanguage.value) {
            const detected = detectBrowserLanguage();
            const candidate =
                (detected && cs.isLanguageSupported(detected) && detected) ||
                cs.partner?.default_language ||
                ENV_DEFAULTS.language;
            anonLanguage.value = candidate;
            storage.set(STORAGE_KEYS.LANGUAGE, candidate);
        }

        // 2. Country —— 浏览器探测优先
        if (!anonCountry.value) {
            const detected = detectBrowserCountry();
            const candidate =
                (detected && cs.isCountrySupported(detected) && detected) ||
                cs.partner?.country ||
                ENV_DEFAULTS.country;
            if (candidate) {
                anonCountry.value = candidate;
                storage.set(STORAGE_KEYS.COUNTRY, candidate);
            }
        }

        // 3. Timezone —— 浏览器探测优先
        if (!anonTimezone.value) {
            const detected = detectBrowserTimezone();
            const candidate =
                (detected && cs.isTimezoneSupported(detected) && detected) ||
                cs.partner?.default_timezone ||
                ENV_DEFAULTS.timezone;
            anonTimezone.value = candidate;
            storage.set(STORAGE_KEYS.TIMEZONE, candidate);
        }

        // 4. Currency —— ★ 不走浏览器探测，partner -> env 兜底
        if (!anonCurrency.value) {
            const fromPartner = cs.partner?.default_currency;
            const candidate = fromPartner || ENV_DEFAULTS.currency;

            if (cs.isCurrencySupported(candidate)) {
                anonCurrency.value = candidate;
            } else if (cs.currencies.length > 0) {
                // partner 默认值非法（极少见），用 partner 支持列表第一个
                anonCurrency.value = cs.currencies[0].code;
            } else {
                // partner 配置还没加载完时先用 env 顶着，稍后会被 partner 数据覆盖
                anonCurrency.value = candidate;
            }
            storage.set(STORAGE_KEYS.CURRENCY, anonCurrency.value);
        }

        // 5. 应用 language 副作用（切 i18n + html lang）
        await applyLanguageSideEffect(currentLanguage.value);
    }

    /* ---------- preferences ---------- */
    async function applyLanguageSideEffect(lang: string): Promise<void> {
        await switchI18nLocale(lang as SupportedLocale);
        document.documentElement.lang = lang;
    }

    async function updatePreference(pref: UserPreference): Promise<void> {
        const cs = useCommonStore();

        // 校验
        if (pref.language && !cs.isLanguageSupported(pref.language)) {
            throw new Error(`Language not supported: ${pref.language}`);
        }
        if (pref.currency && !cs.isCurrencySupported(pref.currency)) {
            throw new Error(`Currency not supported: ${pref.currency}`);
        }
        if (pref.timezone && !cs.isTimezoneSupported(pref.timezone)) {
            throw new Error(`Timezone not supported: ${pref.timezone}`);
        }
        if (pref.country && !cs.isCountrySupported(pref.country)) {
            throw new Error(`Country not supported: ${pref.country}`);
        }

        // 更新 state（登录态写 userInfo，匿名写 anon*）
        if (pref.language) {
            if (userInfo.value) userInfo.value.language = pref.language;
            else                anonLanguage.value     = pref.language;
        }
        if (pref.currency) {
            if (userInfo.value) userInfo.value.currency = pref.currency;
            else                anonCurrency.value     = pref.currency;
        }
        if (pref.timezone) {
            if (userInfo.value) userInfo.value.timezone = pref.timezone;
            else                anonTimezone.value     = pref.timezone;
        }
        if (pref.country) {
            if (userInfo.value) userInfo.value.country = pref.country;
            else                anonCountry.value     = pref.country;
        }

        // localStorage 持久化
        if (pref.language) storage.set(STORAGE_KEYS.LANGUAGE, pref.language);
        if (pref.currency) storage.set(STORAGE_KEYS.CURRENCY, pref.currency);
        if (pref.timezone) storage.set(STORAGE_KEYS.TIMEZONE, pref.timezone);
        if (pref.country)  storage.set(STORAGE_KEYS.COUNTRY,  pref.country);

        // 已登录则同步到后端
        if (isLoggedIn.value) {
            await userService.updateUserPreference(pref);
        }

        // 副作用
        if (pref.language) {
            await applyLanguageSideEffect(pref.language);
        }
    }

    /* ---------- 切换快捷方法（语法糖） ---------- */
    const switchLanguage = (lang: string)     => updatePreference({ language: lang as SupportedLocale });
    const switchCurrency = (currency: string) => updatePreference({ currency });
    const switchTimezone = (timezone: string) => updatePreference({ timezone });
    const switchCountry  = (country: string)  => updatePreference({ country });

    return {
        // state
        userInfo, token, refreshToken, balance,
        isUserLoaded, isBalanceLoaded,
        anonLanguage, anonCurrency, anonTimezone, anonCountry,

        // getters
        isLoggedIn, username, vipLevel,isTest,
        currentLanguage, currentCurrency, currentTimezone, currentCountry,

        // token
        setTokens, clearTokens, doRefreshToken,

        // auth
        login, register, logout, initUserInfo,

        // data fetch
        fetchUserInfo, fetchBalance,

        // preferences
        initAnonPreferences,
        updatePreference,
        switchLanguage, switchCurrency, switchTimezone, switchCountry,
    };
});