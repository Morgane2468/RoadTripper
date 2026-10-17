<!-- RegisterView : page d'inscription (validation du formulaire, enregistrement simulé). -->
<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import AuthLayout from '@/components/AuthLayout.vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const confirm = ref('')
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

const confirmError = computed(() => {
  if (!confirm.value) return 'Confirme ton mot de passe.'
  if (confirm.value !== password.value) return 'Les mots de passe ne correspondent pas.'
  return ''
})

function submit() {
  submitted.value = true
  if (emailError.value || passwordError.value || confirmError.value) return

  // TEMPORAIRE : le vrai enregistrement (API + MySQL + mot de passe hashé) viendra au Milestone 3
  router.push('/login')
}
</script>

<template>
  <AuthLayout title="Rejoins l'aventure !" subtitle="Crée ton compte en 30 secondes.">
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
        autocomplete="new-password"
        placeholder="8 caractères minimum"
        class="w-full rounded-2xl border-2 p-2 focus:border-coral focus:outline-none"
        :class="submitted && passwordError ? 'border-red-500' : 'border-gray-200'"
      />
      <p v-if="submitted && passwordError" class="mt-1 text-sm text-red-500">{{ passwordError }}</p>

      <label class="mt-4 mb-1 block text-sm font-bold" for="confirm">Confirmer le mot de passe</label>
      <input
        id="confirm"
        v-model="confirm"
        type="password"
        autocomplete="new-password"
        class="w-full rounded-2xl border-2 p-2 focus:border-coral focus:outline-none"
        :class="submitted && confirmError ? 'border-red-500' : 'border-gray-200'"
      />
      <p v-if="submitted && confirmError" class="mt-1 text-sm text-red-500">{{ confirmError }}</p>

      <button
        type="submit"
        class="mt-6 w-full rounded-full bg-coral p-3 font-bold text-white hover:bg-coral-dark"
      >
        Créer mon compte
      </button>

      <p class="mt-4 text-center text-sm text-gray-500">
        Déjà un compte ?
        <RouterLink to="/login" class="font-bold text-coral hover:underline">Se connecter</RouterLink>
      </p>
    </form>
  </AuthLayout>
</template>
