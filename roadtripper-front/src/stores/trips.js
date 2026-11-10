import { defineStore } from 'pinia'
import http from '@/services/api'

export const useTripsStore = defineStore('trips', {
  state: () => ({ categories: [], trips: [], tasks: [], loaded: false, error: '' }),
  actions: {
    async load() {
      const [{ data: trips }, { data: categories }] = await Promise.all([
        http.get('/trips'),
        http.get('/categories'),
      ])
      const tasks = await Promise.all(trips.map(async (trip) => {
        const { data } = await http.get('/trips/' + trip.id_trip + '/tasks')
        return data
      }))
      this.trips = trips
      this.categories = categories
      this.tasks = tasks.flat()
      this.loaded = true
    },
    tasksByTrip(id) {
      return this.tasks.filter((task) => task.id_trip === Number(id))
    },
    progress(id) {
      const tasks = this.tasksByTrip(id)
      return tasks.length ? Math.round(100 * tasks.filter((task) => task.status === 'Done').length / tasks.length) : 0
    },
    async addTrip(data, tasks = []) {
      await this.change(async () => {
        await http.post('/trips', {
          ...data,
          start_date: data.start_date || null,
          end_date: data.end_date || null,
          budget: data.budget === '' ? null : data.budget,
          currency: data.currency,
          tasks,
        })
        await this.load()
      })
    },
    async updateTrip(id, data) {
      await this.change(async () => {
        const { data: updated } = await http.put('/trips/' + id, {
          ...data,
          start_date: data.start_date || null,
          end_date: data.end_date || null,
          budget: data.budget === '' ? null : data.budget,
        })
        const trip = this.trips.find((item) => item.id_trip === id)
        if (trip) Object.assign(trip, updated)
      })
    },
    async deleteTrip(id) {
      await this.change(async () => {
        await http.delete('/trips/' + id)
        this.trips = this.trips.filter((trip) => trip.id_trip !== id)
        this.tasks = this.tasks.filter((task) => task.id_trip !== id)
      })
    },
    async addTask(tripId, title, category) {
      await this.change(async () => {
        const { data } = await http.post('/trips/' + tripId + '/tasks', {
          title, id_category: category || null,
        })
        this.tasks.push(data)
      })
    },
    async setStatus(id, status) {
      const task = this.tasks.find((item) => item.id_todo === id)
      if (!task) return
      await this.change(async () => {
        const { data } = await http.put('/trips/' + task.id_trip + '/tasks/' + id, { status })
        Object.assign(task, data)
      })
    },
    async deleteTask(id) {
      const task = this.tasks.find((item) => item.id_todo === id)
      if (!task) return
      await this.change(async () => {
        await http.delete('/trips/' + task.id_trip + '/tasks/' + id)
        this.tasks = this.tasks.filter((item) => item.id_todo !== id)
      })
    },
    async change(operation) {
      this.error = ''
      try {
        await operation()
      } catch (error) {
        this.error = error.response?.data?.message || 'Unable to save changes. Please try again.'
      }
    },
  },
})
