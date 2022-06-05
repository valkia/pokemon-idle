
import type { ComputedRef } from 'vue-demi'
import { computed, ref } from 'vue'
import App from '~/scripts/App'
import * as GameConstants from '~/enums/GameConstants'
import GameHelper from '~/enums/GameHelper'
import { pokemonMap } from '~/scripts/pokemons/PokemonList'
import { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import { PokemonFactory } from '~/scripts/pokemons/PokemonFactory'
import { BattleFrontierRunner } from '~/scripts/battleFrontier/BattleFrontierRunner'
import { usePlayerStore } from '~/stores/player'
import { Battle } from '~/scripts/Battle'
export class BattleFrontierBattle extends Battle {
  static alternateAttack = false
  static pokemonIndex = ref(0)
  static totalPokemons = ref(3)

  // Looks like we don't need this, unless we want to put a random trainer name or similar
  static trainer = ref(0)

  static counter = 0

  // Override pokemon attack method so we can ignore the region multiplier
  public static pokemonAttack() {
    // attack twice as fast if we have defeated this stage
    this.alternateAttack = !this.alternateAttack
    if (this.alternateAttack && BattleFrontierRunner.stage.value > App.game.statistics.battleFrontierHighestStageCompleted())
      return

    // Limit pokemon attack speed, Only allow 1 attack per 450ms
    const now = Date.now()
    if (this.lastPokemonAttack > now - 450)
      return

    this.lastPokemonAttack = now
    if (!this.enemyPokemon?.isAlive())
      return

    this.enemyPokemon.damage(App.game.party.calculatePokemonAttack(this.enemyPokemon.type1, this.enemyPokemon.type2, true))
    if (!this.enemyPokemon.isAlive())
      this.defeatPokemon()
  }

  /**
     * Award the player with exp, gems and go to the next pokemon
     */
  public static defeatPokemon() {
    // This needs to stay as none so the stage number isn't adjusted
    App.game.breeding.progressEggsBattle(BattleFrontierRunner.stage.value, GameConstants.Region.none)
    this.enemyPokemon.defeat(true)
    // Next pokemon
    GameHelper.incrementObservable(this.pokemonIndex)

    if (this.pokemonIndex.value >= 3) {
      // Move on to next stage, reset timer
      BattleFrontierRunner.nextStage()
      this.pokemonIndex.value = 0
    }

    // If player still challenging Battle Frontier, keep generating Pokemon
    if (BattleFrontierRunner.started.value) {
      // Create the next Pokemon to fight
      this.generateNewEnemy()
    }
    else {
      this.enemyPokemon = (null)
    }
  }

  public static generateNewEnemy() {
    const player = usePlayerStore()
    const enemy = pokemonMap.randomRegion(player.highestRegion)
    // This needs to stay as none so the stage number isn't adjusted
    const health = PokemonFactory.routeHealth(BattleFrontierRunner.stage.value + 10, GameConstants.Region.none)
    const level = Math.min(100, BattleFrontierRunner.stage.value)
    // Don't award money per pokemon defeated, award money at the end
    const money = 0
    const shiny = PokemonFactory.generateShiny(GameConstants.SHINY_CHANCE_BATTLE)
    // Give 1 extra gem per pokemon defeated after every 80 stages
    const gems = Math.ceil(BattleFrontierRunner.stage.value / 80)

    const enemyPokemon = new BattlePokemon(enemy.name, enemy.id, enemy.type[0], enemy.type[1], health, level, 0, enemy.exp, new Amount(money, GameConstants.Currency.money), shiny, gems)
    this.enemyPokemon = (enemyPokemon)
  }
}
