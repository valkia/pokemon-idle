import { acceptHMRUpdate, defineStore } from 'pinia'
import { PartyPokemon } from '~/scripts/party/PartyPokemon'

export const useNpcStore = defineStore('npc', {

  state: () => ({
    npcModalFlag: false,
    name: '',
    dialogHTML: '',
    image: '',
  }),
  getters: {

  },
  actions: {
    close() {
      this.npcModalFlag = false
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useNpcStore, import.meta.hot))
