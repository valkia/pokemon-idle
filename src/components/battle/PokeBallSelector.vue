<template>
  <div class="pokeball-selector">
    <div class="selector-container">
      <div class="current-ball" @click="showList = !showList">
        <img :src="currentBallImage" :alt="currentBall.name">
        <span class="quantity">{{ currentBall.quantity }}</span>
      </div>

      <div v-if="showList" class="ball-list">
        <div v-for="ball in availableBalls" 
          :key="ball.type"
          class="ball-item"
          :class="{ 'selected': ball.type === selectedBall }"
          @click="selectBall(ball)">
          <img :src="getBallImage(ball.type)" :alt="ball.name">
          <div class="ball-info">
            <span class="name">{{ ball.name }}</span>
            <span class="quantity" :class="{ 'low': ball.quantity < 10 }">
              {{ ball.quantity }}
            </span>
          </div>
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
import { useI18n } from 'vue-i18n'
import type { Pokeball } from '~/scripts/pokeballs/Pokeball'
import { PokeBallType } from '~/scripts/pokeballs/Pokeball'
import { Battle } from '~/scripts/Battle'
import { usePlayerStore } from '~/stores/player'

const { t } = useI18n()
const player = usePlayerStore()

const showList = ref(false)
const selectedBall = ref(PokeBallType.Pokeball)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('')

const availableBalls = computed(() => {
  return player.pokeballs.filter(ball => ball.unlocked() && ball.type !== PokeBallType.None)
})

const currentBall = computed(() => {
  return availableBalls.value.find(ball => ball.type === selectedBall.value) || availableBalls.value[0]
})

const currentBallImage = computed(() => {
  return getBallImage(currentBall.value?.type)
})

function getBallImage(type: PokeBallType): string {
  return new URL(`../../assets/images/pokeball/${PokeBallType[type]}.svg`, import.meta.url).href
}

function selectBall(ball: Pokeball) {
  if (ball.quantity <= 0) {
    showNotificationMessage('No balls remaining!', 'error')
    return
  }
  
  selectedBall.value = ball.type
  showList.value = false
  Battle.selectedBall = ball.type
}

function showNotificationMessage(message: string, type: string) {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

defineExpose({
  selectedBall,
  currentBall,
})
</script>

<style scoped>
.pokeball-selector {
  position: relative;
  display: inline-block;
}

.selector-container {
  position: relative;
}

.current-ball {
  display: flex;
  align-items: center;
  padding: 4px;
  border: 2px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  background: white;
}

.current-ball img {
  width: 32px;
  height: 32px;
}

.ball-list {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-height: 300px;
  overflow-y: auto;
}

.ball-item {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ball-item:hover {
  background-color: #f5f5f5;
}

.ball-item.selected {
  background-color: #e3f2fd;
}

.ball-item img {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.ball-info {
  display: flex;
  flex-direction: column;
}

.quantity {
  font-size: 0.8em;
  color: #666;
}

.quantity.low {
  color: #f44336;
}

.notification {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 8px;
  font-size: 0.9em;
  z-index: 1001;
}

.notification.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}
</style>