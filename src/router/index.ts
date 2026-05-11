import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import Login from '@/pages/auth/Login.vue';
import Register from '@/pages/auth/Register.vue';
import Home from "@/pages/Home.vue";
import Ssc from "@/pages/lottery/Ssc.vue";
import Sd from "@/pages/lottery/Sd.vue";
import Ks from "@/pages/lottery/Ks.vue";
import Lhc from "@/pages/lottery/Lhc.vue";
import Kl8 from "@/pages/lottery/Kl8.vue";
import Account from "@/pages/Account.vue";
import Pk10 from "@/pages/lottery/Pk10.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/lottery/ssc/:sign', component: Ssc, name: 'lotterySsc' },
    { path: '/lottery/lhc/:sign', component: Lhc, name: 'lotteryLhc' },
    { path: '/lottery/pk10/:sign', component: Pk10, name: 'lotteryPk10' },
    { path: '/lottery/ks/:sign', component: Ks, name: 'lotteryKs' },
    { path: '/lottery/sd/:sign', component: Sd, name: 'lotterySd' },
    { path: '/lottery/kl8/:sign', component: Kl8, name: 'lotteryKl8' },
    { path: '/account/:page', component: Account, name: 'account' },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const token = userStore.token;
    const publicPaths = ['/login', '/error'];

    if (!token && !publicPaths.includes(to.path)) {
        return next('/login');
    }
    next();
});

export default router;
