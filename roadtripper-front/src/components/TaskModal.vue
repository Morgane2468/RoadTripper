<!-- TaskModal : fenêtre pour ajouter une tâche à un voyage. -->
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
  <!-- Fond sombre-->
  <div
    class="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-2xl">New task</h2>

      <input
        v-model="title"
        @keyup.enter="save"
        type="text"
        placeholder="Ex. Check passport"
        class="mb-3 w-full rounded-2xl border-2 border-gray-200 p-2 focus:border-coral focus:outline-none"
      />

      <select v-model="category" class="mb-4 w-full rounded-2xl border-2 border-gray-200 p-2">
        <option value="">Select a category</option>
        <option v-for="c in store.categories" :key="c.id_category" :value="c.id_category">
          {{ c.name }}
        </option>
      </select>

      <div class="flex justify-end gap-2">
        <button @click="emit('close')" class="rounded-full border-2 border-gray-200 px-4 py-2 font-bold">
          Cancel
        </button>
        <button @click="save" class="rounded-full bg-coral px-4 py-2 font-bold text-white hover:bg-coral-dark">
          Add Task
        </button>
      </div>
    </div>
  </div>
</template>
