<!-- SiteFooter: footer shown under every page when the user is logged in. -->
<script setup>
import { RouterLink } from "vue-router";

const APP_NAME = "GearUP";
const team = ["Valentin", "Morgane", "Erwan", "Mathieu"];

// Pages that will be added with the back-end
const soonPages = ["Discover", "Calendar", "Budget"];
</script>

<template>
  <footer class="relative mt-40 bg-night text-white">
    <!-- Montagnes : deux plans, sommets enneigés et sapins, qui relient la page au footer -->
    <svg
      viewBox="0 0 1440 160"
      class="pointer-events-none absolute inset-x-0 bottom-full -mb-px block h-auto w-full"
      aria-hidden="true"
    >
      <!-- Plan arrière : grandes montagnes -->
      <path
        fill="#3b4283"
        d="M0 160 L0 112 L160 52 L270 102 L420 28 L570 112 L710 58 L870 122 L1030 38 L1190 110 L1330 60 L1440 100 L1440 160 Z"
      />
      <!-- Sommets enneigés -->
      <g fill="#dfe6ff">
        <polygon points="420,28 358,58 382,52 406,68 430,54 454,66 473,58" />
        <polygon points="1030,38 972,64 994,58 1014,72 1038,60 1062,70 1080,62" />
        <polygon points="160,52 118,72 138,68 154,80 172,68 192,76 204,70" />
        <polygon points="710,58 672,76 690,72 706,84 722,72 742,80 752,74" />
        <polygon points="1330,60 1296,76 1312,72 1326,82 1340,72 1358,78 1366,74" />
      </g>

      <!-- Plan avant : même couleur que le footer -->
      <g fill="#1f2347">
        <path
          d="M0 160 L0 122 L110 92 L200 126 L340 74 L470 132 L610 98 L740 140 L900 88 L1040 136 L1190 96 L1320 132 L1440 110 L1440 160 Z"
        />
        <polygon points="135,112 150,78 165,112" />
        <polygon points="139,92 150,60 161,92" />
        <polygon points="505,124 520,90 535,124" />
        <polygon points="509,104 520,72 531,104" />
        <polygon points="945,110 960,76 975,110" />
        <polygon points="949,90 960,58 971,90" />
        <polygon points="1247,116 1262,82 1277,116" />
        <polygon points="1251,96 1262,64 1273,96" />
        <polygon points="45,118 60,84 75,118" />
        <polygon points="49,98 60,66 71,98" />
      </g>
    </svg>

    <div class="relative mx-auto grid max-w-7xl gap-8 px-8 py-0 md:grid-cols-4">
      <div class="md:col-span-2">
        <p class="font-brand text-3xl text-sun">{{ APP_NAME }}</p>
        <p class="mt-2 max-w-sm text-white/80">
          Plan every road trip step by step: one board per trip, ready-made checklists and a clear
          view of your progress.
        </p>
      </div>

      <div>
        <p class="mb-2 font-bold text-sun">Explore</p>
        <ul class="space-y-1">
          <li><RouterLink to="/trips" class="hover:text-sun">My Trips</RouterLink></li>
          <li v-for="page in soonPages" :key="page" class="text-white/40">{{ page }} (soon)</li>
        </ul>
      </div>

      <div>
        <p class="mb-2 font-bold text-sun">Project</p>
        <ul class="space-y-1">
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
          <li class="text-white/80">MOD8 - Advanced Web Programming</li>
          <li class="text-white/80">Concordia Continuing Education</li>
        </ul>
      </div>
    </div>

    <!-- Route en pointillés avant la ligne de copyright -->
    <div class="relative border-t-2 border-dashed border-sun/40">
      <div
        class="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-8 py-3 text-sm text-white/70"
      >
        <p>&copy; 2026 {{ APP_NAME }}. Built by {{ team.join(", ") }}.</p>
        <p>Course project</p>
      </div>
    </div>
  </footer>
</template>
