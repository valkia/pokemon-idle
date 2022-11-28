import { acceptHMRUpdate, defineStore } from 'pinia'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
export const useBattleStore = defineStore('battle', {

  state: () => ({
    enemyPokemon: null as BattlePokemon | null,
    catching: false,
    catchRateActual: 0,
  }),
  getters: {

  },
  actions: {
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useBattleStore, import.meta.hot))
