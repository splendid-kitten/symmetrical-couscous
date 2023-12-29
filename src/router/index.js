import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/visits',
                    name: 'visits table',
                    component: () => import('@/views/VisitsTable.vue')
                }
            ]
        }    
    ]
});

export default router;
