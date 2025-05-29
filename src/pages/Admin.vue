<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import axios from 'axios'

const productsData = ref([])
const ordersData = ref([])

const router = useRouter()
const authStore = useAuthStore()
onMounted(() => {
  if (!authStore.isAdmin()) {
    router.push('/')
  }
})

const filters = ref('')
const visibleModalItems = ref(false)
const visibleModalOrders = ref(false)
const visibleDeleteConfirm = ref(false)
const visibleEditModal = ref(false)
const activeTab = ref('products')
const selectedOrder = ref(null)
const productIdToDelete = ref(null)
const selectedProduct = ref(null)

const getProducts = async () => {
  try {
    const { data: products } = await axios.get(`https://05d681b6ec2b8d1f.mokky.dev/items`)
    productsData.value = products
  } catch (err) {
    console.error('Ошибка при загрузке товаров:', err)
  }
}

const getOrders = async () => {
  try {
    const { data: orders } = await axios.get(
      `https://05d681b6ec2b8d1f.mokky.dev/orders?_relations=users`
    )
    ordersData.value = orders
  } catch (err) {
    console.error('Ошибка при загрузке заказов:', err)
  }
}

const setActiveTab = (tabKey) => {
  activeTab.value = tabKey
  if (tabKey === 'products' && productsData.value.length === 0) {
    getProducts()
  } else if (tabKey === 'orders' && ordersData.value.length === 0) {
    getOrders()
  }
}

onMounted(() => {
  setActiveTab('products')
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newProduct.value.file = file
  }
}

const newProduct = ref({
  title: '',
  price: 0,
  imageUrl: '',
  file: null
})

const editProductData = ref({
  id: null,
  title: '',
  price: 0,
  imageUrl: '',
  file: null
})

const createProduct = async () => {
  try {
    if (newProduct.value.file) {
      const formData = new FormData()
      formData.append('file', newProduct.value.file)
      const res = await fetch('https://05d681b6ec2b8d1f.mokky.dev/uploads', {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        const uploadData = await res.json()
        newProduct.value.imageUrl = uploadData.url
      } else {
        console.error('Ошибка при загрузке файла:', res.statusText)
        return
      }
    }
    await axios.post(`https://05d681b6ec2b8d1f.mokky.dev/items`, newProduct.value)
    getProducts()
    visibleModalItems.value = false
    newProduct.value = { title: '', price: 0, imageUrl: '', file: null }
  } catch (err) {
    console.error('Ошибка при создании товара:', err)
  }
}

const editProduct = async () => {
  try {
    const productId = editProductData.value.id
    let updateData = {
      title: editProductData.value.title,
      price: editProductData.value.price
    }
    await axios.patch(`https://05d681b6ec2b8d1f.mokky.dev/items/${productId}`, updateData)
    getProducts()
    visibleEditModal.value = false
    editProductData.value = { id: null, title: '', price: 0, imageUrl: '', file: null }
  } catch (err) {
    console.error('Ошибка при редактировании товара:', err)
  }
}

const deleteProduct = async () => {
  try {
    await axios.delete(`https://05d681b6ec2b8d1f.mokky.dev/items/${productIdToDelete.value}`)
    getProducts()
    visibleDeleteConfirm.value = false
  } catch (err) {
    console.error('Ошибка при удалении товара:', err)
  }
}

const confirmOrder = async () => {
  try {
    await axios.patch(`https://05d681b6ec2b8d1f.mokky.dev/orders/${selectedOrder.value.id}`, {
      status: 'confirmed'
    })
    getOrders()
    visibleModalOrders.value = false
  } catch (err) {
    console.error('Ошибка при подтверждении заказа:', err)
  }
}

const declineOrder = async () => {
  try {
    await axios.patch(`https://05d681b6ec2b8d1f.mokky.dev/orders/${selectedOrder.value.id}`, {
      status: 'decline'
    })
    getOrders()
    visibleModalOrders.value = false
  } catch (err) {
    console.error('Ошибка при отказе от заказа:', err)
  }
}

const openOrderDetails = (order) => {
  selectedOrder.value = order
  visibleModalOrders.value = true
}

const closeOrderDetails = () => {
  selectedOrder.value = null
  visibleModalOrders.value = false
}

const openDeleteConfirm = (productId) => {
  productIdToDelete.value = productId
  visibleDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
  productIdToDelete.value = null
  visibleDeleteConfirm.value = false
}

const openEditModal = (product) => {
  selectedProduct.value = product
  editProductData.value = {
    id: product.id,
    title: product.title,
    price: product.price,
    imageUrl: product.imageUrl,
    file: null
  }
  visibleEditModal.value = true
}

const logout = () => {
  authStore.logout()
  router.push('/')
}

const filteredProducts = computed(() => {
  if (!filters.value) return productsData.value
  return productsData.value.filter(
    (product) =>
      product.title.toLowerCase().includes(filters.value.toLowerCase()) ||
      product.price.toString().includes(filters.value)
  )
})

const filteredOrders = computed(() => {
  if (!filters.value) return ordersData.value
  return ordersData.value.filter(
    (order) =>
      order.id.toString().includes(filters.value) ||
      order.user.name.toLowerCase().includes(filters.value.toLowerCase()) ||
      order.totalPrice.toString().includes(filters.value)
  )
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Панель администратора</h2>
      <button
        @click="logout"
        class="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm"
      >
        Выйти
      </button>
    </div>
    <div class="flex flex-col mb-4">
      <div class="flex border-b border-gray-200">
        <button
          v-for="tab in ['products', 'orders']"
          :key="tab"
          :class="{
            'border-b-2 border-blue-500 text-blue-600': activeTab === tab,
            'text-gray-500 hover:text-gray-700': activeTab !== tab
          }"
          @click="setActiveTab(tab)"
          class="py-2 px-4 font-medium text-sm flex-1 text-center"
        >
          {{ tab === 'products' ? 'Товары' : 'Заказы' }}
        </button>
      </div>
    </div>

    <button
      v-if="activeTab === 'products'"
      @click="visibleModalItems = true"
      class="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm"
    >
      Создать товар
    </button>

    <div class="mb-4">
      <input
        v-model="filters"
        type="text"
        placeholder="Поиск..."
        class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="activeTab === 'products' && filteredProducts.length > 0">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="border-b border-gray-200 p-4"
        >
          <div class="flex flex-col md:flex-row xs:text-center items-start gap-4">
            <img
              :src="product.imageUrl"
              :alt="product.title"
              class="w-16 h-16 object-cover rounded"
            />
            <div class="flex-1 space-y-2">
              <h3 class="font-medium text-black text-lg">{{ product.title }}</h3>
              <p class="text-gray-600">{{ product.price }} руб.</p>

              <div class="flex flex-wrap gap-2 mt-2">
                <button
                  @click="openEditModal(product)"
                  class="text-blue-500 text-sm py-1 px-3 rounded border border-blue-500 hover:bg-blue-50 transition w-full sm:w-auto"
                >
                  Редактировать
                </button>
                <button
                  @click="openDeleteConfirm(product.id)"
                  class="text-red-500 text-sm py-1 px-3 rounded border border-red-500 hover:bg-red-50 transition w-full sm:w-auto"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'orders' && filteredOrders.length > 0">
        <div v-for="order in filteredOrders" :key="order.id" class="border-b border-gray-200 p-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium text-black">Заказ #{{ order.id }}</h3>
              <p class="text-gray-600">{{ order.user.name }}</p>
              <p class="font-medium">{{ order.totalPrice }} руб.</p>
              <span
                :class="{
                  'text-green-500': order.status === 'confirmed',
                  'text-red-500': order.status === 'decline',
                  'text-yellow-500': order.status === 'unconfirmed'
                }"
                class="text-sm"
              >
                {{ order.status === 'unconfirmed' ? 'Ожидает' : '' }}
                {{ order.status === 'confirmed' ? 'Подтверждён' : '' }}
                {{ order.status === 'decline' ? 'Отменён' : '' }}
              </span>
            </div>
            <button
              @click="openOrderDetails(order)"
              class="text-blue-500 text-sm py-1 px-2 rounded border border-blue-500 hover:bg-blue-50"
            >
              Подробнее
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="
          (activeTab === 'products' && filteredProducts.length === 0) ||
          (activeTab === 'orders' && filteredOrders.length === 0)
        "
        class="p-8 text-center text-gray-500"
      >
        Нет данных для отображения
      </div>
    </div>
    <div
      v-if="visibleModalItems"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-black">Создание товара</h3>
        </div>
        <form @submit.prevent="createProduct" class="p-4">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1 text-black">Название</label>
            <input
              v-model="newProduct.title"
              type="text"
              required
              class="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1 text-black">Цена</label>
            <input
              v-model.number="newProduct.price"
              type="number"
              required
              class="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1 text-black">Изображение</label>
            <input type="file" @change="handleFileUpload" accept="image/*" class="w-full text-sm" />
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              @click="visibleModalItems = false"
              class="px-4 py-2 border border-gray-300 rounded text-sm text-black"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
    <div
      v-if="visibleEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-black">Редактирование товара</h3>
        </div>
        <form @submit.prevent="editProduct" class="p-4">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1 text-black">Название</label>
            <input
              v-model="editProductData.title"
              type="text"
              required
              class="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1 text-black">Цена</label>
            <input
              v-model.number="editProductData.price"
              type="number"
              required
              class="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              @click="visibleEditModal = false"
              class="px-4 py-2 border border-gray-300 rounded text-sm text-black"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
    <div
      v-if="visibleDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-black">Подтверждение удаления</h3>
        </div>
        <div class="p-4">
          <p>Вы уверены, что хотите удалить этот товар?</p>
        </div>
        <div class="flex justify-end space-x-2 p-4 border-t border-gray-200">
          <button
            @click="closeDeleteConfirm"
            class="px-4 py-2 border border-gray-300 rounded text-sm text-black"
          >
            Отмена
          </button>
          <button
            @click="deleteProduct"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="visibleModalOrders"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 class="text-lg font-medium text-black">Детали заказа</h3>
        </div>
        <div class="p-4">
          <div v-if="selectedOrder" class="space-y-4">
            <div>
              <h4 class="font-medium">Пользователь:</h4>
              <p>{{ selectedOrder.user.name }}</p>
            </div>
            <div>
              <h4 class="font-medium">Сумма:</h4>
              <p>{{ selectedOrder.totalPrice }} руб.</p>
            </div>
            <div>
              <h4 class="font-medium">Статус:</h4>
              <p
                :class="{
                  'text-green-500': selectedOrder.status === 'confirmed',
                  'text-red-500': selectedOrder.status === 'decline',
                  'text-yellow-500': selectedOrder.status === 'unconfirmed'
                }"
              >
                {{ selectedOrder.status === 'unconfirmed' ? 'Ожидает подтверждения' : '' }}
                {{ selectedOrder.status === 'confirmed' ? 'Подтверждён' : '' }}
                {{ selectedOrder.status === 'decline' ? 'Отменён' : '' }}
              </p>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <h4 class="font-medium mb-2">Товары:</h4>
              <div
                v-for="item in selectedOrder.items"
                :key="item.id"
                class="flex items-start mb-4 pb-4 border-b border-gray-100"
              >
                <img
                  :src="item.imageUrl"
                  :alt="item.title"
                  class="w-16 h-16 object-cover rounded mr-3"
                />
                <div>
                  <h5 class="font-medium">{{ item.title }}</h5>
                  <p class="text-gray-600">{{ item.price }} руб.</p>
                </div>
              </div>
            </div>

            <div class="flex space-x-2 pt-4">
              <button
                @click="confirmOrder"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-sm"
              >
                Подтвердить
              </button>
              <button
                @click="declineOrder"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm"
              >
                Отказать
              </button>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-200">
          <button
            @click="closeOrderDetails"
            class="w-full py-2 border border-gray-300 rounded text-sm text-black"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* p {
  color: black !important;
}
</style>
