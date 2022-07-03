<template>
  <div v-for="pokemon in pokemonList">
    <div flex justify-center items-center>
      <img :src="pokemonImgUrl(pokemon)" class="avatar">
      <div>{{ t(`pokemon.${pokemon.name}`) }}</div>
      <div ml="2">
        等级{{ pokemon._level }}
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
import type { PartyPokemon } from '~/scripts/party/PartyPokemon'
const { t, locale } = useI18n()
console.log('locale', locale.value)
const pokemonList = computed(() => {
  return usePartyStore().caughtPokemon
})
const pokemonImgUrl = (pokemon: PartyPokemon) => {
  return `/src/assets/images/pokemon/${pokemon.id}.png`
}
</script>

<style scoped>
.avatar{
}
</style>
