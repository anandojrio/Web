import { defineStore } from 'pinia'
import router from '@/router'
import AuthService from '@/services/auth.service'

// da bih koristio piniu za authentikaciju

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
        // moze da se automatski uloguje, ako treba
        // await this.login(username, password)
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
