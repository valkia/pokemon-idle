<script setup lang="ts">
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Battle } from '~/scripts/Battle'
import { GameState, Pokeball } from '~/scripts/GameConstants'
import { useBattleStore } from '~/stores/battle'
import { useGameStore } from '~/stores/game'

const { t, locale } = useI18n()
console.log('[Enemy] Current locale:', locale.value)
const gameStore = useGameStore()
const gameState = computed(() => {
  console.log('[Enemy] Game state changed:', gameStore.gameState)
  return gameStore.gameState
})
const pokemon = computed(() => {
  return useBattleStore().enemyPokemon
})
const catching = computed(() => {
  return useBattleStore().catching
})
const pokeballImgUrl = computed(() => {
  return `/src/assets/images/pokeball/${Pokeball[Battle.pokeball.value]}.svg`
})
const pokemonImgUrl = computed(() => {
  return `/src/assets/images/pokemon/${pokemon.value.id}.png`
})

// 添加震动状态
const isShaking = ref(false)

function enemyClick() {
  console.log('[Enemy] Click event triggered')
  console.log('[Enemy] Current game state:', gameState.value)
  console.log('[Enemy] Current pokemon:', pokemon.value)
  if (gameState.value === GameState.fighting) {
    Battle.clickAttack()
    console.log('[Enemy] Attack initiated')

    // 触发震动动画
    isShaking.value = true

    // 500毫秒后停止震动（延长时间以便更容易观察到效果）
    setTimeout(() => {
      isShaking.value = false
      console.warn('Shake animation ended')
    }, 500)
  }
  else {
    console.log('[Enemy] Attack blocked - not in fighting state')
  }
}
</script>

<template>
  <div @click="enemyClick">
    <img
      v-if="catching"
      class="pokeball-animated"
      :src="pokeballImgUrl"
    >
    <img
      v-else
      :src="pokemonImgUrl"
      :class="isShaking ? 'avatar shake-animation' : 'avatar'"
    >

    <div>{{ t(`pokemon.${pokemon.name}`) }}</div>
    <div>{{ pokemon.health }}/{{ pokemon.maxHealth }}</div>
  </div>
</template>

<style scoped>
.avatar {
  margin: 0 auto;
  display: block;
}

.pokeball-animated {
  margin: auto;
  height: 96px;
  width: 96px;
  padding: 10px;
  -webkit-animation: spin 1s linear infinite;
  -moz-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}

/* 增强震动动画效果 */
.shake-animation {
  animation: shake 0.5s ease-in-out;
  transform-origin: 50% 50%;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}

@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(20deg);
  }
}
@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(20deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  15% {
    transform: rotate(10deg);
  }
  30% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(0deg);
  }
  65% {
    transform: rotate(-10deg);
  }
  80% {
    transform: rotate(0deg);
  }
}
</style>
