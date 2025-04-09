import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    userData: {},
    isRegistering: false,
    userId: null,
    registerError: null,
    loginError: null
  }),
  actions: {
    async register(userData) {
      try {
        this.isRegistering = true
        this.registerError = null

        const userExists = await this.checkUserExists(userData.password, userData.phone)
        if (userExists) {
          this.registerError = 'Пользователь с такими данными уже существует'
          throw new Error(this.registerError)
        }

        const { data } = await axios.post(`https://05d681b6ec2b8d1f.mokky.dev/users`, userData)

        this.userData = data
        this.userId = data.id
        this.isLoggedIn = true

        localStorage.setItem('userData', JSON.stringify(data))
        localStorage.setItem('isLoggedIn', true)
      } catch (error) {
        console.error('Ошибка при регистрации:', error)
        if (error.response) {
          this.registerError = error.response.data.message || 'Ошибка при регистрации'
        } else {
          this.registerError = error.message || 'Сервер не отвечает'
        }
        throw new Error(this.registerError)
      } finally {
        this.isRegistering = false
      }
    },

    async login(credentials) {
      try {
        const response = await axios.post('https://05d681b6ec2b8d1f.mokky.dev/auth', credentials)

        this.userData = response.data.data
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('userData', JSON.stringify(response.data.data))
        localStorage.setItem('isLoggedIn', true)

        this.isLoggedIn = true

        if (!response.data.data) {
          throw new Error('Пользователь с такими данными не найден')
        }

        return response.data
      } catch (error) {
        console.error('Error during login:', error.response?.data || error.message)
        throw error
      }
    },

    async checkUserExists(password, phone) {
      try {
        const { data } = await axios.get(`https://05d681b6ec2b8d1f.mokky.dev/users`)
        console.log(data.data)
        return data.some((user) => user.password === password || user.phone === phone)
      } catch (error) {
        console.error('Ошибка при проверке пользователя:', error)
        throw new Error('Ошибка при проверке пользователя')
      }
    },

    isAdmin() {
      return this.userData.isAdmin
    },

    logout() {
      this.isLoggedIn = false
      this.userData = {}
      this.userId = null
      localStorage.removeItem('userData')
      localStorage.removeItem('isLoggedIn')
    },

    loadUserData() {
      const storedUserData = localStorage.getItem('userData')
      const storedIsLoggedIn = localStorage.getItem('isLoggedIn')
      if (storedUserData && storedIsLoggedIn) {
        this.userData = JSON.parse(storedUserData)
        this.isLoggedIn = true
      }
    }
  }
})
