<!-- NavBar : barre de navigation en haut de l'écran, avec le menu du compte et la déconnexion. -->
<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import GearUpLogo from "@/components/GearUpLogo.vue";

const router = useRouter();
const auth = useAuthStore();

const menuOpen = ref(false);

// Pages du menu : celles sans "to" sont grisées (pas encore disponibles)
const pages = [
  { label: "Discover" },
  { label: "Calendar", to: "/calendar" },
  { label: "Budget" , to: "/budget" },
];

// Première lettre affichée dans le rond du profil
const initial = computed(() => (auth.email ? auth.email[0].toUpperCase() : "?"));

const logoutError = ref('')

async function logout() {
  menuOpen.value = false
  try {
    await auth.logout()
    await router.push('/login')
  } catch {
    logoutError.value = 'Unable to sign out. Please try again.'
  }
}
</script>

<template>
  <p v-if="logoutError" role="alert" class="text-center text-red-700">{{ logoutError }}</p>
  <nav class="relative bg-night shadow-lg">
    <div class="mx:auto flex items-center justify-between px-6 py-7">
      <RouterLink to="/trips" class="text-4xl text-white"><GearUpLogo /></RouterLink>

      <!-- Liens -->
      <div class="hidden items-center text-xl gap-3 md:flex translate-x-100">
        <RouterLink
          to="/trips"
          active-class="bg-white !text-night"
          class="rounded-full px-4 py-1 font-bold text-white transition-colors"
        >
          My Trips
        </RouterLink>
        <template v-for="page in pages" :key="page.label">
          <RouterLink
            v-if="page.to"
            :to="page.to"
            active-class="bg-white !text-night"
            class="rounded-full px-4 py-1 font-bold text-white transition-colors"
          >
            {{ page.label }}
          </RouterLink>
          <span
            v-else
            class="cursor-not-allowed rounded-full px-4 py-1 font-bold text-white/30"
            title="Soon available"
          >
            {{ page.label }}
          </span>
        </template>
      </div>

      <!-- Menu du compte -->
      <div class="relative">
        <button
          @click="menuOpen = !menuOpen"
          class="flex h-11 w-11 items-center justify-center rounded-full bg-white font-bold text-night ring-2 ring-white/20 transition-transform hover:scale-105"
        >
          {{ initial }}
        </button>

        <!-- Zone invisible pour fermer les menus ouverts -->
        <div v-if="menuOpen" class="fixed inset-0 z-10" @click="menuOpen = false" />

        <div
          v-if="menuOpen"
          class="absolute right-0 z-20 mt-2 w-56 rounded-2xl bg-white p-2 text-night shadow-xl"
        >
          <p class="truncate px-3 py-2 text-sm text-gray-500">{{ auth.email }}</p>
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

    <!-- Route en pointillés en bas de la barre -->
    <div class="absolute inset-x-6 bottom-1.5 border-b-2 border-dashed border-sun/40" />
  </nav>
</template>
