<template>
  <div
    v-if="gameState === GameConstants.GameState.fighting"
    class="row justify-content-center no-gutters"
  >
    <div
      class="col no-gutters clickable" style="height: 240px; display: block;"
      @click="Battle.clickAttack()"
    >
      <h2 class="pageItemTitle" style="display: block;">
        <div class="right" data-bind="using: App.game.statistics.routeKills[player.region][player.route()]()">
          <span data-bind="text: $data.toLocaleString('en-US')">
            {{ routeKills }}
          </span>
          <span v-show="routeKills < GameConstants.ROUTE_KILLS_NEEDED">
            /10
          </span>
          &nbsp;{{ t(`ui.defeated`) }}
        </div>

        <div class="left">
          <div data-bind="text: Routes.getName(player.route(), player.region)">
            {{ Routes.getName(player.route, player.region) }}
          </div>
          <!--If all Pokémon on the route are caught-->
          <img
            v-show="hasCatch"
            title="You have captured all Pokémon on this route!" class="pokeball-smallest"
            src="/src/assets/images/pokeball/Pokeball.svg"
          >

          <!--If all Pokémon on the route are caught shiny-->
          <img
            v-show="hasCatchShiny"
            title="You have captured all Pokémon shiny on this route!" class="pokeball-smallest"
            src="/src/assets/images/pokeball/Pokeball-shiny.svg"
          >
        </div>

        <div>
          <div data-bind="text: Battle.enemyPokemon().name">
            {{ t(`pokemon.${pokemon.name}`) }}
          </div>
          <div
            data-bind="template: { name: 'caughtStatusTemplate', data: {'status': PartyController.getCaughtStatus(Battle.enemyPokemon().id)}}"
          />
        </div>
      </h2>

      <div>
        <div v-show="!catching">
          <img
            class="enemy"
            :src="pokemonImgUrl"
          >
        </div>
        <div v-show="catching" class="catchChance">
          <img
            class="pokeball-animated"
            :src="pokeballImgUrl"
          >
          {{ t(`ui.Catch Chance`) }}:
          <span data-bind="text:  + '%'">
            {{ Math.floor(battle.catchRateActual) }}%
          </span>
        </div>
      </div>
      <div class="progress hitpoints" style="height: 20px;">
        <div
          class="progress-bar bg-danger" role="progressbar"
          data-bind="attr:{  }"
          :style="'width:' + battle.enemyPokemon?.healthPercentage + '%'"
          aria-valuemin="0" aria-valuemax="100"
        >
          <span
            data-bind="text: "
            style="font-size: 12px;"
          >{{ battle.enemyPokemon?.health }}  /  {{ battle.enemyPokemon?.maxHealth }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Battle } from '~/scripts/Battle'
import { useStatisticsStore } from '~/stores/statistics'
import { usePlayerStore } from '~/stores/player'
import Routes from '~/scripts/wildBattle/Routes'
import { useGameStore } from '~/stores/game'
import * as GameConstants from '~/enums/GameConstants'
import { PokemonHelper } from '~/scripts/pokemons/PokemonHelper'
import { useBattleStore } from '~/stores/battle'
import { Pokeball } from '~/enums/GameConstants'
import { RouteHelper } from '~/scripts/wildBattle/RouteHelper'
const { t, locale } = useI18n()
const gameState = computed(() => {
  return useGameStore().gameState
})
const player = usePlayerStore()
const routeKills = computed(() => {
  return useStatisticsStore().getRouteKills(player.region, player.route)
})
const battle = computed(() => {
  return useBattleStore()
})
const pokemon = computed(() => {
  return useBattleStore().enemyPokemon
})
const catching = computed(() => {
  return useBattleStore().catching
})
const pokeballImgUrl = computed(() => {
  return `/src/assets/images/pokeball/${Pokeball[Battle.pokeball.value]}.svg`
})
const pokemonImgUrl = computed(() => {
  return PokemonHelper.getImage(pokemon.value, pokemon.value?.shiny)
})

const hasCatch = computed(() => {
  return (!RouteHelper.routeCompleted(player.route, player.region, true) && RouteHelper.routeCompleted(player.route, player.region, false))
})

const hasCatchShiny = computed(() => {
  return RouteHelper.routeCompleted(player.route, player.region, true)
})
</script>
<style lang="scss">
.enemy{
  margin: 25px auto;
}
.pageItemTitle{
  .left{
    display: flex;
    align-items: center;
  }
}
</style>
