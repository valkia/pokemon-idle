import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Town } from '~/scripts/towns/Town'
import type { Gym } from '~/scripts/gym/Gym'

export const useDataStore = defineStore('data', {

  state: () => ({
    townList: {} as Record<string, Town>,
    gymList: {} as Record<string, Gym>,
  }),
  getters: {

  },
  actions: {
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
