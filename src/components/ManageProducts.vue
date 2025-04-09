<template>
    <div>
      <h2>Управление товарами</h2>
      <form @submit.prevent="addProduct">
        <input v-model="newProduct.name" placeholder="Название товара" required />
        <input v-model="newProduct.price" type="number" placeholder="Цена" required />
        <button type="submit">Добавить товар</button>
      </form>
  
      <ul>
        <li v-for="product in products" :key="product.id">
          {{ product.name }} {{ product.price }}
          <button @click="deleteProduct(product.id)">Удалить</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const newProduct = ref({ name: '', price: 0 });
  const products = ref([]);
  
  async function addProduct() {
    const response = await axios.post('/api/products', newProduct.value);
    products.value.push(response.data);
    newProduct.value = { name: '', price: 0 };
  }
  
  async function deleteProduct(productId) {
    await axios.delete(`/api/products/${productId}`);
    products.value = products.value.filter(product => product.id !== productId);
  }
  
  onMounted(async () => {
    const response = await axios.get('/api/products');
    products.value = response.data;
  });
  </script>