import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('@/views/LoginView.vue') },
    { path: '/register', component: () => import('@/views/RegisterView.vue') },
    { path: '/trips', component: () => import('@/views/TripsView.vue'), meta: { requiresAuth: true } },
    { path: '/trips/:id', component: () => import('@/views/KanbanView.vue'), meta: { requiresAuth: true } },
    { path: '/', redirect: '/trips' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) return '/login'
})

export default router
