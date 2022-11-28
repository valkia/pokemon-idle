import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Dungeon } from '~/scripts/dungeons/Dungeon'
import type { DungeonMap } from '~/scripts/dungeons/DungeonMap'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import type { DungeonTrainer } from '~/scripts/dungeons/DungeonTrainer'

export const useDungeonStore = defineStore('dungeon', {

  state: () => ({
    dungeon: null as Dungeon | null,
    map: null as DungeonMap | null,
    enemyPokemon: null as BattlePokemon | null,
    trainer: null as DungeonTrainer | null,
    catching: false,
    catchRateActual: 0,
    fightingBoss: false,
    fighting: false,
    counter: 0,
    defeatedBoss: false,
    trainerPokemonIndex: 0,
    dungeonFinished: false,
  }),
  getters: {
  },
  actions: {
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDungeonStore, import.meta.hot))
