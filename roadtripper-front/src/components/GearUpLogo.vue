<!-- GearUpLogo : logo GearUP (image /logo.jpg dans le dossier public) et le nom en police Pacifico. -->
<!-- La taille suit la taille du texte : on la règle avec une classe text-* sur le composant. -->
<script setup>
defineProps({
  // false = seulement l'image, sans le nom
  showText: { type: Boolean, default: true },
})
</script>

<template>
  <span class="inline-flex items-center gap-2">
    <img src="/logo.png" alt="GearUP" class="h-[2em] w-auto shrink-0 rounded-lg" />
    <span v-if="showText" class="font-brand">GearUP</span>
  </span>
</template>
