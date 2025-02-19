<template>
  <div @click="enemyClick">
    <img
      v-if="catching"
      class="pokeball-animated"
      :src="pokeballImgUrl"
    >
    <img v-else :src="pokemonImgUrl" class="avatar">

    <div>{{ t(`pokemon.${pokemon.name}`) }}</div>
    <div>{{ pokemon.health }}/{{ pokemon.maxHealth }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import { Battle } from '~/scripts/Battle'
import { useBattleStore } from '~/stores/battle'
import { GameState, Pokeball } from '~/scripts/GameConstants'
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
const enemyClick = () => {
  console.log('[Enemy] Click event triggered')
  console.log('[Enemy] Current game state:', gameState.value)
  console.log('[Enemy] Current pokemon:', pokemon.value)
  if (gameState.value === GameState.fighting) {
    Battle.clickAttack()
    console.log('[Enemy] Attack initiated')
  } else {
    console.log('[Enemy] Attack blocked - not in fighting state')
  }
}
</script>

<style scoped>
.avatar{
  margin: 0 auto;
}

.pokeball-animated {
  margin: auto;
  height: 96px;
  width: 96px;
  padding: 10px;
  -webkit-animation:spin 1s linear infinite;
  -moz-animation:spin 1s linear infinite;
  animation:spin 1s linear infinite;
}

@-moz-keyframes spin { 100% { -moz-transform: rotate(20deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(20deg); } }

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
