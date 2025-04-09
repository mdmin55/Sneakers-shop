<template>
  <div class="p-6">
    <h1 v-if="authStore.isLoggedIn" class="text-3xl font-bold mb-8">Профиль</h1>

    <div v-if="!authStore.isLoggedIn">
      <Register />
    </div>
    <div v-else>
      <p class="text-[#9A9A9A]">Имя Фамилия: {{ authStore.userData.name }}</p>
      <p class="text-[#9A9A9A]">Адрес: {{ authStore.userData.address }}</p>
      <p class="text-[#9A9A9A]">Номер телефона: {{ authStore.userData.phone }}</p>

      <button
        @click="isEditing = true"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Редактировать данные
      </button>

      <button
        @click="logout"
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4"
      >
        Выйти
      </button>
      <div v-if="isEditing" class="mt-4">
        <!-- Форма редактирования профиля -->
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Имя Фамилия:</label>
        <input
          type="text"
          id="name"
          v-model="editableProfileData.name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
        />

        <label for="address" class="block text-gray-700 text-sm font-bold mb-2">Адрес:</label>
        <input
          type="text"
          id="address"
          v-model="editableProfileData.address"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
        />

        <label for="phone" class="block text-gray-700 text-sm font-bold mb-2"
          >Номер телефона:</label
        >
        <input
          type="text"
          id="phone"
          v-model="editableProfileData.phone"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
        />

        <button
          @click="saveProfile"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Сохранить
        </button>
        <button
          @click="cancelEdit"
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Отменить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import Register from './Register.vue'
import axios from 'axios'

const authStore = useAuthStore()

const isEditing = ref(false)

const editableProfileData = ref({ ...authStore.userData })

onMounted(() => {
  authStore.loadUserData()
  editableProfileData.value = { ...authStore.userData }
})

const saveProfile = async () => {
  try {
    console.log('Сохраняем профиль:', editableProfileData.value)
    localStorage.setItem('userData', JSON.stringify(editableProfileData.value))
    authStore.userData = editableProfileData.value
    await axios.patch(`https://05d681b6ec2b8d1f.mokky.dev/users/${editableProfileData.value.id}`, {
      address: editableProfileData.value.address,
      phone: editableProfileData.value.phone,
      name: editableProfileData.value.name
    })
    isEditing.value = false
    alert('Профиль успешно обновлен!')
  } catch (error) {
    console.error('Ошибка при сохранении профиля:', error)
    alert('Не удалось сохранить профиль. Попробуйте снова.')
  }
}

// Отмена редактирования
const cancelEdit = () => {
  editableProfileData.value = { ...authStore.userData }
  isEditing.value = false
}

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>
