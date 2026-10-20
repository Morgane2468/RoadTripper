<!-- 4 cartes de chiffres clés, calculés à partir des voyages et des tâches -->
<script setup>
import { computed } from 'vue'
import { useTripsStore } from '@/stores/trips'

const store = useTripsStore()

const stats = computed(() => {
  const total = store.tasks.length
  const done = store.tasks.filter((task) => task.status === 'Done').length
  const percent = total ? Math.round((done / total) * 100) : 0

  return [
    { label: 'Trips', value: store.trips.length, color: 'bg-coral' },
    { label: 'Tasks done', value: done, color: 'bg-leaf' },
    { label: 'Tasks left', value: total - done, color: 'bg-sun' },
    { label: 'Overall readiness', value: percent + '%', color: 'bg-lagoon' },
  ]
})
</script>

<template>
  <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
    <div v-for="stat in stats" :key="stat.label" class="rounded-3xl bg-white p-5 shadow">
      <span class="mb-3 block h-1.5 w-10 rounded-full" :class="stat.color" />
      <p class="font-display text-4xl">{{ stat.value }}</p>
      <p class="text-sm text-gray-500">{{ stat.label }}</p>
    </div>
  </div>
</template>
