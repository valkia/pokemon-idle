import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Town } from '~/scripts/towns/Town'
import type { Gym } from '~/scripts/gym/Gym'

export const useDataStore = defineStore('data', () => {
  const townList = ref<Record<string, Town>>({})
  const gymList = ref<Record<string, Gym>>({})

  return { townList, gymList }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
