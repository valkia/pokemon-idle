import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Dungeon } from '~/scripts/dungeons/Dungeon'
import type { DungeonMap } from '~/scripts/dungeons/DungeonMap'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import type { DungeonTrainer } from '~/scripts/dungeons/DungeonTrainer'

export const useDungeonStore = defineStore('dungeon', {

  state: () => ({
    _dungeon: null as Dungeon | null,
    _map: null as DungeonMap | null,
    _enemyPokemon: null as BattlePokemon | null,
    _trainer: null as DungeonTrainer | null,
  }),
  getters: {
    dungeon: (state): Dungeon | null => {
      return state._dungeon
    },
    map: (state): DungeonMap | null => {
      return state._map
    },
    enemyPokemon: (state): BattlePokemon | null => {
      return state._enemyPokemon
    },
    trainer: (state): DungeonTrainer | null => {
      return state._trainer
    },

  },
  actions: {
    setDungeon(value: Dungeon | null) {
      this._dungeon = value
    },
    setMap(value: DungeonMap | null) {
      this._map = value
    },
    setEnemyPokemon(value: BattlePokemon | null) {
      this._enemyPokemon = value
    },
    setTrainer(value: DungeonTrainer | null) {
      this._trainer = value
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDungeonStore, import.meta.hot))
