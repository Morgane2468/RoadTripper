<!-- App: main component. Shows the navigation bar, the current page and the footer (when logged in). -->
<script setup>
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useTripsStore } from '@/stores/trips';
import BackgroundShapes from "@/components/BackgroundShapes.vue";
import NavBar from "@/components/NavBar.vue";
import SiteFooter from "@/components/SiteFooter.vue";

const auth = useAuthStore();
const trips = useTripsStore();
</script>

<template>

  <div class="relative min-h-screen ">
    <BackgroundShapes />
    <NavBar v-if="auth.user" />
    <div class="flex-1">
      <p v-if="trips.error" role="alert" class="p-4 text-center text-red-700">{{ trips.error }}</p>
      <RouterView />
    </div>
    <SiteFooter v-if="auth.user" />
  </div>
</template>
