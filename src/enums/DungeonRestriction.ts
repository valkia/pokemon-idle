/// <reference path="./LocationRestriction.ts" />

import type { MinimalEvo } from '~/enums/Evolution'
import { restrictEvoWith } from '~/enums/Evolution'
import { EvolutionType } from '~/enums/EvolutionType'
import * as GameConstants from '~/scripts/GameConstants'
import { LocationRestricted } from '~/enums/LocationRestriction'
function ByDungeon<EvoClass extends MinimalEvo>(Base: EvoClass) {
  return class extends Base implements LocationRestricted {
    dungeon: string

    constructor(...args: any[]) {
      const [dungeon, ...rest] = args
      super(...rest)
      this.dungeon = dungeon
    }

    atLocation(): boolean {
      return App.game.gameState == GameConstants.GameState.dungeon
                && DungeonRunner.dungeon.name == this.dungeon
    }
  }
}

// Utility type so that typescript can figure out
// the constructor params for our lifted evolution
type DungeonRestrictedT<T extends Constructor<any>> =
    new (dungeon: string,
      ...rest: ConstructorParameters<T>
    )
    => InstanceType<T>

export function DungeonRestricted<T extends Constructor<any>>(Base: T): DungeonRestrictedT<T> {
  return LocationRestricted(ByDungeon(Base))
}

export const AnyDungeonRestricted = restrictEvoWith(() => App.game.gameState == GameConstants.GameState.dungeon, EvolutionType.Location)
