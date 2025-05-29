<script setup>
import { ref, provide, computed } from 'vue'
import Header from './components/Header.vue'
import Drawer from './components/Drawer.vue'
import Footer from './components/Footer.vue'

const cart = ref([])
const drawerOpen = ref(false)

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))

const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))

const closeDrawer = () => {
  drawerOpen.value = false
}

const openDrawer = () => {
  drawerOpen.value = true
}
const addToCart = (item) => {
  cart.value.push(item)
  item.isAdded = true
}
const removeFromCart = (item) => {
  cart.value.splice(cart.value.indexOf(item), 1)
  item.isAdded = false
}

provide('cart', {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart
})
</script>

<template>
  <Drawer v-if="drawerOpen" :totalPrice="totalPrice" :vatPrice="vatPrice" />
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <Header :total-price="totalPrice" @open-drawer="openDrawer" />
    <div class="md:p10 p-1">
      <router-view></router-view>
      <Footer />
    </div>
  </div>
</template>

<style scoped></style>
