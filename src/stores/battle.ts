import { acceptHMRUpdate, defineStore } from 'pinia'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
export const useBattleStore = defineStore('battle', {

  state: () => ({
    _enemyPokemon: null as BattlePokemon | null,
    _catching: false,
    _catchRateActual: 0,
  }),
  getters: {
    catching: (state): any => {
      return state._catching
    },
    enemyPokemon: (state): any => {
      return state._enemyPokemon
    },
    catchRateActual: (state): any => {
      return state._catchRateActual
    }
  },
  actions: {
    setEnemyPokemon(value: BattlePokemon | null) {
      this._enemyPokemon = value
    },
    setCatching(value: boolean) {
      this._catching = value
    },
    setCatchRateActual(value: number) {
      this._catchRateActual = value
    }
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useBattleStore, import.meta.hot))
