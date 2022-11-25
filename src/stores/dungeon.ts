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
    /*setDungeon(value: Dungeon | null) {
      this.dungeon = value
    },
    setMap(value: DungeonMap | null) {
      this.map = value
    },
    setEnemyPokemon(value: BattlePokemon | null) {
      this.enemyPokemon = value
    },
    setTrainer(value: DungeonTrainer | null) {
      this.trainer = value
    },
    setCatching(value: boolean) {
      this.catching = value
    },
    setCatchRateActual(value: number) {
      this.catchRateActual = value
    },
    setFightingBoss(value: boolean) {
      this.fightingBoss = value
    },
    setFighting(value: boolean) {
      this.fighting = value
    },
    setCounter(value: number) {
      this.counter = value
    },
    setDefeatedBoss(value: boolean) {
      this.defeatedBoss = value
    },
    setTrainerPokemonIndex(value: number) {
      this.trainerPokemonIndex = value
    },
    setDungeonFinished(value: boolean) {
      this.dungeonFinished = value
    },*/

  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDungeonStore, import.meta.hot))
