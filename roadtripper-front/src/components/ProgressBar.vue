<script setup>
defineProps({
  percent: { type: Number, default: 0 },
})
</script>

<template>
  <div>
    <div class="flex justify-between text-sm text-gray-600 mb-1">
      <span>Préparation du voyage</span>
      <span>{{ percent }} %</span>
    </div>
    <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-3 bg-green-500 rounded-full transition-all duration-300"
        :style="{ width: percent + '%' }"
      />
    </div>
  </div>
</template>
