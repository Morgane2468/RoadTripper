<script setup>
import { RouterLink } from 'vue-router'
import { useTripsStore } from '@/stores/trips'

const store = useTripsStore()
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Mes road trips 🚗</h1>

    <RouterLink
      v-for="trip in store.trips"
      :key="trip.id_trip"
      :to="`/trips/${trip.id_trip}`"
      class="block bg-white rounded-lg shadow p-4 mb-3 hover:shadow-md"
    >
      <p class="font-medium text-gray-800">{{ trip.name }}</p>
      <p class="text-sm text-gray-500">
        {{ store.progress(trip.id_trip) }} % prêt
      </p>
    </RouterLink>

    <p v-if="store.trips.length === 0" class="text-gray-400">
      Aucun voyage pour l'instant.
    </p>
  </div>
</template>
