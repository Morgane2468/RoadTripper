<script setup>
import { computed } from "vue";
import draggable from "vuedraggable";
import TaskCard from "./TaskCard.vue";
import { useTripsStore } from "@/stores/trips";

const props = defineProps({
  title: { type: String, required: true },
  tasks: { type: Array, required: true },
});

const store = useTripsStore();

// Liste locale : vuedraggable a besoin d'un v-model modifiable
const list = computed({
  get: () => props.tasks,
  set: () => {},
});

// Appelé quand une carte est déposée dans cette colonne
function onChange(evt) {
  if (evt.added) {
    store.setStatus(evt.added.element.id_todo, props.title);
  }
}
</script>

<template>
  <div class="bg-gray-100 rounded-lg p-3">
    <h2 class="font-bold text-gray-700 mb-3">
      {{ title }}
      <span class="text-sm font-normal text-gray-500">({{ tasks.length }})</span>
    </h2>

    <draggable
      v-model="list"
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
