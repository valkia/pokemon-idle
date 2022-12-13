import AchievementRequirement from './AchievementRequirement'
import * as GameConstants from '~/scripts/GameConstants'

export default class PokerusStatusRequirement extends AchievementRequirement {
  constructor(pokemonRequired: number, private statusRequired: GameConstants.Pokerus) {
    super(pokemonRequired, GameConstants.AchievementOption.more, GameConstants.AchievementType.Pokerus)
  }

  public getProgress() {
    return Math.min(App.game.party.caughtPokemon.filter(p => p.pokerus >= this.statusRequired).length, this.requiredValue)
  }

  public hint(): string {
    return `${this.requiredValue} Pokémon needs to be infected.`
  }
}
