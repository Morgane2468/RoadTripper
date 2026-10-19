<!-- App: main component. Shows the navigation bar, the current page and the footer (when logged in). -->
<script setup>
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import BackgroundShapes from "@/components/BackgroundShapes.vue";
import NavBar from "@/components/NavBar.vue";
import SiteFooter from "@/components/SiteFooter.vue";

const auth = useAuthStore();
</script>

<template>
  <!-- flex-1 on the page keeps the footer at the bottom even when the page is short -->
  <div class="flex min-h-screen flex-col">
    <BackgroundShapes />
    <NavBar v-if="auth.token" />
    <div class="flex-1">
      <RouterView />
    </div>
    <SiteFooter v-if="auth.token" />
  </div>
</template>
