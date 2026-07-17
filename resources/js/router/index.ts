import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/Stores/auth';

declare module 'vue-router' {
    interface RouteMeta {
        title?: string;
        requiresAuth?: boolean;
        guest?: boolean;
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/Pages/Home.vue'),
        meta: {
            title: 'Home',
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/Pages/Auth/Login.vue'),
        meta: {
            title: 'Login',
            guest: true,
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/Pages/Auth/Register.vue'),
        meta: {
            title: 'Cadastro',
            guest: true,
        },
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/Pages/Auth/ForgotPassword.vue'),
        meta: {
            title: 'Recuperar senha',
            guest: true,
        },
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('@/Pages/Auth/ResetPassword.vue'),
        meta: {
            title: 'Redefinir senha',
            guest: true,
        },
    },
    {
        path: '/dashboard',
        component: () => import('@/Layouts/AppLayout.vue'),
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('@/Pages/Dashboard.vue'),
                meta: {
                    title: 'Dashboard',
                    requiresAuth: true,
                },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to) => {
    const authStore = useAuthStore();

    if (!authStore.initialized) {
        await authStore.initialize();
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return { name: 'login', query: { redirect: to.fullPath } };
    }

    if (to.meta.guest && authStore.isAuthenticated && (to.name === 'login' || to.name === 'register')) {
        return { name: 'dashboard' };
    }

    return true;
});

export default router;
