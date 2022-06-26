<template>
  <div>111</div>
  <div v-for="pokemon in pokemonList">
    <img :src="pokemonImgUrl(pokemon)" class="avatar">
    <div>{{ t(`pokemon.${pokemon.name}`) }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import { Battle } from '~/scripts/Battle'
import { useBattleStore } from '~/stores/battle'
import { usePartyStore } from '~/stores/party'
const { t, locale } = useI18n()
console.log('locale', locale.value)
const pokemonList = computed(() => {
  return usePartyStore().caughtPokemon
})
const pokemonImgUrl = (pokemon) => {
  return `/src/assets/images/pokemon/${pokemon.id}.png`
}
const enemyClick = () => {
  Battle.clickAttack()
}
</script>

<style scoped>
.avatar{
  margin: 0 auto;
}
</style>
