import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    login() {
      this.token = 'fake-token'
      localStorage.setItem('token', this.token)
    },
    logout() {
      this.token = null
      localStorage.removeItem('token')
    },
  },
})
