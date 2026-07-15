import axios from 'axios';
import type {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { notify } from '@shared/notify';
import { nav } from '@shared/navigation';
import { t } from '@shared/i18n';
import { ApiError, type ApiResponse } from '@shared/types/api';

/* =========================================================
 * Hooks（避免 api 直接依赖 store，打破循环引用）
 * ========================================================= */
interface AuthHooks {
    getToken:        () => string | null;
    getRefreshToken: () => string | null;
    setTokens:       (access: string, refresh: string) => void;
    onUnauthorized:  () => void;
    onRefreshTokenRequest: (refresh: string) => Promise<{ access_token: string; refresh_token: string }>;
}
interface ContextHooks {
    getLanguage: () => string;
    getCurrency: () => string;
    getTimezone: () => string;
}

let authHooks: AuthHooks | null = null;
let contextHooks: ContextHooks | null = null;

export function configureAuth(hooks: AuthHooks): void { authHooks = hooks; }
export function configureContext(hooks: ContextHooks): void { contextHooks = hooks; }

/* =========================================================
 * Axios 实例
 * ========================================================= */
const instance = axios.create({
    baseURL: (import.meta.env.VITE_API_BASE_URL as string) || '/api',
    timeout: 10000,
});

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = authHooks?.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const lang = contextHooks?.getLanguage()
            ?? (import.meta.env.VITE_DEFAULT_LANG as string)
            ?? 'en';
        // 后端按 x-lang 头解析语言(BaseContextMid::resolveLanguage,值须匹配 LanguageConst)。
        // 之前只发 Accept-Language,后端不读 → 服务端翻译(如玩法结构标题)回落默认语言。
        config.headers['x-lang'] = lang;
        config.headers['Accept-Language'] = lang;

        const currency = contextHooks?.getCurrency() ?? '';
        if (currency) config.headers['X-Currency'] = currency;

        const timezone = contextHooks?.getTimezone() ?? '';
        if (timezone) config.headers['X-Timezone'] = timezone;
        config.headers['X-Device']        = 'web';
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

/* =========================================================
 * 401 refresh 队列
 * ========================================================= */
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];
const flushQueue = (token: string | null) => {
    pendingQueue.forEach(cb => cb(token));
    pendingQueue = [];
};

instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
        const res = response.data;
        if (!res || typeof res.code === 'undefined') {
            const msg = t('common.service.api.invalid');
            notify.error(msg);
            return Promise.reject(new ApiError(-1, msg));
        }
        if (res.code === 200) return response;

        notify.error(res.msg);
        return Promise.reject(new ApiError(res.code, res.msg, res));
    },

    async (error: AxiosError<ApiResponse<unknown>>) => {
        const { response, config } = error;

        if (!response) {
            const msg = t('common.service.api.network');
            notify.error(msg);
            return Promise.reject(new ApiError(-1, msg));
        }

        const status = response.status;
        const cfg = config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

        // 401 → refresh + retry
        if (status === 401 && cfg && !cfg._retry) {
            cfg._retry = true;
            const refresh = authHooks?.getRefreshToken();

            if (!refresh || !authHooks) {
                authHooks?.onUnauthorized();
                nav.toLogin();
                return Promise.reject(new ApiError(401, t('common.service.api.loginExpired')));
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingQueue.push((newToken) => {
                        if (newToken && cfg.headers) {
                            cfg.headers.Authorization = `Bearer ${newToken}`;
                            resolve(instance(cfg));
                        } else {
                            reject(new ApiError(401, t('common.service.api.loginExpired')));
                        }
                    });
                });
            }

            isRefreshing = true;
            try {
                const { access_token, refresh_token } = await authHooks.onRefreshTokenRequest(refresh);
                authHooks.setTokens(access_token, refresh_token);
                flushQueue(access_token);
                if (cfg.headers) cfg.headers.Authorization = `Bearer ${access_token}`;
                return instance(cfg);
            } catch {
                flushQueue(null);
                authHooks.onUnauthorized();
                nav.toLogin();
                return Promise.reject(new ApiError(401, t('common.service.api.loginExpired')));
            } finally {
                isRefreshing = false;
            }
        }

        const data = response.data;
        const msg = data?.msg;

        switch (status) {
            case 403:
                notify.error(msg || t('common.service.api.forbidden'));
                nav.toForbidden();
                break;
            case 404:
                nav.toNotFound();
                break;
            case 408:
            case 504:
                notify.error(t('common.service.api.timeout'));
                break;
            case 422: {
                const errors = (data as any)?.data?.errors;
                if (errors && typeof errors === 'object') {
                    const firstField = Object.keys(errors)[0];
                    const firstMsg = errors[firstField]?.[0];
                    notify.error(firstMsg || msg || t('common.service.api.validation'));
                } else {
                    notify.error(msg || t('common.service.api.validation'));
                }
                break;
            }
            case 429:
                notify.error(t('common.service.api.rateLimit'));
                break;
            case 500:
            case 502:
            case 503:
                notify.error(msg || t('common.service.api.serverError'));
                break;
            default:
                notify.error(msg || `${t('common.service.api.unknownError')} (${status})`);
        }

        return Promise.reject(new ApiError(status, msg || error.message, data));
    },
);

/* =========================================================
 * 类型化请求工具
 * ========================================================= */
async function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    const response = await instance.request<ApiResponse<T>>(config);
    return response.data.data;
}

export const api = {
    get:    <T = unknown>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, url, method: 'GET' }),
    post:   <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        request<T>({ ...config, url, method: 'POST', data }),
    put:    <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        request<T>({ ...config, url, method: 'PUT', data }),
    patch:  <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        request<T>({ ...config, url, method: 'PATCH', data }),
    delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, url, method: 'DELETE' }),
};

export default api;