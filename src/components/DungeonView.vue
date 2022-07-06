<script lang="ts" setup>
import { useGameStore } from '~/stores/game'
import * as GameConstants from '~/enums/GameConstants'
import {PokemonHelper} from "~/scripts/pokemons/PokemonHelper";
import {DungeonRunner} from "~/scripts/dungeons/DungeonRunner";
import {useDungeonStore} from "~/stores/dungeon";
const gameState = useGameStore()
const dungeon = computed(()=>{
  return useDungeonStore().dungeon
})
</script>
<template>
  <div v-if="gameState.gameState === GameConstants.GameState.dungeon" class="row justify-content-center no-gutters">
    <div
      class="col no-gutters clickable"
      style="height: 220px; display: block;"
      data-bind="click: function() { DungeonRunner.handleClick() }"
      @click="DungeonRunner.handleClick()"
    >
      <h2 class="pageItemTitle" style="display: block;">
        <div v-if="DungeonBattle.enemyPokemon() && DungeonBattle.enemyPokemon().health()">
          <div data-bind="text: DungeonBattle.enemyPokemon().name">
            {{ DungeonBattle.enemyPokemon().name }}
          </div>
          <!-- ko if: !DungeonBattle.trainer() -->
          <div data-bind="template: { name: 'caughtStatusTemplate', data: {'status': PartyController.getCaughtStatus(DungeonBattle.enemyPokemon().id)}}" />
        <!-- /ko -->
        </div>
        <div v-if="!DungeonBattle.enemyPokemon() || !DungeonBattle.enemyPokemon().health()">
                &nbsp;
        </div>

        <div class="left">
          <!-- ko if: !DungeonBattle.trainer() -->
          <div data-bind="text: DungeonRunner.dungeon.name">
            {{ dungeon.name }}
          </div>
          <!-- /ko -->
          <!-- ko if: DungeonBattle.trainer() -->
          <div data-bind="text: DungeonBattle.trainer().name">
            {{DungeonBattle.trainer().name}}
          </div>
          <!-- /ko -->

          <!-- ko if: !DungeonBattle.trainer() -->

          <!--If all Pokémon in the dungeon are caught-->
          <div v-if="(!DungeonRunner.dungeonCompleted(DungeonRunner.dungeon, true) && DungeonRunner.dungeonCompleted(DungeonRunner.dungeon, false))">
            <img
              title="You have captured all Pokémon in this dungeon!" class="pokeball-smallest"
              src="/src/assets/images/pokeball/Pokeball.svg"
            >
          </div>

          <!--If all Pokémon in the dungeon are caught shiny-->
          <div v-if="DungeonRunner.dungeonCompleted(dungeon, true)">
            <img
              title="You have captured all Pokémon shiny in this dungeon!"
              class="pokeball-smallest"
              src="/src/assets/images/pokeball/Pokeball-shiny.svg"
            >
          </div>

        <!-- /ko -->
        </div>

        <!-- ko ifnot: DungeonBattle.trainer() -->
        <div
            class="right"
            :class=" DungeonRunner.timeLeftSeconds() < 20?'text-danger':'text-primary'"
            data-bind="css: { 'text-danger': DungeonRunner.timeLeftSeconds() < 20, 'text-primary': DungeonRunner.timeLeftSeconds() >= 20 }">
          <h4>
            <strong data-bind="text: DungeonRunner.timeLeftSeconds() + 's'" >
            {{DungeonRunner.timeLeftSeconds() + 's'}}
          </strong>
          </h4>
        </div>
        <!-- /ko -->
        <!-- ko if: DungeonBattle.trainer() -->
        <div class="right">
          <span v-for="item in  new Array(DungeonBattle.defeatedTrainerPokemon())">
            <img src="/src/assets/images/pokeball/Pokeball.svg" class="pokeball-smallest pokeball-defeated">
          </span>
          <span v-for="item in  new Array(DungeonBattle.remainingTrainerPokemon())">
            <img src="/src/assets/images/pokeball/Pokeball.svg" class="pokeball-smallest">
          </span>
        </div>
        <!-- /ko -->
        <div class="progress timer">
          <div
            class="progress-bar bg-danger" role="progressbar"
            :class="DungeonRunner.timeLeftSeconds() < 20?'bg-danger':'bg-primary'"
            :style="'width:' + DungeonRunner.timeLeftPercentage() + '%'"
            data-bind="attr:{ style: 'width:' + DungeonRunner.timeLeftPercentage() + '%' },
                     css: { 'bg-danger': DungeonRunner.timeLeftSeconds() < 20, 'bg-primary': DungeonRunner.timeLeftSeconds() >= 20 }"
            aria-valuemin="0" aria-valuemax="100"
          >
            <span data-bind="text: DungeonRunner.timeLeftSeconds() + 's'" style="font-size: 12px;" >{{DungeonRunner.timeLeftSeconds() + 's'}}</span>
          </div>
        </div>
      </h2>

      <!-- ko if: (DungeonRunner.fighting() || DungeonBattle.catching)  -->
      <div v-if="DungeonBattle.enemyPokemon">
        <div style="position:absolute; left:65%;" v-if="DungeonBattle.trainer()">
          <img data-bind="attr:{ src: DungeonBattle.trainer().image }"
               :src="DungeonBattle.trainer().image"
               onerror="this.src='assets/images/trainers/Mysterious Trainer.png';">
        </div>
        <div>
          <div v-if="!DungeonBattle.catching">
            <img
              class="enemy"
              data-bind="attr:{ src: PokemonHelper.getImage(DungeonBattle.enemyPokemon(), DungeonBattle.enemyPokemon().shiny) }"
              :src="PokemonHelper.getImage(DungeonBattle.enemyPokemon(), DungeonBattle.enemyPokemon().shiny)"
            >
          </div>
          <div v-if="DungeonBattle.catching" class="catchChance">
            <img
              class="pokeball-animated"
              data-bind="attr:{ src: 'assets/images/pokeball/' + GameConstants.Pokeball[DungeonBattle.pokeball()] + '.svg' }"
              :src="'assets/images/pokeball/' + GameConstants.Pokeball[DungeonBattle.pokeball()] + '.svg'"
            >
            <br>
            Catch Chance:
            <div data-bind="text: Math.floor(DungeonBattle.catchRateActual()) + '%'">
              {{ Math.floor(DungeonBattle.catchRateActual()) + '%' }}
            </div>
          </div>
        </div>
        <div class="progress hitpoints" style="height: 20px;">
          <div
            class="progress-bar bg-danger" role="progressbar"
            :style="'width:' + DungeonBattle.enemyPokemon().healthPercentage() + '%'"
            :class="DungeonRunner.fightingBoss()?'healthbar-boss':'bg-danger'"
            data-bind="attr:{ style: 'width:' + DungeonBattle.enemyPokemon().healthPercentage() + '%'}, css: { 'healthbar-boss': DungeonRunner.fightingBoss(), 'bg-danger': !DungeonRunner.fightingBoss()}"
            aria-valuemin="0" aria-valuemax="100"
          >
            <span data-bind="text: DungeonBattle.enemyPokemon().health() + ' / ' + DungeonBattle.enemyPokemon().maxHealth()" style="font-size: 12px;" >
              {{DungeonBattle.enemyPokemon().health() + ' / ' + DungeonBattle.enemyPokemon().maxHealth()}}
            </span>
          </div>
        </div>
      </div>
      <!-- /ko -->
      <!-- ko if: DungeonRunner.map.currentTile().type() === GameConstants.DungeonTile.chest -->
      <div>
        <div class="dungeon-chest" style="height: 95px">
          <img src="/src/assets/images/dungeons/chest.png">
        </div>
        <button class="btn btn-warning chest-button">
          <p>Open</p>
          <p>(+20% Enemy HP)</p>
        </button>
      </div>
      <!-- /ko -->
      <!-- ko if: (DungeonRunner.map.currentTile().type() === GameConstants.DungeonTile.boss && !DungeonRunner.fightingBoss()) -->
      <div>
        <button class="btn btn-danger dungeon-button">
          Start Bossfight
        </button>
      </div>
      <!-- /ko -->
      <!-- ko if: DungeonRunner.map.currentTile().type() === GameConstants.DungeonTile.entrance && DungeonRunner.map.playerMoved() -->
      <div>
        <button class="btn btn-warning dungeon-button">
          Leave Dungeon
        </button>
      </div>
    <!-- /ko -->
    </div>
  </div>
</template>
