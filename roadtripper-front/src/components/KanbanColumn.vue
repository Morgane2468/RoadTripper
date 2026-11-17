<!-- KanbanColumn : une colonne du Kanban (To Do, Doing ou Done), on peut glisser les cartes. -->
<script setup>
import draggable from 'vuedraggable'
import TaskCard from './TaskCard.vue'
import { useTripsStore } from '@/stores/trips'

const props = defineProps({
  title: { type: String, required: true },
  tasks: { type: Array, required: true },
})

const store = useTripsStore()

// Trois bleus du plus clair au plus foncé : la colonne devient plus sombre à mesure qu'on avance
const COLORS = {
  'To Do': { body: 'bg-blue-100', head: 'bg-blue-300 text-night', empty: 'border-blue-400 text-blue-900/60' },
  Doing: { body: 'bg-blue-400', head: 'bg-blue-500 text-night', empty: 'border-blue-100 text-night/60' },
  Done: { body: 'bg-blue-800', head: 'bg-blue-950 text-white', empty: 'border-blue-300 text-white/60' },
}

// Changement dynamique du statut
function onChange(event) {
  if (event.added) {
    store.setStatus(event.added.element.id_todo, props.title)
  }
}
</script>

<template>
  <div class="shadow-md" :class="COLORS[title].body">
    <!-- Bandeau du titre : rectangle plein, sans coins arrondis -->
    <h2
      class="flex items-center justify-between px-4 py-3 text-lg font-bold tracking-widest uppercase"
      :class="COLORS[title].head"
    >
      {{ title }}
      <span class="min-w-7 bg-white px-2 py-0.5 text-center text-sm font-bold text-night">
        {{ tasks.length }}
      </span>
    </h2>

    <div class="relative p-3">
      <draggable
        :model-value="tasks"
        group="tasks"
        item-key="id_todo"
        @change="onChange"
        class="min-h-28"
        ghost-class="opacity-40"
      >
        <template #item="{ element }">
          <TaskCard :task="element" class="cursor-grab" />
        </template>
      </draggable>

      <!-- Colonne vide : zone en pointillés, posée dans la zone où l'on dépose les cartes -->
      <p
        v-if="tasks.length === 0"
        class="pointer-events-none absolute inset-3 flex items-center justify-center border-2 border-dashed text-sm font-bold"
        :class="COLORS[title].empty"
      >
        Put a task here
      </p>
    </div>
  </div>
</template>
