import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@shared/stores/userStore';

import PageHost from '@h5/themes/PageHost.vue';

// 所有页面走主题解析(PageHost):按当前 sign 解析 themes/skins/<sign>/pages/<name>.vue,回落 default。
// 路由参数由 PageHost 透传给页面(见 PageHost.vue),兼容 props:true 风格页面。
const routes = [
    { path: '/',          component: PageHost, props: { name: 'index' },          name: 'home' },
    { path: '/lottery',   component: PageHost, props: { name: 'lottery' },        name: 'lottery' },
    { path: '/lottery/:category/:sign', component: PageHost, props: { name: 'lottery/bet' }, name: 'lotteryBet', meta: { requiresAuth: true } },
    { path: '/mine',      component: PageHost, props: { name: 'mine' },           name: 'mine' },
    { path: '/activity',  component: PageHost, props: { name: 'activity' },       name: 'activity' },
    { path: '/join',      component: PageHost, props: { name: 'join' },           name: 'join' },
    { path: '/recharge',  component: PageHost, props: { name: 'recharge' },       name: 'recharge' },
    { path: '/sports',    component: PageHost, props: { name: 'sports' },         name: 'sports' },
    { path: '/login',     component: PageHost, props: { name: 'auth/Login' },     name: 'login' },
    { path: '/error/403', component: PageHost, props: { name: 'error/Error403' }, name: 'forbidden' },
    { path: '/error/404', component: PageHost, props: { name: 'error/Error404' }, name: 'notFound' },

    { path: '/:pathMatch(.*)*', redirect: '/error/404' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, _from, next) => {
    const userStore = useUserStore();
    const token = userStore.token;
    const publicPaths = ['/login', '/error/403', '/error/404', '/', '/lottery', '/mine', '/activity', '/join', '/recharge', '/sports'];

    if (to.meta.requiresAuth && !token) {
        return next('/login');
    }
    if (!token && !publicPaths.includes(to.path)) {
        return next('/login');
    }
    next();
});

export default router;
