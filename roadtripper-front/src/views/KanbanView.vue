<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import KanbanColumn from '@/components/KanbanColumn.vue'
import ProgressBar from '@/components/ProgressBar.vue'

const route = useRoute()
const store = useTripsStore()

const statuses = ['To Do', 'Doing', 'Done']

const trip = computed(() =>
  store.trips.find((t) => t.id_trip === Number(route.params.id))
)
const tasksOf = (status) =>
  store.tasksByTrip(route.params.id).filter((t) => t.status === status)
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">{{ trip?.name ?? 'Voyage introuvable' }}</h1>

    <ProgressBar :percent="store.progress(route.params.id)" class="mb-6" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KanbanColumn v-for="s in statuses" :key="s" :title="s" :tasks="tasksOf(s)" />
    </div>
  </div>
</template>
