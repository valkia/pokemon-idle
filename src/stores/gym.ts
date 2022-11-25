import { acceptHMRUpdate, defineStore } from 'pinia'
import { GYM_TIME } from '~/enums/GameConstants'
import type { Gym } from '~/scripts/gym/Gym'
import {BattlePokemon} from "~/scripts/pokemons/BattlePokemon";
export const useGymStore = defineStore('gym', {

  state: () => ({
    timeLeft: GYM_TIME as number,
    timeLeftPercentage: 100,
    gym: null as any, // Gym
    running: false,
    autoRestart: false,
    initialRun: true,
    index: 0,
    totalPokemons: 0,
    enemyPokemon: null as BattlePokemon | null,
  }),
  getters: {
  },
  actions: {

  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGymStore, import.meta.hot))
