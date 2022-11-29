import { acceptHMRUpdate, defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {

  state: () => ({
    shopModalFlag: false,
    pickStarterModalFlag: true,
    receiveBadgeModal: false,
    hallOfFameModal: false,
  }),
  getters: {

  },
  actions: {
    setShopModalFlag(value: any) {
      this.shopModalFlag = value
    },
    setPickStarterModalFlag(value: any) {
      this.pickStarterModalFlag = value
    },
    toggleShopModal() {
      this.shopModalFlag = !this.shopModalFlag
    },
    togglePickStarterModal() {
      this.pickStarterModalFlag = !this.pickStarterModalFlag
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useModalStore, import.meta.hot))
