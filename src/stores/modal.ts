import { acceptHMRUpdate, defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {

  state: () => ({
    _shopModalFlag: false,
    _pickStarterModalFlag: true,
    _receiveBadgeModal: false,
  }),
  getters: {
    shopModalFlag: (state): any => {
      return state._shopModalFlag
    },
    pickStarterModalFlag: (state): any => {
      return state._pickStarterModalFlag
    },
  },
  actions: {
    setShopModalFlag(value: any) {
      this._shopModalFlag = value
    },
    setPickStarterModalFlag(value: any) {
      this._pickStarterModalFlag = value
    },
    toggleShopModal() {
      this._shopModalFlag = !this._shopModalFlag
    },
    togglePickStarterModal() {
      this._pickStarterModalFlag = !this._pickStarterModalFlag
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useModalStore, import.meta.hot))
