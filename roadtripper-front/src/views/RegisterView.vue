<script setup>
import { ref, computed } from "vue";
import { useRouter, RouterLink } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const confirm = ref("");
const submitted = ref(false);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const emailError = computed(() => {
  if (!email.value.trim()) return "L'adresse email est obligatoire.";
  if (!EMAIL_REGEX.test(email.value.trim()))
    return "Entre une adresse email valide (ex. nom@exemple.com).";
  return "";
});

const passwordError = computed(() => {
  if (!password.value) return "Le mot de passe est obligatoire.";
  if (password.value.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
  return "";
});

const confirmError = computed(() => {
  if (!confirm.value) return "Confirme ton mot de passe.";
  if (confirm.value !== password.value) return "Les mots de passe ne correspondent pas.";
  return "";
});

function submit() {
  submitted.value = true;
  if (emailError.value || passwordError.value || confirmError.value) return;

  // TEMPORAIRE : le vrai enregistrement (API + MySQL + hash) viendra au Milestone 3
  router.push("/login");
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="submit" novalidate class="bg-white p-8 rounded-lg shadow w-96">
      <h1 class="text-2xl font-bold text-blue-600 mb-6">Créer un compte 🚗</h1>

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
        autocomplete="new-password"
        placeholder="8 caractères minimum"
        class="w-full border rounded p-2"
        :class="submitted && passwordError ? 'border-red-500' : 'border-gray-300'"
      />
      <p v-if="submitted && passwordError" class="text-sm text-red-500 mt-1">
        {{ passwordError }}
      </p>

      <label class="block text-sm font-medium text-gray-700 mt-4 mb-1" for="confirm">
        Confirmer le mot de passe
      </label>
      <input
        id="confirm"
        v-model="confirm"
        type="password"
        autocomplete="new-password"
        class="w-full border rounded p-2"
        :class="submitted && confirmError ? 'border-red-500' : 'border-gray-300'"
      />
      <p v-if="submitted && confirmError" class="text-sm text-red-500 mt-1">
        {{ confirmError }}
      </p>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white rounded p-2 mt-6 hover:bg-blue-700"
      >
        Créer mon compte
      </button>

      <p class="text-sm text-gray-500 mt-4 text-center">
        Déjà un compte ?
        <RouterLink to="/login" class="text-blue-600 hover:underline">Se connecter</RouterLink>
      </p>
    </form>
  </div>
</template>
