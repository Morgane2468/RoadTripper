<script setup>
import TaskCard from './TaskCard.vue'

defineProps({
  title: { type: String, required: true },
  tasks: { type: Array, required: true },
})
</script>

<template>
  <div class="bg-gray-100 rounded-lg p-3">
    <h2 class="font-bold text-gray-700 mb-3">
      {{ title }}
      <span class="text-sm font-normal text-gray-500">({{ tasks.length }})</span>
    </h2>

    <TaskCard v-for="t in tasks" :key="t.id_todo" :task="t" />

    <p v-if="tasks.length === 0" class="text-sm text-gray-400">Aucune tâche</p>
  </div>
</template>
