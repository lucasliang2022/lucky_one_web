import { createApp } from 'vue';
import { createPinia } from 'pinia';
// Vant 组件按需自动引入(unplugin-vue-components + VantResolver),此处只需引入基础样式。
import 'vant/lib/index.css';
import { showToast, showNotify } from 'vant';

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

    // 与 web 端一致:api 内核不直接依赖 store,由端注入 token / 刷新逻辑
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

    // h5 端注入自己的 router 实现;shared 内部只调 nav.xxx()
    configureNavigation({
        toLogin:     () => { router.push('/login'); },
        toHome:      () => { router.push('/'); },
        toForbidden: () => { router.push('/error/403'); },
        toNotFound:  () => { router.push('/error/404'); },
        currentPath: () => router.currentRoute.value.path,
    });

    // h5 端提示走 Vant 的 Toast / Notify;shared 内部只调 notify.xxx()
    configureNotify({
        success: (m) => showToast({ type: 'success', message: m }),
        error:   (m) => showNotify({ type: 'danger', message: m }),
        warning: (m) => showNotify({ type: 'warning', message: m }),
        info:    (m) => showToast({ message: m }),
    });

    app.use(router);
    // 注意:h5 不 use ElementPlus,改用 Vant 按需引入
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
