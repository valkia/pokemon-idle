
<template>
  <div>
    <townView />
    <Enemy />
    <KantoSVG />
    <Notificaton />
    <pickStarterTutorialModal />
    <!--    <starterCaught />-->
    <BattleList />
    <button @click="start()">
      ok
    </button>
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
import townView from '~/components/map/townView.vue'
import Enemy from '~/components/pokemon/Enemy.vue'
import BattleList from '~/components/pokemon/BattleList.vue'
import pickStarterTutorialModal from '~/components/pickStarterTutorialModal.vue'
import starterCaught from '~/components/starterCaught.vue'
import Notificaton from '~/components/Notification.vue'
import { useDataStore } from '~/stores/data'
import { init as townInit } from '~/scripts/towns/init'
import { init as gymInit } from '~/scripts/gym/init'
import { init as routeInit } from '~/scripts/wildBattle/init'
const { t, locale } = useI18n()
locale.value = 'zh-CN'
const start = () => {
  // App.start()
}
// eslint-disable-next-line no-console
console.log(t)
useDataStore().setGymList(gymInit())
useDataStore().setTownList(townInit())
routeInit()
console.log(Battle.generateNewEnemy())
</script>
