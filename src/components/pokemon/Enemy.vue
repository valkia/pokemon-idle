<template>
  <img :src="pokemonImgUrl">
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import { Battle } from '~/scripts/Battle'
import { useBattleStore } from '~/stores/battle'
const pokemon = computed(() => {
  return useBattleStore().enemyPokemon
})
const pokemonImgUrl = computed(() => {
  return `/src/asserts/images/pokemon/${pokemon.value.id}.png`
})

</script>

<style scoped>

</style>
