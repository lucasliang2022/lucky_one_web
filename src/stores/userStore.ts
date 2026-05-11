import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import router from '@/router';
import { switchLanguage as switchI18nLocale } from '@/i18n';
import * as userService from '@/api/userService';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { useCommonStore } from '@/stores/commonStore';
import type { UserBalance, UserDetail, UserPreference } from '@/types/user';
import type { SupportedLocale } from '@/types/i18n';

const emptyBalance = (): UserBalance => ({ main: {}, third: {} });

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

    /* ---------- getters ---------- */
    const isLoggedIn = computed(() => !!token.value);
    const username   = computed(() => userInfo.value?.username ?? '');
    const vipLevel   = computed(() => userInfo.value?.vip_level ?? 0);

    const currentLanguage = computed<string>(() => {
        const cs = useCommonStore();
        return userInfo.value?.language || anonLanguage.value || cs.partner?.default_language || 'en';
    });
    const currentCurrency = computed<string>(() => {
        const cs = useCommonStore();
        return userInfo.value?.currency || anonCurrency.value || cs.partner?.default_currency || '';
    });
    const currentTimezone = computed<string>(() => {
        const cs = useCommonStore();
        return userInfo.value?.timezone || anonTimezone.value || cs.partner?.default_timezone || 'UTC';
    });

    /* ---------- token ---------- */
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
        username: string; password: string; password_confirm: string; captcha?: string;
    }): Promise<void> {
        const { access_token, refresh_token } = await userService.registerUser(params);
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

    /* ---------- preferences ---------- */
    async function applyLanguageSideEffect(lang: string): Promise<void> {
        await switchI18nLocale(lang as SupportedLocale);
        document.documentElement.lang = lang;
    }

    async function updatePreference(pref: UserPreference): Promise<void> {
        const cs = useCommonStore();

        if (pref.language && !cs.isLanguageSupported(pref.language)) {
            throw new Error(`Language not supported: ${pref.language}`);
        }
        if (pref.currency && !cs.isCurrencySupported(pref.currency)) {
            throw new Error(`Currency not supported: ${pref.currency}`);
        }
        if (pref.timezone && !cs.isTimezoneSupported(pref.timezone)) {
            throw new Error(`Timezone not supported: ${pref.timezone}`);
        }

        if (pref.language) {
            if (userInfo.value) userInfo.value.language = pref.language;
            else anonLanguage.value = pref.language;
        }
        if (pref.currency) {
            if (userInfo.value) userInfo.value.currency = pref.currency;
            else anonCurrency.value = pref.currency;
        }
        if (pref.timezone) {
            if (userInfo.value) userInfo.value.timezone = pref.timezone;
            else anonTimezone.value = pref.timezone;
        }

        if (pref.language) storage.set(STORAGE_KEYS.LANGUAGE, pref.language);
        if (pref.currency) storage.set(STORAGE_KEYS.CURRENCY, pref.currency);
        if (pref.timezone) storage.set(STORAGE_KEYS.TIMEZONE, pref.timezone);

        if (isLoggedIn.value) {
            await userService.updateUserPreference(pref);
        }

        if (pref.language) {
            await applyLanguageSideEffect(pref.language);
        }
    }

    const switchLanguage = (lang: string)     => updatePreference({ language: lang as SupportedLocale });
    const switchCurrency = (currency: string) => updatePreference({ currency });
    const switchTimezone = (timezone: string) => updatePreference({ timezone });

    return {
        userInfo, token, refreshToken, balance, isUserLoaded, isBalanceLoaded,
        isLoggedIn, username, vipLevel,
        currentLanguage, currentCurrency, currentTimezone,
        setTokens, clearTokens, doRefreshToken,
        login, register, logout, initUserInfo,
        fetchUserInfo, fetchBalance,
        updatePreference, switchLanguage, switchCurrency, switchTimezone,
    };
});