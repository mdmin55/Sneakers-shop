<script setup>
import { inject } from 'vue'
import { watch, ref, onMounted } from 'vue'
import axios from 'axios'
import CardList from '../components/CardList.vue'

const { cart, addToCart, removeFromCart } = inject('cart')
const items = ref([])

const favorites = ref([])
onMounted(async () => {
  try {
    const { data } = await axios.get(
      'https://05d681b6ec2b8d1f.mokky.dev/favorites?_relations=items'
    )
    favorites.value = data.map((obj) => obj.item)
  } catch (err) {
    console.log(err)
  }
})
const fetchItems = async () => {
  try {
    const { data } = await axios.get(`https://05d681b6ec2b8d1f.mokky.dev/items`)
    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false
    }))
  } catch (err) {
    console.log(err)
  }
}

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false
  }))
})
onMounted(async () => {
  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []
  await fetchItems()
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
})
watch(
  cart,
  () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  },
  { deep: true }
)
</script>

<template>
  <h1 class="text-3xl font-bold mb-8">Мои закладки</h1>

  <CardList :items="favorites" @add-to-cart="onClickAddPlus" />
</template>
