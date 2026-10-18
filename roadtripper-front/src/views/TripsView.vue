<!-- TripsView : liste des voyages de l'utilisateur, avec création et suppression. -->
<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import PageHeader from '@/components/PageHeader.vue'
import TripModal from '@/components/TripModal.vue'

const store = useTripsStore()
const showModal = ref(false)

function removeTrip(trip) {
  if (confirm(`Delete « ${trip.name} » and all its tasks ?`)) {
    store.deleteTrip(trip.id_trip)
  }
}
</script>

<template>
  <PageHeader title="Mes road trips" subtitle="Organise chaque voyage, étape par étape.">
    <button
      @click="showModal = true"
      class="rounded-full bg-white px-6 py-3 font-bold text-coral shadow hover:bg-cream"
    >
      + New trip
    </button>
  </PageHeader>

  <div class="mx-auto max-w-5xl p-6">
    <div class="grid gap-5 sm:grid-cols-2">
      <div
        v-for="trip in store.trips"
        :key="trip.id_trip"
        class="overflow-hidden rounded-3xl bg-white shadow transition hover:shadow-lg"
      >
        <RouterLink :to="`/trips/${trip.id_trip}`" class="block">
          <!-- Bandeau titre  -->
          <div class="flex h-24 items-center justify-center bg-linear-to-br from-coral to-sun">
            <span class="font-brand text-5xl text-white">{{ trip.name }}</span>
          </div>

          <div class="p-4">
            <p class="font-display text-xl">{{ trip.name }}</p>
            <!-- Ces infos n'existent que si elles ont été remplies dans le formulaire -->
            <p v-if="trip.destination" class="text-sm text-gray-500">{{ trip.destination }}</p>
            <p v-if="trip.start_date" class="text-sm text-gray-500">
              {{ trip.start_date }} au {{ trip.end_date || '?' }}
            </p>

            <div class="mt-3 flex flex-wrap gap-2 text-xs font-bold">
              <span v-if="trip.trip_type" class="rounded-full bg-coral/15 px-3 py-1 text-coral-dark">
                {{ trip.trip_type }}
              </span>
              <span v-if="trip.transport" class="rounded-full bg-sun/30 px-3 py-1">
                {{ trip.transport }}
              </span>
              <span v-if="trip.travelers" class="rounded-full bg-lagoon/20 px-3 py-1">
                {{ trip.travelers }} voyager(s)
              </span>
              <span v-if="trip.budget" class="rounded-full bg-leaf/30 px-3 py-1">{{ trip.budget }} $</span>
            </div>

            <p class="mt-4 mb-1 text-sm text-gray-500">{{ store.progress(trip.id_trip) }} % prêt</p>
            <div class="h-2.5 overflow-hidden rounded-full bg-gray-200">
              <div
                class="h-2.5 rounded-full bg-coral transition-all"
                :style="{ width: store.progress(trip.id_trip) + '%' }"
              />
            </div>
          </div>
        </RouterLink>

        <div class="border-t border-gray-100 px-4 py-2 text-right">
          <button @click="removeTrip(trip)" class="text-sm text-red-500 hover:text-red-700">Delete</button>
        </div>
      </div>
    </div>

    <p v-if="store.trips.length === 0" class="py-10 text-center text-gray-400">
      No trip for now. Create the first one !
    </p>
  </div>

  <TripModal v-if="showModal" @close="showModal = false" />
</template>
