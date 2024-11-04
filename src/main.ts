import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'
import App from './App.vue'
import i18n from './i18n'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const pinia = createPinia()

const router = createRouter({
  routes,
  history: createWebHistory(),
})
createApp(App).use(i18n).use(pinia).use(router).mount('#app')

// This will update routes at runtime without reloading the page
if (import.meta.hot) {
  handleHotUpdate(router)
}
