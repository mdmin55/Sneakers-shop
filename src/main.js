import './assets/mine.css'
import { createRouter, createWebHistory } from 'vue-router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import Home from './pages/Home.vue'
import Favorites from './pages/Favorites.vue'
import Shoplist from './pages/Shoplist.vue'
import Profil from './pages/Profil.vue'
import Register from './pages/Register.vue'
import Admin from './pages/Admin.vue'
import Login from './components/Login.vue'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import '../src/assets/global.css'

const app = createApp(App)

const pinia = createPinia()
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/favorites', name: 'Favorites', component: Favorites },
  { path: '/shoplist', name: 'Shoplist', component: Shoplist },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profil', name: 'Profil', component: Profil },
  { path: '/login', name: 'Login', component: Login },
  { path: '/admin', name: 'Admin', component: Admin }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

app.use(autoAnimatePlugin)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})
app.use(pinia)

app.mount('#app')
