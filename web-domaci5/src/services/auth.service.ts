// src/services/auth.service.ts
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/auth/'

class AuthService {
  async login(username: string, password: string) {
    const response = await axios.post(API_URL + 'login', {
      username,
      password,
    })

    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
  }

  logout() {
    localStorage.removeItem('user')
  }

  async register(username: string, password: string) {
    return axios.post(API_URL + 'register', {
      username,
      password,
    })
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  }

  getToken() {
    const user = this.getCurrentUser()
    return user?.token
  }
}

export default new AuthService()
