<script lang="ts" setup>
import { useGameStore } from '~/stores/game'
import * as GameConstants from '~/enums/GameConstants'
import { DungeonRunner } from '~/scripts/dungeons/DungeonRunner'
import { useDungeonStore } from '~/stores/dungeon'
import { GameState } from '~/enums/GameConstants'
import { GymBattle } from '~/scripts/gym/GymBattle'
import { useGymStore } from '~/stores/gym'
import { GymRunner } from '~/scripts/gym/GymRunner'
import Settings from '~/modules/settings'
import { PokemonHelper } from '~/scripts/pokemons/PokemonHelper'
const gameState = computed(() => {
  return useGameStore().gameState
})

const gymStore = useGymStore()
const gym = computed(() => {
  return gymStore.gym
})
const enemyPokemon = computed(() => {
  return gymStore.enemyPokemon
})
const autoRestart = computed(() => {
  return gymStore.autoRestart
})
</script>
<template>
  <div v-if="gameState === GameState.gym" class="row justify-content-center no-gutters">
    <div class="col no-gutters clickable" style="height: 220px; display: block;" @click="GymBattle.clickAttack()">
      <h2 class="pageItemTitle" style="display: block;">
        <div class="left">
          <div data-bind="text: ">
            {{ gym.leaderName.replace(/\d/g,'') }}
          </div>
        </div>

        <div>
          <div data-bind="text: GymBattle.enemyPokemon().name">
            {{ enemyPokemon.name }}
          </div>
        </div>

        <div class="right">
          <span v-for="item in new Array(GymBattle.pokemonsDefeatedComputable)">
            <img src="/src/assets/images/pokeball/Pokeball.svg" class="pokeball-smallest pokeball-defeated">
          </span>
          <span v-for="item in new Array(GymBattle.pokemonsUndefeatedComputable)">
            <img src="/src/assets/images/pokeball/Pokeball.svg" class="pokeball-smallest">
          </span>
        </div>

        <div class="progress timer">
          <div
            class="progress-bar bg-danger" role="progressbar"
            :style=" 'width:' + GymRunner.timeLeftPercentage + '%'"
            :class="GymRunner.timeLeftSeconds < 10?'bg-danger':'bg-primary'"
            data-bind="attr:{ style: 'width:' + GymRunner.timeLeftPercentage() + '%' },
                     css: { 'bg-danger': GymRunner.timeLeftSeconds() < 10, 'bg-primary': GymRunner.timeLeftSeconds() >= 10 }"
            aria-valuemin="0" aria-valuemax="100"
          >
            <span data-bind="text: GymRunner.timeLeftSeconds() + 's'" style="font-size: 12px;">
              {{ GymRunner.timeLeftSeconds }}
            </span>
          </div>
        </div>
      </h2>

      <!--  v-if="Settings.getSetting('showGymGoAnimation').observableValue"    -->
      <div v-if="false" id="gymGoContainer">
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
        <img mx-auto class="enemy" :src="PokemonHelper.getImage(enemyPokemon, enemyPokemon.shiny)">
      </div>

      <div class="progress hitpoints" style="height: 20px;">
        <div
          class="progress-bar bg-danger" role="progressbar"
          :style=" 'width:' + enemyPokemon.healthPercentage + '%'"
          data-bind="attr:{ style: 'width:' + GymBattle.enemyPokemon().healthPercentage() + '%' }"
          aria-valuemin="0" aria-valuemax="100"
        >
          <span data-bind="text: GymBattle.enemyPokemon().health() + ' / ' + GymBattle.enemyPokemon().maxHealth()" style="font-size: 12px;">
            {{ enemyPokemon.health }} / {{ enemyPokemon.maxHealth }}
          </span>
        </div>
      </div>

      <button
        v-if="autoRestart" class="btn btn-sm btn-danger" style="position: absolute; top: 68px; left: 10px;"
        data-bind="visible: GymRunner.autoRestart()"
        @click="gymStore.setAutoRestart(false)"
      >
        Stop Auto
      </button>
    </div>
  </div>
</template>
