// @ts-check
import { acceptHMRUpdate, defineStore } from 'pinia'
import * as GameConstants from '~/scripts/GameConstants'
import type { Town } from '~/scripts/towns/Town'
export const usePlayerStore = defineStore({
  id: 'player',
  state: () => ({
    id: '',
    name: '',
    route: 1,
    region: GameConstants.Region.kanto,
    highestRegion: GameConstants.Region.kanto,
    town: null as Town | null,
    starter: null as GameConstants.Starter | null,
    regionStarters: {} as Record<number, number>,
    lastSeen: 0,
  }),
  getters: {
  },
  actions: {

    setHighestRegion(region: GameConstants.Region) {
      this.highestRegion = region
    },
    setRegionStarters(region: GameConstants.Region, starter: GameConstants.Starter) {
      this.regionStarters[region] = starter
    },
  },
  persist: true,
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot))
