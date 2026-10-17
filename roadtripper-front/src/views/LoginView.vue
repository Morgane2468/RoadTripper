<!-- LoginView : page de connexion (validation du formulaire, puis connexion simulée). -->
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
  <AuthLayout title="Content de te revoir !" subtitle="Connecte-toi pour retrouver tes voyages.">
    <form @submit.prevent="submit" novalidate>
      <label class="mb-1 block text-sm font-bold" for="email">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        autocomplete="email"
        placeholder="nom@exemple.com"
        class="w-full rounded-2xl border-2 p-2 focus:border-coral focus:outline-none"
        :class="submitted && emailError ? 'border-red-500' : 'border-gray-200'"
      />
      <p v-if="submitted && emailError" class="mt-1 text-sm text-red-500">{{ emailError }}</p>

      <label class="mt-4 mb-1 block text-sm font-bold" for="password">Mot de passe</label>
      <input
        id="password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        placeholder="8 caractères minimum"
        class="w-full rounded-2xl border-2 p-2 focus:border-coral focus:outline-none"
        :class="submitted && passwordError ? 'border-red-500' : 'border-gray-200'"
      />
      <p v-if="submitted && passwordError" class="mt-1 text-sm text-red-500">{{ passwordError }}</p>

      <button
        type="submit"
        class="mt-6 w-full rounded-full bg-coral p-3 font-bold text-white hover:bg-coral-dark"
      >
        C'est parti !
      </button>

      <p class="mt-4 text-center text-sm text-gray-500">
        Pas encore de compte ?
        <RouterLink to="/register" class="font-bold text-coral hover:underline">Créer un compte</RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>
