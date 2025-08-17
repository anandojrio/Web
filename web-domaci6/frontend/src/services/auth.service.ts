import axios from 'axios'

const API_URL = 'http://localhost:8080/api/auth'

// KLASA ZA AUTHORIZACIJU
// koristi auth.store.ts
class AuthService {
  async login(username: string, password: string) {
    const response = await axios.post(API_URL + '/login', { username, password })
    return response.data
  }

  async register(username: string, password: string) {
    return axios.post(API_URL + '/register', { username, password })
  }

  logout() {
    localStorage.removeItem('user')
  }
}

export default new AuthService()
