import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@shared/stores/userStore';

import PageHost from '@web/themes/PageHost.vue';

// 所有页面走主题解析(PageHost):按当前 sign 解析 themes/<sign>/pages/<name>.vue,回落 default。
// 路由参数(:category/:sign/:page 等)由 PageHost 透传给页面(见 PageHost.vue),兼容 props:true 风格页面。
const routes = [
    { path: '/',         component: PageHost, props: { name: 'index' },         name: 'home' },
    { path: '/login',    component: PageHost, props: { name: 'auth/Login' },    name: 'login' },
    { path: '/register', component: PageHost, props: { name: 'auth/Register' }, name: 'register' },

    {
        path: '/lottery/:category/:sign',
        name: 'lottery',
        component: PageHost, props: { name: 'lottery/Lottery' },
        meta: { requiresAuth: true },
    },

    { path: '/lottery', redirect: '/' },

    { path: '/account/:page', component: PageHost, props: { name: 'Account' }, name: 'account' },

    {
        path: '/game/:category',
        name: 'gameCategory',
        component: PageHost, props: { name: 'game/CategoryHome' },
    },
    {
        path: '/game/:category/:sign',
        name: 'gamePlay',
        component: PageHost, props: { name: 'game/GamePlay' },
        meta: { requiresAuth: true },
    },
    {
        path: '/game/sport/fb',
        name: 'sport-fb',
        component: PageHost, props: { name: 'game/sport/fb' },
        meta: { requiresAuth: true },
    },

    { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const token = userStore.token;
    const publicPaths = ['/login', '/register', '/error', '/'];

    if (to.meta.requiresAuth && !token) {
        return next('/login');
    }
    if (!token && !publicPaths.includes(to.path)) {
        return next('/login');
    }
    next();
});

export default router;