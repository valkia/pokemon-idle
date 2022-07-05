<script lang="ts" setup>
import { useGameStore } from '~/stores/game'
import * as GameConstants from '~/enums/GameConstants'
const gameState = useGameStore()

</script>
<template>
  <div v-if="gameState.gameState === GameConstants.GameState.dungeon" class="row justify-content-center no-gutters">
    <div
      class="col no-gutters clickable" style="height: 220px; display: block;"
      data-bind="click: function() { DungeonRunner.handleClick() }"
    >
      <h2 class="pageItemTitle" style="display: block;">
        <div data-bind="if: DungeonBattle.enemyPokemon() && DungeonBattle.enemyPokemon().health()">
          <div data-bind="text: DungeonBattle.enemyPokemon().name">
            Pokémon name
          </div>
          <!-- ko if: !DungeonBattle.trainer() -->
          <div data-bind="template: { name: 'caughtStatusTemplate', data: {'status': PartyController.getCaughtStatus(DungeonBattle.enemyPokemon().id)}}" />
        <!-- /ko -->
        </div>
        <div data-bind="if: !DungeonBattle.enemyPokemon() || !DungeonBattle.enemyPokemon().health()">
                &nbsp;
        </div>

        <div class="left">
          <!-- ko if: !DungeonBattle.trainer() -->
          <div data-bind="text: DungeonRunner.dungeon.name">
            Dungeon name
          </div>
          <!-- /ko -->
          <!-- ko if: DungeonBattle.trainer() -->
          <div data-bind="text: DungeonBattle.trainer().name">
            Trainer name
          </div>
          <!-- /ko -->

          <!-- ko if: !DungeonBattle.trainer() -->

          <!--If all Pokémon in the dungeon are caught-->
          <div data-bind="if: (!DungeonRunner.dungeonCompleted(DungeonRunner.dungeon, true) && DungeonRunner.dungeonCompleted(DungeonRunner.dungeon, false))">
            <img
              title="You have captured all Pokémon in this dungeon!" class="pokeball-smallest"
              src="assets/images/pokeball/Pokeball.svg"
            >
          </div>

          <!--If all Pokémon in the dungeon are caught shiny-->
          <div data-bind="if: DungeonRunner.dungeonCompleted(DungeonRunner.dungeon, true)">
            <img
              title="You have captured all Pokémon shiny in this dungeon!"
              class="pokeball-smallest"
              src="assets/images/pokeball/Pokeball-shiny.svg"
            >
          </div>

        <!-- /ko -->
        </div>

        <!-- ko ifnot: DungeonBattle.trainer() -->
        <div class="right" data-bind="css: { 'text-danger': DungeonRunner.timeLeftSeconds() < 20, 'text-primary': DungeonRunner.timeLeftSeconds() >= 20 }">
          <h4><strong data-bind="text: DungeonRunner.timeLeftSeconds() + 's'" /></h4>
        </div>
        <!-- /ko -->
        <!-- ko if: DungeonBattle.trainer() -->
        <div class="right">
          <span data-bind="foreach: new Array(DungeonBattle.defeatedTrainerPokemon())">
            <img src="assets/images/pokeball/Pokeball.svg" class="pokeball-smallest pokeball-defeated">
          </span>
          <span data-bind="foreach: new Array(DungeonBattle.remainingTrainerPokemon())">
            <img src="assets/images/pokeball/Pokeball.svg" class="pokeball-smallest">
          </span>
        </div>
        <!-- /ko -->
        <div class="progress timer">
          <div
            class="progress-bar bg-danger" role="progressbar"
            data-bind="attr:{ style: 'width:' + DungeonRunner.timeLeftPercentage() + '%' },
                     css: { 'bg-danger': DungeonRunner.timeLeftSeconds() < 20, 'bg-primary': DungeonRunner.timeLeftSeconds() >= 20 }"
            aria-valuemin="0" aria-valuemax="100"
          >
            <span data-bind="text: DungeonRunner.timeLeftSeconds() + 's'" style="font-size: 12px;" />
          </div>
        </div>
      </h2>

      <!-- ko if: (DungeonRunner.fighting() || DungeonBattle.catching)  -->
      <div data-bind="if: DungeonBattle.enemyPokemon">
        <div style="position:absolute; left:65%;" data-bind="if: DungeonBattle.trainer()">
          <img data-bind="attr:{ src: DungeonBattle.trainer().image }" onerror="this.src='assets/images/trainers/Mysterious Trainer.png';">
        </div>
        <div>
          <div data-bind="ifnot: DungeonBattle.catching">
            <img
              class="enemy"
              data-bind="attr:{ src: PokemonHelper.getImage(DungeonBattle.enemyPokemon(), DungeonBattle.enemyPokemon().shiny) }"
              src=""
            >
          </div>
          <div data-bind="if: DungeonBattle.catching" class="catchChance">
            <img
              class="pokeball-animated"
              data-bind="attr:{ src: 'assets/images/pokeball/' + GameConstants.Pokeball[DungeonBattle.pokeball()] + '.svg' }"
              src=""
            >
            <br>
            Catch Chance:
            <div data-bind="text: Math.floor(DungeonBattle.catchRateActual()) + '%'">
              Catch Rate
            </div>
          </div>
        </div>
        <div class="progress hitpoints" style="height: 20px;">
          <div
            class="progress-bar bg-danger" role="progressbar"
            data-bind="attr:{ style: 'width:' + DungeonBattle.enemyPokemon().healthPercentage() + '%'}, css: { 'healthbar-boss': DungeonRunner.fightingBoss(), 'bg-danger': !DungeonRunner.fightingBoss()}"
            aria-valuemin="0" aria-valuemax="100"
          >
            <span data-bind="text: DungeonBattle.enemyPokemon().health() + ' / ' + DungeonBattle.enemyPokemon().maxHealth()" style="font-size: 12px;" />
          </div>
        </div>
      </div>
      <!-- /ko -->
      <!-- ko if: DungeonRunner.map.currentTile().type() === GameConstants.DungeonTile.chest -->
      <div>
        <div class="dungeon-chest" style="height: 95px">
          <img src="assets/images/dungeons/chest.png">
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
