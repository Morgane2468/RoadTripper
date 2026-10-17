<!-- KanbanColumn : une colonne du Kanban (To Do, Doing ou Done) dont on peut glisser les cartes. -->
<script setup>
import draggable from 'vuedraggable'
import TaskCard from './TaskCard.vue'
import { useTripsStore } from '@/stores/trips'

const props = defineProps({
  title: { type: String, required: true },
  tasks: { type: Array, required: true },
})

const store = useTripsStore()

// Couleur de fond et pastille de chaque colonne
const COLORS = {
  'To Do': { bg: 'bg-sun/20', dot: 'bg-sun' },
  Doing: { bg: 'bg-lagoon/20', dot: 'bg-lagoon' },
  Done: { bg: 'bg-leaf/20', dot: 'bg-leaf' },
}

// Quand une carte est déposée dans cette colonne, on change son statut
function onChange(event) {
  if (event.added) {
    store.setStatus(event.added.element.id_todo, props.title)
  }
}
</script>

<template>
  <div class="rounded-3xl p-3" :class="COLORS[title].bg">
    <h2 class="mb-3 flex items-center gap-2 text-lg font-bold">
      <span class="h-3 w-3 rounded-full" :class="COLORS[title].dot" />
      {{ title }}
      <span class="text-sm font-normal text-gray-500">({{ tasks.length }})</span>
    </h2>

    <draggable
      :model-value="tasks"
      group="tasks"
      item-key="id_todo"
      @change="onChange"
      class="min-h-24"
      ghost-class="opacity-40"
    >
      <template #item="{ element }">
        <TaskCard :task="element" class="cursor-grab" />
      </template>
    </draggable>

    <p v-if="tasks.length === 0" class="text-sm text-gray-400">Glisse une tâche ici</p>
  </div>
</template>
