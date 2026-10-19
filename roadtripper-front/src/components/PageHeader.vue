<!-- PageHeader : bandeau coloré en haut des pages, avec un titre et un bouton optionnel (slot). -->
<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <header class="bg-linear-to-br from-coral to-sun text-white">
    <div class="flex flex-wrap items-center justify-between gap-4 px-6 py-10">
      <div>
        <h1 class="font-brand text-4xl md:text-5xl">{{ title }}</h1>
        <p class="mt-1 text-lg text-white/90">{{ subtitle }}</p>
      </div>
      <slot />
    </div>
  </header>
</template>
