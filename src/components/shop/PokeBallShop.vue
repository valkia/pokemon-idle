<template>
  <div class="pokeball-shop">
    <h2>{{ $t('shop.pokeball.title') }}</h2>

    <div class="pokeball-list">
      <div v-for="ball in availablePokeballs" :key="ball.type" class="pokeball-item">
        <div class="ball-info">
          <img :src="getBallImage(ball.type)" :alt="ball.name">
          <div class="ball-details">
            <h3>{{ ball.name }}</h3>
            <p class="description">{{ ball.description }}</p>
            <p class="price">{{ formatPrice(ball.price) }} ¥</p>
            <p class="stock">{{ $t('shop.pokeball.owned') }}: {{ ball.quantity }}</p>
          </div>
        </div>

        <div class="purchase-controls">
          <div class="quantity-selector">
            <button @click="decreaseQuantity(ball)" :disabled="purchaseQuantity[ball.type] <= 1">-</button>
            <input type="number" v-model.number="purchaseQuantity[ball.type]" min="1">
            <button @click="increaseQuantity(ball)">+</button>
          </div>
          <button class="buy-button" 
            @click="purchaseBall(ball)"
            :disabled="!canAfford(ball)"
            :class="{ 'disabled': !canAfford(ball) }">
            {{ $t('shop.pokeball.buy') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showNotification" class="notification" :class="notificationType">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWalletStore } from '~/stores/wallet'
import type { Pokeball } from '~/scripts/pokeballs/Pokeball'
import { ShopHandler } from '~/scripts/shop/ShopHandler'
import { usePlayerStore } from '~/stores/player'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const wallet = useWalletStore()
const player = usePlayerStore()

const showNotification = ref(false)
const notificationType = ref('')
const notificationMessage = ref('')
const purchaseQuantity = ref<Record<number, number>>({})

const availablePokeballs = computed(() => {
  return ShopHandler.pokeBallStock.filter(ball => ball.unlocked())
})

const canAfford = (ball: Pokeball) => {
  return wallet.money >= ball.price * (purchaseQuantity.value[ball.type] || 1)
}

const getBallImage = (type: number) => {
  return `/images/pokeball/${type}.svg`
}

const formatPrice = (price: number) => {
  return price.toLocaleString()
}

const showMessage = (message: string, type: string) => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const purchaseBall = (ball: Pokeball) => {
  const quantity = purchaseQuantity.value[ball.type] || 1
  const totalPrice = ball.price * quantity

  if (!canAfford(ball)) {
    showMessage(t('shop.pokeball.not_enough_money'), 'error')
    return
  }

  wallet.spendMoney(totalPrice)
  ShopHandler.purchasePokeball(ball.type, quantity)
  showMessage(t('shop.pokeball.purchase_success'), 'success')
}

const increaseQuantity = (ball: Pokeball) => {
  if (!purchaseQuantity.value[ball.type]) {
    purchaseQuantity.value[ball.type] = 1
  }
  purchaseQuantity.value[ball.type]++
}

const decreaseQuantity = (ball: Pokeball) => {
  if (purchaseQuantity.value[ball.type] > 1) {
    purchaseQuantity.value[ball.type]--
  }
}
</script>

<style scoped>
.pokeball-shop {
  padding: 20px;
}

.pokeball-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.pokeball-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: white;
}

.ball-info {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.ball-info img {
  width: 48px;
  height: 48px;
}

.ball-details h3 {
  margin: 0 0 5px 0;
  font-size: 1.2em;
}

.description {
  color: #666;
  font-size: 0.9em;
  margin: 5px 0;
}

.price {
  font-weight: bold;
  color: #2c3e50;
}

.purchase-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 5px;
}

.quantity-selector input {
  width: 60px;
  text-align: center;
  padding: 5px;
}

.quantity-selector button {
  padding: 5px 10px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  cursor: pointer;
}

.buy-button {
  flex: 1;
  padding: 8px 15px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.buy-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 4px;
  color: white;
  animation: fadeIn 0.3s ease;
}

.notification.error {
  background: #ff4444;
}

.notification.success {
  background: #4CAF50;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>