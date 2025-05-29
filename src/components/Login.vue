<template>
  <div class="flex items-center justify-center p-4">
    <form
      @submit.prevent="login"
      class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md"
    >
      <h2 class="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Войти</h2>

      <div class="mb-4">
        <label for="phone" class="block text-gray-700 text-sm font-medium mb-2"
          >Номер телефона</label
        >
        <input
          type="text"
          id="phone"
          v-model="phone"
          placeholder="+7 (999) 999-99-99"
          required
          class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-medium mb-2">Пароль</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="••••••••"
          required
          class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <p v-if="loginError" class="text-red-500 text-sm text-center mb-4">{{ loginError }}</p>

      <button
        type="submit"
        class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md w-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Войти
      </button>
      <div class="mt-4 text-center space-y-2">
        <router-link to="/Register" class="text-sm text-green-600 hover:underline">
          Нет аккаунта? Зарегистрируйтесь
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const phone = ref('')
const password = ref('')
const loginError = ref(null)

async function login() {
  try {
    await authStore.login({ phone: phone.value, password: password.value })
    if (authStore.isAdmin()) {
      router.push('/admin')
    } else {
      router.push('/Profil')
    }
  } catch (error) {
    loginError.value = 'Неверный логин или пароль'
  }
}
</script>
