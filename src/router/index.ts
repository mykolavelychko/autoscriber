import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/records',
      name: 'records',
      component: () => import('@/views/RecordsView.vue'),
      children: [
        {
          path: ':id',
          name: 'record-details',
          component: () => import('@/views/RecordDetailsView.vue')
        }
      ]
    },
    {
      path: '/new-record',
      name: 'new record',
      component: () => import('@/views/RecordingView.vue')
    }
  ]
});

export default router;
