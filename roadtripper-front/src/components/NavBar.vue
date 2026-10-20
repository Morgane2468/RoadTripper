<!-- NavBar : barre de navigation en haut de l'écran, avec le menu du compte et la déconnexion. -->
<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const menuOpen = ref(false);

// Pages qui seront ajoutées avec le back-end (pas encore cliquables)
const soonPages = ["Discover", "Calendar", "Budget"];

// Première lettre de l'email, affichée dans le rond du profil
const initial = computed(() => (auth.email ? auth.email[0].toUpperCase() : "?"));

function logout() {
  menuOpen.value = false;
  auth.logout();
  router.push("/login");
}
</script>

<template>
  <nav class="relative bg-night shadow-lg">
    <div class="mx:auto flex items-center justify-between px-6 py-7">
      <RouterLink to="/trips" class="font-brand text-4xl text-white">GearUP</RouterLink>

      <!-- Liens -->
      <div class="hidden items-center text-xl gap-3 md:flex translate-x-100">
        <RouterLink
          to="/trips"
          active-class="bg-white !text-night"
          class="rounded-full px-4 py-1 font-bold text-white transition-colors"
        >
          My Trips
        </RouterLink>
        <span
          v-for="page in soonPages"
          :key="page"
          class="cursor-not-allowed rounded-full px-4 py-1 font-bold text-white/30"
          title="Soon available"
        >
          {{ page }}
        </span>
      </div>

      <!-- Menu du compte -->
      <div class="relative">
        <button
          @click="menuOpen = !menuOpen"
          class="flex h-11 w-11 items-center justify-center rounded-full bg-white font-bold text-night ring-2 ring-white/20 transition-transform hover:scale-105"
        >
          {{ initial }}
        </button>

        <!-- Zone invisible pour fermer les menus ouvert en cliquant à côté -->
        <div v-if="menuOpen" class="fixed inset-0 z-10" @click="menuOpen = false" />

        <div
          v-if="menuOpen"
          class="absolute right-0 z-20 mt-2 w-56 rounded-2xl bg-white p-2 text-night shadow-xl"
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

    <!-- Route en pointillés le long du bord bas -->
    <div class="absolute inset-x-6 bottom-1.5 border-b-2 border-dashed border-sun/40" />
  </nav>
</template>
