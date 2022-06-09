import { acceptHMRUpdate, defineStore } from 'pinia'

export const useDataStore = defineStore('data', {

  state: () => ({
    _townList: {},
  }),
  getters: {
    TownList: (state): any => {
      return state._townList
    },
  },
  actions: {
    setTownList(value: any) {
      this._townList = value
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
