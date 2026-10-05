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
  },
})
