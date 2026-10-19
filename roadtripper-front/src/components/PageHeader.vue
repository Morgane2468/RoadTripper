<!-- PageHeader : bandeau coloré en haut des pages, avec un titre et un bouton optionnel (slot). -->
<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <header class="w-[47%] py-4">
    <div class="rounded-full bg-linear-to-br from-coral to-sun flex flex-wrap items-center justify-between gap-2 px-6 py-6 h-[102px]">
      <div>
        <h1 class="font-brand text-white text-3xl md:text-4xl translate-x-6 -translate-y-2">{{ title }}</h1>
        <p class="mt-1 text-lg text-white/90 py-1 translate-x-6">{{ subtitle }}</p>
      </div>
      <slot />
    </div>
  </header>
</template>
