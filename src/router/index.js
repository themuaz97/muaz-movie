import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/NowPlaying.vue')
                },
                {
                    path: '/moviedetails/:id',
                    name: 'moviedetails',
                    component: () => import('@/views/MovieDetails.vue'),
                    props: true
                },
                {
                    path: '/genreslist',
                    name: 'genreslist',
                    component: () => import('@/views/GenreList.vue')
                },
                {
                    path: '/genreshows/:id',
                    name: 'genreshows',
                    component: () => import('@/views/Genre.vue'),
                    props: true
                }
            ]
        }
    ]
});

export default router;
