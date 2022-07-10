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
    _catching: false,
    _catchRateActual: 0,
    _fightingBoss: false,
    _fighting: false,
    _counter: 0,
    _defeatedBoss: false,
    _trainerPokemonIndex: 0,
    _dungeonFinished: false,
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
    catching: (state): any => {
      return state._catching
    },
    catchRateActual: (state): any => {
      return state._catchRateActual
    },
    fightingBoss: (state): boolean => {
      return state._fightingBoss
    },
    fighting: (state): boolean => {
      return state._fighting
    },
    counter: (state): number => {
      return state._counter
    },
    defeatedBoss: (state): boolean => {
      return state._defeatedBoss
    },
    trainerPokemonIndex: (state): number => {
      return state._trainerPokemonIndex
    },
    dungeonFinished: (state): boolean => {
      return state.__dungeonFinished
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
    setCatching(value: boolean) {
      this._catching = value
    },
    setCatchRateActual(value: number) {
      this._catchRateActual = value
    },
    setFightingBoss(value: boolean) {
      this._fightingBoss = value
    },
    setFighting(value: boolean) {
      this._fighting = value
    },
    setCounter(value: number) {
      this._counter = value
    },
    setDefeatedBoss(value: boolean) {
      this._defeatedBoss = value
    },
    setTrainerPokemonIndex(value: number) {
      this._trainerPokemonIndex = value
    },
    setDungeonFinished(value: boolean) {
      this._dungeonFinished = value
    },

  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDungeonStore, import.meta.hot))
