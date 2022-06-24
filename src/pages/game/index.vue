
<template>
  <div>
    <Enemy />
    <KantoSVG />
    <Notificaton />
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
import { useDataStore } from '~/stores/data'
import { init as townInit } from '~/scripts/towns/init'
import { init as gymInit } from '~/scripts/gym/init'
import { init as routeInit } from '~/scripts/wildBattle/init'
const { t, locale } = useI18n()
locale.value = 'zh-CN'

// eslint-disable-next-line no-console
console.log(t)
useDataStore().setGymList(gymInit())
useDataStore().setTownList(townInit())
routeInit()
console.log(Battle.generateNewEnemy())
</script>
