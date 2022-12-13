import type { PokemonNameType } from '../pokemons/PokemonNameType'
import Requirement from './Requirement'
import { AchievementOption } from '~/scripts/GameConstants'

export default class MegaEvolveRequirement extends Requirement {
  constructor(private name: PokemonNameType) {
    super(1, AchievementOption.equal)
  }

  getProgress(): number {
    return App.game.party.getPokemonByName(this.name)?.megaStone?.canEvolve() ? 1 : 0
  }

  hint(): string {
    return `Can't mega evolve ${this.name} yet.`
  }
}
