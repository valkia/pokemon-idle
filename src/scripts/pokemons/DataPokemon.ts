import type PokemonInterface from '~/interfaces/Pokemon'
import type { PokemonNameType } from '~/enums/PokemonNameType'
import type PokemonType from '~/enums/PokemonType'
import type LevelType from '~/enums/LevelType'
import type BagItem from '~/interfaces/BagItem'

export class DataPokemon implements PokemonInterface {
  shiny: boolean

  constructor(
    public id: number,
    public name: PokemonNameType,
    public catchRate: number,
    public evolutions: Evolution[],
    public type1: PokemonType,
    public type2: PokemonType,
    public attack: number,
    public hitpoints: number,
    public levelType: LevelType,
    public exp: number,
    public eggCycles: number,
    public heldItem: BagItem | null,
  ) {
    this.shiny = false
  }
}
