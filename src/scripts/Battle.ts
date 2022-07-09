
import { computed, ref } from 'vue'
import type { Ref } from 'vue-demi'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import * as GameConstants from '~/enums/GameConstants'
import App from '~/scripts/App'
import { usePlayerStore } from '~/stores/player'
import GameHelper from '~/enums/GameHelper'
import { PokemonFactory } from '~/scripts/pokemons/PokemonFactory'
import MapHelper from '~/scripts/worldmap/MapHelper'
import Rand from '~/utilities/Rand'
import { LogBookTypes } from '~/modules/logbook/LogBookTypes'
import OakItemType from '~/modules/enums/OakItemType'
import { useBattleStore } from '~/stores/battle'
import { usePartyStore } from '~/stores/party'
import { useStatisticsStore } from '~/stores/statistics'
import { Pokeballs } from '~/scripts/pokeballs/Pokeballs'
import { useDungeonStore } from '~/stores/dungeon'
/**
 * Handles all logic related to battling
 */
export class Battle {
  static enemyPokemon: BattlePokemon | null

  static counter = 0
  static catching = ref(false)
  static catchRateActual = ref(0)
  static pokeball = ref(GameConstants.Pokeball.Pokeball)
  static lastPokemonAttack = Date.now()
  static lastClickAttack = Date.now()
  static route

  /**
     * Probably not needed right now, but might be if we add more logic to a gameTick.
     */
  public static tick() {
    this.counter = 0
    this.pokemonAttack()
  }

  /**
     * Attacks with Pokémon and checks if the enemy is defeated.
     */
  public static pokemonAttack() {
    // TODO: figure out a better way of handling this
    // Limit pokemon attack speed, Only allow 1 attack per 900ms
    const now = Date.now()
    if (this.lastPokemonAttack > now - 900)
      return

    this.lastPokemonAttack = now
    const battleStore = useBattleStore()
    const enemyPokemon = battleStore.enemyPokemon
    if (!enemyPokemon?.isAlive())
      return
    const partyStore = usePartyStore()
    enemyPokemon.damage(partyStore.calculatePokemonAttack(enemyPokemon.type1, enemyPokemon.type2))
    if (!enemyPokemon.isAlive())
      this.defeatPokemon()
  }

  /**
     * Attacks with clicks and checks if the enemy is defeated.
     */
  public static clickAttack(battleStore = useBattleStore()) {
    const player = usePlayerStore()
    // click attacks disabled and we already beat the starter
    /* if (App.game.challenges.list.disableClickAttack.active() && player.starter() != GameConstants.Starter.None)
      return
*/
    // TODO: figure out a better way of handling this
    // Limit click attack speed, Only allow 1 attack per 50ms (20 per second)
    const now = Date.now()
    if (this.lastClickAttack > now - 50)
      return

    this.lastClickAttack = now
    console.log('clickAttack', battleStore)
    const enemyPokemon = battleStore.enemyPokemon
    if (!enemyPokemon?.isAlive())
      return

    /* GameHelper.incrementObservable(App.game.statistics.clickAttacks) */
    const partyStore = usePartyStore()
    enemyPokemon.damage(partyStore.calculateClickAttack(true))
    if (!enemyPokemon.isAlive())
      this.defeatPokemon()
  }

  /**
     * Award the player with money and exp, and throw a Pokéball if applicable
     */
  public static defeatPokemon() {
    const player = usePlayerStore()
    const battleStore = useBattleStore()
    const enemyPokemon = battleStore.enemyPokemon
    Battle.route = player.route
    enemyPokemon?.defeat()
    const statistics = useStatisticsStore()
    statistics.setRouteKills(player.region, Battle.route)

    // App.game.breeding.progressEggsBattle(Battle.route, player.region)
    const isShiny: boolean = enemyPokemon.shiny
    const pokeBall: GameConstants.Pokeball = new Pokeballs().calculatePokeballToUse(enemyPokemon.id, isShiny)
    console.log('pokeBall', pokeBall)
    if (pokeBall !== GameConstants.Pokeball.None) {
      this.prepareCatch(enemyPokemon, pokeBall)
      setTimeout(
        () => {
          this.attemptCatch(enemyPokemon)
          if (Battle.route != 0)
            this.generateNewEnemy()
        },
        500 || new Pokeballs().calculateCatchTime(pokeBall),
      )
    }
    else {
      this.generateNewEnemy()
    }
    this.gainItem()
    // player.lowerItemMultipliers(MultiplierDecreaser.Battle)
  }

  /**
     * Generate a new enemy based on the current route and region.
     * Reset the counter.
     */
  public static generateNewEnemy() {
    const player = usePlayerStore()
    this.counter = 0
    console.log('player', player.route, player.region)
    const enemyPokemon = (PokemonFactory.generateWildPokemon(player.route, player.region))
    console.log('enemyPokemon', enemyPokemon)
    const battleStore = useBattleStore()
    battleStore.setEnemyPokemon(enemyPokemon)
    return enemyPokemon
    /* GameHelper.incrementObservable(App.game.statistics.pokemonEncountered[enemyPokemon.id])
    GameHelper.incrementObservable(App.game.statistics.totalPokemonEncountered)
    if (enemyPokemon.shiny) {
      GameHelper.incrementObservable(App.game.statistics.shinyPokemonEncountered[enemyPokemon.id])
      GameHelper.incrementObservable(App.game.statistics.totalShinyPokemonEncountered)
      App.game.logbook.newLog(LogBookTypes.SHINY, `[${Routes.getRoute(player.region, player.route).routeName}] You encountered a wild shiny ${enemyPokemon.name}.`)
    }
    else if (!App.game.party.alreadyCaughtPokemon(enemyPokemon.id) && enemyPokemon.health) {
      App.game.logbook.newLog(LogBookTypes.NEW, `[${Routes.getRoute(player.region, player.route).routeName}] You encountered a wild ${enemyPokemon.name}.`)
    } */
  }

  protected static calculateActualCatchRate(enemyPokemon: BattlePokemon, pokeBall: GameConstants.Pokeball) {
    const pokeballBonus = new Pokeballs().getCatchBonus(pokeBall)
    // const oakBonus = App.game.oakItems.calculateBonus(OakItemType.Magic_Ball)
    const oakBonus = 0
    const totalChance = GameConstants.clipNumber(enemyPokemon.catchRate + pokeballBonus + oakBonus, 0, 100)
    return totalChance
  }

  protected static prepareCatch(enemyPokemon: BattlePokemon, pokeBall: GameConstants.Pokeball, battleStore: any = useBattleStore()) {
    this.pokeball.value = (pokeBall)
    battleStore.setCatching(true)
    battleStore.setCatchRateActual(this.calculateActualCatchRate(enemyPokemon, pokeBall))
    new Pokeballs().usePokeball(pokeBall)
  }

  protected static attemptCatch(enemyPokemon: BattlePokemon, battleStore: any = useBattleStore()) {
    console.log('attemptCatch', battleStore)
    const partyStore = usePartyStore()
    if (enemyPokemon == null) {
      this.catching.value = (false)
      return
    }
    if (Rand.chance(this.catchRateActual.value / 100)) { // Caught
      this.catchPokemon(enemyPokemon)
    }
    else if (enemyPokemon.shiny) { // Failed to catch, Shiny
      // App.game.logbook.newLog(LogBookTypes.ESCAPED, `The Shiny ${enemyPokemon.name} escaped!`)
      console.log(`The Shiny ${enemyPokemon.name} escaped!`)
    }
    else if (!partyStore.alreadyCaughtPokemon(enemyPokemon.id)) { // Failed to catch, Uncaught
      // App.game.logbook.newLog(LogBookTypes.ESCAPED, `The wild ${enemyPokemon.name} escaped!`)
      console.log(`The wild ${enemyPokemon.name} escaped!`)
    }
    battleStore.setCatching(false)
    battleStore.setCatchRateActual(0)
  }

  public static catchPokemon(enemyPokemon: BattlePokemon) {
    const player = usePlayerStore()
    const catchRoute = Battle.route || player.town?.dungeon?.difficultyRoute || 1
    // App.game.wallet.gainDungeonTokens(PokemonFactory.routeDungeonTokens(catchRoute, player.region))
    // App.game.oakItems.use(OakItemType.Magic_Ball)
    const party = usePartyStore()
    party.gainPokemonById(enemyPokemon.id, enemyPokemon.shiny)
  }

  static gainItem() {
    const player = usePlayerStore()
    const p = MapHelper.normalizeRoute(Battle.route, player.region) / 1600 + 0.009375

    if (Rand.chance(p))
      App.game.farming.gainRandomBerry()
  }
}
