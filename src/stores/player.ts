// @ts-check
import { acceptHMRUpdate, defineStore } from 'pinia'
import * as GameConstants from '~/enums/GameConstants'
import { Town } from '~/scripts/towns/Town'
export const usePlayerStore = defineStore({
  id: 'statistics',
  state: () => ({
    /** @type {string[]} */
    id: '',
    name: '',
    route: 1,
    region: GameConstants.Region.kanto,
    highestRegion: GameConstants.Region.kanto,
    town: Town,
  }),
  getters: {
  },
  actions: {
    setRoute(route: number) {
      this.route = route
    },
    /**
     * Add item to the cart
     * @param {string} name
     */
    /* addItem(name) {
      this.rawItems.push(name)
    }, */

    /**
     * Remove item from the cart
     * @param {string} name
     */
    /* removeItem(name) {
      const i = this.rawItems.lastIndexOf(name)
      if (i > -1) this.rawItems.splice(i, 1)
    },

    async purchaseItems() {
      console.log('Purchasing', this.items)
      const n = this.items.length
      this.rawItems = []

      return n
    }, */
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot))
