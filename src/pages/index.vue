<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
const isLoading = ref(false)

const startGame = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  router.push('/game')
}
</script>

<template>
  <div class="game-container">
    <Transition name="fade" appear>
      <div class="logo-container">
        <img src="/src/assets/images/pokemon/logo.png" alt="Pokemon Logo" class="pokemon-logo" />
      </div>
    </Transition>

    <Transition name="slide-fade" appear>
      <h1 class="game-title">{{ t('game.title') }}</h1>
    </Transition>

    <div class="content-section">
      <p class="game-desc">{{ t('intro.desc') }}</p>
      <p class="game-hint">{{ t('intro.start') }}</p>

      <Transition name="bounce">
        <button 
          class="start-button"
          :class="{ 'loading': isLoading }"
          @click="startGame"
          :disabled="isLoading"
        >
          {{ t('button.go') }}
        </button>
      </Transition>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
}

.pokemon-logo {
  width: 300px;
  height: auto;
  animation: breathe 3s ease-in-out infinite;
}

.game-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--text-color);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.content-section {
  text-align: center;
  max-width: 600px;
}

.game-desc, .game-hint {
  margin: 1rem 0;
  color: var(--text-color);
  line-height: 1.6;
}

.start-button {
  background: var(--primary-color);
  color: var(--text-light);
  padding: 1rem 3rem;
  border-radius: 2rem;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
  }

  &.loading {
    opacity: 0.7;
    cursor: wait;
  }
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
