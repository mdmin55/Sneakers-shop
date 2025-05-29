<script setup>
import { inject } from 'vue'
import { reactive, watch, ref, onMounted } from 'vue'
import CardList from '../components/CardList.vue'
import axios from 'axios'
const { cart, addToCart, removeFromCart } = inject('cart')
const items = ref([])

const filters = reactive({
  sortBy: 'title',
  searchQuery: ''
})

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value
}

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`https://05d681b6ec2b8d1f.mokky.dev/favorites`)
    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.item_id === item.id)

      if (!favorite) {
        return item
      }
      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id
      }
    })
  } catch (err) {
    console.log(err)
  }
}

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy
    }
    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`
    }
    const { data } = await axios.get(`https://05d681b6ec2b8d1f.mokky.dev/items`, {
      params
    })
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
const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        item_id: item.id
      }
      item.isFavorite = true
      const { data } = await axios.post(`https://05d681b6ec2b8d1f.mokky.dev/favorites`, obj)

      item.favoriteId = data.id
    } else {
      item.isFavorite = false
      await axios.delete(`https://05d681b6ec2b8d1f.mokky.dev/favorites/${item.favoriteId}`)

      item.favoriteId = null
    }
  } catch (err) {
    console.log(err)
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
  await fetchFavorites()
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
watch(filters, fetchItems)
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h2 class="text-2xl sm:text-3xl font-bold">Все кроссовки</h2>

      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <select
          @change="onChangeSelect"
          class="py-2 px-3 h-[42px] border rounded-md outline-none focus:border-gray-400 w-full sm:w-auto"
        >
          <option value="title">По названию</option>
          <option value="price">По цене (дешевые)</option>
          <option value="-price">По цене (дорогие)</option>
        </select>

        <div class="relative w-full sm:w-auto">
          <img class="absolute left-3 top-3 h-4 w-4" src="/search.svg" alt="Поиск" />
          <input
            @input="onChangeSearchInput"
            class="border rounded-md py-2 pl-10 pr-4 outline-none focus:border-gray-400 w-full"
            placeholder="Поиск..."
          />
        </div>
      </div>
    </div>

    <div class="mb-6 w-full overflow-hidden rounded-lg shadow-sm">
      <img src="/flaer.png" class="w-full h-auto object-cover" alt="Баннер акции" />
    </div>

    <div class="gap-6">
      <CardList :items="items" @addToFavorite="addToFavorite" @add-to-cart="onClickAddPlus" />
    </div>
  </div>
</template>
