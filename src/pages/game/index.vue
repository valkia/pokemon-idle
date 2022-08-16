
<template>
  <div container mx-auto flex>
    <div w-xs>
      <BattleList />
    </div>
    <div>
      <GymView />
      <TownView />
      <!--      <Enemy />-->
      <div class="battle-view card-body p-0 justify-content-center no-gutters no-select">
        <RouteBattles />
        <DungeonView />
      </div>
      <KantoSVG />

      <DungeonMap />
    </div>
  </div>
  <Notificaton />
  <PickStarterTutorialModal />
  <!--    <starterCaught />-->
  <ShopModal />
  <ReceiveGymBadge />

  <button @click="start()">
    ok
  </button>
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
import ShopModal from '~/components/map/ShopModal.vue'
import DungeonMap from '~/components/DungeonMap.vue'
import DungeonView from '~/components/DungeonView.vue'
import RouteBattles from '~/components/RouteBattles.vue'
import TownView from '~/components/map/TownView.vue'
import Enemy from '~/components/pokemon/Enemy.vue'
import BattleList from '~/components/pokemon/BattleList.vue'
import PickStarterTutorialModal from '~/components/PickStarterTutorialModal.vue'
import StarterCaught from '~/components/StarterCaught.vue'
import Notificaton from '~/components/Notification.vue'
import ReceiveGymBadge from '~/components/ReceiveGymBadge.vue'
import GymView from '~/components/GymView.vue'
import { useDataStore } from '~/stores/data'
import { init as townInit } from '~/scripts/towns/init'
import { init as gymInit } from '~/scripts/gym/init'
import { init as routeInit } from '~/scripts/wildBattle/init'
import App from '~/scripts/App'
const { t, locale } = useI18n()
locale.value = 'zh-CN'
const start = () => {
  App.start()
}
// eslint-disable-next-line no-console
console.log(t)
useDataStore().setGymList(gymInit())
useDataStore().setTownList(townInit())
routeInit()
console.log(Battle.generateNewEnemy())
</script>
