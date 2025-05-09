import { defineStore } from 'pinia'
import router from '@/router'
import AuthService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as {
      token: string
      username: string
    } | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user?.token,
  },
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await AuthService.login(username, password)
        this.user = response
        localStorage.setItem('user', JSON.stringify(response))
        router.push({ name: 'posts' })
      } catch (error) {
        throw error
      }
    },
    async register(username: string, password: string) {
      try {
        await AuthService.register(username, password)
        // Optionally, auto-login after registration:
        // await this.login(username, password)
        // Or just notify user to login:
      } catch (error) {
        throw error
      }
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
      router.push({ name: 'auth' })
    },
  },
})
