<!-- formulaire de création OU de modification d'un voyage (si la prop `trip` est fournie, on est en mode édition) -->
<script setup>
import { ref, computed, watch } from 'vue'
import { useTripsStore } from '@/stores/trips'
import { TRIP_TEMPLATES } from '@/data/tripTemplates'
const props = defineProps({
  trip: { type: Object, default: null },
})
const emit = defineEmits(['close'])
const store = useTripsStore()

// En mode édition, on pré-remplit le formulaire avec les valeurs actuelles du voyage
const isEdit = computed(() => !!props.trip)
const initial = props.trip || {}

const currencies = ['CAD', 'USD', 'EUR', 'GBP', 'CHF', 'JPY']
const currency = ref(initial.currency ?? 'CAD')
const name = ref(initial.name ?? '')
const destination = ref(initial.destination ?? '')
const tripType = ref(initial.trip_type ?? '')
const startDate = ref(initial.start_date ?? '')
const endDate = ref(initial.end_date ?? '')
const travelers = ref(initial.travelers ?? 1)
const budget = ref(initial.budget ?? '')
const transport = ref(initial.transport ?? 'Car')
const visibility = ref(initial.visibility ?? 'Private')
const description = ref(initial.description ?? '')
const submitted = ref(false)

// types de voyage proposés
const tripTypes = Object.keys(TRIP_TEMPLATES)

// tâches suggérées pour le type choisi
const suggestions = computed(() => TRIP_TEMPLATES[tripType.value] || [])

// titres des tâches cochées
const chosen = ref([])
watch(tripType, () => {
  chosen.value = suggestions.value.map((task) => task.title)
})

const nameError = computed(() => (name.value.trim() ? '' : 'The travel name is required.'))

const dateError = computed(() => {
  if (startDate.value && endDate.value && endDate.value < startDate.value) {
    return 'The return date must be after the depart date.'
  }
  return ''
})

const travelersError = computed(() => {
  const n = Number(travelers.value)
  return Number.isInteger(n) && n >= 1 ? '' : 'At least 1 traveler is required.'
})

const saving = ref(false)

async function save() {
  if (saving.value) return
  submitted.value = true
  if (nameError.value || dateError.value || travelersError.value) return

  const data = {
    name: name.value,
    trip_type: tripType.value,
    destination: destination.value,
    start_date: startDate.value,
    end_date: endDate.value,
    travelers: Number(travelers.value),
    transport: transport.value,
    visibility: visibility.value,
    description: description.value,
    budget: budget.value,
    currency: currency.value,
  }

  saving.value = true
  if (isEdit.value) {
    await store.updateTrip(props.trip.id_trip, data)
  } else {
    // garde seulement les tâches suggérées qui sont restées cochées
    const tasks = suggestions.value.filter((task) => chosen.value.includes(task.title))
    await store.addTrip(data, tasks)
  }
  saving.value = false
  if (!store.error) emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-30 overflow-y-auto bg-black/40 p-4" @click.self="emit('close')">
    <form
      @submit.prevent="save"
      novalidate
      class="mx-auto my-8 w-full max-w-lg rounded-3xl bg-white p-6 shadow-lg"
    >
      <h2 class="mb-4 text-2xl">{{ isEdit ? 'Edit trip' : 'New Trip' }}</h2>

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-bold" for="trip-name">Travel name</label>
          <input
            id="trip-name"
            v-model="name"
            type="text"
            placeholder="Ex. Canada 2026"
            class="w-full rounded-2xl border-2 p-2 focus:border-coral focus:outline-none"
            :class="submitted && nameError ? 'border-red-500' : 'border-gray-200'"
          />
          <p v-if="submitted && nameError" class="mt-1 text-sm text-red-500">{{ nameError }}</p>
        </div>

        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-bold" for="trip-dest">Destination</label>
          <input
            id="trip-dest"
            v-model="destination"
            type="text"
            placeholder="Ex. Montreal, Toronto, Vancouver..."
            class="w-full rounded-2xl border-2 border-gray-200 p-2 focus:border-coral focus:outline-none"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-bold" for="trip-type">Trip type</label>
          <select id="trip-type" v-model="tripType" class="w-full rounded-2xl border-2 border-gray-200 p-2">
            <option value="">None</option>
            <option v-for="type in tripTypes" :key="type">{{ type }}</option>
          </select>
        </div>

        <div v-if="!isEdit && suggestions.length" class="rounded-2xl bg-sun/20 p-4 sm:col-span-2">
          <p class="text-sm font-bold">Suggested tasks for « {{ tripType }} »</p>
          <p class="mb-3 text-xs text-gray-500">
            Uncheck useless tasks, you can always add more later.
          </p>
          <label v-for="task in suggestions" :key="task.title" class="flex items-center gap-2 py-1 text-sm">
            <input type="checkbox" v-model="chosen" :value="task.title" class="h-4 w-4 accent-coral" />
            {{ task.title }}
          </label>
        </div>

        <div>
          <label class="mb-1 block text-sm font-bold" for="trip-start">Depart date</label>
          <input
            id="trip-start"
            v-model="startDate"
            type="date"
            class="w-full rounded-2xl border-2 border-gray-200 p-2 focus:border-coral focus:outline-none"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-bold" for="trip-end">Return date</label>
          <input
            id="trip-end"
            v-model="endDate"
            type="date"
            class="w-full rounded-2xl border-2 p-2 focus:border-coral focus:outline-none"
            :class="submitted && dateError ? 'border-red-500' : 'border-gray-200'"
          />
        </div>
        <p v-if="submitted && dateError" class="text-sm text-red-500 sm:col-span-2">{{ dateError }}</p>

        <div>
          <label class="mb-1 block text-sm font-bold" for="trip-travelers">Travelers</label>
          <input
            id="trip-travelers"
            v-model="travelers"
            type="number"
            min="1"
            class="w-full rounded-2xl border-2 p-2 focus:border-coral focus:outline-none"
            :class="submitted && travelersError ? 'border-red-500' : 'border-gray-200'"
          />
          <p v-if="submitted && travelersError" class="mt-1 text-sm text-red-500">{{ travelersError }}</p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-bold" for="trip-budget">Budget</label>
          <div class="flex gap-2">
            <input
              id="trip-budget"
              v-model="budget"
              type="number"
              min="0"
              placeholder="Ex. 1500"
              class="w-full rounded-2xl border-2 border-gray-200 p-2 focus:border-coral focus:outline-none"
            />
            <select
              v-model="currency"
              aria-label="Currency"
              class="rounded-2xl border-2 border-gray-200 p-2"
            >
              <option v-for="c in currencies" :key="c">{{ c }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="mb-1 block text-sm font-bold" for="trip-transport">Transport</label>
          <select id="trip-transport" v-model="transport" class="w-full rounded-2xl border-2 border-gray-200 p-2">
            <option>Car</option>
            <option>Camping-car</option>
            <option>Motorcycle</option>
            <option>Bike</option>
            <option>Public transportation</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-sm font-bold" for="trip-visibility">Visibility</label>
          <select id="trip-visibility" v-model="visibility" class="w-full rounded-2xl border-2 border-gray-200 p-2">
            <option>Private</option>
            <option>Shared with friends</option>
            <option>Public</option>
          </select>
        </div>

        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-bold" for="trip-desc">Description</label>
          <textarea
            id="trip-desc"
            v-model="description"
            rows="3"
            placeholder="Ideas, steps, notes..."
            class="w-full rounded-2xl border-2 border-gray-200 p-2 focus:border-coral focus:outline-none"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button
          type="button"
          @click="emit('close')"
          class="rounded-full border-2 border-gray-200 px-4 py-2 font-bold"
        >
          Cancel
        </button>
        <button type="submit" class="rounded-full bg-coral px-5 py-2 font-bold text-white hover:bg-coral-dark">
          {{ isEdit ? 'Save changes' : 'Create Trip' }}
        </button>
      </div>
    </form>
  </div>
</template>
