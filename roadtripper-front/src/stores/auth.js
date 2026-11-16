import { defineStore } from 'pinia'
import http from '@/services/api'
import { useTripsStore } from '@/stores/trips'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, avatar: undefined }),
  getters: {
    email: (state) => state.user?.email,
  },
  actions: {
    async register(email, password) {
      await http.post('/user', { email, password })
    },
    async login(email, password) {
      const { data } = await http.post('/user/login', { email, password })
      useTripsStore().$reset()
      this.avatar = undefined
      this.user = data
    },
    async restore() {
      try {
        const { data } = await http.get('/user/auth')
        if (this.user?.id_user !== data.id_user) {
          useTripsStore().$reset()
          this.avatar = undefined
        }
        this.user = data
      } catch (error) {
        this.user = null
        this.avatar = undefined
        useTripsStore().$reset()
        if (error.response?.status !== 401) throw error
      }
    },
    async changePassword(currentPassword, newPassword) {
      await http.put('/user/password', { currentPassword, newPassword })
    },
    async deleteAccount(currentPassword) {
      await http.delete('/user/account', { data: { currentPassword } })
      this.user = null
      this.avatar = undefined
      useTripsStore().$reset()
    },
    async logout() {
      await http.post('/user/logout')
      this.user = null
      this.avatar = undefined
      useTripsStore().$reset()
    },
  },
})
