<!-- CalendarView : tous les voyages affichés sur un calendrier mensuel, une pastille colorée par voyage. -->
<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import PageHeader from '@/components/PageHeader.vue'

const store = useTripsStore()

// 0 = dimanche, 1 = lundi : premier jour de la semaine dans le calendrier
const WEEK_START = 1
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const weekdays = [...DAY_NAMES.slice(WEEK_START), ...DAY_NAMES.slice(0, WEEK_START)].map((name) => ({
  name,
  weekend: name === 'Sat' || name === 'Sun',
}))

// Le calendrier affiche toujours 6 semaines pour garder la même taille d'un mois à l'autre
const WEEK_COUNT = 6
// Nombre maximum de voyages affichés l'un sous l'autre dans une même semaine
const MAX_LANES = 3

// Une couleur par voyage (classes écrites en entier pour que Tailwind les détecte)
const COLORS = [
  { bar: 'bg-blue-700 text-white', dot: 'bg-blue-700' },
  { bar: 'bg-emerald-600 text-white', dot: 'bg-emerald-600' },
  { bar: 'bg-amber-400 text-night', dot: 'bg-amber-400' },
  { bar: 'bg-rose-600 text-white', dot: 'bg-rose-600' },
  { bar: 'bg-violet-600 text-white', dot: 'bg-violet-600' },
  { bar: 'bg-teal-600 text-white', dot: 'bg-teal-600' },
  { bar: 'bg-orange-500 text-white', dot: 'bg-orange-500' },
  { bar: 'bg-sky-600 text-white', dot: 'bg-sky-600' },
]

const DAY_MS = 24 * 60 * 60 * 1000

// "2026-07-14" -> date locale (sans décalage de fuseau horaire)
function toDate(text) {
  const [year, month, day] = String(text).slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day)
}
function addDays(date, count) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + count)
}
function dayDiff(from, to) {
  return Math.round((to - from) / DAY_MS)
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const now = new Date()
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const cursor = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const monthLabel = computed(() =>
  cursor.value.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' }),
)

function changeMonth(step) {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + step, 1)
}
function goToday() {
  cursor.value = new Date(today.getFullYear(), today.getMonth(), 1)
}
function goToMonthOf(date) {
  cursor.value = new Date(date.getFullYear(), date.getMonth(), 1)
}

function formatDate(date, withYear = false) {
  return date.toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    ...(withYear ? { year: 'numeric' } : {}),
  })
}
function formatRange(start, end) {
  if (sameDay(start, end)) return formatDate(start, true)
  return `${formatDate(start)} - ${formatDate(end, true)}`
}

// Voyages avec dates : ce sont ceux qu'on peut placer sur le calendrier
const scheduled = computed(() =>
  store.trips
    .map((trip, index) => ({ trip, color: COLORS[index % COLORS.length] }))
    .filter(({ trip }) => trip.start_date)
    .map((item) => {
      const start = toDate(item.trip.start_date)
      let end = item.trip.end_date ? toDate(item.trip.end_date) : start
      if (end < start) end = start
      return { ...item, start, end }
    }),
)

const unscheduled = computed(() => store.trips.filter((trip) => !trip.start_date))

// Les 6 semaines affichées, avec les pastilles de voyage de chaque semaine
const weeks = computed(() => {
  const first = cursor.value
  const offset = (first.getDay() - WEEK_START + 7) % 7
  const gridStart = addDays(first, -offset)

  return Array.from({ length: WEEK_COUNT }, (_, w) => {
    const weekStart = addDays(gridStart, w * 7)
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i)
      return {
        key: date.getTime(),
        number: date.getDate(),
        inMonth: date.getMonth() === first.getMonth(),
        isToday: sameDay(date, today),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      }
    })
    const weekEnd = addDays(weekStart, 6)

    const segments = scheduled.value
      .filter((item) => item.start <= weekEnd && item.end >= weekStart)
      .sort((a, b) => a.start - b.start || b.end - a.end)
      .map((item) => ({
        ...item,
        startCol: Math.max(0, dayDiff(weekStart, item.start)) + 1,
        endCol: Math.min(6, dayDiff(weekStart, item.end)) + 1,
        fromPrevWeek: item.start < weekStart,
        toNextWeek: item.end > weekEnd,
        lane: 0,
      }))

    // Chaque pastille prend la première ligne libre pour ne pas en recouvrir une autre
    const laneEnds = []
    for (const segment of segments) {
      let lane = laneEnds.findIndex((end) => end < segment.startCol)
      if (lane === -1) {
        lane = laneEnds.length
        laneEnds.push(0)
      }
      laneEnds[lane] = segment.endCol
      segment.lane = lane
    }

    return {
      key: weekStart.getTime(),
      days,
      visible: segments.filter((segment) => segment.lane < MAX_LANES),
      hiddenCount: segments.filter((segment) => segment.lane >= MAX_LANES).length,
    }
  })
})

// Nombre de voyages qui touchent le mois affiché
const monthCount = computed(() => {
  const first = cursor.value
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0)
  return scheduled.value.filter((item) => item.start <= last && item.end >= first).length
})

const monthSummary = computed(() => {
  if (!monthCount.value) return 'No trip this month, time to plan one!'
  return `${monthCount.value} ${monthCount.value === 1 ? 'trip' : 'trips'} this month`
})
</script>

<template>
  <PageHeader
    title="Calendar"
    subtitle="All your trips at a glance"
    class="mx:auto items-center justify-between px-14"
  />

  <div class="mx-auto max-w-7xl space-y-8 px-8 py-8">
    <!-- Aucun voyage -->
    <div v-if="!store.trips.length" class="rounded-3xl bg-white p-10 text-center shadow">
      <p class="font-display text-xl">No trips yet</p>
      <p class="mt-1 text-gray-500">Create a trip and it will appear here.</p>
      <RouterLink
        to="/trips"
        class="mt-4 inline-block rounded-full bg-coral px-5 py-2 font-bold text-white hover:bg-coral-dark"
      >
        Go to my trips
      </RouterLink>
    </div>

    <template v-else>
      <section>
        <!-- Bandeau du mois : même style que le haut de page, avec montagnes et trajet en pointillés -->
        <div
          class="relative flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-3xl bg-blue-200 px-6 py-3 shadow-lg shadow-blue-200/60"        >
          <svg
            viewBox="0 0 300 102"
            preserveAspectRatio="xMaxYMax slice"
            class="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/2 sm:block"
            style="
              mask-image: linear-gradient(to right, transparent 10%, #000 70%);
              -webkit-mask-image: linear-gradient(to right, transparent 10%, #000 70%);
            "
            aria-hidden="true"
          >
            <path
              d="M0 102 L0 80 L50 40 L85 70 L125 28 L175 82 L215 52 L260 85 L300 60 L300 102 Z"
              fill="#1f2347"
              fill-opacity="0.15"
            />
            <path
              d="M0 102 L0 92 L60 68 L110 90 L170 62 L230 92 L300 74 L300 102 Z"
              fill="#1f2347"
              fill-opacity="0.12"
            />
          </svg>

          <div class="relative z-10">
            <h2 class="font-brand text-3xl leading-[1.5] text-night md:text-4xl">{{ monthLabel }}</h2>
            <p class="text-sm font-bold text-night/70">{{ monthSummary }}</p>
          </div>

          <div class="relative z-10 flex items-center gap-2">
            <button
              @click="changeMonth(-1)"
              aria-label="Previous month"
              class="h-9 w-9 rounded-full bg-night/10 text-xl font-bold text-night hover:bg-night/20"
            >
              ‹
            </button>
            <button
              @click="goToday"
              class="rounded-full bg-night px-4 py-1.5 font-bold text-white hover:bg-night-light"
            >
              Today
            </button>
            <button
              @click="changeMonth(1)"
              aria-label="Next month"
              class="h-9 w-9 rounded-full bg-night/10 text-xl font-bold text-night hover:bg-night/20"
            >
              ›
            </button>
          </div>
        </div>

        <div class="mt-4 overflow-x-auto pb-2">
          <div class="min-w-160">
            <!-- Noms des jours -->
            <div class="mb-1.5 grid grid-cols-7 gap-x-1.5">
              <div
                v-for="day in weekdays"
                :key="day.name"
                class="py-1 text-center font-display text-lg"
                :class="day.weekend ? 'text-coral' : 'text-night'"
              >
                {{ day.name }}
              </div>
            </div>

            <!-- 6 semaines de hauteur fixe : le calendrier garde toujours la même taille -->
            <div class="space-y-1.5">
              <div v-for="week in weeks" :key="week.key" class="relative h-32">
                <!-- Fond : une case arrondie par jour -->
                <div class="absolute inset-0 grid grid-cols-7 gap-x-1.5" aria-hidden="true">
                  <div
                    v-for="day in week.days"
                    :key="day.key"
                    class="rounded-2xl"
                    :class="[
                      day.inMonth ? (day.isWeekend ? 'bg-sun/15 shadow-sm' : 'bg-white shadow-sm') : 'bg-white/40',
                      day.isToday ? 'ring-2 ring-sun' : '',
                    ]"
                  />
                </div>

                <!-- Devant : numéros des jours puis pastilles des voyages -->
                <div
                  class="relative grid h-full grid-cols-7 content-start gap-x-1.5 gap-y-0.5"
                  :style="{ gridTemplateRows: '2rem repeat(' + MAX_LANES + ', 1.5rem)' }"
                >
                  <span
                    v-for="(day, index) in week.days"
                    :key="day.key"
                    :style="{ gridColumn: index + 1, gridRow: 1 }"
                    class="m-1 flex h-6 w-6 items-center justify-center justify-self-start rounded-full text-sm font-bold"
                    :class="
                      day.isToday
                        ? 'bg-sun text-night'
                        : day.inMonth
                          ? 'text-night'
                          : 'text-gray-300'
                    "
                  >
                    {{ day.number }}
                  </span>

                  <RouterLink
                    v-for="segment in week.visible"
                    :key="segment.trip.id_trip"
                    :to="'/trips/' + segment.trip.id_trip"
                    :title="`${segment.trip.name}${segment.trip.destination ? ' - ' + segment.trip.destination : ''}\n${formatRange(segment.start, segment.end)}`"
                    :style="{
                      gridColumn: segment.startCol + ' / ' + (segment.endCol + 1),
                      gridRow: segment.lane + 2,
                    }"
                    class="truncate text-sm leading-6 font-bold shadow-sm hover:brightness-110"
                    :class="[
                      segment.color.bar,
                      segment.fromPrevWeek ? 'rounded-l-none pl-2' : 'ml-1 rounded-l-full pl-2.5',
                      segment.toNextWeek ? 'rounded-r-none pr-2' : 'mr-1 rounded-r-full pr-2.5',
                    ]"
                  >
                    {{ segment.trip.name }}
                  </RouterLink>

                  <span
                    v-if="week.hiddenCount"
                    :style="{ gridColumn: 7, gridRow: 1 }"
                    class="mr-2 self-center justify-self-end rounded-full bg-night px-2 text-xs leading-5 font-bold text-white"
                    :title="week.hiddenCount + ' more trip(s) this week'"
                  >
                    +{{ week.hiddenCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Légende : tous les voyages avec leur couleur -->
      <section v-if="scheduled.length">
        <h2 class="text-2xl">Your trips</h2>
        <p class="mb-4 text-gray-500">Click a trip to jump to its month. Click a pill on the calendar to open its checklist.</p>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="item in scheduled"
            :key="item.trip.id_trip"
            @click="goToMonthOf(item.start)"
            class="flex items-center gap-3 rounded-full bg-white py-2 pr-5 pl-3 text-left shadow hover:shadow-md"
          >
            <span class="h-4 w-4 shrink-0 rounded-full" :class="item.color.dot" />
            <span>
              <span class="block leading-tight font-bold">{{ item.trip.name }}</span>
              <span class="block text-sm text-gray-500">
                {{ formatRange(item.start, item.end) }}
                <template v-if="item.trip.destination"> · {{ item.trip.destination }}</template>
              </span>
            </span>
          </button>
        </div>
      </section>

      <!-- Voyages sans dates : impossibles à placer sur le calendrier -->
      <section v-if="unscheduled.length">
        <h2 class="text-2xl">Trips without dates</h2>
        <p class="mb-4 text-gray-500">Add a departure date to a trip (Edit) to see it on the calendar.</p>
        <div class="flex flex-wrap gap-3">
          <RouterLink
            v-for="trip in unscheduled"
            :key="trip.id_trip"
            :to="'/trips/' + trip.id_trip"
            class="rounded-full border-2 border-dashed border-gray-300 px-4 py-2 font-bold hover:bg-white"
          >
            {{ trip.name }}
          </RouterLink>
        </div>
      </section>
    </template>
  </div>
</template>
