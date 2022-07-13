import { acceptHMRUpdate, defineStore } from 'pinia'
import { GYM_TIME } from '~/enums/GameConstants'
import type { Gym } from '~/scripts/gym/Gym'
import {BattlePokemon} from "~/scripts/pokemons/BattlePokemon";
export const useGymStore = defineStore('gym', {

  state: () => ({
    _timeLeft: GYM_TIME as number,
    _timeLeftPercentage: 100,
    _gym: null as any, // Gym
    _running: false,
    _autoRestart: false,
    _initialRun: true,
    _index: 0,
    _totalPokemons: 0,
    _enemyPokemon: null as BattlePokemon | null,
  }),
  getters: {
    timeLeft: (state): number => {
      return state._timeLeft
    },
    timeLeftPercentage: (state): number => {
      return state._timeLeftPercentage
    },
    gym: (state): Gym => {
      return state._gym
    },
    index: (state): number => {
      return state._index
    },
    totalPokemons: (state): number => {
      return state._totalPokemons
    },
    running: (state): boolean => {
      return state._running
    },
    autoRestart: (state): boolean => {
      return state._autoRestart
    },
    initialRun: (state): boolean => {
      return state._initialRun
    },
    enemyPokemon: (state): any => {
      return state._enemyPokemon
    },
  },
  actions: {
    setTimeLeft(value: number) {
      this._timeLeft = value
    },
    setTimeLeftPercentage(value: number) {
      this._timeLeftPercentage = value
    },
    setGym(value: Gym) {
      this._gym = value
    },
    setRunning(value: boolean) {
      this._running = value
    },
    setIndex(value: number) {
      this._index = value
    },
    setTotalPokemons(value: number) {
      this._totalPokemons = value
    },
    setAutoRestart(value: boolean) {
      this._autoRestart = value
    },
    setInitialRun(value: boolean) {
      this._initialRun = value
    },
    setEnemyPokemon(value: BattlePokemon | null) {
      this._enemyPokemon = value
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGymStore, import.meta.hot))
