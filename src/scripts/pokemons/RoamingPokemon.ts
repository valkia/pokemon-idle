import type { PokemonListData } from '~/scripts/pokemons/PokemonList'
import { pokemonMap } from '~/scripts/pokemons/PokemonList'
import type { PokemonNameType } from '~/enums/PokemonNameType'
import type Requirement from '~/scripts/achievements/Requirement'
import type OneFromManyRequirement from '~/scripts/achievements/OneFromManyRequirement'
import type MultiRequirement from '~/scripts/achievements/MultiRequirement'

export class RoamingPokemon {
  public pokemon: PokemonListData

  constructor(
    public pokemonName: PokemonNameType,
    public unlockRequirement?: Requirement | MultiRequirement | OneFromManyRequirement,
  ) {
    this.pokemon = pokemonMap[pokemonName]
  }

  public isRoaming() {
    return this.unlockRequirement ? this.unlockRequirement.isCompleted() : true
  }
}
