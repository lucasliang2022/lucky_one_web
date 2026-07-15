import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
polyfillCountryFlagEmojis('Twemoji Country Flags');

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus, { ElMessage } from 'element-plus';
import 'element-plus/dist/index.css';
import '@/assets/scss/global.scss';
import '@/assets/scss/sd-font.scss';

import App from './App.vue';
import router from './router';
import i18n, { loadInitialLocale } from '@shared/i18n';
import { handleGlobalError } from '@shared/utils/common';

import { configureAuth, configureContext } from '@shared/api';
import { configureNavigation } from '@shared/navigation';
import { configureNotify } from '@shared/notify';
import { refreshTokenRequest } from '@shared/api/userService';
import { useUserStore } from '@shared/stores/userStore';

(async () => {
    await loadInitialLocale();

    const app = createApp(App);

    app.use(createPinia());

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

    // web 端注入自己的 router 实现;shared 内部只调 nav.xxx(),不直接依赖 router
    configureNavigation({
        toLogin:     () => { router.push('/login'); },
        toHome:      () => { router.push('/'); },
        toForbidden: () => { router.push('/error/403'); },
        toNotFound:  () => { router.push('/error/404'); },
        currentPath: () => router.currentRoute.value.path,
    });

    // web 端提示走 element-plus 的 ElMessage;shared 内部只调 notify.xxx()
    configureNotify({
        success: (m) => ElMessage.success(m),
        error:   (m) => ElMessage.error(m),
        warning: (m) => ElMessage.warning(m),
        info:    (m) => ElMessage.info(m),
    });

    app.use(router);
    app.use(ElementPlus);
    app.use(i18n);

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