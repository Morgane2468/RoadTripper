<!-- SiteFooter: footer shown under every page when the user is logged in. -->
<script setup>
import { RouterLink } from 'vue-router'

const APP_NAME = 'GearUP'
const team = ['Valentin', 'Morgane', 'Erwan', 'Mathieu']

// Pages that will be added with the back-end
const soonPages = ['Discover', 'Calendar', 'Budget']
</script>

<template>
  <footer class="relative mt-16 overflow-hidden bg-linear-to-r from-coral-dark to-coral text-white">
    <!-- Decorative circles -->
    <div class="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10" />
    <div class="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-sun/25" />

    <div class="relative mx-auto grid max-w-7xl gap-10 px-8 py-12 md:grid-cols-4">
      <div class="md:col-span-2">
        <p class="font-brand text-3xl">{{ APP_NAME }}</p>
        <p class="mt-3 max-w-sm">
          Plan every road trip step by step: one board per trip, ready-made checklists and a clear view of your
          progress.
        </p>
      </div>

      <div>
        <p class="mb-3 font-bold">Explore</p>
        <ul class="space-y-2">
          <li><RouterLink to="/trips" class="hover:text-sun">My Trips</RouterLink></li>
          <li v-for="page in soonPages" :key="page" class="text-white/60">{{ page }} (soon)</li>
        </ul>
      </div>

      <div>
        <p class="mb-3 font-bold">Project</p>
        <ul class="space-y-2">
          <li>
            <a
              href="https://github.com/Morgane2468/RoadTripper"
              target="_blank"
              rel="noopener"
              class="hover:text-sun"
            >
              GitHub repository
            </a>
          </li>
          <li>MOD8 - Advanced Web Programming</li>
          <li>Concordia Continuing Education</li>
        </ul>
      </div>
    </div>

    <div class="relative border-t border-white/20">
      <div class="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-8 py-4 text-sm">
        <p>&copy; 2026 {{ APP_NAME }}. Built by {{ team.join(', ') }}.</p>
        <p>Course project</p>
      </div>
    </div>
  </footer>
</template>
