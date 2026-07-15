import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { nav } from '@shared/navigation';
import { switchLanguage as switchI18nLocale } from '@shared/i18n';
import * as userService from '@shared/api/userService';
import * as messageService from '@shared/api/messageService';
import { storage, STORAGE_KEYS } from '@shared/utils/storage';
import { useCommonStore } from '@shared/stores/commonStore';
import {
    detectBrowserLanguage,
    detectBrowserCountry,
    detectBrowserTimezone,
} from '@shared/utils/detect';
import type { UserBalance, UserDetail, UserPreference } from '@shared/types/user';
import type { SupportedLocale } from '@shared/types/i18n';


const ENV_DEFAULTS = {
    language: import.meta.env.VITE_DEFAULT_LANG     || 'en',
    currency: import.meta.env.VITE_DEFAULT_CURRENCY || 'usdt',
    timezone: import.meta.env.VITE_DEFAULT_TIMEZONE || 'UTC',
    country:  import.meta.env.VITE_DEFAULT_COUNTRY  || '',
};

/**
 * 把一个偏好值收敛到「后端(总后台)支持列表」内。
 *  - 后端列表尚未加载(空)→ 无法校验,原样返回(best-effort,配置到位后会再次收敛);
 *  - 传入值仍受支持 → 保留;
 *  - 否则依次回退:tenant 默认 → 列表首个 → env 默认。
 * 用途:总后台调整了支持的语言/币种/国家后,用它覆盖掉本地(localStorage/历史用户)里已失效的默认值。
 */
function resolveSupported(
    raw: string | undefined,
    list: ReadonlyArray<unknown>,
    isSupported: (code: string) => boolean,
    tenantDefault: string | undefined,
    firstCode: string | undefined,
    envDefault: string,
): string {
    if (!list.length) return raw || tenantDefault || envDefault;
    if (raw && isSupported(raw)) return raw;
    if (tenantDefault && isSupported(tenantDefault)) return tenantDefault;
    return firstCode || envDefault;
}

const emptyBalance = (): UserBalance => ({});

export const useUserStore = defineStore('user', () => {
    /* ---------- state ---------- */
    const userInfo     = ref<UserDetail | null>(null);
    const token        = ref<string | null>(storage.get(STORAGE_KEYS.TOKEN));
    const refreshToken = ref<string | null>(storage.get(STORAGE_KEYS.REFRESH_TOKEN));
    const balance      = ref<UserBalance>(emptyBalance());

    const isUserLoaded    = ref(false);
    const isBalanceLoaded = ref(false);

    /** 站内信未读数(登录态) */
    const unreadMsgCount = ref(0);

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

    // 生效值 = 用户/匿名偏好,但一律收敛到后端支持列表:失效的历史值会被 tenant 默认覆盖。
    const currentLanguage = computed<string>(() => {
        const cs = useCommonStore();
        return resolveSupported(
            userInfo.value?.language || anonLanguage.value,
            cs.languages, cs.isLanguageSupported,
            cs.tenant?.default_language, cs.languages[0]?.code, ENV_DEFAULTS.language,
        );
    });

    const currentCurrency = computed<string>(() => {
        const cs = useCommonStore();
        return resolveSupported(
            userInfo.value?.currency || anonCurrency.value,
            cs.currencies, cs.isCurrencySupported,
            cs.tenant?.default_currency, cs.currencies[0]?.code, ENV_DEFAULTS.currency,
        );
    });

    const currentTimezone = computed<string>(() => {
        const cs = useCommonStore();
        return resolveSupported(
            userInfo.value?.timezone || anonTimezone.value,
            cs.timezones, cs.isTimezoneSupported,
            cs.tenant?.default_timezone, cs.timezones[0]?.code, ENV_DEFAULTS.timezone,
        );
    });

    const currentCountry = computed<string>(() => {
        const cs = useCommonStore();
        return resolveSupported(
            userInfo.value?.country || anonCountry.value,
            cs.countries, cs.isCountrySupported,
            cs.tenant?.country, cs.countries[0]?.code, ENV_DEFAULTS.country,
        );
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
        // 用户名大小写不敏感:统一转小写(与后端裸用户名 + 小写存储一致)
        const payload = { ...params, username: params.username.trim().toLowerCase() };
        const { access_token, refresh_token } = await userService.loginUser(payload);
        setTokens(access_token, refresh_token);
        await fetchUserInfo();
        // 登录后按登录态重新拉配置 + 余额(config 可能随登录态/币种变化,余额需鉴权),并行拉取。
        // 鉴权已成功(token 已写),这两步失败不应阻断登录,静默兜底,后续挂载/刷新会重试。
        await loadAuthedContext();
        await applyLanguageSideEffect(currentLanguage.value);
        nav.toHome();
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
            username: params.username.trim().toLowerCase(),
            language: currentLanguage.value,
            currency: currentCurrency.value,
            timezone: currentTimezone.value,
            country:  currentCountry.value,
        };
        const { access_token, refresh_token } = await userService.registerUser(enriched);
        setTokens(access_token, refresh_token);
        await fetchUserInfo();
        // 注册即登录:同样按登录态重新拉配置 + 余额(新用户余额为 0 也需落到 store)。
        await loadAuthedContext();
        nav.toHome();
    }

    function logout(): void {
        clearTokens();
        userInfo.value = null;
        balance.value = emptyBalance();
        isUserLoaded.value = false;
        isBalanceLoaded.value = false;
        unreadMsgCount.value = 0;
        storage.remove(STORAGE_KEYS.USER_INFO);
        // anon* 故意保留：登出后界面仍然按用户之前的偏好显示
        if (nav.currentPath() !== '/login') {
            nav.toLogin();
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

    /**
     * 登录/注册成功后加载「登录态上下文」:强制重拉系统配置 + 余额,并行。
     * 鉴权已成功,这两步失败不阻断流程(静默),后续组件挂载/刷新会重试。
     */
    async function loadAuthedContext(): Promise<void> {
        await Promise.all([
            useCommonStore().initMainConfig(true).catch(() => { /* 静默:配置刷新失败不阻断登录 */ }),
            fetchBalance().catch(() => { /* 静默:余额拉取失败不阻断登录 */ }),
        ]);
    }

    /** 拉站内信未读数(未登录直接归零;失败静默,不影响主流程) */
    async function fetchUnreadMsgCount(): Promise<void> {
        if (!isLoggedIn.value) { unreadMsgCount.value = 0; return; }
        try {
            const { unread } = await messageService.fetchUnreadCount();
            unreadMsgCount.value = Number(unread) || 0;
        } catch { /* 静默 */ }
    }

    // 登录态一旦成立(会话内登录 / 刷新后恢复 token)就拉一次未读数,保证顶部数字及时出现
    watch(isLoggedIn, (v) => { if (v) fetchUnreadMsgCount(); }, { immediate: true });

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

    /* ---------- 首次进入 / 配置变更：收敛匿名偏好 ---------- */
    /**
     * 调用时机：commonStore.initMainConfig() 之后、用户交互之前。
     * 对每一项:空值先走浏览器探测,然后统一收敛到「后端支持列表」并回写 localStorage——
     * 所以总后台移除了某语言/币种/国家后,本地残留的失效默认值会被后端默认覆盖(自愈)。
     * 币种特殊:不走浏览器探测。
     */
    async function initAnonPreferences(): Promise<void> {
        const cs = useCommonStore();

        // 1. Language —— 空则浏览器探测,再收敛到支持列表
        const langRaw = anonLanguage.value || detectBrowserLanguage() || '';
        anonLanguage.value = resolveSupported(
            langRaw, cs.languages, cs.isLanguageSupported,
            cs.tenant?.default_language, cs.languages[0]?.code, ENV_DEFAULTS.language,
        );
        storage.set(STORAGE_KEYS.LANGUAGE, anonLanguage.value);

        // 2. Country（允许为空）—— 空则浏览器探测,再收敛
        const ctyRaw = anonCountry.value || detectBrowserCountry() || '';
        const country = resolveSupported(
            ctyRaw, cs.countries, cs.isCountrySupported,
            cs.tenant?.country, cs.countries[0]?.code, ENV_DEFAULTS.country,
        );
        if (country) {
            anonCountry.value = country;
            storage.set(STORAGE_KEYS.COUNTRY, country);
        }

        // 3. Timezone —— 空则浏览器探测,再收敛
        const tzRaw = anonTimezone.value || detectBrowserTimezone() || '';
        anonTimezone.value = resolveSupported(
            tzRaw, cs.timezones, cs.isTimezoneSupported,
            cs.tenant?.default_timezone, cs.timezones[0]?.code, ENV_DEFAULTS.timezone,
        );
        storage.set(STORAGE_KEYS.TIMEZONE, anonTimezone.value);

        // 4. Currency —— 不走浏览器探测,直接收敛(失效值被 tenant 默认覆盖)
        anonCurrency.value = resolveSupported(
            anonCurrency.value, cs.currencies, cs.isCurrencySupported,
            cs.tenant?.default_currency, cs.currencies[0]?.code, ENV_DEFAULTS.currency,
        );
        storage.set(STORAGE_KEYS.CURRENCY, anonCurrency.value);

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
        isUserLoaded, isBalanceLoaded, unreadMsgCount,
        anonLanguage, anonCurrency, anonTimezone, anonCountry,

        // getters
        isLoggedIn, username, vipLevel,isTest,
        currentLanguage, currentCurrency, currentTimezone, currentCountry,

        // token
        setTokens, clearTokens, doRefreshToken,

        // auth
        login, register, logout, initUserInfo,

        // data fetch
        fetchUserInfo, fetchBalance, fetchUnreadMsgCount,

        // preferences
        initAnonPreferences,
        updatePreference,
        switchLanguage, switchCurrency, switchTimezone, switchCountry,
    };
});