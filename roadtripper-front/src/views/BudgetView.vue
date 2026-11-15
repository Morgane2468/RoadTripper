<!-- BudgetView: "Budget" page to compare the budget of each trip (total, per person, per day...). -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import PageHeader from '@/components/PageHeader.vue'

const store = useTripsStore()

onMounted(() => {
  if (!store.loaded) store.load()
})

// ---- Display options -------------------------------------------------------
const modes = [
  { key: 'total', label: 'Total' },
  { key: 'person', label: 'Per person' },
  { key: 'day', label: 'Per day' },
  { key: 'personDay', label: 'Per person / day' },
]
const mode = ref('total')
const sortBy = ref('date') // 'date' | 'value'
const selectedCurrency = ref('ALL')
const modeLabel = computed(() => modes.find((item) => item.key === mode.value).label)

// ---- Formatting ------------------------------------------------------------
// The currency comes from each trip and can change at any time: an unknown code must not break the page
function money(amount, currency = 'CAD', digits = 0) {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency, maximumFractionDigits: digits }).format(amount)
  } catch {
    return `${Number(amount).toFixed(digits)} ${currency}`
  }
}

// DATEONLY comes as "YYYY-MM-DD": we add the time so the day does not shift with the time zone
const toDate = (date) => new Date(date + 'T00:00:00')
const fmtDate = (date) =>
  date ? toDate(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date'

// ---- Calculations ----------------------------------------------------------
// Number of days of a trip (start and end day included), or null without dates
function tripDays(trip) {
  if (!trip.start_date || !trip.end_date) return null
  const days = Math.round((toDate(trip.end_date) - toDate(trip.start_date)) / 86400000) + 1
  return days > 0 ? days : null
}

// Every trip with its 4 budget views (road_trips: budget is a DECIMAL, so it arrives as text)
const baseRows = computed(() =>
  store.trips.map((trip) => {
    const budget = trip.budget === null || trip.budget === undefined || trip.budget === '' ? null : Number(trip.budget)
    const days = tripDays(trip)
    const people = Math.max(1, Number(trip.travelers) || 1)
    return {
      ...trip,
      currency: (trip.currency || 'CAD').toUpperCase(),
      budget,
      days,
      people,
      metrics: {
        total: budget,
        person: budget === null ? null : budget / people,
        day: budget === null || !days ? null : budget / days,
        personDay: budget === null || !days ? null : budget / people / days,
      },
    }
  })
)

// Currencies used by the trips (the filter only shows when there are several)
const currencies = computed(() => [...new Set(baseRows.value.map((trip) => trip.currency))].sort())
const activeCurrency = computed(() => (currencies.value.includes(selectedCurrency.value) ? selectedCurrency.value : 'ALL'))
const visibleRows = computed(() =>
  activeCurrency.value === 'ALL' ? baseRows.value : baseRows.value.filter((trip) => trip.currency === activeCurrency.value)
)

// One block per currency: without exchange rates we never compare or add different currencies
const groups = computed(() => {
  const byCurrency = {}
  for (const trip of visibleRows.value) {
    const group = (byCurrency[trip.currency] ||= { currency: trip.currency, total: 0, trips: [] })
    group.total += trip.budget || 0
    if (trip.metrics[mode.value] !== null) group.trips.push(trip)
  }
  return Object.values(byCurrency).map((group) => {
    const values = group.trips.map((trip) => trip.metrics[mode.value])
    const sorted = [...group.trips].sort((a, b) => a.metrics[mode.value] - b.metrics[mode.value])
    return {
      currency: group.currency,
      total: group.total,
      count: group.trips.length,
      average: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0,
      max: values.length ? Math.max(...values) : 0,
      cheapest: sorted[0] || null,
      priciest: sorted.length > 1 ? sorted[sorted.length - 1] : null,
    }
  })
})

const groupOf = (currency) => groups.value.find((group) => group.currency === currency)

// Rows displayed: value of the selected view, bar, gap to the average, badges
const rows = computed(() => {
  const list = visibleRows.value.map((trip) => {
    const group = groupOf(trip.currency)
    const value = trip.metrics[mode.value]
    return {
      ...trip,
      value,
      pct: value !== null && group.max ? Math.round((value / group.max) * 100) : 0,
      delta: value !== null && group.average && group.count > 1 ? Math.round((value / group.average - 1) * 100) : null,
      isCheapest: group.cheapest?.id_trip === trip.id_trip && group.count > 1,
      isPriciest: group.priciest?.id_trip === trip.id_trip,
    }
  })
  return list.sort((a, b) => {
    if (sortBy.value === 'value') return a.currency.localeCompare(b.currency) || (b.value ?? -1) - (a.value ?? -1)
    return (a.start_date || '9999').localeCompare(b.start_date || '9999')
  })
})

const digits = (key) => (key === 'total' || key === 'person' ? 0 : 1)
</script>

<template>
  <!-- Page header -->
  <PageHeader title="Budget" subtitle="Compare what each trip costs." class="mx:auto items-center justify-between px-14" />

  <div class="mx-auto max-w-7xl space-y-10 px-8 py-8">
    <p v-if="store.error" role="alert" class="text-red-700">{{ store.error }}</p>

    <!-- Key numbers (one row per currency) -->
    <section v-if="groups.length" class="space-y-5">
      <div v-for="group in groups" :key="group.currency" class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-3xl bg-night p-6 text-white shadow-lg">
          <p class="text-sm text-white/60">Total budget ({{ group.currency }})</p>
          <p class="mt-1 font-display text-3xl">{{ money(group.total, group.currency) }}</p>
        </div>
        <div class="rounded-3xl bg-white p-6 shadow-lg">
          <p class="text-sm text-gray-500">Average · {{ modeLabel.toLowerCase() }}</p>
          <p class="mt-1 font-display text-3xl text-coral">{{ money(group.average, group.currency, digits(mode)) }}</p>
        </div>
        <div class="rounded-3xl bg-white p-6 shadow-lg">
          <p class="text-sm text-gray-500">Cheapest trip</p>
          <p class="mt-1 truncate font-display text-xl text-night">{{ group.cheapest?.name || '–' }}</p>
          <p v-if="group.cheapest" class="text-sm text-gray-500">
            {{ money(group.cheapest.metrics[mode], group.currency, digits(mode)) }}
          </p>
        </div>
        <div class="rounded-3xl bg-white p-6 shadow-lg">
          <p class="text-sm text-gray-500">Most expensive trip</p>
          <p class="mt-1 truncate font-display text-xl text-night">{{ group.priciest?.name || '–' }}</p>
          <p v-if="group.priciest" class="text-sm text-gray-500">
            {{ money(group.priciest.metrics[mode], group.currency, digits(mode)) }}
          </p>
        </div>
      </div>
    </section>

    <section>
      <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 class="text-2xl">Your trips</h2>

        <div class="flex flex-wrap items-center gap-3">
          <!-- View: same pill style as the navbar links -->
          <div class="flex flex-wrap gap-2" role="group" aria-label="Budget view">
            <button
              v-for="item in modes"
              :key="item.key"
              @click="mode = item.key"
              :aria-pressed="mode === item.key"
              class="rounded-full px-4 py-1 font-bold transition-colors"
              :class="mode === item.key ? 'bg-night text-white' : 'bg-white text-night hover:bg-night/10'"
            >
              {{ item.label }}
            </button>
          </div>

          <!-- Currency filter: only when the trips use several currencies -->
          <select
            v-if="currencies.length > 1"
            v-model="selectedCurrency"
            aria-label="Filter by currency"
            class="rounded-full bg-white px-4 py-1 font-bold text-night"
          >
            <option value="ALL">All currencies</option>
            <option v-for="code in currencies" :key="code" :value="code">{{ code }}</option>
          </select>

          <select v-model="sortBy" aria-label="Sort trips" class="rounded-full bg-white px-4 py-1 font-bold text-night">
            <option value="date">Sort by date</option>
            <option value="value">Sort by cost</option>
          </select>
        </div>
      </div>

      <div class="space-y-5">
        <article v-for="trip in rows" :key="trip.id_trip" class="rounded-3xl bg-white p-6 shadow-lg">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="font-display text-xl text-night">{{ trip.name }}</h3>
                <span v-if="trip.isCheapest" class="rounded-full bg-coral/10 px-3 py-0.5 text-sm font-bold text-coral">
                  Cheapest
                </span>
                <span v-if="trip.isPriciest" class="rounded-full bg-night px-3 py-0.5 text-sm font-bold text-white">
                  Most expensive
                </span>
                <span v-if="trip.trip_type" class="rounded-full bg-gray-100 px-3 py-0.5 text-sm text-gray-500">
                  {{ trip.trip_type }}
                </span>
                <span v-if="trip.transport" class="rounded-full bg-gray-100 px-3 py-0.5 text-sm text-gray-500">
                  {{ trip.transport }}
                </span>
              </div>
              <p class="text-sm text-gray-500">
                <span v-if="trip.destination">{{ trip.destination }}, </span>{{ fmtDate(trip.start_date) }} – {{ fmtDate(trip.end_date) }}
              </p>
            </div>

            <div class="text-right">
              <p v-if="trip.value !== null" class="font-display text-2xl text-night">
                {{ money(trip.value, trip.currency, digits(mode)) }}
              </p>
              <p v-else class="rounded-full bg-gray-100 px-4 py-1 text-sm font-bold text-gray-500">
                {{ trip.budget === null ? 'No budget set' : 'Dates needed' }}
              </p>
              <p v-if="trip.value !== null" class="text-sm text-gray-500">{{ modeLabel.toLowerCase() }} ({{ trip.currency }})</p>
            </div>
          </div>

          <!-- Bar relative to the most expensive trip + gap to the average -->
          <div v-if="trip.value !== null" class="mt-4">
            <div
              class="h-3 overflow-hidden rounded-full bg-gray-100"
              role="progressbar"
              :aria-valuenow="trip.pct"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div class="h-full rounded-full bg-coral" :style="{ width: trip.pct + '%' }" />
            </div>
            <p v-if="trip.delta !== null" class="mt-1 text-sm text-gray-500">
              {{ trip.delta === 0 ? 'Same as the average' : Math.abs(trip.delta) + '% ' + (trip.delta > 0 ? 'above' : 'below') + ' the average' }}
            </p>
          </div>

          <!-- All views at once + the trip's own numbers -->
          <div v-if="trip.budget !== null" class="mt-5 grid gap-3 border-t-2 border-dashed border-coral/40 pt-4 sm:grid-cols-3 lg:grid-cols-6">
            <div v-for="item in modes" :key="item.key">
              <p class="text-sm text-gray-500">{{ item.label }}</p>
              <p class="font-bold" :class="item.key === mode ? 'text-coral' : 'text-night'">
                {{ trip.metrics[item.key] === null ? '–' : money(trip.metrics[item.key], trip.currency, digits(item.key)) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Travellers</p>
              <p class="font-bold text-night">{{ trip.people }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Duration</p>
              <p class="font-bold text-night">{{ trip.days ? trip.days + (trip.days > 1 ? ' days' : ' day') : '–' }}</p>
            </div>
          </div>

          <RouterLink v-else to="/trips" class="mt-4 inline-block text-sm font-bold text-coral hover:underline">
            Set a budget for this trip
          </RouterLink>
        </article>

        <!-- Dashed card, same pattern as "Create a new trip" -->
        <RouterLink
          to="/trips"
          class="flex w-full flex-col items-center rounded-3xl border-2 border-dashed border-coral/40 py-10 text-coral hover:bg-coral/5"
        >
          <span class="font-display text-xl">+ Create a new trip</span>
          <span class="mt-1 text-sm text-gray-500">Add a budget to compare it with your other trips</span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>