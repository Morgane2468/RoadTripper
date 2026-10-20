// page d'un voyage avec sa progression et son tableau
<script setup>
import { ref, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import KanbanColumn from '@/components/KanbanColumn.vue'
import PageHeader from '@/components/PageHeader.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import TaskModal from '@/components/TaskModal.vue'

const route = useRoute()
const store = useTripsStore()
const showModal = ref(false)

const statuses = ['To Do', 'Doing', 'Done']

const trip = computed(() => store.trips.find((t) => t.id_trip === Number(route.params.id)))

function tasksWithStatus(status) {
  return store.tasksByTrip(route.params.id).filter((task) => task.status === status)
}
</script>

<template>
  <div v-if="trip">
    <PageHeader :title="trip.name" :subtitle="trip.destination || 'Preparation checklist'" class="mx:auto items-center justify-between px-14">
      <button
        @click="showModal = true"
        class= "rounded-full md:text-xl text-white px-8 py-2 font-bold hover:bg-night-light -translate-x-2 -translate-y-3"
      >
        + New task
      </button>
    </PageHeader>

    <div class= " p-6 mx-auto max-w-7xl space-y-10 px-8 py-8">
      <RouterLink to="/trips" class="text-sm font-bold text-coral hover:underline">← My trips</RouterLink>

      <div class="mt-3 mb-6 rounded-3xl bg-white p-4 shadow">
        <ProgressBar :percent="store.progress(route.params.id)" />
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KanbanColumn v-for="status in statuses" :key="status" :title="status" :tasks="tasksWithStatus(status)" />
      </div>
    </div>

    <TaskModal v-if="showModal" :trip-id="route.params.id" @close="showModal = false" />
  </div>

  <!-- Si l'id de l'URL ne correspond à aucun voyage -->
  <div v-else class="mx-auto max-w-xl p-6 py-16 text-center">
    <h1 class="mb-2 text-3xl">Trip not found</h1>
    <p class="mb-4 text-gray-500">This trip does not exist or has been deleted.</p>
    <RouterLink to="/trips" class="font-bold text-coral hover:underline">Return to my trips</RouterLink>
  </div>
</template>
