<template>
  <div class="battle-pokemon-list">
    <div v-for="(pokemon,index) in pokemonList">
<div flex justify-center items-center @click="handleBattleClick(pokemon)">
        <img :src="pokemonImgUrl(pokemon)" class="avatar">
        <div>{{ t(`pokemon.${pokemon.name}`) }}</div>
        <div ml="2">
          等级{{ pokemon._level }}
        </div>
        <div v-if="canRemoveBattle" ml="2" @click="removeBattle(index)">
          移出队伍
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import { Battle } from '~/scripts/Battle'
import { useBattleStore } from '~/stores/battle'
import { usePartyStore } from '~/stores/party'
import { useGameStore } from '~/stores/game'
import type { PartyPokemon } from '~/scripts/party/PartyPokemon'
import type { GameState } from '~/scripts/GameConstants'
const { t, locale } = useI18n()
console.log('locale', locale.value)
const pokemonList = computed(() => {
  return usePartyStore().battlePokemon
})
const pokemonImgUrl = (pokemon: PartyPokemon) => {
  return `/src/assets/images/pokemon/${pokemon.id}.png`
}

const canRemoveBattle = computed(() => {
  return usePartyStore().battlePokemon.length > 1
})
const removeBattle = (index: number) => {
  console.log('removeBattle', index)
  usePartyStore().battlePokemon.splice(index, 1)
}

const handleBattleClick = (pokemon: PartyPokemon) => {
  console.debug('Battle clicked:', { pokemon })
  const battleStore = useBattleStore() 
  const gameStore = useGameStore()

  // Set battle state and start attack
  gameStore.gameState = GameState.fighting
  Battle.clickAttack(battleStore, gameStore)

  console.debug('Battle state:', {
    gameState: gameStore.gameState,
    battleStore: battleStore.enemyPokemon
  })
}
</script>

<style scoped>
.avatar{
}
.battle-pokemon-list{
  max-height: 600px;
  overflow:auto;
}
</style>
