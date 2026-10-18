<!-- TripModal : formulaire de création d'un voyage, avec des tâches suggérées selon le type de voyage. -->
<script setup>
import { ref, computed, watch } from 'vue'
import { useTripsStore } from '@/stores/trips'
import { TRIP_TEMPLATES } from '@/data/tripTemplates'

const emit = defineEmits(['close'])
const store = useTripsStore()

// Un ref par champ du formulaire (ils seront enregistrés dans MySQL )
const name = ref('')
const destination = ref('')
const tripType = ref('')
const startDate = ref('')
const endDate = ref('')
const travelers = ref(1)
const budget = ref('')
const transport = ref('Car')
const visibility = ref('Private')
const description = ref('')
const submitted = ref(false)

// Types de voyage proposés : Montagne, Campagne, Plage...
const tripTypes = Object.keys(TRIP_TEMPLATES)

// Tâches suggérées pour le type choisi (liste vide si aucun type)
const suggestions = computed(() => TRIP_TEMPLATES[tripType.value] || [])

// Titres des tâches cochées : quand le type change, on coche tout par défaut
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

function save() {
  submitted.value = true
  if (nameError.value || dateError.value) return

  // On garde seulement les tâches suggérées qui sont restées cochées
  const tasks = suggestions.value.filter((task) => chosen.value.includes(task.title))

  store.addTrip(
    {
      name: name.value,
      trip_type: tripType.value,
      destination: destination.value,
      start_date: startDate.value,
      end_date: endDate.value,
      travelers: travelers.value,
      budget: budget.value,
      transport: transport.value,
      visibility: visibility.value,
      description: description.value,
    },
    tasks,
  )
  emit('close')
}
</script>

<template>
  <!-- Fond sombre : un clic dessus ferme la fenêtre -->
  <div class="fixed inset-0 z-30 overflow-y-auto bg-black/40 p-4" @click.self="emit('close')">
    <form
      @submit.prevent="save"
      novalidate
      class="mx-auto my-8 w-full max-w-lg rounded-3xl bg-white p-6 shadow-lg"
    >
      <h2 class="mb-4 text-2xl">New Trip</h2>

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-bold" for="trip-name">Travel name</label>
          <input
            id="trip-name"
            v-model="name"
            type="text"
            placeholder="Ex. Gaspésie 2026"
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
            placeholder="Ex. Gaspé, Québec"
            class="w-full rounded-2xl border-2 border-gray-200 p-2 focus:border-coral focus:outline-none"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-bold" for="trip-type">Type de voyage</label>
          <select id="trip-type" v-model="tripType" class="w-full rounded-2xl border-2 border-gray-200 p-2">
            <option value="">Aucun</option>
            <option v-for="type in tripTypes" :key="type">{{ type }}</option>
          </select>
        </div>

        <!-- Tâches suggérées : cochées par défaut, l'utilisateur décoche celles qu'il ne veut pas -->
        <div v-if="suggestions.length" class="rounded-2xl bg-sun/20 p-4 sm:col-span-2">
          <p class="text-sm font-bold">Tâches suggérées pour « {{ tripType }} »</p>
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
            class="w-full rounded-2xl border-2 border-gray-200 p-2 focus:border-coral focus:outline-none"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-bold" for="trip-budget">Budget (CAD$)</label>
          <input
            id="trip-budget"
            v-model="budget"
            type="number"
            min="0"
            placeholder="Ex. 1500"
            class="w-full rounded-2xl border-2 border-gray-200 p-2 focus:border-coral focus:outline-none"
          />
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
            placeholder="Idées, étapes, notes..."
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
          Create Trip
        </button>
      </div>
    </form>
  </div>
</template>
