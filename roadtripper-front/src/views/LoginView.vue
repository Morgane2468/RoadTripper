<!-- LoginView : page de connexion -->
<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/AuthLayout.vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const submitted = ref(false)

// Format : texte@texte.extension, sans espace
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const emailError = computed(() => {
  if (!email.value.trim()) return "Email address is required."
  if (!EMAIL_REGEX.test(email.value.trim())) return 'Please enter a valid email address (e.g., name@company.com).'
  return ''
})

const passwordError = computed(() => {
  if (!password.value) return 'Password is required.'
  if (password.value.length < 8) return 'The password must contain at least 8 characters.'
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
  <AuthLayout title="Good to see you again !" subtitle="Connect you to find your trips.">
    <form @submit.prevent="submit" novalidate>
      <label class="mb-1 block text-sm font-bold" for="email">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        autocomplete="email"
        placeholder="name@company.com"
        class="w-full rounded-2xl border-2 p-2 focus:border-coral focus:outline-none"
        :class="submitted && emailError ? 'border-red-500' : 'border-gray-200'"
      />
      <p v-if="submitted && emailError" class="mt-1 text-sm text-red-500">{{ emailError }}</p>

      <label class="mt-4 mb-1 block text-sm font-bold" for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        placeholder="8 characters minimum"
        class="w-full rounded-2xl border-2 p-2 focus:border-coral focus:outline-none"
        :class="submitted && passwordError ? 'border-red-500' : 'border-gray-200'"
      />
      <p v-if="submitted && passwordError" class="mt-1 text-sm text-red-500">{{ passwordError }}</p>

      <button
        type="submit"
        class="mt-6 w-full rounded-full bg-coral p-3 font-bold text-white hover:bg-coral-dark"
      >
        Let's begin !
      </button>

      <p class="mt-4 text-center text-sm text-gray-500">
        Don't have an account yet?
        <RouterLink to="/register" class="font-bold text-coral hover:underline">Create an account</RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>
