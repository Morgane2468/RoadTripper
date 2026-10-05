<script setup>
import { ref } from 'vue'
import { useTripsStore } from '@/stores/trips'

const props = defineProps({
  tripId: { type: [String, Number], required: true },
})
const emit = defineEmits(['close'])

const store = useTripsStore()
const title = ref('')
const category = ref('')

function save() {
  if (!title.value.trim()) return
  store.addTask(props.tripId, title.value, category.value)
  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-10"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <h2 class="text-xl font-bold mb-4">Nouvelle tâche</h2>

      <input
        v-model="title"
        @keyup.enter="save"
        type="text"
        placeholder="Ex. Vérifier passeport"
        class="w-full border rounded p-2 mb-3"
      />

      <select v-model="category" class="w-full border rounded p-2 mb-4">
        <option value="">Sans catégorie</option>
        <option v-for="c in store.categories" :key="c.id_category" :value="c.id_category">
          {{ c.name }}
        </option>
      </select>

      <div class="flex justify-end gap-2">
        <button @click="emit('close')" class="px-4 py-2 rounded border">Annuler</button>
        <button @click="save" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
          Ajouter
        </button>
      </div>
    </div>
  </div>
</template>
