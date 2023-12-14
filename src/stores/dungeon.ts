import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Dungeon } from '~/scripts/dungeons/Dungeon'
import type { DungeonMap } from '~/scripts/dungeons/DungeonMap'
import type { BattlePokemon } from '~/scripts/pokemons/BattlePokemon'
import type { DungeonTrainer } from '~/scripts/dungeons/DungeonTrainer'

export const useDungeonStore = defineStore('dungeon', () => {
  const dungeon = ref<Dungeon | null>(null)
  const map = ref<DungeonMap | null>(null)
  const enemyPokemon = ref<BattlePokemon | null>(null)
  const trainer = ref<DungeonTrainer | null>(null)
  const catching = ref(false)
  const catchRateActual = ref(0)
  const fightingBoss = ref(false)
  const fighting = ref(false)
  const counter = ref(0)
  const defeatedBoss = ref(false)
  const trainerPokemonIndex = ref(0)
  const dungeonFinished = ref(false)

  return {
    dungeon,
    map,
    enemyPokemon,
    trainer,
    catching,
    catchRateActual,
    fightingBoss,
    fighting,
    counter,
    defeatedBoss,
    trainerPokemonIndex,
    dungeonFinished,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDungeonStore, import.meta.hot))
