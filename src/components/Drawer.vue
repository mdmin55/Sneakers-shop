<script setup>
import CartItemList from './CartItemList.vue'
import DrawerHead from './DrawerHead.vue'
import InfoBlok from './InfoBlok.vue'
import { ref, inject, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const props = defineProps({
  totalPrice: Number,
  vatPrice: Number
})

const { cart } = inject('cart')
const isCreating = ref(false)
const orderId = ref(null)

const createOrder = async () => {
  try {
    authStore.loadUserData()
    isCreating.value = true
    const { data } = await axios.post(`https://05d681b6ec2b8d1f.mokky.dev/orders`, {
      items: cart.value,
      user_id: authStore.userData.id,
      date: new Date().toISOString(),
      totalPrice: props.totalPrice,
      status: 'unconfirmed'
    })

    cart.value = []
    orderId.value = data.id
    return data
  } catch (err) {
    console.log(err)
  } finally {
    isCreating.value = false
  }
}
const cartIsEmpty = computed(() => cart.value.length === 0)

const buttonDisabled = computed(() => isCreating.value || cartIsEmpty.value)
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 pt-12 pl-12 md:pr-8 pr-3">
    <DrawerHead />

    <div v-if="!totalPrice || orderId" class="flex h-full items-center">
      <InfoBlok
        v-if="orderId"
        title="Заказ оформлен!"
        :description="`Ваш заказ #${orderId} скоро будет передан курьерской доставке.`"
        image-url="/order-success-icon.png"
      />

      <InfoBlok
        v-if="!totalPrice && !orderId"
        title="Карзина пустая"
        description="Добавьте хотя бы одну пару красовок, что бы сделать заказ."
        image-url="/package-icon.png"
      />
    </div>

    <div v-else>
      <CartItemList />

      <div class="flex flex-col gap-4 my-7">
        <div class="flex gap-2">
          <span class="text-black">Итого:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ totalPrice }} руб.</b>
        </div>

        <div class="flex gap-2">
          <span class="text-black">Налог 5%:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ vatPrice }} руб.</b>
        </div>

        <button
          :disabled="buttonDisabled"
          @click="createOrder"
          class="mt-4 transition bg-lime-500 w-full rounded-xl py-3 text-white disabled:bg-slte-300 hover:bg-lime-600 active:bg-lime-700 cursor-pointer"
        >
          Оформите заказ
        </button>
      </div>
    </div>
  </div>
</template>
