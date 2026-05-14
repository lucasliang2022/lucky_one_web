import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

import Home     from '@/pages/Home.vue';
import Login    from '@/pages/auth/Login.vue';
import Register from '@/pages/auth/Register.vue';
import Account  from '@/pages/Account.vue';

const routes = [
    { path: '/',         component: Home,     name: 'home' },
    { path: '/login',    component: Login,    name: 'login' },
    { path: '/register', component: Register, name: 'register' },

    {
        path: '/lottery/:category/:sign',
        name: 'lottery',
        component: () => import('@/pages/lottery/Lottery.vue'),
        props: true,
        meta: { requiresAuth: true },
    },

    { path: '/lottery', redirect: '/' },

    { path: '/account/:page', component: Account, name: 'account' },

    {
        path: '/game/:category',
        name: 'gameCategory',
        component: () => import('@/pages/game/CategoryHome.vue'),
        props: true,
    },
    {
        path: '/game/:category/:sign',
        name: 'gamePlay',
        component: () => import('@/pages/game/GamePlay.vue'),
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: '/game/sport/fb',
        name: 'sport-fb',
        component: () => import('@/pages/game/sport/fb.vue'),
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