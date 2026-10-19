<!-- NavBar : barre de navigation en haut de l'écran, avec le menu du compte et la déconnexion. -->
<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const menuOpen = ref(false)

// Pages qui seront ajoutées avec le back-end (pas encore cliquables)
const soonPages = ['Discover', 'Calendar', 'Budget']

// Première lettre de l'email, affichée dans le rond du profil
const initial = computed(() => (auth.email ? auth.email[0].toUpperCase() : '?'))

function logout() {
  menuOpen.value = false
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-white shadow">
    <div class="flex items-center justify-between px-34 py-4">
      <RouterLink to="/trips" class="font-brand text-3xl text-coral">GearUP</RouterLink>

      <!-- Liens -->
      <div class="hidden items-center gap-3 md:flex translate-x-62">
        <RouterLink to="/trips" class="font-bold hover:text-coral">My Trips</RouterLink>
        <span
          v-for="page in soonPages"
          :key="page"
          class="cursor-not-allowed font-bold text-gray-300"
          title="Soon available"
        >
          {{ page }}
        </span>
      </div>

      <!-- Menu du compte -->
      <div class="relative">
        <button
          @click="menuOpen = !menuOpen"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-coral font-bold text-white hover:bg-coral-dark"
        >
          {{ initial }}
        </button>

        <!-- Zone invisible pour fermer les menus ouvert en cliquant à côté -->
        <div v-if="menuOpen" class="fixed inset-0 z-10" @click="menuOpen = false" />

        <div
          v-if="menuOpen"
          class="absolute right-0 z-20 mt-2 w-56 rounded-2xl bg-white p-2 shadow-lg"
        >
          <p class="truncate px-3 py-2 text-sm text-gray-500">{{ auth.name }}</p>
          <hr class="my-1 border-gray-100" />
          <span class="block cursor-not-allowed px-3 py-2 text-gray-400">My profile (soon)</span>
          <span class="block cursor-not-allowed px-3 py-2 text-gray-400">Settings (soon)</span>
          <hr class="my-1 border-gray-100" />
          <button
            @click="logout"
            class="block w-full rounded-xl px-3 py-2 text-left font-bold text-red-500 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
