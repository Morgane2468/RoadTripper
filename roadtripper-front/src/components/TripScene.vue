<!--illustration made by AI for the different trip types (beach, snow, mountain, desert, lake, city, countryside)-->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: '' },
})

const SCENES = [
  { name: 'beach', words: ['plage', 'beach'] },
  { name: 'snow', words: ['neige', 'snow', 'ski', 'winter', 'hiver'] },
  { name: 'mountain', words: ['montagne', 'mountain'] },
  { name: 'desert', words: ['desert', 'désert'] },
  { name: 'lake', words: ['lac', 'lake'] },
  { name: 'city', words: ['ville', 'city'] },
  { name: 'countryside', words: ['campagne', 'country', 'camp', 'forest', 'forêt'] },
]

const scene = computed(() => {
  const type = (props.type || '').toLowerCase()
  const found = SCENES.find((s) => s.words.some((word) => type.includes(word)))
  return found ? found.name : 'road'
})
</script>

<template>
  <svg
    viewBox="0 0 400 200"
    preserveAspectRatio="xMidYMid slice"
    role="img"
    :aria-label="scene + ' illustration'"
  >
    <g v-if="scene === 'beach'">
      <rect width="400" height="200" fill="#ffe7c2" />
      <circle cx="310" cy="62" r="32" fill="#ffc93c" />
      <rect y="105" width="400" height="60" fill="#2ec4b6" />
      <path d="M0 125 Q25 115 50 125 T100 125 T150 125 T200 125 T250 125 T300 125 T350 125 T400 125" stroke="#fff7ea" stroke-width="3" fill="none" />
      <path d="M0 155 Q100 138 200 150 T400 145 V200 H0 Z" fill="#ffd98a" />
      <line x1="95" y1="95" x2="95" y2="175" stroke="#1f2347" stroke-width="4" />
      <path d="M50 100 A45 45 0 0 1 140 100 Z" fill="#ff6b4a" />
      <path d="M95 55 L75 100 H115 Z" fill="#fff7ea" />
      <rect x="160" y="168" width="64" height="16" rx="4" fill="#7bd957" />
    </g>

    <g v-else-if="scene === 'snow'">
      <rect width="400" height="200" fill="#cfe8f7" />
      <circle cx="330" cy="50" r="24" fill="#fff7ea" />
      <polygon points="0,165 120,55 240,165" fill="#a9cde8" />
      <polygon points="160,165 290,45 400,165" fill="#86b3d6" />
      <polygon points="120,55 100,88 116,82 124,92 138,80 148,88" fill="#ffffff" />
      <polygon points="290,45 268,82 284,76 292,88 306,74 318,84" fill="#ffffff" />
      <path d="M0 160 Q100 138 200 155 T400 148 V200 H0 Z" fill="#ffffff" />
      <polygon points="50,172 72,118 94,172" fill="#2f9e44" />
      <polygon points="72,118 62,142 82,142" fill="#ffffff" />
      <polygon points="330,176 350,128 370,176" fill="#2f9e44" />
      <polygon points="350,128 341,150 359,150" fill="#ffffff" />
      <circle cx="40" cy="40" r="4" fill="#ffffff" />
      <circle cx="180" cy="30" r="4" fill="#ffffff" />
      <circle cx="240" cy="90" r="3" fill="#ffffff" />
      <circle cx="380" cy="100" r="3" fill="#ffffff" />
    </g>

    <g v-else-if="scene === 'mountain'">
      <rect width="400" height="200" fill="#ffe7c2" />
      <circle cx="70" cy="55" r="26" fill="#ffc93c" />
      <polygon points="0,170 110,60 220,170" fill="#9fb4e8" />
      <polygon points="150,170 280,40 400,170" fill="#4b57a3" />
      <polygon points="110,60 90,92 104,86 112,96 124,84 132,92" fill="#fff7ea" />
      <polygon points="280,40 255,78 270,72 282,82 296,70 310,78" fill="#fff7ea" />
      <rect y="165" width="400" height="35" fill="#7bd957" />
      <polygon points="40,178 58,132 76,178" fill="#2f9e44" />
      <polygon points="320,180 340,128 360,180" fill="#2f9e44" />
    </g>

    <g v-else-if="scene === 'desert'">
      <rect width="400" height="200" fill="#ffe0b0" />
      <circle cx="200" cy="100" r="48" fill="#ff9a62" />
      <path d="M0 150 Q100 110 200 145 T400 135 V200 H0 Z" fill="#f2b45c" />
      <path d="M0 175 Q120 145 250 170 T400 165 V200 H0 Z" fill="#e89a3c" />
      <rect x="320" y="112" width="14" height="60" rx="7" fill="#2f9e44" />
      <rect x="300" y="128" width="10" height="28" rx="5" fill="#2f9e44" />
      <rect x="300" y="148" width="30" height="9" rx="4" fill="#2f9e44" />
      <rect x="334" y="122" width="10" height="26" rx="5" fill="#2f9e44" />
      <rect x="326" y="140" width="14" height="9" rx="4" fill="#2f9e44" />
    </g>

    <g v-else-if="scene === 'lake'">
      <rect width="400" height="200" fill="#ffe7c2" />
      <circle cx="310" cy="58" r="28" fill="#ffc93c" />
      <polygon points="0,110 90,55 180,110" fill="#9fb4e8" />
      <polygon points="120,110 230,45 340,110" fill="#4b57a3" />
      <rect y="110" width="400" height="90" fill="#2ec4b6" />
      <path d="M40 140 H110 M230 150 H310 M80 178 H170 M260 184 H340" stroke="#fff7ea" stroke-width="3" stroke-linecap="round" />
      <path d="M150 132 H225 L212 150 H165 Z" fill="#ff6b4a" />
      <line x1="188" y1="132" x2="188" y2="98" stroke="#1f2347" stroke-width="3" />
      <polygon points="188,98 188,128 214,128" fill="#fff7ea" />
    </g>

    <g v-else-if="scene === 'city'">
      <rect width="400" height="200" fill="#ffe7c2" />
      <circle cx="75" cy="68" r="30" fill="#ffc93c" />
      <rect x="30" y="100" width="50" height="100" fill="#4b57a3" />
      <rect x="90" y="68" width="55" height="132" fill="#1f2347" />
      <rect x="155" y="108" width="45" height="92" fill="#4b57a3" />
      <rect x="210" y="58" width="60" height="142" fill="#1f2347" />
      <rect x="280" y="95" width="50" height="105" fill="#4b57a3" />
      <rect x="340" y="122" width="45" height="78" fill="#1f2347" />
      <rect x="42" y="115" width="10" height="10" fill="#ffc93c" />
      <rect x="60" y="140" width="10" height="10" fill="#ffc93c" />
      <rect x="104" y="85" width="10" height="10" fill="#ffc93c" />
      <rect x="122" y="115" width="10" height="10" fill="#ffc93c" />
      <rect x="104" y="145" width="10" height="10" fill="#ffc93c" />
      <rect x="168" y="125" width="10" height="10" fill="#ffc93c" />
      <rect x="225" y="78" width="10" height="10" fill="#ffc93c" />
      <rect x="245" y="110" width="10" height="10" fill="#ffc93c" />
      <rect x="225" y="140" width="10" height="10" fill="#ffc93c" />
      <rect x="295" y="112" width="10" height="10" fill="#ffc93c" />
      <rect x="353" y="138" width="10" height="10" fill="#ffc93c" />
    </g>

    <g v-else-if="scene === 'countryside'">
      <rect width="400" height="200" fill="#ffe7c2" />
      <circle cx="325" cy="55" r="28" fill="#ffc93c" />
      <path d="M0 140 Q100 90 200 130 T400 120 V200 H0 Z" fill="#a8e063" />
      <path d="M0 165 Q120 130 240 160 T400 150 V200 H0 Z" fill="#7bd957" />
      <polygon points="120,172 160,116 200,172" fill="#ff6b4a" />
      <polygon points="160,116 146,172 174,172" fill="#d9482a" />
      <rect x="296" y="132" width="9" height="40" fill="#8a5a2b" />
      <circle cx="300" cy="122" r="26" fill="#2f9e44" />
    </g>

    <g v-else>
      <rect width="400" height="200" fill="#ffe7c2" />
      <circle cx="200" cy="82" r="36" fill="#ffc93c" />
      <path d="M0 112 Q100 82 200 106 T400 100 V200 H0 Z" fill="#7bd957" />
      <polygon points="194,106 206,106 340,200 60,200" fill="#1f2347" />
      <path d="M200 112 V126 M200 142 V162 M200 180 V200" stroke="#ffc93c" stroke-width="5" stroke-linecap="round" />
    </g>
  </svg>
</template>
