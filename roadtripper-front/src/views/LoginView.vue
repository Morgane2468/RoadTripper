<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const submitted = ref(false)

// Format : texte@texte.extension, sans espace
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const emailError = computed(() => {
  if (!email.value.trim()) return "L'adresse email est obligatoire."
  if (!EMAIL_REGEX.test(email.value.trim())) return 'Entre une adresse email valide (ex. nom@exemple.com).'
  return ''
})

const passwordError = computed(() => {
  if (!password.value) return 'Le mot de passe est obligatoire.'
  if (password.value.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.'
  return ''
})

function submit() {
  submitted.value = true
  if (emailError.value || passwordError.value) return

  auth.login(email.value.trim())
  router.push('/trips')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="submit" novalidate class="bg-white p-8 rounded-lg shadow w-96">
      <h1 class="text-2xl font-bold text-blue-600 mb-6">RoadTripper 🚗</h1>

      <label class="block text-sm font-medium text-gray-700 mb-1" for="email">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        autocomplete="email"
        placeholder="nom@exemple.com"
        class="w-full border rounded p-2"
        :class="submitted && emailError ? 'border-red-500' : 'border-gray-300'"
      />
      <p v-if="submitted && emailError" class="text-sm text-red-500 mt-1">{{ emailError }}</p>

      <label class="block text-sm font-medium text-gray-700 mt-4 mb-1" for="password">
        Mot de passe
      </label>
      <input
        id="password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        placeholder="8 caractères minimum"
        class="w-full border rounded p-2"
        :class="submitted && passwordError ? 'border-red-500' : 'border-gray-300'"
      />
      <p v-if="submitted && passwordError" class="text-sm text-red-500 mt-1">
        {{ passwordError }}
      </p>

      <button type="submit" class="w-full bg-blue-600 text-white rounded p-2 mt-6 hover:bg-blue-700">
        Se connecter
      </button>

      <p class="text-sm text-gray-500 mt-4 text-center">
        Pas encore de compte ?
        <RouterLink to="/register" class="text-blue-600 hover:underline">Créer un compte</RouterLink>
      </p>
    </form>
  </div>
</template>
