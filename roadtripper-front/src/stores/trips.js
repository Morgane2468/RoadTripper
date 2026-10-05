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
        addTask(id_trip, title, id_category) {
      const clean = title.trim()
      if (!clean) return
      const nextId = this.tasks.length
        ? Math.max(...this.tasks.map((t) => t.id_todo)) + 1
        : 1
      this.tasks.push({
        id_todo: nextId,
        id_trip: Number(id_trip),
        id_category: id_category ? Number(id_category) : null,
        title: clean,
        status: 'To Do',
      })
    },

    deleteTask(id_todo) {
      this.tasks = this.tasks.filter((t) => t.id_todo !== id_todo)
    },
    setStatus(id_todo, status) {
      const t = this.tasks.find((t) => t.id_todo === id_todo)
      if (t) t.status = status
    },
  },
})
