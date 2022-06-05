import type * as GameConstants from '~/enums/GameConstants'
import type RoutePokemon from '~/scripts/wildBattle/RoutePokemon'
import type OneFromManyRequirement from '~/scripts/achievements/OneFromManyRequirement'
import type Requirement from '~/scripts/achievements/Requirement'
export default class RegionRoute {
  constructor(
    public routeName: string,
    public region: GameConstants.Region,
    public number: number,
    public pokemon: RoutePokemon,
    public requirements: (OneFromManyRequirement | Requirement)[] = [],
    public orderNumber?: number,
  ) {
    this.orderNumber = orderNumber || number
  }

  public isUnlocked() {
    return this.requirements.every(requirement => requirement.isCompleted())
  }
}
