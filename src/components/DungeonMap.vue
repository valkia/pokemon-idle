<script lang="ts" setup>
import { useGameStore } from '~/stores/game'
import * as GameConstants from '~/enums/GameConstants'
import { DungeonRunner } from '~/scripts/dungeons/DungeonRunner'
import { useDungeonStore } from '~/stores/dungeon'
const gameState = useGameStore()
const dungeonStore = useDungeonStore()
const dungeon = computed(() => {
  return dungeonStore.dungeon
})
const map = computed(() => {
  return dungeonStore.map
})
</script>

<template>
  <div
    v-if="gameState.gameState === GameConstants.GameState.dungeon"
    id="dungeonMap"
    class="card sortable-disabled border-secondary mb-3 dungeon no-select"
  >
    <!--    <div class="card-header p-0">
      <span>{{ dungeon.name }}</span>
    </div>-->
    <div class="card-body p-0 text-center">
      <table class="dungeon-board">
        <tbody>
          <tr v-for="(mapItem,mapIndex) in map?.board">
            <td
              v-for="(item,index) in mapItem"
              :class="item.cssClass"
              @click="map.moveToCoordinates(index, mapIndex)"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style lang="scss">
:root{
  --trainer-image: url('/src/assets/images/profile/trainer-0.png');
}
</style>
