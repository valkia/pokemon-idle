import type { PokemonNameType } from '~/enums/PokemonNameType'

export class GymPokemon {
  name: PokemonNameType
  maxHealth: number
  level: number

  constructor(name: PokemonNameType, maxHealth: number, level: number) {
    this.name = name
    this.maxHealth = maxHealth
    this.level = level
  }
}
