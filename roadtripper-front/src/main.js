import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useTripsStore, STORAGE_KEY } from '@/stores/trips'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// TEMPORAIRE : sauvegarde locale, remplacée par l'API + MySQL au Milestone 3
const trips = useTripsStore(pinia)
trips.$subscribe((_mutation, state) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ trips: state.trips, tasks: state.tasks }),
  )
})

app.mount('#app')
