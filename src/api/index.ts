import axios from 'axios';
import type {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { t } from '@/i18n';
import { ApiError, type ApiResponse } from '@/types/api';

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
            ElMessage.error(msg);
            return Promise.reject(new ApiError(-1, msg));
        }
        if (res.code === 200) return response;

        ElMessage.error(res.msg);
        return Promise.reject(new ApiError(res.code, res.msg, res));
    },

    async (error: AxiosError<ApiResponse<unknown>>) => {
        const { response, config } = error;

        if (!response) {
            const msg = t('common.service.api.network');
            ElMessage.error(msg);
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
                router.push('/login');
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
                router.push('/login');
                return Promise.reject(new ApiError(401, t('common.service.api.loginExpired')));
            } finally {
                isRefreshing = false;
            }
        }

        const data = response.data;
        const msg = data?.msg;

        switch (status) {
            case 403:
                ElMessage.error(msg || t('common.service.api.forbidden'));
                router.push('/error/403');
                break;
            case 404:
                router.push('/error/404');
                break;
            case 408:
            case 504:
                ElMessage.error(t('common.service.api.timeout'));
                break;
            case 422: {
                const errors = (data as any)?.data?.errors;
                if (errors && typeof errors === 'object') {
                    const firstField = Object.keys(errors)[0];
                    const firstMsg = errors[firstField]?.[0];
                    ElMessage.error(firstMsg || msg || t('common.service.api.validation'));
                } else {
                    ElMessage.error(msg || t('common.service.api.validation'));
                }
                break;
            }
            case 429:
                ElMessage.error(t('common.service.api.rateLimit'));
                break;
            case 500:
            case 502:
            case 503:
                ElMessage.error(msg || t('common.service.api.serverError'));
                break;
            default:
                ElMessage.error(msg || `${t('common.service.api.unknownError')} (${status})`);
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