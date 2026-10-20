<!-- PageHeader : bandeau coloré en haut des pages, avec un titre et un bouton optionnel (slot). -->
<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
});
</script>

<template>
  <header class="w-[47%] py-4">
    <div
      class="relative flex h-[102px] flex-wrap items-center justify-between gap-2 overflow-hidden rounded-full bg-linear-to-br from-coral to-sun px-6 py-6 shadow-lg shadow-coral/30"
    >
      <!-- Décor : montagnes et trajet d'avion, uniquement derrière le bouton (à droite) -->
      <svg
        viewBox="0 0 300 102"
        preserveAspectRatio="xMaxYMax slice"
        class="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-2/5 sm:block"
        style="
          mask-image: linear-gradient(to right, transparent 15%, #000 60%);
          -webkit-mask-image: linear-gradient(to right, transparent 15%, #000 60%);
        "
        aria-hidden="true"
      >
        <!-- Montagnes -->
        <path
          d="M0 102 L0 80 L50 40 L85 70 L125 28 L175 82 L215 52 L260 85 L300 60 L300 102 Z"
          fill="#fff"
          fill-opacity="0.12"
        />
        <path
          d="M0 102 L0 92 L60 68 L110 90 L170 62 L230 92 L300 74 L300 102 Z"
          fill="#fff"
          fill-opacity="0.1"
        />
      </svg>

      <!-- Liseré pointillé façon billet / tampon -->
      <div
        class="pointer-events-none absolute inset-1.5 rounded-full border border-dashed border-white/40"
        aria-hidden="true"
      />

      <div class="relative z-10">
        <h1 class="font-brand text-white text-3xl md:text-4xl translate-x-6 -translate-y-2">
          {{ title }}
        </h1>
        <p class="mt-1 text-lg text-white/90 py-1 translate-x-6">{{ subtitle }}</p>
      </div>
      <div class="relative z-10">
        <slot />
      </div>
    </div>
  </header>
</template>
