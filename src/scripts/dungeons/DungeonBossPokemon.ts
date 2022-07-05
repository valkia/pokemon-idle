import type { PokemonNameType } from '~/enums/PokemonNameType'
import type { EnemyOptions } from '~/scripts/dungeons/Dungeon'

export class DungeonBossPokemon {
  constructor(
    public name: PokemonNameType,
    public baseHealth: number,
    public level: number,
    public options?: EnemyOptions,
  ) {}
}
