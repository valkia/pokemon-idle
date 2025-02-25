<script setup lang="ts">
import DungeonMap from '~/components/DungeonMap.vue'
import DungeonView from '~/components/DungeonView.vue'
import GymView from '~/components/GymView.vue'
import HallOfFameModal from '~/components/HallOfFame.vue'
import KantoSVG from '~/components/map/Kanto/KantoSVG.vue'
import ShopModal from '~/components/map/ShopModal.vue'
import TownView from '~/components/map/TownView.vue'
import Notificaton from '~/components/Notification.vue'
import NpcModal from '~/components/NpcModal.vue'
import PartyModal from '~/components/PartyModal.vue'
import PickStarterTutorialModal from '~/components/PickStarterTutorialModal.vue'
import BattleList from '~/components/pokemon/BattleList.vue'
import CatchList from '~/components/pokemon/CatchList.vue'
import TeamView from '~/components/pokemon/TeamView.vue'
import ReceiveGymBadge from '~/components/ReceiveGymBadge.vue'
import RouteBattles from '~/components/RouteBattles.vue'
import App from '~/scripts/App'
import { Battle } from '~/scripts/Battle'
import * as GameConstants from '~/scripts/GameConstants'
import { init as gymInit } from '~/scripts/gym/init'
import { init as townInit } from '~/scripts/towns/init'
import { init as routeInit } from '~/scripts/wildBattle/init'
import MapHelper from '~/scripts/worldmap/MapHelper'
import { useDataStore } from '~/stores/data'
import { useGameStore } from '~/stores/game'
import { useModalStore } from '~/stores/modal'

const { t, locale } = useI18n()
locale.value = 'zh-CN'
function start() {
  App.start()
}
const modalStore = useModalStore()
// eslint-disable-next-line no-console
console.log(t)
useDataStore().gymList = (gymInit())
useDataStore().townList = (townInit())
routeInit()
console.log(Battle.generateNewEnemy())

const gameState = computed(() => {
  return useGameStore().gameState
})
</script>

<template>
  <div mx-auto flex container>
    <div w-xs>
      <CatchList />
    </div>
    <div w-xs>
      <BattleList />
    </div>
    <div>
      <TownView />
      <!--      <Enemy /> -->
      <div
        v-show="(gameState === GameConstants.GameState.fighting
          || gameState === GameConstants.GameState.dungeon
          || gameState === GameConstants.GameState.paused
          || gameState === GameConstants.GameState.gym
          || gameState == GameConstants.GameState.battleFrontier)
          || gameState == GameConstants.GameState.temporaryBattle"
        class="battle-view card-body justify-content-center no-gutters no-select p-0"
        :class="MapHelper.calculateBattleCssClass()"
      >
        <RouteBattles />
        <DungeonView />
        <GymView />
      </div>
      <KantoSVG v-show="gameState !== GameConstants.GameState.dungeon" />

      <DungeonMap />
    </div>
  </div>
  <Notificaton />
  <PickStarterTutorialModal />
  <!--    <starterCaught /> -->
  <ShopModal />
  <ReceiveGymBadge />
  <HallOfFameModal />
  <NpcModal />
  <PartyModal />
  <TeamView />
  <button
    class="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
    @click="modalStore.teamViewModalFlag = true"
  >
    View Party
  </button>
  <button @click="start()">
    start
  </button>
</template>

<route lang="yaml">
meta:
layout: game
</route>
