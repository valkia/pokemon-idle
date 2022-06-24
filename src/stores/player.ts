// @ts-check
import { acceptHMRUpdate, defineStore } from 'pinia'
import * as GameConstants from '~/enums/GameConstants'
import { Town } from '~/scripts/towns/Town'
export const usePlayerStore = defineStore({
  id: 'statistics',
  state: () => ({
    /** @type {string[]} */
    _id: '',
    _name: '',
    _route: 1,
    _region: GameConstants.Region.kanto,
    _highestRegion: GameConstants.Region.kanto,
    _town: null as Town | null,
  }),
  getters: {
    town: (state): Town | null => {
      return state._town
    }
  },
  actions: {
    setRoute(route: number) {
      this._route = route
    },
    setTown(town: Town | null) {
      this._town = town
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
