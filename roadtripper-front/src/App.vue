<!-- App : composant principal. -->
<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/NavBar.vue'

const auth = useAuthStore()
</script>

<template>
  <NavBar v-if="auth.token" />
  <RouterView />
</template>
