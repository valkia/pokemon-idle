
<template>
  <div>
<!--    <Enemy :pokemon="enemy" />
    <KantoSVG />-->
    <Notificaton></Notificaton>
  </div>
</template>

<route lang="yaml">
meta:
  layout: game
</route>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { pokemonMap } from '~/scripts/pokemons/PokemonList'
import { Battle } from '~/scripts/Battle'
import KantoSVG from '~/components/map/Kanto/KantoSVG.vue'
import Enemy from '~/components/pokemon/Enemy.vue'
import Notificaton from '~/components/Notification.vue'
const { t } = useI18n()
console.log(Battle.generateNewEnemy())
const enemy = ref(Battle.generateNewEnemy())
// eslint-disable-next-line no-console
console.log(t)
</script>
