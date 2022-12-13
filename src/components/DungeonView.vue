<script lang="ts" setup>
import { useGameStore } from '~/stores/game'
import * as GameConstants from '~/scripts/GameConstants'
import { PokemonHelper } from '~/scripts/pokemons/PokemonHelper'
import { DungeonRunner } from '~/scripts/dungeons/DungeonRunner'
import { DungeonBattle } from '~/scripts/dungeons/DungeonBattle'
import { useDungeonStore } from '~/stores/dungeon'
const gameState = useGameStore()
const dungeonStore = useDungeonStore()
const dungeon = computed(() => {
  return dungeonStore.dungeon
})
const map = computed(() => {
  return dungeonStore.map
})
const enemyPokemon = computed(() => {
  return dungeonStore.enemyPokemon
})
const trainer = computed(() => {
  return dungeonStore.trainer
})
// eslint-disable-next-line no-unused-expressions
</script>
<template>
  <div
    v-if="gameState.gameState === GameConstants.GameState.dungeon"
    class="row justify-content-center no-gutters"
  >
    <!--    -->
    <div
      class="col no-gutters clickable"
      style="height: 240px; display: block;"
      data-bind="click: function() { DungeonRunner.handleClick() }"
      @click="DungeonRunner.handleClick()"
    >
      <h2 class="pageItemTitle" flex style="display: block;">
        <div v-if="enemyPokemon?.health">
          <div data-bind="text: DungeonBattle.enemyPokemon().name">
            {{ enemyPokemon?.name }}
          </div>
          <!-- ko if: !DungeonBattle.trainer() -->
          <div
            v-if="!trainer"
            data-bind="template: { name: 'caughtStatusTemplate', data: {'status': PartyController.getCaughtStatus(DungeonBattle.enemyPokemon().id)}}"
          />
        <!-- /ko -->
        </div>
        <div v-if="!enemyPokemon || !enemyPokemon?.health">
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
            {{ trainer?.name }}
          </div>
          <!-- /ko -->

          <!-- ko if: !DungeonBattle.trainer() -->

          <!--If all Pokémon in the dungeon are caught-->
          <img
            v-if="(!DungeonRunner.dungeonCompleted(dungeon, true) && DungeonRunner.dungeonCompleted(dungeon, false))"
            title="You have captured all Pokémon in this dungeon!" class="pokeball-smallest"
            src="/src/assets/images/pokeball/Pokeball.svg"
          >

          <!--If all Pokémon in the dungeon are caught shiny-->
          <img
            v-if="DungeonRunner.dungeonCompleted(dungeon, true)"
            title="You have captured all Pokémon shiny in this dungeon!"
            class="pokeball-smallest"
            src="/src/assets/images/pokeball/Pokeball-shiny.svg"
          >

        <!-- /ko -->
        </div>

        <!-- ko ifnot: DungeonBattle.trainer() -->
        <div
          v-if="!trainer"
          class="right"
          :class=" DungeonRunner.timeLeftSeconds() < 20?'text-danger':'text-primary'"
          data-bind="css: { 'text-danger': DungeonRunner.timeLeftSeconds() < 20, 'text-primary': DungeonRunner.timeLeftSeconds() >= 20 }"
        >
          <h4>
            <strong data-bind="text: DungeonRunner.timeLeftSeconds() + 's'">
              {{ DungeonRunner.timeLeftSeconds() + 's' }}
            </strong>
          </h4>
        </div>
        <!-- /ko -->
        <!-- ko if: DungeonBattle.trainer() -->
        <div v-if="trainer" class="right">
          <span v-for="item in new Array(DungeonBattle.defeatedTrainerPokemon())">
            <img src="/src/assets/images/pokeball/Pokeball.svg" class="pokeball-smallest pokeball-defeated">
          </span>
          <span v-for="item in new Array(DungeonBattle.remainingTrainerPokemon())">
            <img src="/src/assets/images/pokeball/Pokeball.svg" class="pokeball-smallest">
          </span>
        </div>
        <!-- /ko -->
        <div class="progress timer">
          <div
            class="progress-bar bg-danger" role="progressbar"
            :class="DungeonRunner.timeLeftSeconds() < 20?'bg-danger':'bg-primary'"
            :style="'width:' + DungeonRunner.timeLeftPercentage + '%'"
            data-bind="attr:{ style: 'width:' + DungeonRunner.timeLeftPercentage() + '%' },
                     css: { 'bg-danger': DungeonRunner.timeLeftSeconds() < 20, 'bg-primary': DungeonRunner.timeLeftSeconds() >= 20 }"
            aria-valuemin="0" aria-valuemax="100"
          >
            <span data-bind="text: DungeonRunner.timeLeftSeconds() + 's'" style="font-size: 12px;">{{ DungeonRunner.timeLeftSeconds() + 's' }}</span>
          </div>
        </div>
      </h2>

      <!-- ko if: (DungeonRunner.fighting() || DungeonBattle.catching)  -->
      <div v-if="dungeonStore.fighting || dungeonStore.catching">
        <div v-if="trainer" style="position:absolute; left:65%;">
          <img
            data-bind="attr:{ src: DungeonBattle.trainer().image }"
            :src="trainer.image"
          >
          <!--    onerror="this.src='assets/images/trainers/Mysterious Trainer.png';"      -->
        </div>
        <div flex justify-center items-center>
          <div v-if="!dungeonStore.catching">
            <img
              class="enemy"
              data-bind="attr:{ src: PokemonHelper.getImage(DungeonBattle.enemyPokemon(), DungeonBattle.enemyPokemon().shiny) }"
              :src="PokemonHelper.getImage(enemyPokemon, enemyPokemon?.shiny)"
            >
          </div>
          <div v-if="dungeonStore.catching" class="catchChance">
            <img
              class="pokeball-animated"
              data-bind="attr:{ src: 'assets/images/pokeball/' + GameConstants.Pokeball[DungeonBattle.pokeball()] + '.svg' }"
              :src="'/src/assets/images/pokeball/' + GameConstants.Pokeball[DungeonBattle.pokeball.value] + '.svg'"
            >
            <br>
            Catch Chance:
            <div data-bind="text: Math.floor(DungeonBattle.catchRateActual()) + '%'">
              {{ Math.floor(dungeonStore.catchRateActual) + '%' }}
            </div>
          </div>
        </div>
        <div class="progress hitpoints" style="height: 20px;" flex justify-center items-center>
          <div
            class="progress-bar bg-danger" role="progressbar"
            :style="'width:' + enemyPokemon.healthPercentage + '%'"
            :class="dungeonStore.fightingBoss?'healthbar-boss':'bg-danger'"
            data-bind="attr:{ style: 'width:' + DungeonBattle.enemyPokemon().healthPercentage() + '%'}, css: { 'healthbar-boss': DungeonRunner.fightingBoss(), 'bg-danger': !DungeonRunner.fightingBoss()}"
            aria-valuemin="0" aria-valuemax="100"
          >
            <span data-bind="text: DungeonBattle.enemyPokemon().health() + ' / ' + DungeonBattle.enemyPokemon().maxHealth()" style="font-size: 12px;">
              {{ enemyPokemon.health }} / {{ enemyPokemon.maxHealth?enemyPokemon.maxHealth:0 }}
            </span>
          </div>
        </div>
      </div>
      <!-- /ko -->
      <!-- ko if: DungeonRunner.map.currentTile().type() === GameConstants.DungeonTile.chest -->
      <div v-if="map.currentTile().type === GameConstants.DungeonTile.chest">
        <div class="dungeon-chest" style="height: 95px" flex justify-center items-center>
          <img src="/src/assets/images/dungeons/chest.png">
        </div>
        <button class="btn btn-warning chest-button">
          <p>Open</p>
          <p>(+20% Enemy HP)</p>
        </button>
      </div>
      <!-- /ko -->
      <!-- ko if: (DungeonRunner.map.currentTile().type() === GameConstants.DungeonTile.boss && !DungeonRunner.fightingBoss()) -->
      <div v-if="(map.currentTile().type === GameConstants.DungeonTile.boss && !dungeonStore.fightingBoss)" flex justify-center items-center>
        <button class="btn btn-danger dungeon-button">
          Start Bossfight
        </button>
      </div>
      <!-- /ko -->
      <!-- ko if: DungeonRunner.map.currentTile().type() === GameConstants.DungeonTile.entrance && DungeonRunner.map.playerMoved() -->
      <div v-if="map.currentTile().type === GameConstants.DungeonTile.entrance && map.playerMoved" flex justify-center items-center>
        <button class="btn btn-warning dungeon-button">
          Leave Dungeon
        </button>
      </div>
    <!-- /ko -->
    </div>
  </div>
</template>
<style lang="scss">
#dungeonPokemonList {
  .boss {
    position: absolute;
    bottom: -10px;
    left: -10px;
    width: 35%;
  }
}
.pokeball-small {
  width: 32px;
  height: 32px;
  opacity: 0.2;
}

.pokeball-smallest {
  width: 16px;
  height: 16px;
  margin-bottom: 3px;
  margin-left: 3px;
  box-sizing: content-box;
}
.tile {
  position: relative;
  height: 45px;
  border: 1px solid black;
  margin: 1px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }

  &:not(.tile-visited, .tile-invisible, .tile-player) {
    filter: brightness(50%);
  }
}

.tile-invisible {
  background-color: #333;
}

.tile-player {
  background-color: #2ecc71;
  position: relative;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: var(--trainer-image);
  image-rendering: pixelated;
}

.tile-empty {
  background-color: whitesmoke;
}

.tile-entrance {
  background-color: #3498db;
}

.tile-enemy {
  background-color: #e74c3c;
}

.tile-chest {
  background-color: #f1c40f;
  &::after {
    position: absolute;
    top: 15%;
    left: 15%;
    content: '';
    display: block;
    height: 70%;
    width: 70%;
    background: center / contain no-repeat url('/src/assets/images/dungeons/chest.png');
  }
}

.tile-boss {
  background-color: #9b59b6;
  &::after {
    position: absolute;
    top: 15%;
    left: 15%;
    content: '';
    display: block;
    height: 70%;
    width: 70%;
    background: center / contain no-repeat url('/src/assets/images/dungeons/boss.svg');
  }
}

.healthbar-boss {
  background-color: #9b59b6;
}

.dungeon-board {
  width: 100%;
  padding: 20px;
  margin: auto;
}

.dungeon-chest {
  margin-top: 25px;
}

.chest-button {
  p {
    font-size: small;
    margin-bottom: 0;
  }
}

.dungeon-button {
  margin-top: 50px;
}

.dungeon-pokemon-locked {
  -webkit-filter: brightness(0%); /* Safari 6.0 - 9.0 */
  filter: brightness(0%);
  opacity: 0.2;
}

.dungeon-pokemon-preview {
  max-height: 64px;
  height: auto;
  width: auto;
  margin: -10px -10px -12px;
}

#dungeonPokemonList {
  background: #fff;
  .list-inline-item{
    width: 60px;
  }
  .boss {
    position: absolute;
    bottom: -10px;
    left: -10px;
    width: 35%;
  }
}

.battle-view {
  min-height: 240px !important;

  background-image: url(/src/assets/images/battleBackground/default.png);
  background-size: cover;
  background-position: bottom;
  position: relative;
  &.forest {
    background-image: url(/src/assets/images/battleBackground/forest.png);
    background-position: top;
  }

  &.water {
    background-image: url(/src/assets/images/battleBackground/water.png);
    background-position: top;
  }

  &.ice {
    background-image: url(/src/assets/images/battleBackground/ice.png);
    background-position: top;
  }

  &.cave {
    background-image: url(/src/assets/images/battleBackground/cave.png);
    background-position: top;
  }

  &.gem, &.cave-gem {
    background-image: url(/src/assets/images/battleBackground/cave-gem.png);
    background-position: center;
  }

  &.power-plant {
    background-image: url(/src/assets/images/battleBackground/power-plant.png);
    background-position: center;
  }

  &.mansion {
    background-image: url(/src/assets/images/battleBackground/mansion.png);
    background-position: center;
  }

  &.graveyard {
    background-image: url(/src/assets/images/battleBackground/graveyard.png);
    background-position: center;
  }

  h2 {
    font-size: 2rem;
  }

  span {
    line-height: 1.5;
  }

  .timer {
    position: absolute;
    width: 100%;
    height: 20px;
    top: 36px;
  }

  .pokeball-animated {
    margin-top: 25px;
  }

  .catchChance {
    color: black;
  }

  .hitpoints {
    height: 20px;
    position: absolute;
    bottom: 20px;
    width: 90%;
    left: 5%;
  }
}

.pageItemTitle {
  width: 100%;
  color: whitesmoke;
  background-color: rgba(0,0,0,0.7);
  margin: 0px;
  position: relative;
  .right {
    position: absolute;
    right: 4px;
    top: 4px;
    font-size: 16px;
  }

  .left {
    position: absolute;
    left: 4px;
    top: 4px;
    font-size: 16px;
  }
}

.pageItemFooter {
  width: 100%;
  color: whitesmoke;
  background-color: rgba(0,0,0,0.7);
  margin: 0px;
  position: absolute;
  bottom: 0px;

  .right {
    position: absolute;
    right: 4px;
    bottom: 4px;
    font-size: 16px;
  }

  .left {
    position: absolute;
    left: 4px;
    bottom: 4px;
    font-size: 16px;
  }
}

.pokeball-animated {
  margin: auto;
  height: 96px;
  width: 96px;
  padding: 10px;
  -webkit-animation:spin 1s linear infinite;
  -moz-animation:spin 1s linear infinite;
  animation:spin 1s linear infinite;
}

@-moz-keyframes spin { 100% { -moz-transform: rotate(20deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(20deg); } }

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  15% {
    transform: rotate(10deg);
  }
  30% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(0deg);
  }
  65% {
    transform: rotate(-10deg);
  }
  80% {
    transform: rotate(0deg);
  }
}
</style>
