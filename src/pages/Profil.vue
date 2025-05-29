<template>
  <div class="p-4 sm:p-6 max-w-2xl mx-auto">
    <h1 v-if="authStore.isLoggedIn" class="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
      Профиль
    </h1>
    <div v-if="!authStore.isLoggedIn">
      <Register />
    </div>

    <div v-else class="bg-white shadow-md rounded-lg p-5 sm:p-6 space-y-6">
      <div class="space-y-3 text-sm sm:text-base text-gray-700">
        <p><span class="font-medium">Имя Фамилия:</span> {{ authStore.userData.name }}</p>
        <p><span class="font-medium">Адрес:</span> {{ authStore.userData.address }}</p>
        <p>
          <span class="font-medium">Номер телефона:</span>
          {{ formatPhoneNumber(authStore.userData.phone) }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
        <button
          @click="openEdit"
          class="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded transition duration-200 text-sm sm:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 sm:w-5 h-4 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <span>Редактировать</span>
        </button>

        <button
          @click="logout"
          class="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded transition duration-200 text-sm sm:text-base"
        >
          Выйти
        </button>
      </div>
    </div>

    <div v-if="isEditing" class="fixed inset-0 z-50 overflow-y-auto sm:hidden">
      <div
        class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="cancelEdit"></div>
        </div>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Редактирование профиля</h3>

            <div class="space-y-4">
              <div>
                <label for="mobile-name" class="block text-sm font-medium text-gray-700 mb-1"
                  >Имя Фамилия</label
                >
                <input
                  type="text"
                  id="mobile-name"
                  v-model="editableProfileData.name"
                  class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 text-sm"
                />
              </div>

              <div>
                <label for="mobile-address" class="block text-sm font-medium text-gray-700 mb-1"
                  >Адрес</label
                >
                <input
                  type="text"
                  id="mobile-address"
                  v-model="editableProfileData.address"
                  class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 text-sm"
                />
              </div>

              <div>
                <label for="mobile-phone" class="block text-sm font-medium text-gray-700 mb-1"
                  >Номер телефона</label
                >
                <input
                  type="tel"
                  id="mobile-phone"
                  v-model="editableProfileData.phone"
                  placeholder="+7 (999) 999-99-99"
                  class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
            <button
              type="button"
              @click="saveProfile"
              class="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition text-sm"
            >
              Сохранить
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="mt-2 sm:mt-0 w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition text-sm"
            >
              Отменить
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isEditing && !isMobile" class="mt-6 space-y-4 hidden sm:block">
      <div>
        <label for="name" class="block text-sm sm:text-base font-medium text-gray-700 mb-1"
          >Имя Фамилия</label
        >
        <input
          type="text"
          id="name"
          v-model="editableProfileData.name"
          class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 sm:p-2.5 text-sm sm:text-base"
        />
      </div>

      <div>
        <label for="address" class="block text-sm sm:text-base font-medium text-gray-700 mb-1"
          >Адрес</label
        >
        <input
          type="text"
          id="address"
          v-model="editableProfileData.address"
          class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 sm:p-2.5 text-sm sm:text-base"
        />
      </div>

      <div>
        <label for="phone" class="block text-sm sm:text-base font-medium text-gray-700 mb-1"
          >Номер телефона</label
        >
        <input
          type="tel"
          id="phone"
          v-model="editableProfileData.phone"
          placeholder="+7 (999) 999-99-99"
          class="w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 p-2 sm:p-2.5 text-sm sm:text-base"
        />
      </div>

      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
        <button
          @click="saveProfile"
          class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition text-sm sm:text-base"
        >
          Сохранить
        </button>
        <button
          @click="cancelEdit"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition text-sm sm:text-base"
        >
          Отменить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import Register from './Register.vue'
import axios from 'axios'

const authStore = useAuthStore()
const isEditing = ref(false)
const editableProfileData = ref({ ...authStore.userData })

const isMobile = computed(() => window.innerWidth < 640)

const openEdit = () => {
  isEditing.value = true
  if (isMobile.value) {
    document.body.style.overflow = 'hidden'
  }
}

onMounted(() => {
  authStore.loadUserData()
  editableProfileData.value = { ...authStore.userData }
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  if (!isMobile.value && isEditing.value) {
    document.body.style.overflow = ''
  }
}

const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/)
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`
  }
  return phone
}

const saveProfile = async () => {
  try {
    console.log('Сохраняем профиль:', editableProfileData.value)
    localStorage.setItem('userData', JSON.stringify(editableProfileData.value))
    authStore.userData = editableProfileData.value

    await axios.patch(`https://05d681b6ec2b8d1f.mokky.dev/users/ ${editableProfileData.value.id}`, {
      address: editableProfileData.value.address,
      phone: editableProfileData.value.phone,
      name: editableProfileData.value.name
    })

    isEditing.value = false
    document.body.style.overflow = ''
    alert('Профиль успешно обновлен!')
  } catch (error) {
    console.error('Ошибка при сохранении профиля:', error)
    alert('Не удалось сохранить профиль. Попробуйте снова.')
  }
}

const cancelEdit = () => {
  editableProfileData.value = { ...authStore.userData }
  isEditing.value = false
  document.body.style.overflow = ''
}

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>
