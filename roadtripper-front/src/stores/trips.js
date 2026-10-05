import { defineStore } from 'pinia'
import mock from '@/mock/data.json'

export const useTripsStore = defineStore('trips', {
  state: () => ({
    categories: mock.categories,
    trips: mock.trips,
    tasks: mock.tasks,
  }),
  getters: {
    tasksByTrip: (s) => (id) => s.tasks.filter((t) => t.id_trip === Number(id)),
    progress: (s) => (id) => {
      const list = s.tasks.filter((t) => t.id_trip === Number(id))
      return list.length
        ? Math.round((list.filter((t) => t.status === 'Done').length / list.length) * 100)
        : 0
    },
  },
  actions: {
    moveTask(id_todo, status) {
      const t = this.tasks.find((t) => t.id_todo === id_todo)
      if (t) t.status = status
    },

    addTrip(name) {
      const clean = name.trim()
      if (!clean) return
      const nextId = this.trips.length
        ? Math.max(...this.trips.map((t) => t.id_trip)) + 1
        : 1
      this.trips.push({ id_trip: nextId, id_user: 1, name: clean })
    },

    deleteTrip(id_trip) {
      this.trips = this.trips.filter((t) => t.id_trip !== id_trip)
      this.tasks = this.tasks.filter((t) => t.id_trip !== id_trip)
    },
  },
})
