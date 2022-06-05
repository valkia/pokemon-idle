<template>
  <img :src="pokemonImgUrl">
</template>

<script setup lang="ts">
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'

const props = defineProps<{
  pokemon: BattlePokemon
}>()

const pokemonImgUrl = computed(() => {
  return `/src/asserts/images/pokemon/${props.pokemon.id}.png`
})

</script>

<style scoped>

</style>
