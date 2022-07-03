<script setup lang="ts">
import * as GameConstants from '~/enums/GameConstants'
import { useGameStore } from '~/stores/game'
import { usePlayerStore } from '~/stores/player'
import { DungeonTown } from '~/scripts/towns/Town'
import { Gym } from '~/scripts/gym/Gym'
import { useStatisticsStore } from '~/stores/statistics'
import { DungeonRunner } from '~/scripts/dungeons/DungeonRunner'

const statistics = useStatisticsStore()
const gameState = computed(() => {
  return useGameStore().gameState
})
const player = usePlayerStore()
const backgroundImage = computed(() => {
  return { backgroundImage: `url('/src/assets/images/towns/${player.town?.name.replace(/'/, '\\\'')}.png')` }
})
</script>

<template>
  <div
    v-if=" gameState === GameConstants.GameState.town"
    id="townView"
    :style="backgroundImage"
    class="justify-content-center no-gutters no-select"
  >
    <div class="row justify-content-center no-gutters">
      <div class="col no-gutters">
        <button
          type="button" class="btn btn-outline-info" style="float: right;"
          data-bind="visible: player.town() instanceof DungeonTown && !QuestLineHelper.isQuestLineCompleted('Tutorial Quests'), tooltip: { title: 'Capture Pokémon to gain Dungeon Tokens in order to battle dungeons.', trigger: 'hover', placement:'left' }"
        >
          ?
        </button>
        <h2 class="pageItemTitle">
          <div>
            {{ player.town?.name }}
          </div>
          <div v-if="player.town instanceof DungeonTown && player.town?.dungeon">
            <!-- ko if: QuestLineHelper.isQuestLineCompleted('Tutorial Quests') -->
            <div
              class="right"
              data-bind="using: App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(player.town().name)]()"
            >
              <div data-bind="text: $data.toLocaleString('en-US')">
                0
              </div>
              <div data-bind="visible: QuestLineHelper.isQuestLineCompleted('Tutorial Quests')">
                clears
              </div>
            </div>
            <!-- /ko -->
            <!--If all Pokémon in the dungeon are caught-->
            <div
              data-bind="if: (!DungeonRunner.dungeonCompleted(player.town().dungeon, true) && DungeonRunner.dungeonCompleted(player.town().dungeon, false))"
            >
              <img
                title="You have captured all Pokémon in this dungeon!" class="pokeball-smallest"
                src="assets/images/pokeball/Pokeball.svg"
              >
            </div>

            <!--If all Pokémon in the dungeon are caught shiny-->
            <div data-bind="if: DungeonRunner.dungeonCompleted(player.town().dungeon, true)">
              <img
                title="You have captured all Pokémon shiny in this dungeon!"
                class="pokeball-smallest"
                src="assets/images/pokeball/Pokeball-shiny.svg"
              >
            </div>
          </div>
        </h2>
      </div>
    </div>
    <div class="row no-gutters">
      <div class="col-4 no-gutters">
        <div class="list-group">
          {{ player.town.dungeon }}
          <button
            v-if="player.town instanceof DungeonTown"
            class="btn btn-secondary p-0"
            :class="player.town.dungeon && App.game.wallet.currencies[GameConstants.Currency.dungeonToken]() >= player.town.dungeon.tokenCost ? 'btn btn-success p-0' : 'btn btn-secondary p-0'"
            @click="DungeonRunner.initializeDungeon(player.town.dungeon)"
          >
            Start<br>
            <span
              data-bind="template: {
              name: 'currencyTemplate',
               data: {'amount': player.town().dungeon.tokenCost, 'currency': GameConstants.Currency.dungeonToken}
               }"
            />
          </button>

          <!-- ko foreach: player.town().content -->
          <div
            v-for="data in player.town.content"
            :key="data.id"
            class="btn-group btn-block"
            style="margin-top: 0px;"
          >
            <button
              v-if="data.isVisible()"
              :class="data.cssClass() + (data.isUnlocked() ? '' : ' disabled')"

              tooltip=" (data.tooltip || data.clears() ? { title: data.clears() != undefined ? `Total Clears: ${data.clears()}` : data.tooltip, trigger: 'hover', placement: 'left' } : undefined)"
              @click=" data.protectedOnclick()"
            >
              {{ data.text() }}
            </button>
            <!-- ko if: $data instanceof Gym -->
            <button
              v-if="data instanceof Gym && data.isUnlocked() && statistics.gymsDefeated[GameConstants.getGymIndex(data.town)]() >= 100"
              class="btn btn-info p-0 btn-gym-auto-restart"
              tooltip=" { html: true, title: `Auto restart Gym fight<br/>Cost: <img src='assets/images/currency/money.svg' height='18px'></button> ${($data.moneyReward * 2).toLocaleString('en-US')} per battle<br/><br/><i class='text-warning'>You will not receive Pokédollars for clearing the gym</i>`, trigger: 'hover', placement:'right' }"
              @click="GymRunner.startGym(data, true)"
            >
              ↻
            </button>
            <!-- /ko -->
          </div>
          <!-- /ko -->
        </div>
      </div>
      <div class="col-5" />
      <div class="col-3 no-gutters">
        <div v-for="data in player.town.npcs" class="list-group">
          <!-- ko if: $data.isVisible() -->
          <button
            class="btn btn-info"
            @click="data.openDialog"
          >
            {{ data.name }}
          </button>
          <!-- /ko -->
        </div>
      </div>
    </div>
    <div style="flex-grow: 1;" />
    <div v-if="(player.town.dungeon && player.town instanceof DungeonTown)">
      <div id="dungeonPokemonList" class="card">
        <!--Display all available Pokémon in this dungeon-->
        <ul class="list-inline">
          <!-- ko foreach: player.town().dungeon.normalEncounterList -->
          <li class="list-inline-item">
            <img
              class="dungeon-pokemon-preview" src="" data-bind="attr:{ src: $data.image },
            css: { 'dungeon-pokemon-locked': $data.hidden }"
              onerror="this.src='assets/images/trainers/Mysterious Trainer.png';"
            >
            <sup class="shiny" data-bind="visible: $data.shiny">✨</sup>
            <img
              class="lock" src="assets/images/breeding/lock.svg" data-bind="
            hidden: !$data.lock,
            tooltip: {
                title: 'Try talking to the locals. Sometimes they know more than you think.',
                html: true,
                placement: 'bottom',
                trigger: 'hover'
            }"
            >
          </li>
          <!-- /ko -->
          <!--Display all available bosses in this dungeon-->
          <!-- ko foreach: player.town().dungeon.bossEncounterList -->
          <li class="list-inline-item" data-bind="hidden: $data.hide">
            <img class="boss" src="assets/images/dungeons/boss.svg">
            <img
              class="dungeon-pokemon-preview" src="" data-bind="attr:{ src: $data.image },
            css: { 'dungeon-pokemon-locked': $data.hidden }"
              onerror="this.src='assets/images/trainers/Mysterious Trainer.png';"
            >
            <sup class="shiny" data-bind="visible: $data.shiny">✨</sup>
            <img
              class="lock" src="assets/images/breeding/lock.svg" data-bind="hidden: !$data.lock,
            tooltip: {
                title: 'Try talking to the locals. Sometimes they know more than you think.',
                html: true,
                placement: 'bottom',
                trigger: 'hover'
            }"
            >
          </li>
          <!-- /ko -->
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#townView {
  min-height: 263px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;

  display: flex;
  flex-direction: column;

  animation: bounceBackground 60s linear infinite alternate;

  .featureList {
    li {
      min-width: 100%;
      padding-bottom: 3px;
    }
  }

  #dungeonPokemonList {
    width: 100%;

    .list-inline-item {
      position: relative;

      .lock {
        position: absolute;
        width: 100%;
        left: 0px;
      }

      .shiny {
        position: absolute;
        top: 10px;
        right: -5px;
      }
    }
  }

  .btn-gym-auto-restart {
    flex: 0 0 36px;
  }
}

@-webkit-keyframes bounceBackground {
  from {
    background-position: top left;
  }
  to {
    background-position: bottom right;
  }
}

@keyframes bounceBackground {
  from {
    background-position: top left;
  }
  to {
    background-position: bottom right;
  }
}
</style>
