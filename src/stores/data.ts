import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Town } from '~/scripts/towns/Town'
import type { Gym } from '~/scripts/gym/Gym'

export const useDataStore = defineStore('data', {

  state: () => ({
    _townList: {} as Record<string, Town>,
    _gymList: {} as Record<string, Gym>,
  }),
  getters: {
    TownList: (state): any => {
      return state._townList
    },
    GymList: (state): any => {
      return state._gymList
    },
  },
  actions: {
    setTownList(value: any) {
      this._townList = value
    },
    setGymList(value: any) {
      this._gymList = value
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
