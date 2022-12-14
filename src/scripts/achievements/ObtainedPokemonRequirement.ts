
import Requirement from '~/scripts/achievements/Requirement'
import type { PokemonListData } from '~/scripts/pokemons/PokemonList'
import { pokemonMap } from '~/scripts/pokemons/PokemonList'
import * as GameConstants from '~/scripts/GameConstants'
import { useStatisticsStore } from '~/stores/statistics'
export default class ObtainedPokemonRequirement extends Requirement {
  public pokemonID: number

  constructor(pokemon: PokemonListData, value = 1, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
    super(value, option)
    this.pokemonID = pokemon?.id
  }

  public getProgress() {
    return Math.min(useStatisticsStore().getPokemonCaptured(this.pokemonID), this.requiredValue)
  }

  public hint(): string {
    return `${pokemonMap[this.pokemonID].name} needs to be caught.`
  }
}
