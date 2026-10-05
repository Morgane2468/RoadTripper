<script setup>
import { computed } from "vue";
import { useTripsStore } from "@/stores/trips";

const props = defineProps({
  task: { type: Object, required: true },
});

const store = useTripsStore();
const category = computed(() =>
  store.categories.find((c) => c.id_category === props.task.id_category),
);
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm p-3 mb-2 border-l-4"
    :style="{ borderColor: category?.color }"
  >
    <p class="font-medium text-gray-800">{{ task.title }}</p>

    <span
      v-if="category"
      class="inline-block text-xs text-white rounded-full px-2 py-0.5 mt-2"
      :style="{ backgroundColor: category.color }"
    >
      {{ category.name }}
    </span>

    <select
      :value="task.status"
      @change="store.moveTask(task.id_todo, $event.target.value)"
      class="block mt-2 text-sm border rounded p-1 w-full"
    >
      <option>To Do</option>
      <option>Doing</option>
      <option>Done</option>
    </select>
    <button
      @click="store.deleteTask(task.id_todo)"
      class="mt-2 text-xs text-red-500 hover:text-red-700"
    >
      Supprimer
    </button>
  </div>
</template>
