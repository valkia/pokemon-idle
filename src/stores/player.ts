// @ts-check
import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Starter } from '~/scripts/GameConstants'
import { Region } from '~/scripts/GameConstants'
import type { Town } from '~/scripts/towns/Town'

export const usePlayerStore = defineStore('player', () => {
  const id = ref('')
  const name = ref('')
  const route = ref(1)
  const region = ref(Region.kanto)
  const highestRegion = ref(Region.kanto)
  const town = ref<Town | null>(null)
  const starter = ref<Starter | null>(null)
  const regionStarters = ref<Record<Region, Starter>>({})
  const lastSeen = ref(0)

  const setHighestRegion = (newRegion: Region) => {
    highestRegion.value = newRegion
  }

  const setRegionStarters = (newRegion: Region, newStarter: Starter) => {
    regionStarters.value[newRegion] = newStarter
  }

  return { id, name, route, region, highestRegion, town, starter, regionStarters, lastSeen, setHighestRegion, setRegionStarters }
}, { persist: true })

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot))
