<!-- AuthLayout : mise en page commune aux pages de connexion et d'inscription. -->
<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
});
</script>

<template>
  <!-- Le dégradé et la scène couvrent toute la page -->
  <div class="relative min-h-screen overflow-hidden bg-linear-to-br from-coral to-sun">
    <!-- Scène : le van arrive sur la route (une seule fois au chargement) -->
    <svg
      viewBox="0 0 1440 260"
      class="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-auto w-full overflow-visible"
      aria-hidden="true"
    >
      <!-- Montagnes au loin -->
      <path
        d="M-200 190 L-200 140 L-60 110 L60 150 L200 98 L340 160 L470 118 L600 170 L760 104 L900 160 L1040 112 L1180 168 L1320 100 L1460 150 L1640 120 L1640 190 Z"
        fill="#d9482a"
        fill-opacity="0.35"
      />
      <!-- Collines -->
      <path
        d="M-200 190 L-200 160 Q0 128 200 158 T600 152 T1000 148 T1400 156 T1640 150 L1640 190 Z"
        fill="#2ec4b6"
      />
      <!-- Sol et route -->
      <rect x="-200" y="182" width="1840" height="90" fill="#1c8f84" />
      <rect x="-200" y="196" width="1840" height="52" fill="#1f2347" />
      <line
        x1="-200"
        y1="222"
        x2="1640"
        y2="222"
        stroke="#fff7ea"
        stroke-width="3"
        stroke-dasharray="22 16"
        stroke-linecap="round"
      />

      <!-- Sapins -->
      <g fill="#146b63">
        <polygon points="90,186 108,136 126,186" />
        <polygon points="120,186 134,150 148,186" />
        <polygon points="540,186 558,140 576,186" />
        <polygon points="570,186 584,152 598,186" />
        <polygon points="1010,186 1028,138 1046,186" />
        <polygon points="1260,186 1278,142 1296,186" />
        <polygon points="1290,186 1304,154 1318,186" />
      </g>

      <!-- Panneau de direction -->
      <rect x="760" y="116" width="6" height="74" fill="#fff7ea" />
      <polygon points="766,122 820,122 833,133 820,144 766,144" fill="#fff7ea" />
      <polygon points="760,150 706,150 693,161 706,172 760,172" fill="#ffc93c" />
      <text
        x="774"
        y="137"
        font-family="Nunito, sans-serif"
        font-size="11"
        font-weight="800"
        fill="#d9482a"
      >
        Lisbon
      </text>
      <text
        x="714"
        y="165"
        font-family="Nunito, sans-serif"
        font-size="11"
        font-weight="800"
        fill="#1f2347"
      >
        Kyoto
      </text>

      <!-- Van -->
      <g transform="translate(330 150)">
        <g class="van">
          <rect x="22" y="4" width="62" height="7" rx="3.5" fill="#ffc93c" />
          <rect x="0" y="12" width="112" height="40" rx="12" fill="#fff7ea" />
          <rect x="0" y="34" width="112" height="9" fill="#ff6b4a" />
          <rect x="12" y="18" width="38" height="16" rx="4" fill="#bfeee9" />
          <rect x="58" y="18" width="34" height="16" rx="4" fill="#bfeee9" />
          <circle cx="106" cy="40" r="3" fill="#ffc93c" />
          <circle cx="28" cy="52" r="10" fill="#1f2347" />
          <circle cx="28" cy="52" r="4" fill="#fff7ea" />
          <circle cx="86" cy="52" r="10" fill="#1f2347" />
          <circle cx="86" cy="52" r="4" fill="#fff7ea" />
        </g>
      </g>
    </svg>

    <div class="relative z-10 grid min-h-screen lg:grid-cols-2">
      <!-- Texte à gauche (caché sur mobile) -->
      <aside class="hidden flex-col p-12 text-white lg:flex">
        <p class="font-brand text-5xl xl:text-6xl">GearUP</p>

        <div class="mx-auto my-auto max-w-md pb-48">
          <h2 class="font-display text-4xl leading-tight font-bold text-night xl:text-5xl">
            Prepare your trip, without stress!
          </h2>

          <ul class="mt-8 space-y-4 text-lg">
            <li class="flex items-center gap-3">
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/25">
                <svg
                  viewBox="0 0 24 24"
                  class="h-5 w-5 fill-none stroke-current"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M8 7v7" />
                  <path d="M12 7v4" />
                  <path d="M16 7v9" />
                </svg>
              </span>
              A Kanban board for each trip
            </li>
            <li class="flex items-center gap-3">
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/25">
                <svg
                  viewBox="0 0 24 24"
                  class="h-5 w-5 fill-none stroke-current"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              Track your progress before you go
            </li>
            <li class="flex items-center gap-3">
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/25">
                <svg
                  viewBox="0 0 24 24"
                  class="h-5 w-5 fill-none stroke-current"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              Keep all your info in one place
            </li>
          </ul>
        </div>
      </aside>

      <!-- Formulaire à droite -->
      <main class="flex items-center justify-center p-6">
        <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl shadow-night/20">
          <div class="mb-4 flex items-center justify-between lg:justify-start">
            <p class="font-brand text-4xl text-coral lg:hidden">GearUP</p>
            <span class="grid h-12 w-12 place-items-center rounded-2xl bg-coral/10 text-coral">
              <svg
                viewBox="0 0 24 24"
                class="h-6 w-6 fill-none stroke-current"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
                />
              </svg>
            </span>
          </div>
          <h1 class="text-3xl">{{ title }}</h1>
          <p class="mb-6 text-gray-500">{{ subtitle }}</p>
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
@keyframes drive-in {
  from {
    transform: translateX(-700px);
  }
  to {
    transform: translateX(0);
  }
}

.van {
  animation: drive-in 2.2s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  .van {
    animation: none;
  }
}
</style>
