import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
    interface RouteMeta {
        title?: string;
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@/Layouts/AppLayout.vue'),
        children: [
            {
                path: '',
                redirect: { name: 'dashboard' },
            },
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@/Pages/Dashboard.vue'),
                meta: {
                    title: 'Dashboard',
                },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
