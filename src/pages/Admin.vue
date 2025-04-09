<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
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
// Фильтры для таблиц
const filters = ref({
  global: { value: null, matchMode: 'contains' }
})

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

// Загрузка данных для заказов
const getOrders = async () => {
  try {
    const { data: orders } = await axios.get(
      `https://05d681b6ec2b8d1f.mokky.dev/orders?_relations=users`
    ) // URL для заказов
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

// Загрузка данных при монтировании компонента
onMounted(() => {
  setActiveTab('products') // По умолчанию загружаем данные для товаров
})

const handleFileUpload = (event) => {
  const file = event.files[0]
  console.log(file)
  if (file) {
    newProduct.value.file = file
  }
}

// Данные для создания нового товара
const newProduct = ref({
  title: '',
  price: 0,
  imageUrl: '',
  file: null
})

// Данные для редактирования товара
const editProductData = ref({
  id: null,
  title: '',
  price: 0,
  imageUrl: '',
  file: null
})

// Создание нового товара
const createProduct = async () => {
  try {
    if (newProduct.value.file) {
      console.log(newProduct.value.file)
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
    // Создание товара
    await axios.post(`https://05d681b6ec2b8d1f.mokky.dev/items`, newProduct.value)
    getProducts()
    visibleModalItems.value = false
    newProduct.value = { title: '', price: 0, imageUrl: '', file: null }
  } catch (err) {
    console.error('Ошибка при создании товара:', err)
  }
}

// Редактирование товара
const editProduct = async () => {
  try {
    const productId = editProductData.value.id
    let updateData = {
      title: editProductData.value.title,
      price: editProductData.value.price
    }
    // Обновление товара
    await axios.patch(`https://05d681b6ec2b8d1f.mokky.dev/items/${productId}`, updateData)
    getProducts()
    visibleEditModal.value = false
    editProductData.value = { id: null, title: '', price: 0, imageUrl: '', file: null }
  } catch (err) {
    console.error('Ошибка при редактировании товара:', err)
  }
}

// Удаление товара
const deleteProduct = async () => {
  try {
    await axios.delete(`https://05d681b6ec2b8d1f.mokky.dev/items/${productIdToDelete.value}`)
    getProducts()
    visibleDeleteConfirm.value = false
  } catch (err) {
    console.error('Ошибка при удалении товара:', err)
  }
}

// Подтверждение заказа
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

// Отказ от заказа
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

// Открытие модального окна просмотра состава заказа
const openOrderDetails = (order) => {
  selectedOrder.value = order
  visibleModalOrders.value = true
}

// Закрытие модального окна просмотра состава заказа
const closeOrderDetails = () => {
  selectedOrder.value = null
  visibleModalOrders.value = false
}

// Открытие модального окна подтверждения удаления
const openDeleteConfirm = (productId) => {
  productIdToDelete.value = productId
  visibleDeleteConfirm.value = true
}

// Закрытие модального окна подтверждения удаления
const closeDeleteConfirm = () => {
  productIdToDelete.value = null
  visibleDeleteConfirm.value = false
}

// Открытие модального окна редактирования товара
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
</script>

<template>
  <div>
    <h2 class="mb-2">Панель администратора</h2>
    <!-- Табы -->
    <div class="tabs flex align-center gap-2 justify-between">
      <div class="flex align-center gap-2">
        <button
          v-for="tab in ['products', 'orders']"
          :key="tab"
          :class="{ active: activeTab === tab }"
          @click="setActiveTab(tab)"
        >
          {{ tab === 'products' ? 'Управление товарами' : 'Управление заказами' }}
        </button>
      </div>
      <button
        v-if="activeTab == 'products'"
        class="tabs"
        label="Show"
        @click="visibleModalItems = true"
      >
        Создать товар
      </button>
    </div>

    <div class="tab-content mt-4">
      <div v-if="activeTab === 'products'">
        <h1>Список товаров</h1>
        <DataTable
          :value="productsData"
          :paginator="true"
          :rows="5"
          :filters="filters"
          filterDisplay="menu"
        >
          <template #header>
            <div class="flex justify-content-between items-center gap-2">
              <span>Товары</span>
              <InputText v-model="filters['global'].value" placeholder="Поиск" />
            </div>
          </template>
          <Column field="id" header="ID" sortable></Column>
          <Column header="Фото">
            <template #body="slotProps">
              <img
                :src="slotProps.data.imageUrl"
                :alt="slotProps.data.title"
                class="w-24 rounded"
              />
            </template>
          </Column>
          <Column field="title" header="Название" sortable></Column>
          <Column field="price" header="Цена" sortable></Column>
          <Column header="Действия">
            <template #body="slotProps">
              <button
                icon="pi pi-pencil"
                class="text-blue-500 mr-2"
                @click="openEditModal(slotProps.data)"
              >
                Редактировать
              </button>
              <button
                icon="pi pi-trash"
                class="text-red-400"
                @click="openDeleteConfirm(slotProps.data.id)"
              >
                Удалить
              </button>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Таблица заказов -->
      <div v-if="activeTab === 'orders'">
        <h1>Список заказов</h1>
        <DataTable
          :value="ordersData"
          :paginator="true"
          :rows="5"
          :filters="filters"
          filterDisplay="menu"
        >
          <template #header>
            <div class="flex justify-content-between items-center gap-2">
              <span>Заказы</span>
              <InputText v-model="filters['global'].value" placeholder="Поиск" />
            </div>
          </template>
          <Column field="id" header="ID" sortable></Column>
          <Column header="Пользователь">
            <template #body="slotProps">
              <span>{{ slotProps.data.user.name }}</span>
            </template>
          </Column>
          <Column field="totalPrice" header="Сумма" sortable></Column>
          <Column header="Статус">
            <template #body="slotProps">
              <span
                :class="{
                  'text-green-500': slotProps.data.status === 'confirmed',
                  'text-red-500': slotProps.data.status === 'decline',
                  'text-yellow-500': slotProps.data.status === 'unconfirmed'
                }"
              >
                {{ slotProps.data.status === 'unconfirmed' ? 'Ждёт подтверждения' : '' }}
                {{ slotProps.data.status === 'confirmed' ? 'Подтверждён' : '' }}
                {{ slotProps.data.status === 'decline' ? 'Отменён' : '' }}
              </span>
            </template>
          </Column>
          <Column header="Действия">
            <template #body="slotProps">
              <button class="text-blue-500" @click="openOrderDetails(slotProps.data)">
                Состав заказа
              </button>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Модальное окно для создания товара -->
    <Dialog v-model:visible="visibleModalItems" header="Создание нового товара" :modal="true">
      <form @submit.prevent="createProduct">
        <div class="field">
          <label for="title">Название</label>
          <InputText id="title" v-model="newProduct.title" required />
        </div>
        <div class="field">
          <label for="price">Цена</label>
          <InputText id="price" v-model.number="newProduct.price" required />
        </div>
        <div class="field">
          <label for="file">Фото</label>
          <FileUpload
            mode="basic"
            name="file"
            url=""
            accept="image/*"
            @select="handleFileUpload"
            chooseLabel="Выберите файл"
            :auto="false"
          />
        </div>
        <Button type="submit" label="Создать" class="mt-2" />
      </form>
    </Dialog>

    <!-- Модальное окно для редактирования товара -->
    <Dialog v-model:visible="visibleEditModal" header="Редактирование товара" :modal="true">
      <form @submit.prevent="editProduct">
        <div class="field">
          <label for="editTitle">Название</label>
          <InputText id="editTitle" v-model="editProductData.title" required />
        </div>
        <div class="field">
          <label for="editPrice">Цена</label>
          <InputText id="editPrice" v-model.number="editProductData.price" required />
        </div>
        <Button type="submit" label="Сохранить" class="mt-2" />
      </form>
    </Dialog>

    <!-- Модальное окно для просмотра состава заказа -->
    <Dialog
      v-model:visible="visibleModalOrders"
      header="Состав заказа"
      :modal="true"
      @update:visible="closeOrderDetails"
    >
      <div v-if="selectedOrder">
        <h3>Пользователь: {{ selectedOrder.user.name }}</h3>
        <h3>Сумма: {{ selectedOrder.totalPrice }}</h3>
        <h3>
          Статус:
          <span
            :class="{
              'text-green-500': selectedOrder.status === 'confirmed',
              'text-red-500': selectedOrder.status === 'decline',
              'text-yellow-500': selectedOrder.status === 'unconfirmed'
            }"
          >
            {{ selectedOrder.status === 'unconfirmed' ? 'Ждёт подтверждения' : '' }}
            {{ selectedOrder.status === 'confirmed' ? 'Подтверждён' : '' }}
            {{ selectedOrder.status === 'decline' ? 'Отменён' : '' }}
          </span>
        </h3>
        <DataTable :value="selectedOrder.items" :paginator="true" :rows="5">
          <Column field="id" header="ID" sortable></Column>
          <Column header="Фото">
            <template #body="slotProps">
              <img
                :src="slotProps.data.imageUrl"
                :alt="slotProps.data.title"
                class="w-24 rounded"
              />
            </template>
          </Column>
          <Column field="title" header="Название" sortable></Column>
          <Column field="price" header="Цена" sortable></Column>
        </DataTable>
        <div class="mt-4 flex gap-4">
          <Button
            label="Подтвердить"
            icon="pi pi-check"
            class="p-button-success"
            @click="confirmOrder"
          />
          <Button
            label="Отказать"
            icon="pi pi-times"
            class="p-button-danger"
            @click="declineOrder"
          />
        </div>
      </div>
    </Dialog>

    <!-- Модальное окно подтверждения удаления -->
    <Dialog
      v-model:visible="visibleDeleteConfirm"
      header="Подтверждение удаления"
      :modal="true"
      :closable="false"
    >
      <p>Вы уверены, что хотите удалить этот товар?</p>
      <template #footer>
        <Button
          label="Отмена"
          icon="pi pi-times"
          class="p-button-text"
          @click="closeDeleteConfirm"
        />
        <Button
          label="Удалить"
          icon="pi pi-check"
          class="p-button-text p-button-danger"
          @click="deleteProduct"
        />
      </template>
    </Dialog>
    <button
      @click="logout"
      class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4"
    >
      Выйти из аккаунта
    </button>
  </div>
</template>

<style>
/* Стили для табов */
.tabs button {
  padding: 10px 20px;
  border: 1px solid #ccc;
  background-color: #666666;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tabs button.active {
  background-color: #007bff;
}

.tabs button:hover {
  background-color: #808080;
}

/* Отступ между табами и содержимым */
.mt-4 {
  margin-top: 1rem;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
}

.text-green-500 {
  color: green;
}

.text-red-500 {
  color: red;
}

.text-yellow-500 {
  color: yellow;
}
</style>
