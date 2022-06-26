// @ts-check
import { acceptHMRUpdate, defineStore } from 'pinia'
import * as GameConstants from '~/enums/GameConstants'
import type { Town } from '~/scripts/towns/Town'
import { usePartyStore } from '~/stores/party'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
export const usePlayerStore = defineStore({
  id: 'player',
  state: () => ({
    /** @type {string[]} */
    _id: '',
    _name: '',
    _route: 1,
    _region: GameConstants.Region.kanto,
    _highestRegion: GameConstants.Region.kanto,
    _town: null as Town | null,
    _starter: null as GameConstants.Starter | null,
  }),
  getters: {
    town: (state): Town | null => {
      return state._town
    },
    route: (state): Number | null => {
      return state._route
    },
    region: (state): GameConstants.Region | null => {
      return state._region
    },
    starter: (state): GameConstants.Starter | null => {
      return state._starter
    },
  },
  actions: {
    setRoute(route: number) {
      this._route = route
    },
    setTown(town: Town | null) {
      this._town = town
    },
    setRegion(region: GameConstants.Region) {
      this._region = region
    },
    setStarter(starter: GameConstants.Starter) {
      this._starter = starter
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot))
