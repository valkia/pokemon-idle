import { acceptHMRUpdate, defineStore } from 'pinia'
import { GameState } from '~/enums/GameConstants'

export const useGameStore = defineStore('game', {

  state: () => ({
    _gameState: GameState.paused,
  }),
  getters: {
    gameState: (state): GameState => {
      return state._gameState
    },
  },
  actions: {
    setGameState(value: GameState) {
      this._gameState = value
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
