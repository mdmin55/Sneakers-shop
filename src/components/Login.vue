<template>
  <div class="flex justify-center items-center">
    <form @submit.prevent="login" class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-6 text-center">Войти</h2>
      <div class="mb-4">
        <label for="phone" class="block text-gray-700 text-sm font-bold mb-2"
          >Введите номер телефона:</label
        >
        <input
          type="text"
          id="phone"
          v-model="phone"
          placeholder="Номер телефона"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2"
          >Введите пароль:</label
        >
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Пароль"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
      >
        Войти
      </button>
      <p v-if="loginError" class="text-red-500 mt-4 text-center">Неверный логин или пароль</p>
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
    loginError.value = error.message
  }
}
</script>
