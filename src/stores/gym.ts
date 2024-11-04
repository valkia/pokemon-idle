import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { GYM_TIME } from '~/scripts/GameConstants'
import { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import type { GymState } from '~/types'
export const useGymStore = defineStore('gym', () => {
  const state = ref<GymState>({
    timeLeft: GYM_TIME,
    timeLeftPercentage: 100,
    gym: null,
    running: false,
    autoRestart: false,
    initialRun: true,
    index: 0,
    totalPokemons: 0,
    enemyPokemon: null,
  })

  return { ...storeToRefs(state) }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGymStore, import.meta.hot))
