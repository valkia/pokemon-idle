/// <reference path="./LocationRestriction.ts" />
import * as GameConstants from '~/enums/GameConstants'
import type { MinimalEvo } from '~/enums/Evolution'
import { restrictEvoWith } from '~/enums/Evolution'
import { LocationRestricted } from '~/enums/LocationRestriction'
import { EvolutionType } from '~/enums/EvolutionType'
function ByGym<EvoClass extends MinimalEvo>(Base: EvoClass) {
  return class extends Base implements LocationRestricted {
    town: string

    constructor(...args: any[]) {
      const [town, ...rest] = args
      super(...rest)
      this.town = town
    }

    atLocation(): boolean {
      return App.game.gameState == GameConstants.GameState.gym
                && GymRunner.gymObservable().town == this.town
    }
  }
}

// Utility type so that typescript can figure out
// the constructor params for our lifted evolution
type GymRestrictedT<T extends Constructor<any>> =
    new (town: string,
      ...rest: ConstructorParameters<T>
    )
    => InstanceType<T>

function GymRestricted<T extends Constructor<any>>(Base: T): GymRestrictedT<T> {
  return LocationRestricted(ByGym(Base))
}

export const AnyGymRestricted = restrictEvoWith(() => App.game.gameState == GameConstants.GameState.gym, EvolutionType.Location)
