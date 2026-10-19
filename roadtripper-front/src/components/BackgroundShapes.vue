<!-- BackgroundShapes: decorative colored shapes in the background of every page (circles, ring, wave). -->
<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <!-- Large circles that overflow the screen corners -->
    <div class="shape-float absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sun/30" />
    <div class="shape-float absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-coral/15" style="animation-delay: -3s" />
    <div class="shape-float absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-lagoon/15" style="animation-delay: -5s" />

    <!-- Ring and small shapes -->
    <div class="shape-float absolute top-1/2 right-16 h-44 w-44 rounded-full border-8 border-leaf/30" style="animation-delay: -2s" />
    <div class="shape-float absolute top-24 left-1/4 h-6 w-6 rounded-full bg-coral/40" />
    <div class="shape-float absolute bottom-1/3 right-1/4 h-4 w-4 rounded-full bg-lagoon/50" style="animation-delay: -4s" />
    <div class="shape-float absolute top-2/3 left-20 h-14 w-14 rotate-12 rounded-2xl bg-sun/50" style="animation-delay: -1s" />
    <div class="shape-float absolute top-40 right-1/3 h-10 w-10 -rotate-12 rounded-xl bg-lagoon/30" style="animation-delay: -6s" />

    <!-- Wavy line -->
    <svg class="absolute bottom-24 left-10 w-56 text-coral/40" viewBox="0 0 200 30" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round">
      <path d="M5 15 Q30 -5 55 15 T105 15 T155 15 T195 15" />
    </svg>
  </div>
</template>

<style scoped>
/* Shapes slowly move up and down (disabled if the user prefers reduced motion) */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-18px);
  }
}

.shape-float {
  animation: float 8s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .shape-float {
    animation: none;
  }
}
</style>
