<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useTripsStore } from '@/stores/trips'

const store = useTripsStore()
const newName = ref('')

function add() {
  store.addTrip(newName.value)
  newName.value = ''
}

function remove(trip) {
  if (confirm(`Supprimer « ${trip.name} » et toutes ses tâches ?`)) {
    store.deleteTrip(trip.id_trip)
  }
}
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Mes road trips 🚗</h1>

    <div class="flex gap-2 mb-6">
      <input
        v-model="newName"
        @keyup.enter="add"
        type="text"
        placeholder="Nom du voyage (ex. Gaspésie 2026)"
        class="flex-1 border rounded p-2"
      />
      <button
        @click="add"
        class="bg-blue-600 text-white rounded px-4 hover:bg-blue-700"
      >
        + Nouveau voyage
      </button>
    </div>

    <div
      v-for="trip in store.trips"
      :key="trip.id_trip"
      class="flex items-center bg-white rounded-lg shadow p-4 mb-3 hover:shadow-md"
    >
      <RouterLink :to="`/trips/${trip.id_trip}`" class="flex-1">
        <p class="font-medium text-gray-800">{{ trip.name }}</p>
        <p class="text-sm text-gray-500">{{ store.progress(trip.id_trip) }} % prêt</p>
      </RouterLink>
      <button @click="remove(trip)" class="text-sm text-red-500 hover:text-red-700">
        Supprimer
      </button>
    </div>

    <p v-if="store.trips.length === 0" class="text-gray-400">
      Aucun voyage pour l'instant. Crée le premier !
    </p>
  </div>
</template>
