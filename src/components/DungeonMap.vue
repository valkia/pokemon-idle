<script lang="ts" setup>
import { useGameStore } from '~/stores/game'
import * as GameConstants from '~/enums/GameConstants'
import { DungeonRunner } from '~/scripts/dungeons/DungeonRunner'
import {useDungeonStore} from "~/stores/dungeon";
const gameState = useGameStore()
const dungeon = computed(()=>{
  return useDungeonStore().dungeon
})
const map = computed(()=>{
  return useDungeonStore().map
})
</script>

<template>
  <div
    v-if="gameState.gameState === GameConstants.GameState.dungeon"
    id="dungeonMap"
    class="card sortable-disabled border-secondary mb-3 dungeon no-select"
  >
    <div class="card-header p-0">
      <span>{{ dungeon.name }}</span>
    </div>
    <div class="card-body p-0 text-center">
      <table class="dungeon-board">
        <tbody v-for="(map,mapIndex) in map?.board()">
          <tr v-for="(item,index) in map">
            <td
              :class="item.cssClass()"
              @click="map.moveToCoordinates(index, mapIndex)"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
