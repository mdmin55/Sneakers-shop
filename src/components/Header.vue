<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
defineProps({
  totalPrice: Number
})

const emit = defineEmits(['openDrawer'])
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

onMounted(() => {
  authStore.loadUserData()
})
</script>

<template>
  <header class="bg-white border-b border-slate-300 px-4 py-4 md:px-10 md:py-8">
    <div class="container mx-auto flex justify-between items-center">
      <router-link to="/" class="flex items-center gap-2 md:gap-4">
        <img class="w-8 md:w-10" src="/logo.png" alt="Logo" />
        <div class="text-left">
          <h2 class="text-lg md:text-xl font-bold uppercase">YourSneak</h2>
          <p class="text-slate-500 text-sm hidden md:block">Магазин лучших кроссовок</p>
        </div>
      </router-link>
      <ul class="hidden xl:flex items-center gap-6 lg:gap-10">
        <li
          v-if="authStore.userData.id"
          @click="() => emit('openDrawer')"
          class="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black"
        >
          <img src="/cart.svg" alt="Cart" class="w-6 h-6" />
          <b>{{ totalPrice }} руб.</b>
        </li>
        <router-link v-if="authStore.userData.id" to="/Favorites">
          <li class="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black">
            <img src="/heart.svg" alt="Favorites" class="w-6 h-6" />
            <span class="text-black">Мои закладки</span>
          </li>
        </router-link>
        <router-link v-if="authStore.userData.id" to="/Shoplist">
          <li class="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black">
            <img src="/shoppbag.svg" alt="Orders" class="w-6 h-6" />
            <span class="text-black">Мои покупки</span>
          </li>
        </router-link>
        <router-link v-if="authStore.userData.id" :to="authStore.isAdmin() ? '/admin' : '/Profil'">
          <li class="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black">
            <img src="/userphoto.svg" alt="Profile" class="w-6 h-6" />
            <span class="text-black">Профиль</span>
          </li>
        </router-link>
        <router-link v-if="!authStore.userData.id" to="/Profil">
          <li class="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black">
            <span class="text-black">Авторизация</span>
          </li>
        </router-link>
      </ul>
      <div class="xl:hidden flex items-center">
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-500 focus:outline-none">
          <svg
            v-if="!mobileMenuOpen"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-show="mobileMenuOpen" class="md:hidden bg-white mt-2 pb-4 px-4 shadow-md rounded-b-lg">
        <ul class="flex flex-col gap-4">
          <li
            v-if="authStore.userData.id"
            @click="() => emit('openDrawer')"
            class="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black"
          >
            <img src="/cart.svg" alt="Cart" class="w-6 h-6" />
            <b>{{ totalPrice }} руб.</b>
          </li>
          <router-link
            v-if="authStore.userData.id"
            to="/Favorites"
            @click.native="mobileMenuOpen = false"
          >
            <li class="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black">
              <img src="/heart.svg" alt="Favorites" class="w-6 h-6" />
              <span>Мои закладки</span>
            </li>
          </router-link>
          <router-link
            v-if="authStore.userData.id"
            to="/Shoplist"
            @click.native="mobileMenuOpen = false"
          >
            <li class="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black">
              <img src="/shoppbag.svg" alt="Orders" class="w-6 h-6" />
              <span>Мои покупки</span>
            </li>
          </router-link>
          <router-link
            v-if="authStore.userData.id"
            :to="authStore.isAdmin() ? '/admin' : '/Profil'"
            @click.native="mobileMenuOpen = false"
          >
            <li class="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black">
              <img src="/userphoto.svg" alt="Profile" class="w-6 h-6" />
              <span>Профиль</span>
            </li>
          </router-link>
          <router-link
            v-if="!authStore.userData.id"
            to="/Profil"
            @click.native="mobileMenuOpen = false"
          >
            <li class="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black">
              <span>Авторизация</span>
            </li>
          </router-link>
        </ul>
      </div>
    </transition>
  </header>
</template>
