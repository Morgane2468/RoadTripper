<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-white shadow">
    <div class="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
      <RouterLink to="/trips" class="text-xl font-bold text-blue-600">
        RoadTripper 🚗
      </RouterLink>

      <div class="flex items-center gap-4">
        <RouterLink to="/trips" class="text-gray-600 hover:text-gray-900">
          Mes voyages
        </RouterLink>
        <button
          @click="logout"
          class="text-sm border border-red-300 text-red-500 rounded px-3 py-1 hover:bg-red-50"
        >
          Déconnexion
        </button>
      </div>
    </div>
  </nav>
</template>
