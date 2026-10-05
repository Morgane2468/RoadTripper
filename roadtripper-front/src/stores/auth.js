import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    email: localStorage.getItem('email') || null,
  }),
  actions: {
    login(email) {
      // TEMPORAIRE : sera remplacé par un appel API au Milestone 3
      this.token = 'fake-token'
      this.email = email
      localStorage.setItem('token', this.token)
      localStorage.setItem('email', email)
    },
    logout() {
      this.token = null
      this.email = null
      localStorage.removeItem('token')
      localStorage.removeItem('email')
    },
  },
})
