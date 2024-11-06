<script setup>
import { onMounted, ref} from 'vue';
import axios from 'axios'
import CardList from '../components/CardList.vue';


const favorites = ref([])
onMounted(async ()=> {
try {
    const {data} = 
    await axios.get('https://05d681b6ec2b8d1f.mokky.dev/favorites?_relations=items')
    favorites.value = data.map((obj) => obj.item)
}catch (err){
    console.log(err);
}
});
</script>



<template>
    <h1 class="text-3xl font-bold mb-8 ">Мои закладки </h1>
        
        <CardList  :items="favorites" is-favorites/>

</template>