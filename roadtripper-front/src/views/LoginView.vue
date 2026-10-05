<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

function submit() {
  auth.login()
  router.push('/trips')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow w-80">
      <h1 class="text-2xl font-bold text-blue-600 mb-4">RoadTripper 🚗</h1>
      <button @click="submit" class="w-full bg-blue-600 text-white rounded p-2">
        Se connecter (test)
      </button>
    </div>
  </div>
</template>
