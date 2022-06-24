<template>
  <div @click="enemyClick">
    <img :src="pokemonImgUrl" class="avatar">
    <div>{{ t(`pokemon.${pokemon.name}`) }}</div>
    <div>{{ pokemon.health }}/{{ pokemon.maxHealth }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import { Battle } from '~/scripts/Battle'
import { useBattleStore } from '~/stores/battle'
const { t, locale } = useI18n()
console.log('locale', locale.value)
const pokemon = computed(() => {
  return useBattleStore().enemyPokemon
})
const pokemonImgUrl = computed(() => {
  return `/src/asserts/images/pokemon/${pokemon.value.id}.png`
})
const enemyClick = () => {
  Battle.clickAttack()
}
</script>

<style scoped>
.avatar{
  margin: 0 auto;
}
</style>
