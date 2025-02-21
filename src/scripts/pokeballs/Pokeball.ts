import type Requirement from '~/scripts/achievements/Requirement'
import type * as GameConstants from '~/scripts/GameConstants'
import MultiRequirement from '~/scripts/achievements/MultiRequirement'
import { Battle } from '~/scripts/Battle'
import MapHelper from '~/scripts/worldmap/MapHelper'
import { useBattleStore } from '~/stores/battle'
import { usePlayerStore } from '~/stores/player'
import { usePartyStore } from '../../stores/party'

export enum PokeBallType {
  None = -1,
  Pokeball = 0,
  Greatball = 1,
  Ultraball = 2,
  Masterball = 3,
  Fastball = 4,
  Quickball = 5,
  Timerball = 6,
  Duskball = 7,
  Luxuryball = 8,
  Diveball = 9,
  Lureball = 10,
  Nestball = 11,
  Repeatball = 12,
}

export class Pokeball {
  public quantity: number
  public readonly price: number
  public readonly baseCatchRate: number

  constructor(
    public type: GameConstants.Pokeball,
    public catchBonus: () => number,
    public catchTime: number,
    public description: string,
    public unlockRequirement: Requirement | MultiRequirement = new MultiRequirement(),
    quantity = 0,
    price = 0,
    baseCatchRate = 0,
  ) {
    this.quantity = quantity
    this.price = price
    this.baseCatchRate = baseCatchRate
  }

  public unlocked() {
    return this.unlockRequirement.isCompleted()
  }

  public calculateCatchProbability(enemyHealth: number): number {
    const player = usePlayerStore()
    const healthModifier = 1 - (enemyHealth / useBattleStore().enemyPokemon.maxHealth)
    let catchRate = this.baseCatchRate + this.catchBonus()

    // Apply special effects based on ball type
    switch (this.type) {
      case PokeBallType.Quickball:
        if (Battle.turns <= 3)
          catchRate *= 2
        break
      case PokeBallType.Timerball:
        catchRate *= Math.min(4, 1 + Battle.turns / 10)
        break
      case PokeBallType.Duskball:
        if (MapHelper.getCurrentEnvironment() === 'Cave' || new Date().getHours() >= 18 || new Date().getHours() < 6)
          catchRate *= 2
        break
      case PokeBallType.Nestball:
        const enemyLevel = useBattleStore().enemyPokemon.level
        if (enemyLevel <= 30)
          catchRate *= (40 - enemyLevel) / 10
        break
    }

    // Apply health modifier
    catchRate *= (1 + healthModifier)

    // Cap at 100%
    return Math.min(catchRate, 100)
  }

  public isCriticalCatch(): boolean {
    const player = usePlayerStore()
    const critRate = Math.min(usePartyStore().caughtPokemon.length / 600, 0.1)
    return Math.random() < critRate
  }

  public getPrice(): number {
    return this.price
  }
}
