import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/assets/scss/global.scss';
import '@/assets/scss/sd-font.scss';

import App from './App.vue';
import router from './router';
import i18n, { loadInitialLocale } from './i18n';
import { handleGlobalError } from '@/utils/common';

import { configureAuth, configureContext } from '@/api';
import { refreshTokenRequest } from '@/api/userService';
import { useUserStore } from '@/stores/userStore';

(async () => {
    await loadInitialLocale();

    const app = createApp(App);

    // 1) Pinia 必须先 use
    app.use(createPinia());

    // 2) ★ 注入 auth + context hooks（让 axios 拦截器拿到 token / lang / currency / tz）
    const userStore = useUserStore();

    configureAuth({
        getToken:        () => userStore.token,
        getRefreshToken: () => userStore.refreshToken,
        setTokens:       (a, r) => userStore.setTokens(a, r),
        onUnauthorized:  () => userStore.logout(),
        onRefreshTokenRequest: async (refresh) => {
            const res = await refreshTokenRequest(refresh);
            return { access_token: res.access_token, refresh_token: res.refresh_token };
        },
    });

    configureContext({
        getLanguage: () => userStore.currentLanguage,
        getCurrency: () => userStore.currentCurrency,
        getTimezone: () => userStore.currentTimezone,
    });

    // 3) 其它 plugins
    app.use(router);
    app.use(ElementPlus);
    app.use(i18n);

    // 4) 全局错误
    app.config.globalProperties.$handleError = handleGlobalError;

    app.config.errorHandler = (err: unknown, instance: any, info: string) => {
        const componentName = instance?.$options?.name || 'UnknownComponent';
        handleGlobalError(err, undefined, `Component Error (${componentName}): ${info}`);
    };

    window.addEventListener('unhandledrejection', (event) => {
        handleGlobalError(event.reason, undefined, 'Unhandled Promise Rejection');
        event.preventDefault();
    });

    app.mount('#app');
})();