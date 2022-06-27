/// <reference path="Evolution.ts"/>
/// <reference path="EvolutionType.ts"/>
import type { PokemonNameType } from '~/enums/PokemonNameType'
import { Evolution } from '~/enums/Evolution'
import { EvolutionType } from '~/enums/EvolutionType'
import { PokemonHelper } from '~/scripts/pokemons/PokemonHelper'
import { usePartyStore } from '~/stores/party'

export class LevelEvolution extends Evolution {
  triggered: boolean

  constructor(
    basePokemon: PokemonNameType,
    public evolvedPokemon: PokemonNameType,
    public level: number,
  ) {
    super(basePokemon)
    this.type.push(EvolutionType.Level)
  }

  getEvolvedPokemon(): PokemonNameType {
    return this.evolvedPokemon
  }

  isSatisfied(): boolean {
    const party = usePartyStore()
    return super.isSatisfied()
            // Check high enough level
            && party.getPokemon(PokemonHelper.getPokemonByName(this.basePokemon).id).level >= this.level
  }

  evolve(): boolean {
    if (this.triggered)
      return false

    this.triggered = true

    // We have already obtained the evolution
    if (App.game.party.alreadyCaughtPokemonByName(this.getEvolvedPokemon()))
      return false

    return super.evolve(true)
  }
}
