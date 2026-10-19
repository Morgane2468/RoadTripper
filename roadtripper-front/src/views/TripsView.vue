<!-- TripsView: "My trips" page with key numbers, the trip list and the trip templates. -->
<script setup>
import { ref } from 'vue'
import { useTripsStore } from '@/stores/trips'
import PageHeader from '@/components/PageHeader.vue'
import StatsStrip from '@/components/StatsStrip.vue'
import TemplatesSection from '@/components/TemplatesSection.vue'
import TripModal from '@/components/TripModal.vue'
import TripRow from '@/components/TripRow.vue'

const store = useTripsStore()
const showModal = ref(false)

function removeTrip(trip) {
  if (confirm(`Delete "${trip.name}" and all its tasks?`)) {
    store.deleteTrip(trip.id_trip)
  }
}
</script>

<template>
  <!-- Page header -->
  <PageHeader title="My trips" subtitle="Organise your trip, without stress!" class="mx:auto flex items-center justify-between px-14">
    <button
      @click="showModal = true"
      class= "rounded-full text-white px-7 py-3 font-bold hover:bg-coral-dark -translate-y-3"
    >
      + New trip
    </button>
  </PageHeader>

  <div class="mx-auto max-w-7xl space-y-10 px-8 py-8">
    <StatsStrip />

    <section>
      <h2 class="mb-4 text-2xl">Your trips</h2>

      <div class="space-y-5">
        <TripRow v-for="trip in store.trips" :key="trip.id_trip" :trip="trip" @delete="removeTrip(trip)" />

        <!-- Dashed card to create a new trip -->
        <button
          @click="showModal = true"
          class="flex w-full flex-col items-center rounded-3xl border-2 border-dashed border-coral/40 py-10 text-coral hover:bg-coral/5"
        >
          <span class="font-display text-xl">+ Create a new trip</span>
          <span class="mt-1 text-sm text-gray-500">Choose a trip type to get a ready-made checklist</span>
        </button>
      </div>
    </section>

    <TemplatesSection />
  </div>

  <TripModal v-if="showModal" @close="showModal = false" />
</template>
