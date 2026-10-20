<!-- one wide row of the trip list (illustration, details, tasks per status, progress) -->
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import TripScene from '@/components/TripScene.vue'

const props = defineProps({
  trip: { type: Object, required: true },
})
const emit = defineEmits(['delete'])

const store = useTripsStore()

// Number of tasks per status, with the color of the dot
const statuses = computed(() => {
  const tasks = store.tasksByTrip(props.trip.id_trip)
  return [
    { label: 'To Do', dot: 'bg-sun', count: tasks.filter((t) => t.status === 'To Do').length },
    { label: 'Doing', dot: 'bg-lagoon', count: tasks.filter((t) => t.status === 'Doing').length },
    { label: 'Done', dot: 'bg-leaf', count: tasks.filter((t) => t.status === 'Done').length },
  ]
})
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-3xl bg-white shadow transition hover:shadow-lg md:flex-row">
    <!-- illustration IA qui depend du type de voyage -->
    <RouterLink :to="`/trips/${trip.id_trip}`" class="relative block min-h-36 md:w-64">
      <TripScene :type="trip.trip_type" class="absolute inset-0 h-full w-full" />
    </RouterLink>

    <!-- Trip details -->
    <div class="flex-1 p-6">
      <RouterLink :to="`/trips/${trip.id_trip}`" class="font-display text-2xl hover:text-coral">
        {{ trip.name }}
      </RouterLink>

      <!-- These details only exist if they were filled in the form -->
      <p v-if="trip.destination" class="mt-1 text-gray-500">{{ trip.destination }}</p>
      <p v-if="trip.start_date" class="text-sm text-gray-500">
        {{ trip.start_date }} to {{ trip.end_date || '?' }}
      </p>

      <div class="mt-3 flex flex-wrap gap-2 text-xs font-bold">
        <span v-if="trip.trip_type" class="rounded-full bg-coral/15 px-3 py-1 text-coral-dark">
          {{ trip.trip_type }}
        </span>
        <span v-if="trip.transport" class="rounded-full bg-sun/30 px-3 py-1">{{ trip.transport }}</span>
        <span v-if="trip.travelers" class="rounded-full bg-lagoon/20 px-3 py-1">
          {{ trip.travelers }} traveler(s)
        </span>
        <span v-if="trip.budget" class="rounded-full bg-leaf/30 px-3 py-1">${{ trip.budget }}</span>
      </div>

      <!-- Number of tasks in each Kanban column -->
      <div class="mt-5 flex gap-6 border-t border-gray-100 pt-4 text-sm">
        <div v-for="status in statuses" :key="status.label" class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-full" :class="status.dot" />
          <span class="font-bold">{{ status.count }}</span>
          <span class="text-gray-500">{{ status.label }}</span>
        </div>
      </div>
    </div>

    <!-- Progress and actions -->
    <div class="flex flex-col justify-between gap-4 border-t border-gray-100 p-6 md:w-72 md:border-t-0 md:border-l">
      <div>
        <p class="font-display text-4xl text-coral">{{ store.progress(trip.id_trip) }}%</p>
        <p class="mb-2 text-sm text-gray-500">done</p>
        <div class="h-2.5 overflow-hidden rounded-full bg-gray-200">
          <div class="h-2.5 rounded-full bg-coral transition-all" :style="{ width: store.progress(trip.id_trip) + '%' }" />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <RouterLink
          :to="`/trips/${trip.id_trip}`"
          class="rounded-full bg-coral px-5 py-2 font-bold text-white hover:bg-coral-dark"
        >
          Open board
        </RouterLink>
        <button @click="emit('delete')" class="text-sm text-red-500 hover:text-red-700">Delete</button>
      </div>
    </div>
  </div>
</template>
