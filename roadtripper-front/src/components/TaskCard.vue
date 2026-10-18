<!-- TaskCard : une carte de tâche (titre, catégorie, changement de statut, suppression). -->
<script setup>
import { computed } from 'vue'
import { useTripsStore } from '@/stores/trips'

const props = defineProps({
  task: { type: Object, required: true },
})

const store = useTripsStore()

// Catégorie de la tâche (Admin, Gear, Bookings...)
const category = computed(() =>
  store.categories.find((c) => c.id_category === props.task.id_category),
)
</script>

<template>
  <div
    class="mb-3 rounded-2xl border-l-8 bg-white p-3 shadow transition hover:shadow-lg"
    :style="{ borderColor: category?.color }"
  >
    <p class="font-bold">{{ task.title }}</p>

    <span
      v-if="category"
      class="mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold text-white"
      :style="{ backgroundColor: category.color }"
    >
      {{ category.name }}
    </span>

    <select
      :value="task.status"
      @change="store.setStatus(task.id_todo, $event.target.value)"
      class="mt-3 block w-full rounded-full border-2 border-gray-200 px-3 py-1 text-sm"
    >
      <option>To Do</option>
      <option>Doing</option>
      <option>Done</option>
    </select>

    <button
      @click="store.deleteTask(task.id_todo)"
      class="mt-2 text-xs text-red-500 hover:text-red-700"
    >
      Supprimer
    </button>
  </div>
</template>
