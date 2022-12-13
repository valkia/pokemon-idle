import type { PokemonNameType } from '../pokemons/PokemonNameType'
import Requirement from './Requirement'
import { AchievementOption } from '~/scripts/GameConstants'

export default class ObtainedPokemonRequirement extends Requirement {
  constructor(public pokemon: PokemonNameType, uncaught = false) {
    super(1, uncaught ? AchievementOption.less : AchievementOption.more)
  }

  public getProgress() {
    return App.game.party.alreadyCaughtPokemonByName(this.pokemon) ? 1 : 0
  }

  public hint(): string {
    return this.option === AchievementOption.more
      ? `${this.pokemon} needs to be caught.`
      : `${this.pokemon} cannot be caught yet.`
  }
}
