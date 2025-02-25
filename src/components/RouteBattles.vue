<script setup>
import { ref, watch } from 'vue'
import { Battle } from '~/scripts/Battle'
import * as GameConstants from '~/scripts/GameConstants'
import { Pokeball } from '~/scripts/GameConstants'
import { PokemonHelper } from '~/scripts/pokemons/PokemonHelper'
import { RouteHelper } from '~/scripts/wildBattle/RouteHelper'
import Routes from '~/scripts/wildBattle/Routes'
import { useBattleStore } from '~/stores/battle'
import { useGameStore } from '~/stores/game'
import { usePlayerStore } from '~/stores/player'
import { useStatisticsStore } from '~/stores/statistics'

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

// 是否正在播放动画
const isAnimating = ref(false)

// 监听敌人变化和捕捉状态变化，重置动画状态
watch([() => pokemon.value?.id, catching], () => {
  // 当敌人ID变化或捕捉状态变化时，重置动画状态
  isAnimating.value = false
}, { immediate: true })

// 攻击敌人并触发动画
function attackEnemy() {
  // 只有在非捕捉状态下才触发攻击和动画
  if (!catching.value) {
    Battle.clickAttack()

    // 触发动画
    if (!isAnimating.value) {
      isAnimating.value = true

      // 400毫秒后停止动画
      setTimeout(() => {
        isAnimating.value = false
      }, 400)
    }
  }
}
</script>

<template>
  <div
    v-if="gameState === GameConstants.GameState.fighting"
    class="row justify-content-center no-gutters"
  >
    <div
      class="col no-gutters clickable" style="height: 240px; display: block;"
      @click="attackEnemy"
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
          <!-- If all Pokémon on the route are caught -->
          <img
            v-show="hasCatch"
            title="You have captured all Pokémon on this route!" class="pokeball-smallest"
            src="/src/assets/images/pokeball/Pokeball.svg"
          >

          <!-- If all Pokémon on the route are caught shiny -->
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
            :class="{ 'pokemon-hit-animation': isAnimating }"
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
          :style="`width:${battle.enemyPokemon?.healthPercentage}%`"
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

<style lang="scss">
.enemy {
  margin: 25px auto;
  display: block;
}
.pageItemTitle {
  .left {
    display: flex;
    align-items: center;
  }
}

/* 宝可梦击中效果（闪白+向右后退） */
.pokemon-hit-animation {
  animation: pokemon-hit 0.4s ease-in-out;
  transform-origin: center;
}

@keyframes pokemon-hit {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  10% {
    transform: translateX(0);
    opacity: 0.6;
  }
  20% {
    transform: translateX(12px);
    opacity: 0.2;
  }
  30% {
    transform: translateX(10px);
    opacity: 0.6;
  }
  40% {
    transform: translateX(5px);
    opacity: 0.8;
  }
  50% {
    transform: translateX(0);
    opacity: 1;
  }
  60% {
    transform: translateX(-3px);
  }
  70% {
    transform: translateX(0);
  }
  80% {
    transform: translateX(-2px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
