<script setup>
import { ref, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import KanbanColumn from '@/components/KanbanColumn.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import TaskModal from '@/components/TaskModal.vue'

const route = useRoute()
const store = useTripsStore()
const showModal = ref(false)

const statuses = ['To Do', 'Doing', 'Done']

const trip = computed(() =>
  store.trips.find((t) => t.id_trip === Number(route.params.id))
)
const tasksOf = (status) =>
  store.tasksByTrip(route.params.id).filter((t) => t.status === status)
</script>

<template>
  <div v-if="trip" class="p-6 max-w-5xl mx-auto">
    <RouterLink to="/trips" class="text-sm text-blue-600 hover:underline">
      ← Mes voyages
    </RouterLink>

    <div class="flex items-center justify-between mt-2 mb-4">
      <h1 class="text-2xl font-bold">{{ trip.name }}</h1>
      <button
        @click="showModal = true"
        class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
      >
        + Nouvelle tâche
      </button>
    </div>

    <ProgressBar :percent="store.progress(route.params.id)" class="mb-6" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KanbanColumn v-for="s in statuses" :key="s" :title="s" :tasks="tasksOf(s)" />
    </div>

    <TaskModal v-if="showModal" :trip-id="route.params.id" @close="showModal = false" />
  </div>

  <div v-else class="p-6 max-w-xl mx-auto text-center">
    <h1 class="text-2xl font-bold mb-2">Voyage introuvable</h1>
    <p class="text-gray-500 mb-4">Ce voyage n'existe pas ou a été supprimé.</p>
    <RouterLink to="/trips" class="text-blue-600 hover:underline">Retour à mes voyages</RouterLink>
  </div>
</template>
