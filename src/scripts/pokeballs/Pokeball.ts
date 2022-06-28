import type Requirement from '~/scripts/achievements/Requirement'
import MultiRequirement from '~/scripts/achievements/MultiRequirement'
import type * as GameConstants from '~/enums/GameConstants'
export class Pokeball {
  public quantity: number

  constructor(
    public type: GameConstants.Pokeball,
    public catchBonus: () => number,
    public catchTime: number,
    public description: string,
    public unlockRequirement: Requirement | MultiRequirement = new MultiRequirement(),
    quantity = 0,
  ) {
    this.quantity = quantity
  }

  public unlocked() {
    return this.unlockRequirement.isCompleted()
  }
}
