
import { computed, ref } from 'vue'
import type { Ref } from 'vue-demi'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import { GameState, Pokeball } from '~/scripts/GameConstants'
import App from '~/scripts/App'
import { usePlayerStore } from '~/stores/player'
import { useGameStore } from '~/stores/game'
import { useBattleStore } from '~/stores/battle'
import GameHelper from '~/scripts/GameHelper'
import { PokemonFactory } from '~/scripts/pokemons/PokemonFactory'
import MapHelper from '~/scripts/worldmap/MapHelper'
import Rand from '~/utilities/Rand'
import { LogBookTypes } from '~/modules/logbook/LogBookTypes'
import OakItemType from '~/modules/enums/OakItemType'
import { usePartyStore } from '~/stores/party'
import { useStatisticsStore } from '~/stores/statistics'
import { Pokeballs } from '~/scripts/pokeballs/Pokeballs'
import { useDungeonStore } from '~/stores/dungeon'
/**
 * Handles all logic related to battling
 */
export class Battle {
  static counter = 0
  static catching = ref<boolean>(false)
  static catchRateActual = ref<number>(0)
  static pokeball = ref<Pokeball>(Pokeball.Pokeball)
  static lastPokemonAttack = Date.now()
  static lastClickAttack = Date.now()
  static route: number

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
public static clickAttack(battleStore = useBattleStore(), gameStore = useGameStore()) {
    const player = usePlayerStore()

    // Skip if already fighting
    if (gameStore.gameState === GameState.fighting) {
      // More lenient click limit
      const now = Date.now() 
      if (this.lastClickAttack > now - 10)
        return
      this.lastClickAttack = now
    }

    const enemyPokemon = battleStore.enemyPokemon 
    if (!enemyPokemon?.isAlive())
      return

    const partyStore = usePartyStore()
    enemyPokemon.damage(partyStore.calculateClickAttack(true))
    if (!enemyPokemon.isAlive())
      this.defeatPokemon()

    // Log battle state for debugging
    console.debug('Battle status:', {
      enemyPokemon,
      damage: partyStore.calculateClickAttack(true)
    })
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

    // Handle auto-catching defeated Pokemon
    if (enemyPokemon?.health <= 0 || enemyPokemon?.isAlive() === false) {
      const isShiny: boolean = enemyPokemon.shiny
      const pokeBall: GameConstants.Pokeball = new Pokeballs().calculatePokeballToUse(enemyPokemon.id, isShiny)

      if (pokeBall !== GameConstants.Pokeball.None) {
        this.prepareCatch(enemyPokemon, pokeBall)
        setTimeout(
          () => {
            this.attemptCatch(enemyPokemon)
            if (Battle.route != 0)
              this.generateNewEnemy()
          },
          GameConstants.debug ? 200 : new Pokeballs().calculateCatchTime(pokeBall),
        )
        return
      }
    }
    this.generateNewEnemy()
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
    battleStore.enemyPokemon = (enemyPokemon)
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

  protected static calculateActualCatchRate(enemyPokemon: BattlePokemon, pokeBall: Pokeball): number {
    const pokeballs = new Pokeballs()
    const selectedBall = pokeballs.pokeballs[pokeBall]
    const pokeballBonus = selectedBall.calculateCatchProbability(enemyPokemon.health)
    const statusBonus = enemyPokemon.status ? 10 : 0 // Bonus for status conditions
    const oakBonus = App.game.oakItems.calculateBonus(OakItemType.Magic_Ball) || 0

    const totalChance = clipNumber(pokeballBonus + statusBonus + oakBonus, 0, 100)
    return totalChance
  }

  protected static prepareCatch(enemyPokemon: BattlePokemon, pokeBall: Pokeball, battleStore = useBattleStore()): void {
    this.pokeball.value = pokeBall
    battleStore.catching = true
    battleStore.catchRateActual = this.calculateActualCatchRate(enemyPokemon, pokeBall)
    new Pokeballs().usePokeball(pokeBall)
  }

  protected static attemptCatch(enemyPokemon: BattlePokemon, battleStore: any = useBattleStore()) {
    const partyStore = usePartyStore()
    const pokeballs = new Pokeballs()

    if (enemyPokemon == null) {
      battleStore.catching = false
      return
    }

    const criticalCatch = pokeballs.pokeballs[this.pokeball.value].isCriticalCatch()
    const catchRate = criticalCatch ? 100 : battleStore.catchRateActual

    if (Rand.chance(catchRate / 100)) {
      App.game.logbook.newLog(LogBookTypes.CAUGHT, `You caught ${enemyPokemon.shiny ? 'a shiny' : 'a'} ${enemyPokemon.name}!`)
      this.catchPokemon(enemyPokemon)
      this.triggerCatchAnimation(true, criticalCatch)
    } else {
      if (enemyPokemon.shiny) {
        App.game.logbook.newLog(LogBookTypes.ESCAPED, `The Shiny ${enemyPokemon.name} escaped!`)
      } else if (!partyStore.alreadyCaughtPokemon(enemyPokemon.id)) {
        App.game.logbook.newLog(LogBookTypes.ESCAPED, `The wild ${enemyPokemon.name} escaped!`)
      }
      this.triggerCatchAnimation(false)
    }
    battleStore.catching = false
    battleStore.catchRateActual = (0)
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
