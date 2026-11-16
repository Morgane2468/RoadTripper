<!-- NavBar : barre de navigation en haut de l'écran, avec le menu du compte et la déconnexion. -->
<script setup>
import { ref, computed, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import http from "@/services/api";
import { useAuthStore } from "@/stores/auth";
import GearUpLogo from "@/components/GearUpLogo.vue";

const router = useRouter();
const auth = useAuthStore();

const menuOpen = ref(false);

const pages = [
  { label: "Calendar", to: "/calendar" },
  { label: "Budget" , to: "/budget" },
];

// Première lettre affichée dans le rond du profil
const initial = computed(() => (auth.email ? auth.email[0].toUpperCase() : "?"));

watch(() => auth.user?.id_user, async (userId, _previousId, onCleanup) => {
  if (!userId || auth.avatar !== undefined) return
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  try {
    const { data } = await http.get('/user/profile', { signal: controller.signal })
    if (!controller.signal.aborted && auth.user?.id_user === userId && auth.avatar === undefined) {
      auth.avatar = data.avatar
    }
  } catch {
    // Affiche l'initiale si la photo ne peut pas être chargée.
  }
}, { immediate: true })

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
    <div class="mx:auto flex items-center justify-between px-6 py-3">
      <RouterLink to="/trips" class="text-5xl text-white"><GearUpLogo /></RouterLink>

      <!-- Liens -->
      <div class="hidden items-center text-xl gap-3 md:flex translate-x-90">
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
          type="button"
          aria-label="Account menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
          class="flex h-11 w-11 items-center justify-center rounded-full bg-white font-bold text-night ring-2 ring-white/20 transition-transform hover:scale-105"
        >
          <img v-if="auth.avatar" :src="auth.avatar" alt="" class="h-full w-full rounded-full object-cover" />
          <span v-else>{{ initial }}</span>
        </button>

        <!-- Zone invisible pour fermer les menus ouverts -->
        <div v-if="menuOpen" class="fixed inset-0 z-10" @click="menuOpen = false" />

        <div
          v-if="menuOpen"
          class="absolute right-0 z-20 mt-2 w-56 rounded-2xl bg-white p-2 text-night shadow-xl"
        >
          <p class="truncate px-3 py-2 text-sm text-gray-500">{{ auth.email }}</p>
          <hr class="my-1 border-gray-100" />
          <RouterLink to="/profile" class="block rounded-xl px-3 py-2 hover:bg-cream" @click="menuOpen = false">
            My profile
          </RouterLink>
          <RouterLink to="/settings" class="block rounded-xl px-3 py-2 hover:bg-cream" @click="menuOpen = false">
            Settings
          </RouterLink>
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
