import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { GameState } from '~/scripts/GameConstants'

export const useGameStore = defineStore('game', () => {
  const gameState = ref(GameState.paused)

  return { gameState }
})

// Handle HMR (Hot Module Replacement)
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))
