import type { Ref } from 'vue-demi'
import type PokemonInterface from '~/interfaces/Pokemon'
import type Amount from '~/modules/wallet/Amount'

export interface EnemyPokemonInterface extends PokemonInterface {
  health: number | Ref<number>
  maxHealth: number | Ref<number>
  level: number
  catchRate: number
  exp: number
  reward: Amount

  isAlive(): boolean
  damage(damage: number): void
}
