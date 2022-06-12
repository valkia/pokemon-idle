import { acceptHMRUpdate, defineStore } from 'pinia'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'

export const useBattleStore = defineStore('battle', {

  state: () => ({
    _enemyPokemon: null as BattlePokemon | null,
    _catching: false,
  }),
  getters: {
    catching: (state): any => {
      return state._catching
    },
    enemyPokemon: (state): any => {
      return state._enemyPokemon
    },
  },
  actions: {
    setEnemyPokemon(value: BattlePokemon | null) {
      this._enemyPokemon = value
      console.log('enemyPokemon', this._enemyPokemon)
    },
    setCatching(value: Boolean) {
      this._catching = value
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useBattleStore, import.meta.hot))
