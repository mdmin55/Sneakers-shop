<script setup>
import { onMounted, ref, reactive,provide, watch} from 'vue';
import axios from 'axios';

import Header from './components/Header.vue';
import CardList from './components/CardList.vue';
import Drawer from './components/Drawer.vue';

const items = ref([]);

const filters = reactive({
  sortBy: 'title',
  searchQuery: '',
})

const onChangeSelect = (event) =>{
  filters.sortBy = event.target.value
}

const onChangeSearchInput = (event) =>{
  filters.searchQuery = event.target.value
}

const fetchFavorites = async () =>{
  try{
  const {data: favorites } = await axios.get (`https://05d681b6ec2b8d1f.mokky.dev/favorites`)
    items.value= items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.parentId === item.id)

      if (!favorite){
        return item;
      }
      return{
        ...item,
        isFavorite: true,
        favoriteId: favorite.id
      };
  });  
  } catch (err){
    console.log(err)
    }
  }

  const addToFavorote = async(item) =>{
    item.isFavorite=true
  }
const fetchItems = async() => {
  try{
    const params ={
      sortBy: filters.sortBy
    }
    if (filters.searchQuery){
      params.title = `*${filters.searchQuery}*`;
    }
    const {data} = await axios.get (`https://05d681b6ec2b8d1f.mokky.dev/Items`,
    {
    params
    });
  items.value=data.map((obj)=> ({
    ...obj,
    isFavorite: false,
    isAdded:false
  }));
    } catch (err){
    console.log(err)
    }}

onMounted(async()=>{
await fetchItems();
await fetchFavorites();
});

watch(filters, fetchItems);
provide('addToFavorite',addToFavorote);
</script>

<template>
  <!-- <Drawer/> -->
<div class="bg-white w-4/5 m-auto rounded-xl  shadow-xl mt-14">
 <Header/> 
  <div class="p-10">
    <div class="flex justify-between ">
      <h2 class="text-3xl font-bold mb-8 ">Все кроссовки</h2>
      
      <div class="flex gap-4">
        <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none" >
          <option value="name">По названию</option>
          <option value="price">По цене(дешевые)</option>
          <option value="-price">По цене (дорогие)</option>
        </select>
  
        <div class="relative">
          <img class="absolute left-3 top-3" src="/search.svg"  />
          <input @input="onChangeSearchInput" class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400" placeholder="Поиск...">
        </div>
      </div>
   </div>
    <div class="mb-10">
      <CardList  :items="items"/>
    </div>
  </div>
</div>

</template>

<style scoped>

</style>
