// Store Pinia des voyages et des tâches.
// Les données sont sauvegardées dans le navigateur (localStorage) en attendant le back-end (Milestone 3).
import { defineStore } from 'pinia'
import mock from '@/mock/data.json'

const STORAGE_KEY = 'roadtripper-data'

// Donne le prochain id libre d'une liste, ex. nextId(trips, 'id_trip')
function nextId(list, field) {
  const ids = list.map((item) => item[field])
  return ids.length ? Math.max(...ids) + 1 : 1
}

export const useTripsStore = defineStore('trips', {
  state: () => {
    // null si rien n'a encore été sauvegardé 
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return {
      categories: mock.categories,
      trips: saved ? saved.trips : mock.trips,
      tasks: saved ? saved.tasks : mock.tasks,
    }
  },

  actions: {
    // Sauvegarde dans le navigateur (appelée après chaque modification)
    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ trips: this.trips, tasks: this.tasks }))
    },

    // Tâches d'un voyage
    tasksByTrip(id_trip) {
      return this.tasks.filter((task) => task.id_trip === Number(id_trip))
    },

    // Pourcentage de tâches terminées (Done) d'un voyage
    progress(id_trip) {
      const tasks = this.tasksByTrip(id_trip)
      if (tasks.length === 0) return 0
      const done = tasks.filter((task) => task.status === 'Done').length
      return Math.round((done / tasks.length) * 100)
    },

    // data = champs du formulaire, tasks = tâches suggérées gardées par l'utilisateur
    addTrip(data, tasks = []) {
      const name = data.name.trim()
      if (!name) return

      const id_trip = nextId(this.trips, 'id_trip')
      this.trips.push({
        id_trip,
        id_user: 1,
        name,
        trip_type: data.trip_type,
        destination: data.destination.trim(),
        start_date: data.start_date,
        end_date: data.end_date,
        travelers: Number(data.travelers) || 1,
        budget: data.budget === '' ? null : Number(data.budget),
        transport: data.transport,
        visibility: data.visibility,
        description: data.description.trim(),
      })

      tasks.forEach((task) => this.addTask(id_trip, task.title, task.id_category))
      this.save()
    },

    // Supprime le voyage et toutes ses tâches
    deleteTrip(id_trip) {
      this.trips = this.trips.filter((trip) => trip.id_trip !== id_trip)
      this.tasks = this.tasks.filter((task) => task.id_trip !== id_trip)
      this.save()
    },

    addTask(id_trip, title, id_category) {
      const cleanTitle = title.trim()
      if (!cleanTitle) return

      this.tasks.push({
        id_todo: nextId(this.tasks, 'id_todo'),
        id_trip: Number(id_trip),
        id_category: id_category ? Number(id_category) : null,
        title: cleanTitle,
        status: 'To Do',
      })
      this.save()
    },

    // Change le statut d'une tâche : 'To Do', 'Doing' ou 'Done'
    setStatus(id_todo, status) {
      const task = this.tasks.find((task) => task.id_todo === id_todo)
      if (task) {
        task.status = status
        this.save()
      }
    },

    deleteTask(id_todo) {
      this.tasks = this.tasks.filter((task) => task.id_todo !== id_todo)
      this.save()
    },
  },
})
