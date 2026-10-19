// Liste des pages de l'application. Les pages avec requiresAuth sont réservées aux utilisateurs connectés.
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import TripsView from '@/views/TripsView.vue'
import KanbanView from '@/views/KanbanView.vue'

const routes = [
  { path: '/', redirect: '/trips' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/trips', component: TripsView, meta: { requiresAuth: true } },
  { path: '/trips/:id', component: KanbanView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Avant chaque page protégée, on vérifie que l'utilisateur est connecté
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) {
    return '/login'
  }
})

export default router