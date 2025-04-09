<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
defineProps({
  totalPrice: Number
})

const emit = defineEmits(['openDrawer'])

const authStore = useAuthStore()
onMounted(() => {
  authStore.loadUserData()
})
</script>

<template>
  <header class="flex justify-between border-b border-slate-300 px-10 py-8">
    <router-link to="/">
      <div class="flex items-center gap-4">
        <img class="w-10" src="/logo.png" alt="Logo" />
        <dir>
          <h2 class="text-xl font-bold uppercase">YourSneak</h2>
          <p class="text-slate-500">Магазин лучших кроссовок</p>
        </dir>
      </div>
    </router-link>

    <ul class="flex items-center gap-10">
      <li
        v-if="authStore.userData.id"
        @click="() => emit('openDrawer')"
        class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black"
      >
        <img src="/cart.svg" alt="Cart" />
        <b>{{ totalPrice }} руб.</b>
      </li>
      <router-link v-if="authStore.userData.id" to="/Favorites">
        <li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
          <img src="/heart.svg" alt="Cart" />
          <span class="text-black">Мои закладки</span>
        </li>
      </router-link>
      <router-link v-if="authStore.userData.id" to="/Shoplist">
        <li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
          <img src="/shoppbag.svg" alt="Cart" />
          <span class="text-black">Мои покупки</span>
        </li>
      </router-link>

      <router-link v-if="authStore.userData.id" :to="authStore.isAdmin() ? '/admin' : '/Profil'">
        <li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
          <img src="/userphoto.svg" alt="Cart" />
          <span class="text-black">Профиль</span>
        </li>
      </router-link>
      <router-link v-if="!authStore.userData.id" to="/Profil">
        <li class="flex items-center gap-3 cursor-pointer text-gray-500 hover:text-black">
          <span class="text-black">Авторизация</span>
        </li>
      </router-link>
    </ul>
  </header>
</template>
