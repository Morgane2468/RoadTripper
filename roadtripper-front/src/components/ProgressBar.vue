<!-- barre de progression d'un voyage (pourcentage de tâches terminées) -->
<script setup>
defineProps({
  percent: { type: Number, default: 0 },
})
</script>

<template>
  <div>
    <div class="mb-2 flex justify-between text-sm font-bold">
      <span>Préparation du voyage</span>
      <span class="text-coral">{{ percent }} %</span>
    </div>

    <div class="relative mr-6">
      <div class="h-4 overflow-hidden rounded-full bg-gray-200">
        <div
          class="h-4 rounded-full bg-coral transition-all duration-500"
          :style="{ width: percent + '%' }"
        />
      </div>
      <span
        class="absolute -top-1 h-6 w-6 rounded-full border-4 border-coral bg-white transition-all duration-500"
        :style="{ left: percent + '%' }"
      />
    </div>
  </div>
</template>
