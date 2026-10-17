<!-- AuthLayout : mise en page commune aux pages de connexion et d'inscription. -->
<script setup>
// Chaque page donne un titre et un sous-titre, et met son formulaire à la place de <slot />
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <div class="grid min-h-screen lg:grid-cols-2">
    <!-- Panneau coloré à gauche (caché sur mobile) -->
    <aside
      class="hidden flex-col justify-between bg-linear-to-br from-coral to-sun p-12 text-white lg:flex"
    >
      <p class="font-brand text-4xl">RoadTripper</p>

      <div>
        <h2 class="font-brand text-5xl leading-snug">Prépare ton road trip, sans stress !</h2>
        <ul class="mt-6 space-y-2 text-lg">
          <li>Un tableau Kanban pour chaque voyage</li>
          <li>Suis ta progression avant le départ</li>
          <li>Garde toutes tes infos au même endroit</li>
        </ul>
      </div>
    </aside>

    <!-- Formulaire à droite -->
    <main class="flex items-center justify-center p-6">
      <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <p class="mb-2 font-brand text-3xl text-coral lg:hidden">RoadTripper</p>
        <h1 class="text-3xl">{{ title }}</h1>
        <p class="mb-6 text-gray-500">{{ subtitle }}</p>
        <slot/>
      </div>
    </main>
  </div>
</template>
