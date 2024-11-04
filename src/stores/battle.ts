import { acceptHMRUpdate, defineStore } from 'pinia'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
export const useBattleStore = defineStore('battle', () => {
  const enemyPokemon = ref<BattlePokemon | null>(null)
  const catching = ref(false)
  const catchRateActual = ref(0)

  return { enemyPokemon, catching, catchRateActual }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useBattleStore, import.meta.hot))
