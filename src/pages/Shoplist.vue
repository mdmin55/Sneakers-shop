<template>
  <h1 class="text-3xl font-bold mb-8">Мои покупки</h1>
  <div class="text-gray-700"></div>
  <div v-if="loading">Загрузка...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div v-for="order in orders" :key="order.id" class="order text-black">
      <!-- <pre class="text-black">{{ order }}</pre> -->
      <p>Заказ #{{ order?.id }}</p>
      <p>Дата: {{ new Date(order?.date).toLocaleDateString() }}</p>
      <p>Сумма: {{ order?.totalPrice }} руб.</p>
      <p v-if="order?.status == 'unconfirmed'">
        Cтатус: {{ order?.status == 'unconfirmed' ? 'Ожидает подтверждения' : '' }}
      </p>
      <p v-if="order?.status == 'confirmed'">
        Cтатус: {{ order?.status == 'confirmed' ? 'Подтверждён' : '' }}
      </p>
      <p v-if="order?.status == 'decline'">
        Cтатус: {{ order?.status == 'decline' ? 'Отменён' : '' }}
      </p>
      <ul>
        <li class="text-black" v-for="item in order.items" :key="item.id">
          {{ item.title }} - {{ item.quantity }} шт. x {{ item.price }} руб.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import axios from 'axios'

const authStore = useAuthStore()
const orders = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    authStore.loadUserData()
    const data = await fetchUserOrders(authStore.userData.id)
    orders.value = data
  } catch (err) {
    error.value = 'Не удалось загрузить заказы'
  } finally {
    loading.value = false
  }
})

async function fetchUserOrders(userId) {
  try {
    const response = await axios.get(
      `https://05d681b6ec2b8d1f.mokky.dev/orders?user_id=${userId}&_relations=users`
    )
    return response.data
  } catch (error) {
    console.error('Ошибка при загрузке заказов:', error)
    throw error
  }
}
</script>

<style scoped>
.order {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
