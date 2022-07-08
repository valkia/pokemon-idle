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
    if (!DungeonBattle.trainer)
      return 0

    return DungeonBattle.trainer?.team.length - DungeonBattle.trainerPokemonIndex
  }

  public static defeatedTrainerPokemon = () => {
    if (!DungeonBattle.trainer)
      return 0

    return DungeonBattle.trainerPokemonIndex
  }

  /**
     * Award the player with money and exp, and throw a Pokéball if applicable
     */
  public static defeatPokemon() {
    const dungeon = useDungeonStore()
    const enemyPokemon: BattlePokemon | null = dungeon.enemyPokemon

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
      this.prepareCatch(enemyPokemon, pokeBall)
      setTimeout(
        () => {
          this.attemptCatch(enemyPokemon)
          if (DungeonRunner.defeatedBoss)
            DungeonRunner.dungeonWon()
        },
        500 || new Pokeballs().calculateCatchTime(pokeBall),
      )
    }
    else if (DungeonRunner.defeatedBoss) {
      DungeonRunner.dungeonWon()
    }
  }

  /**
     * Handles defeating a trainer Pokemon
     */
  private static defeatTrainerPokemon() {
    this.enemyPokemon().defeat(true)

    // GameHelper.incrementObservable(this.trainerPokemonIndex)

    // App.game.breeding.progressEggsBattle(DungeonRunner.dungeon.difficultyRoute, player.region)
    // player.lowerItemMultipliers(MultiplierDecreaser.Battle)

    // No Pokemon left, trainer defeated
    if (this.trainerPokemonIndex >= this.trainer.team.length) {
      // rewards for defeating trainer
      if (this.trainer.options.reward) {
        // Custom reward amount on defeat
        App.game.wallet.addAmount(this.trainer.options.reward)
      }
      else {
        const dungeonCost = DungeonRunner.dungeon.tokenCost
        // Reward back 50% or 100% (boss) of the total dungeon DT cost as money (excludes achievement multiplier)
        const money = Math.round(dungeonCost * (DungeonRunner.fightingBoss ? 1 : 0.5))
        App.game.wallet.gainMoney(money, true)
        // Reward back 4% or 10% (boss) of the total dungeon DT cost (excludes achievement multiplier)
        const tokens = Math.round(dungeonCost * (DungeonRunner.fightingBoss ? 0.1 : 0.04))
        App.game.wallet.gainDungeonTokens(tokens, true)
      }

      DungeonRunner.fighting = (false)
      this.trainer = (null)
      useDungeonStore().setTrainer(null)
      this.trainerPokemonIndex = (0)

      // Clearing Dungeon tile
      DungeonRunner.map.currentTile().type = (GameConstants.DungeonTile.empty)
      DungeonRunner.map.currentTile().calculateCssClass()
      const dungeonStore = useDungeonStore()
      dungeonStore.setMap(DungeonRunner.map)
      // Update boss
      if (DungeonRunner.fightingBoss) {
        DungeonRunner.fightingBoss = (false)
        DungeonRunner.defeatedBoss = (true)
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
      this.trainerPokemonIndex = (0)

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
    this.counter = 0

    const pokemon = this.trainer.team[this.trainerPokemonIndex]
    const baseHealth = DungeonRunner.fightingBoss ? pokemon.maxHealth : DungeonRunner.dungeon.baseHealth
    const level = DungeonRunner.fightingBoss ? pokemon.level : DungeonRunner.dungeonLevel()
    const enemyPokemon = PokemonFactory.generateDungeonTrainerPokemon(pokemon, DungeonRunner.chestsOpened, baseHealth, level)

    this.enemyPokemon = (enemyPokemon)
  }

  public static generateNewBoss() {
    DungeonRunner.fighting = (true)
    this.catching = (false)
    this.counter = 0

    // Finding boss from bossList
    const enemy = Rand.fromWeightedArray(DungeonRunner.dungeon.availableBosses(), DungeonRunner.dungeon.bossWeightList)
    // Pokemon
    const player = usePlayerStore()
    if (enemy instanceof DungeonBossPokemon) {
      this.enemyPokemon = (PokemonFactory.generateDungeonBoss(enemy, DungeonRunner.chestsOpened))
      GameHelper.incrementObservable(App.game.statistics.pokemonEncountered[this.enemyPokemon.id])
      GameHelper.incrementObservable(App.game.statistics.totalPokemonEncountered)

      if (this.enemyPokemon.shiny) {
        GameHelper.incrementObservable(App.game.statistics.shinyPokemonEncountered[this.enemyPokemon.id])
        GameHelper.incrementObservable(App.game.statistics.totalShinyPokemonEncountered)
        App.game.logbook.newLog(LogBookTypes.SHINY, `[${player.town.dungeon.name}] You encountered a Shiny ${this.enemyPokemon.name}.`)
      }
      else if (!App.game.party.alreadyCaughtPokemon(this.enemyPokemon.id)) {
        App.game.logbook.newLog(LogBookTypes.NEW, `[${player.town.dungeon.name}] You encountered a wild ${this.enemyPokemon.name}.`)
      }
    }
    else {
      this.trainer = (enemy)
      useDungeonStore().setTrainer(enemy)
      this.trainerPokemonIndex = (0)

      this.generateTrainerPokemon()
    }
  }
}
