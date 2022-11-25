import { acceptHMRUpdate, defineStore } from 'pinia'
import { GameState } from '~/enums/GameConstants'

export const useGameStore = defineStore('game', {

  state: () => ({
    gameState: GameState.paused,
  }),
  getters: {
  },
  actions: {
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
