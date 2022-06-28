/// <reference path="Evolution.ts"/>
/// <reference path="EvolutionType.ts"/>
import type { PokemonNameType } from '~/enums/PokemonNameType'
import { Evolution } from '~/enums/Evolution'
import { EvolutionType } from '~/enums/EvolutionType'
import type * as GameConstants from '~/enums/GameConstants'
export class StoneEvolution extends Evolution {
  constructor(
    basePokemon: PokemonNameType,
    public evolvedPokemon: PokemonNameType,
    public stone: GameConstants.StoneType,
  ) {
    super(basePokemon)
    this.type.push(EvolutionType.Stone)
  }

  getEvolvedPokemon(): PokemonNameType {
    return this.evolvedPokemon
  }
}
