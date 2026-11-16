<script setup>
import { onMounted, ref, watch } from 'vue'
import http from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const names = [
  { key: 'first_name', label: 'First name', autocomplete: 'given-name' },
  { key: 'last_name', label: 'Last name', autocomplete: 'family-name' },
  { key: 'nickname', label: 'Nickname', autocomplete: 'nickname' },
]
const profile = ref(null)
const photo = ref(null)
const photoPreview = ref('')
const photoInput = ref(null)
const removePhoto = ref(false)
const busy = ref(false)
const message = ref('')
const error = ref('')

watch(photo, (file, _previousFile, onCleanup) => {
  photoPreview.value = file ? URL.createObjectURL(file) : ''
  if (file) {
    const previewUrl = photoPreview.value
    onCleanup(() => URL.revokeObjectURL(previewUrl))
  }
})

onMounted(async () => {
  try {
    const { data } = await http.get('/user/profile')
    profile.value = data
  } catch (cause) {
    error.value = cause.response?.data?.message || 'Unable to load your profile.'
  }
})

function selectPhoto(event) {
  const file = event.target.files[0]
  if (!file) {
    photo.value = null
    return
  }
  message.value = ''
  error.value = ''
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 512 * 1024) {
    event.target.value = ''
    photo.value = null
    error.value = 'Choose a JPG, PNG, or WebP image up to 512 KB.'
    return
  }
  photo.value = file
  removePhoto.value = false
}

function readPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function clearSelectedPhoto() {
  photo.value = null
  photoInput.value.value = ''
}

function markPhotoForRemoval() {
  clearSelectedPhoto()
  removePhoto.value = true
}

async function save() {
  if (busy.value) return
  busy.value = true
  error.value = ''
  message.value = ''
  const userId = auth.user?.id_user
  try {
    const fields = Object.fromEntries(names.map(({ key }) => [key, profile.value[key] || '']))
    if (photo.value) fields.avatar = await readPhoto(photo.value)
    else if (removePhoto.value) fields.avatar = null
    const { data } = await http.put('/user/profile', fields)
    if (auth.user?.id_user === userId) auth.avatar = data.avatar
    profile.value = data
    clearSelectedPhoto()
    removePhoto.value = false
    message.value = 'Profile saved.'
  } catch (cause) {
    error.value = cause.response?.data?.message || 'Unable to save your profile.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="mx-auto my-8 max-w-xl space-y-4 rounded-2xl bg-white p-6 shadow">
    <dl>
      <dt class="font-bold">Email address</dt>
      <dd class="mt-1 break-all">{{ auth.email }}</dd>
    </dl>
    <form v-if="profile" @submit.prevent="save">
      <fieldset :disabled="busy" class="space-y-4">
        <label v-for="field in names" :key="field.key" class="block">
          {{ field.label }}
          <input v-model="profile[field.key]" :autocomplete="field.autocomplete" maxlength="80" class="mt-1 block w-full rounded-xl border border-gray-300 p-2" />
        </label>
        <div class="space-y-3 text-center">
          <p>Profile photo</p>
          <img v-if="!removePhoto && (photoPreview || profile.avatar)" :src="photoPreview || profile.avatar" alt="Profile photo" class="mx-auto h-20 w-20 rounded-full object-cover" />
          <input
            ref="photoInput"
            hidden
            type="file"
            accept="image/jpeg,image/png,image/webp"
            @change="selectPhoto"
          />
          <div class="flex flex-wrap items-center justify-center gap-3">
            <button type="button" class="rounded-full bg-coral px-4 py-2 font-bold text-white enabled:hover:bg-coral-dark" @click="photoInput.click()">
              Choose file
            </button>
            <button v-if="profile.avatar && !removePhoto" type="button" class="rounded-full px-4 py-2 text-red-700 hover:bg-red-50" @click="markPhotoForRemoval">
              Remove photo
            </button>
            <button type="submit" class="rounded-full bg-coral px-5 py-2 font-bold text-white enabled:hover:bg-coral-dark disabled:opacity-50">
              Save profile
            </button>
          </div>
          <p v-if="photo" class="break-all text-sm" role="status">{{ photo.name }}</p>
          <p class="text-sm text-gray-600">JPG, PNG, or WebP up to 512 KB.</p>
        </div>
        <p v-if="message" role="status" class="text-green-700">{{ message }}</p>
      </fieldset>
    </form>
    <p v-if="error" role="alert" class="text-red-700">{{ error }}</p>
  </section>
</template>
