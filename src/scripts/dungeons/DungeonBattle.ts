import { Battle } from '~/scripts/Battle'
import type { DungeonTrainer } from '~/scripts/dungeons/DungeonTrainer'
import App from '~/scripts/App'
import GameHelper from '~/enums/GameHelper'
import { LogBookTypes } from '~/modules/logbook/LogBookTypes'
import { PokemonFactory } from '~/scripts/pokemons/PokemonFactory'
import { DungeonRunner } from '~/scripts/dungeons/DungeonRunner'
import type { PokemonNameType } from '~/enums/PokemonNameType'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import { usePlayerStore } from '~/stores/player'
import * as GameConstants from '~/enums/GameConstants'
import { Pokeballs } from '~/scripts/pokeballs/Pokeballs'
import Rand from '~/modules/utilities/Rand'
import { DungeonBossPokemon } from '~/scripts/dungeons/DungeonBossPokemon'
import { useDungeonStore } from '~/stores/dungeon'
import { usePartyStore } from '~/stores/party'

export class DungeonBattle extends Battle {
  static trainer: DungeonTrainer | null = null
  static trainerPokemonIndex: 0

  public static remainingTrainerPokemon = () => {
    const dungeon = useDungeonStore()
    if (!dungeon.trainer)
      return 0

    return dungeon.trainer?.team.length - dungeon.trainerPokemonIndex
  }

  public static defeatedTrainerPokemon = () => {
    const dungeon = useDungeonStore()
    if (!dungeon.trainer)
      return 0

    return dungeon.trainerPokemonIndex
  }

  /**
     * Award the player with money and exp, and throw a Pokéball if applicable
     */
  public static defeatPokemon() {
    console.log('defeatPokemon')
    const dungeon = useDungeonStore()
    const enemyPokemon: BattlePokemon | null = dungeon.enemyPokemon

    console.log('dungeon.trainer', dungeon.trainer, !!dungeon.trainer)
    // Handle Trainer Pokemon defeat
    if (dungeon.trainer) {
      this.defeatTrainerPokemon()
      return
    }

    dungeon.setFighting(false)
    if (dungeon.fightingBoss) {
      dungeon.setFightingBoss(false)
      dungeon.setDefeatedBoss(true)
    }
    enemyPokemon?.defeat()
    const player = usePlayerStore()
    // App.game.breeding.progressEggsBattle(DungeonRunner.dungeon.difficultyRoute, player.region)
    // player.lowerItemMultipliers(MultiplierDecreaser.Battle)

    // Clearing Dungeon tile
    DungeonRunner.map.currentTile().type = (GameConstants.DungeonTile.empty)
    DungeonRunner.map.currentTile().calculateCssClass()
    dungeon.setMap(DungeonRunner.map)
    // Attempting to catch Pokemon
    const isShiny: boolean = enemyPokemon?.shiny
    const pokeBall: GameConstants.Pokeball = new Pokeballs().calculatePokeballToUse(enemyPokemon?.id, isShiny)
    if (pokeBall !== GameConstants.Pokeball.None) {
      this.prepareCatch(enemyPokemon, pokeBall, dungeon)
      setTimeout(
        () => {
          this.attemptCatch(enemyPokemon, dungeon)
          if (dungeon.defeatedBoss)
            DungeonRunner.dungeonWon()
        },
        GameConstants.debug ? 50 : new Pokeballs().calculateCatchTime(pokeBall),
      )
    }
    else if (dungeon.defeatedBoss) {
      DungeonRunner.dungeonWon()
    }
    else {
      dungeon.setEnemyPokemon(null)
    }
  }

  /**
     * Handles defeating a trainer Pokemon
     */
  private static defeatTrainerPokemon() {
    console.log('defeatTrainerPokemon')
    const dungeon = useDungeonStore()
    dungeon.enemyPokemon.defeat(true)
    dungeon.setTrainerPokemonIndex(dungeon.trainerPokemonIndex + 1)
    // GameHelper.incrementObservable(this.trainerPokemonIndex)

    // App.game.breeding.progressEggsBattle(DungeonRunner.dungeon.difficultyRoute, player.region)
    // player.lowerItemMultipliers(MultiplierDecreaser.Battle)

    // No Pokemon left, trainer defeated
    console.log('this.trainerPokemonIndex', dungeon.trainerPokemonIndex)
    console.log('dungeon.trainer', dungeon.trainer.team.length)
    if (dungeon.trainerPokemonIndex >= dungeon.trainer.team.length) {
      // rewards for defeating trainer
      if (dungeon.trainer.options.reward) {
        // Custom reward amount on defeat
        // App.game.wallet.addAmount(dungeon.trainer.options.reward)
      }
      else {
        const dungeonCost = dungeon.dungeon.tokenCost
        // Reward back 50% or 100% (boss) of the total dungeon DT cost as money (excludes achievement multiplier)
        const money = Math.round(dungeonCost * (dungeon.fightingBoss ? 1 : 0.5))
        // App.game.wallet.gainMoney(money, true)
        // Reward back 4% or 10% (boss) of the total dungeon DT cost (excludes achievement multiplier)
        const tokens = Math.round(dungeonCost * (dungeon.fightingBoss ? 0.1 : 0.04))
        // App.game.wallet.gainDungeonTokens(tokens, true)
      }

      dungeon.setFighting(false)
      dungeon.setTrainer(null)

      dungeon.setTrainerPokemonIndex(0)

      // Clearing Dungeon tile
      DungeonRunner.map.currentTile().type = (GameConstants.DungeonTile.empty)
      DungeonRunner.map.currentTile().calculateCssClass()

      dungeon.setMap(DungeonRunner.map)
      // Update boss
      if (dungeon.fightingBoss) {
        dungeon.setFightingBoss(false)
        dungeon.setDefeatedBoss(true)
        DungeonRunner.dungeonWon()
      }
      // Generate next trainer Pokemon
    }
    else {
      this.generateTrainerPokemon()
    }
  }

  public static generateNewEnemy() {
    const dungeon = useDungeonStore()
    dungeon.setCatching(false)
    dungeon.setCounter(0)
    const player = usePlayerStore()
    const party = usePartyStore()
    // Finding enemy from enemyList
    const enemy = Rand.fromWeightedArray(DungeonRunner.dungeon.availableMinions(), DungeonRunner.dungeon.weightList)
    // Pokemon
    if (typeof enemy === 'string' || enemy.hasOwnProperty('pokemon')) {
      const pokemon = (typeof enemy === 'string') ? enemy : (<DetailedPokemon>enemy).pokemon
      const enemyPokemon = PokemonFactory.generateDungeonPokemon(pokemon, DungeonRunner.chestsOpened, DungeonRunner.dungeon.baseHealth, DungeonRunner.dungeonLevel())
      dungeon.setEnemyPokemon(enemyPokemon)

      // GameHelper.incrementObservable(App.game.statistics.pokemonEncountered[enemyPokemon.id])
      // GameHelper.incrementObservable(App.game.statistics.totalPokemonEncountered)
      if (enemyPokemon.shiny) {
        // GameHelper.incrementObservable(App.game.statistics.shinyPokemonEncountered[enemyPokemon.id])
        // GameHelper.incrementObservable(App.game.statistics.totalShinyPokemonEncountered)
        // App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town.dungeon.name}] You encountered a Shiny ${this.enemyPokemon.name}.`)
      }
      else if (!party.alreadyCaughtPokemon(enemyPokemon.id)) {
        // App.game.logbook.newLog(LogBookTypes.NEW, `[${player.town.dungeon.name}] You encountered a wild ${this.enemyPokemon.name}.`)
      }
      // Trainer
    }
    else {
      const trainer = <DungeonTrainer>enemy
      this.trainer = (trainer)
      dungeon.setTrainer(trainer)
      dungeon.setTrainerPokemonIndex(0)

      this.generateTrainerPokemon()
    }

    dungeon.setFighting(true)
  }

  public static generateNewLootEnemy(pokemon: PokemonNameType) {
    this.catching = (false)
    this.counter = 0
    const enemyPokemon = PokemonFactory.generateDungeonPokemon(pokemon
      , DungeonRunner.chestsOpened, DungeonRunner.dungeon.baseHealth * 2, DungeonRunner.dungeonLevel())
    this.enemyPokemon = (enemyPokemon)
    const player = usePlayerStore()
    GameHelper.incrementObservable(App.game.statistics.pokemonEncountered[enemyPokemon.id])
    GameHelper.incrementObservable(App.game.statistics.totalPokemonEncountered)
    if (enemyPokemon.shiny) {
      GameHelper.incrementObservable(App.game.statistics.shinyPokemonEncountered[enemyPokemon.id])
      GameHelper.incrementObservable(App.game.statistics.totalShinyPokemonEncountered)
      App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town.dungeon.name}] You encountered a Shiny ${this.enemyPokemon.name}.`)
    }
    else if (!App.game.party.alreadyCaughtPokemon(this.enemyPokemon.id)) {
      App.game.logbook.newLog(LogBookTypes.NEW, `[${player.town.dungeon.name}] You encountered a wild ${this.enemyPokemon.name}.`)
    }
    DungeonRunner.fighting = (true)
  }

  /**
     * Handles generating the enemy Trainer Pokemon
     */
  public static generateTrainerPokemon() {
    const dungeon = useDungeonStore()

    this.counter = 0

    const pokemon = dungeon.trainer.team[dungeon.trainerPokemonIndex]
    const baseHealth = dungeon.fightingBoss ? pokemon.maxHealth : dungeon.dungeon.baseHealth
    const level = dungeon.fightingBoss ? pokemon.level : dungeon.dungeon.dungeonLevel
    const enemyPokemon = PokemonFactory.generateDungeonTrainerPokemon(pokemon, DungeonRunner.chestsOpened, baseHealth, level)
    console.log('pokemon', pokemon)
    console.log('generateTrainerPokemon', enemyPokemon)
    dungeon.setEnemyPokemon(enemyPokemon)
  }

  public static generateNewBoss() {
    console.log('generateNewBoss')
    const dungeon = useDungeonStore()
    dungeon.setFighting(true)
    dungeon.setCatching(false)
    this.counter = 0
    console.log('dungeon.dungeon', dungeon.dungeon)
    console.log('dungeon.dungeon', dungeon.dungeon.availableBosses())
    console.log('dungeon.dungeon', dungeon.dungeon.bossWeightList)
    console.log('dungeon.dungeon', dungeon.dungeon.bossWeightList)
    // Finding boss from bossList
    const enemy = Rand.fromWeightedArray(dungeon.dungeon.availableBosses(), dungeon.dungeon.bossWeightList)
    // Pokemon
    const player = usePlayerStore()
    const party = usePartyStore()
    console.log('enemy', enemy, (enemy instanceof DungeonBossPokemon))
    if (enemy instanceof DungeonBossPokemon) {
      this.enemyPokemon = (PokemonFactory.generateDungeonBoss(enemy, dungeon.chestsOpened))
      console.log('this.enemyPokemon', this.enemyPokemon)
      // GameHelper.incrementObservable(App.game.statistics.pokemonEncountered[this.enemyPokemon.id])
      // GameHelper.incrementObservable(App.game.statistics.totalPokemonEncountered)
      dungeon.setEnemyPokemon(this.enemyPokemon)
      if (this.enemyPokemon.shiny) {
        /// GameHelper.incrementObservable(App.game.statistics.shinyPokemonEncountered[this.enemyPokemon.id])
        // GameHelper.incrementObservable(App.game.statistics.totalShinyPokemonEncountered)
        // App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town.dungeon.name}] You encountered a Shiny ${this.enemyPokemon.name}.`)
      }
      else if (!party.alreadyCaughtPokemon(this.enemyPokemon.id)) {
        // App.game.logbook.newLog(LogBookTypes.NEW, `[${player.town.dungeon.name}] You encountered a wild ${this.enemyPokemon.name}.`)
      }
    }
    else {
      dungeon.setTrainer(enemy)
      dungeon.setTrainerPokemonIndex(0)

      this.generateTrainerPokemon()
    }
  }
}
window.DungeonBattle = DungeonBattle
