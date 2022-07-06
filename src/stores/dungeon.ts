import { acceptHMRUpdate, defineStore } from 'pinia'
import {Dungeon} from "~/scripts/dungeons/Dungeon";
import {DungeonMap} from "~/scripts/dungeons/DungeonMap";

export const useDungeonStore = defineStore('dungeon', {

  state: () => ({
    _dungeon: null as Dungeon | null,
    _map: null as DungeonMap | null,
  }),
  getters: {
    dungeon: (state): Dungeon | null => {
      return state._dungeon
    },
    map: (state): DungeonMap | null => {
      return state._map
    },
  },
  actions: {
    setDungeon(value: Dungeon | null) {
      this._dungeon = value
    },
    setMap(value: DungeonMap | null) {
      this._map = value
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDungeonStore, import.meta.hot))
