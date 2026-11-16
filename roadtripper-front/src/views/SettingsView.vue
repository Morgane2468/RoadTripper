<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const currentPassword = ref('')
const newPassword = ref('')
const confirmation = ref('')
const deletionPassword = ref('')
const confirmingDeletion = ref(false)
const busy = ref(false)
const passwordMessage = ref('')
const passwordError = ref('')
const deletionError = ref('')

async function changePassword() {
  if (busy.value) return
  passwordMessage.value = ''
  passwordError.value = ''
  if (!currentPassword.value) {
    passwordError.value = 'Enter your current password.'
    return
  }
  if (newPassword.value.length < 8) {
    passwordError.value = 'The new password must contain at least 8 characters.'
    return
  }
  if (newPassword.value !== confirmation.value) {
    passwordError.value = 'The new passwords do not match.'
    return
  }

  busy.value = true
  try {
    await auth.changePassword(currentPassword.value, newPassword.value)
    currentPassword.value = ''
    newPassword.value = ''
    confirmation.value = ''
    passwordMessage.value = 'Password updated.'
  } catch (error) {
    passwordError.value = error.response?.data?.message || 'Unable to update your password.'
  } finally {
    busy.value = false
  }
}

function cancelDeletion() {
  confirmingDeletion.value = false
  deletionPassword.value = ''
  deletionError.value = ''
}

async function deleteAccount() {
  if (busy.value || !confirmingDeletion.value) return
  deletionError.value = ''
  busy.value = true
  try {
    await auth.deleteAccount(deletionPassword.value)
    await router.replace('/login')
  } catch (error) {
    deletionError.value = error.response?.data?.message || 'Unable to delete your account.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-xl space-y-6 px-4 py-8">
    <section class="rounded-2xl bg-white p-6 shadow">
      <h2 class="mb-4 text-xl font-bold">Change password</h2>
      <form class="space-y-4" novalidate @submit.prevent="changePassword">
        <label class="block">
          Current password
          <input v-model="currentPassword" type="password" autocomplete="current-password" required class="mt-1 block w-full rounded-xl border border-gray-300 p-2" />
        </label>
        <label class="block">
          New password
          <input v-model="newPassword" type="password" autocomplete="new-password" required minlength="8" class="mt-1 block w-full rounded-xl border border-gray-300 p-2" />
        </label>
        <label class="block">
          Confirm new password
          <input v-model="confirmation" type="password" autocomplete="new-password" required class="mt-1 block w-full rounded-xl border border-gray-300 p-2" />
        </label>
        <p v-if="passwordError" role="alert" class="text-red-700">{{ passwordError }}</p>
        <p v-if="passwordMessage" role="status" class="text-green-700">{{ passwordMessage }}</p>
        <button type="submit" :disabled="busy" class="rounded-full bg-coral px-5 py-2 font-bold text-white enabled:hover:bg-coral-dark disabled:opacity-50">
          Save password
        </button>
      </form>
    </section>

    <section class="rounded-2xl bg-white p-6 shadow">
      <h2 class="mb-4 text-xl font-bold">Delete account</h2>
      <button v-if="!confirmingDeletion" type="button" :disabled="busy" class="rounded-full px-5 py-2 font-bold text-red-500 enabled:hover:bg-red-50" @click="confirmingDeletion = true">
        Delete account
      </button>
      <form v-else class="space-y-4" @submit.prevent="deleteAccount">
        <p>This permanently deletes your account, your trips, and their tasks.</p>
        <label class="block">
          Current password
          <input v-model="deletionPassword" type="password" autocomplete="current-password" required class="mt-1 block w-full rounded-xl border border-gray-300 p-2" />
        </label>
        <p v-if="deletionError" role="alert" class="text-red-700">{{ deletionError }}</p>
        <div class="flex flex-wrap gap-4">
          <button type="submit" :disabled="busy" class="rounded-full bg-red-700 px-5 py-2 font-bold text-white enabled:hover:bg-red-800 disabled:opacity-50">
            Permanently delete account
          </button>
          <button type="button" :disabled="busy" class="rounded-full px-4 py-2 font-bold enabled:hover:bg-cream" @click="cancelDeletion">Cancel</button>
        </div>
      </form>
    </section>
  </div>
</template>
