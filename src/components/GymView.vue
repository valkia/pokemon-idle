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
  <div class="row justify-content-center no-gutters" data-bind="if: App.game.gameState === GameConstants.GameState.gym">
    <div class="col no-gutters clickable" data-bind="click: function() {GymBattle.clickAttack()}" style="height: 220px; display: block;">
      <h2 class="pageItemTitle" style="display: block;">
        <div class="left">
          <div data-bind="text: GymBattle.gym.leaderName.replace(/\d/g,'')" />
        </div>

        <div>
          <div data-bind="text: GymBattle.enemyPokemon().name">
            Pokémon name
          </div>
        </div>

        <div class="right">
          <span data-bind="foreach: new Array(GymBattle.pokemonsDefeatedComputable())">
            <img src="/src/assets/images/pokeball/Pokeball.svg" class="pokeball-smallest pokeball-defeated">
          </span>
          <span data-bind="foreach: new Array(GymBattle.pokemonsUndefeatedComputable())">
            <img src="/src/assets/images/pokeball/Pokeball.svg" class="pokeball-smallest">
          </span>
        </div>

        <div class="progress timer">
          <div
            class="progress-bar bg-danger" role="progressbar"
            data-bind="attr:{ style: 'width:' + GymRunner.timeLeftPercentage() + '%' },
                     css: { 'bg-danger': GymRunner.timeLeftSeconds() < 10, 'bg-primary': GymRunner.timeLeftSeconds() >= 10 }"
            aria-valuemin="0" aria-valuemax="100"
          >
            <span data-bind="text: GymRunner.timeLeftSeconds() + 's'" style="font-size: 12px;" />
          </div>
        </div>
      </h2>

      <div id="gymGoContainer" data-bind="if: Settings.getSetting('showGymGoAnimation').observableValue">
        <div class="row" style="display: inline-block; vertical-align: middle;">
          <div class="col-sm-6 offset-sm-3">
            <img id="gymGo" style="width:100%" src="/src/assets/gifs/go.gif">
          </div>
        </div>
      </div>

      <div>
        <!-- TODO: Add after all Gym Leader images are formatted correctly (same sizes, style etc)
            <img style="position:absolute; left:65%; top: 64px; height: 64px" data-bind="attr:{ src: GymBattle.gym.imagePath }" onerror="this.src = '/src/assets/images/transparent.png'"/>
            -->
        <img class="enemy" data-bind="attr:{ src: PokemonHelper.getImage(GymBattle.enemyPokemon(), GymBattle.enemyPokemon().shiny) }" src="">
      </div>

      <div class="progress hitpoints" style="height: 20px;">
        <div
          class="progress-bar bg-danger" role="progressbar"
          data-bind="attr:{ style: 'width:' + GymBattle.enemyPokemon().healthPercentage() + '%' }"
          aria-valuemin="0" aria-valuemax="100"
        >
          <span data-bind="text: GymBattle.enemyPokemon().health() + ' / ' + GymBattle.enemyPokemon().maxHealth()" style="font-size: 12px;" />
        </div>
      </div>

      <button
        class="btn btn-sm btn-danger" style="position: absolute; top: 68px; left: 10px;" data-bind="visible: GymRunner.autoRestart()"
        onclick="GymRunner.autoRestart(false)"
      >
        Stop Auto
      </button>
    </div>
  </div>
</template>
