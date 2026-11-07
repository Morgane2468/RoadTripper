<!-- shows the trip types and their suggested tasks on a single row -->
<script setup>
import { TRIP_TEMPLATES } from '@/data/tripTemplates'
import TripScene from '@/components/TripScene.vue'

// [{ type: 'Beach', tasks: [...] }, ...]
const templates = Object.keys(TRIP_TEMPLATES).map((type) => ({
  type,
  tasks: TRIP_TEMPLATES[type],
}))
</script>

<template>
  <section>
    <h2 class="text-2xl">Start from a template</h2>
    <p class="mb-4 text-gray-500">
      Pick a trip type in the "New trip" form and we add a ready-made checklist for you.
    </p>

    <div class="flex gap-4 overflow-x-auto pt-1 pb-4">
      <div
        v-for="item in templates"
        :key="item.type"
        class="min-w-36 flex-1 overflow-hidden rounded-3xl bg-white shadow"
      >
        <TripScene :type="item.type" class="h-24 w-full" />
        <div class="p-4">
          <h3 class="font-display text-lg">{{ item.type }}</h3>
          <p class="mb-2 text-sm font-bold text-coral">{{ item.tasks.length }} tasks</p>
          <ul class="space-y-1 text-sm text-gray-500">
            <li v-for="task in item.tasks.slice(0, 3)" :key="task.title" class="truncate">{{ task.title }}</li>
            <li>...</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
