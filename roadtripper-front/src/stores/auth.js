// Store Pinia de l'authentification : garde le token et l'email de l'utilisateur connecté.
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    email: localStorage.getItem('email'),
  }),

  actions: {
    login(email) {
      // TEMPORAIRE : au Milestone 3, le token viendra de l'API Node.js
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
