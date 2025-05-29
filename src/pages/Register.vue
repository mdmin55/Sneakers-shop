<template>
  <div class="flex justify-center items-center">
    <form @submit.prevent="submitForm" class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Регистрация</h2>
      <div class="mb-4">
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Имя Фамилия:</label>
        <input
          type="text"
          id="name"
          v-model="name"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="mb-4">
        <label for="address" class="block text-gray-700 text-sm font-bold mb-2">Адрес:</label>
        <input
          type="text"
          id="address"
          v-model="address"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="mb-4">
        <label for="phone" class="block text-gray-700 text-sm font-bold mb-2"
          >Номер телефона:</label
        >
        <input
          type="text"
          id="phone"
          v-model="phone"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Пароль:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
        />
      </div>
      <button
        type="submit"
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
      >
        Зарегистрироваться
      </button>
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
      <p class="text-center mt-4 text-black">
        Уже есть аккаунт?
        <router-link to="/login" custom v-slot="{ navigate }">
          <a @click="navigate" class="text-green-600 hover:text-green-500 cursor-pointer">
            Войти
          </a>
        </router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const name = ref('')
const email = ref('')
const address = ref('')
const phone = ref('')
const password = ref('')
const error = ref(null)
const submitForm = async () => {
  // Валидация полей
  if (!name.value || !email.value || !address.value || !phone.value || !password.value) {
    error.value = 'Все поля обязательны для заполнения'
    return
  }
  // Проверка длины пароля
  if (password.value.length < 6) {
    error.value = 'Пароль должен содержать не менее 6 символов'
    return
  }
  try {
    // Проверка, существует ли пользователь с таким email или телефоном
    const userExists = await authStore.checkUserExists(email.value, phone.value)
    if (userExists) {
      error.value =
        'Пользователь с таким email или телефоном уже существует. Пожалуйста, авторизуйтесь.'

      return
    }
    // Вызов метода регистрации из хранилища
    await authStore.register({
      name: name.value,
      email: email.value,
      address: address.value,
      phone: phone.value,
      password: password.value,
      isAdmin: false
    })
    // Очистка формы после успешной регистрации
    name.value = ''
    email.value = ''
    address.value = ''
    phone.value = ''
    password.value = ''
    // Перенаправление на страницу профиля
    router.push('/Profil')
  } catch (err) {
    // Обработка ошибок
    error.value = err.message || 'Ошибка при регистрации'
  }
}
</script>
