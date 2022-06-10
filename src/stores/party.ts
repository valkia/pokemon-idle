import { acceptHMRUpdate, defineStore } from 'pinia'
import type { PartyPokemon } from '~/scripts/party/PartyPokemon'
import type { PokemonNameType } from '~/enums/PokemonNameType'
import { PokemonHelper } from '~/scripts/pokemons/PokemonHelper'

export const usePartyStore = defineStore('party', {
  state: () => ({
    _caughtPokemon: [] as PartyPokemon[],
  }),
  getters: {
    caughtPokemon: (state): PartyPokemon[] => {
      return state._caughtPokemon
    },
  },
  actions: {
    addCaughtPokemon(value: PartyPokemon) {
      this._caughtPokemon.push(value)
    },
    alreadyCaughtPokemonByName(name: PokemonNameType, shiny = false) {
      return this.alreadyCaughtPokemon(PokemonHelper.getPokemonByName(name).id, shiny)
    },
    alreadyCaughtPokemon(id: number, shiny = false) {
      const pokemon = this._caughtPokemon.find(p => p.id == id)
      if (pokemon)
        return (!shiny || pokemon.shiny)

      return false
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePartyStore, import.meta.hot))
