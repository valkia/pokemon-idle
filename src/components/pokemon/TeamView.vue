<!-- TeamView.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import Modal from '~/components/common/Modal.vue'
import PokemonType from '~/enums/PokemonType'
import { useModalStore } from '~/stores/modal'
import PokemonCard from './PokemonCard.vue'

export interface Pokemon {
  id: number
  name: string
  catchRate: number
  type: PokemonType[]
  levelType: string
  exp: number
  eggCycles: number
  evolutions: any[]
  base: {
    hitpoints: number
    attack: number
    specialAttack: number
    defense: number
    specialDefense: number
    speed: number
  }
  gender: {
    femaleRatio: number
  }
  // 扩展属性，用于团队展示
  nickname?: string
  lvl?: number
  health?: number
  isAlolan?: boolean
  candyType?: CandyType
}

export type CandyType = 'mighty' | 'tough' | 'smart' | 'courage' | 'quick'

// 使用modalStore来控制弹窗显示
const modalStore = useModalStore()
const show = computed(() => modalStore.teamViewModalFlag)
const toggleShow = () => modalStore.toggleTeamViewModal()

// teamGenerator.ts

const POKEMON_LIST = [
  'Bulbasaur',
  'Ivysaur',
  'Venusaur',
  'Charmander',
  'Charmeleon',
  'Charizard',
  'Squirtle',
  'Wartortle',
  'Blastoise',
  'Caterpie',
  'Metapod',
  'Butterfree',
  'Weedle',
  'Kakuna',
  'Beedrill',
  'Pidgey',
  'Pidgeotto',
  'Pidgeot',
  'Rattata',
  'Raticate',
  'Spearow',
  'Fearow',
  'Ekans',
  'Arbok',
  'Pikachu',
  'Raichu',
  'Sandshrew',
  'Sandslash',
  'Nidoran♀',
  'Nidorina',
  'Nidoqueen',
  'Nidoran♂',
  'Nidorino',
  'Nidoking',
  'Clefairy',
  'Clefable',
  'Vulpix',
  'Ninetales',
  'Jigglypuff',
  'Wigglytuff',
  'Zubat',
  'Golbat',
  'Oddish',
  'Gloom',
  'Vileplume',
  'Paras',
  'Parasect',
  'Venonat',
  'Venomoth',
  'Diglett',
  'Dugtrio',
  'Meowth',
  'Persian',
  'Psyduck',
  'Golduck',
  'Mankey',
  'Primeape',
  'Growlithe',
  'Arcanine',
  'Poliwag',
  'Poliwhirl',
  'Poliwrath',
  'Abra',
  'Kadabra',
  'Alakazam',
  'Machop',
  'Machoke',
  'Machamp',
  'Bellsprout',
  'Weepinbell',
  'Victreebel',
  'Tentacool',
  'Tentacruel',
  'Geodude',
  'Graveler',
  'Golem',
  'Ponyta',
  'Rapidash',
  'Slowpoke',
  'Slowbro',
  'Magnemite',
  'Magneton',
  'Farfetch\'d',
  'Doduo',
  'Dodrio',
  'Seel',
  'Dewgong',
  'Grimer',
  'Muk',
  'Shellder',
  'Cloyster',
  'Gastly',
  'Haunter',
  'Gengar',
  'Onix',
  'Drowzee',
  'Hypno',
  'Krabby',
  'Kingler',
  'Voltorb',
  'Electrode',
  'Exeggcute',
  'Exeggutor',
  'Cubone',
  'Marowak',
  'Hitmonlee',
  'Hitmonchan',
  'Lickitung',
  'Koffing',
  'Weezing',
  'Rhyhorn',
  'Rhydon',
  'Chansey',
  'Tangela',
  'Kangaskhan',
  'Horsea',
  'Seadra',
  'Goldeen',
  'Seaking',
  'Staryu',
  'Starmie',
  'Mr Mime',
  'Scyther',
  'Jynx',
  'Electabuzz',
  'Magmar',
  'Pinsir',
  'Tauros',
  'Magikarp',
  'Gyarados',
  'Lapras',
  'Ditto',
  'Eevee',
  'Vaporeon',
  'Jolteon',
  'Flareon',
  'Porygon',
  'Omanyte',
  'Omastar',
  'Kabuto',
  'Kabutops',
  'Aerodactyl',
  'Snorlax',
  'Articuno',
  'Zapdos',
  'Moltres',
  'Dratini',
  'Dragonair',
  'Dragonite',
  'Mewtwo',
  'Mew',
] // 原window.pokemon数组
const ALOLAN_LIST = [
  'Rattata',
  'Raticate',
  'Raichu',
  'Sandshrew',
  'Sandslash',
  'Vulpix',
  'Ninetales',
  'Diglett',
  'Dugtrio',
  'Meowth',
  'Persian',
  'Geodude',
  'Graveler',
  'Golem',
  'Grimer',
  'Muk',
  'Exeggutor',
  'Marowak',
] // 原window.alolan数组

function generateTeam(): Pokemon[] {
  return Array.from({ length: 6 }, () => {
    const index = Math.floor(Math.random() * POKEMON_LIST.length)
    console.warn('generating pokemon...', index)
    const baseName = POKEMON_LIST[index]

    return {
      id: index + 1,
      name: baseName,
      nickname: generateNickname(baseName),
      catchRate: 45,
      type: [PokemonType.Normal],
      levelType: 'medium',
      exp: 64,
      eggCycles: 20,
      evolutions: [],
      base: {
        hitpoints: 45,
        attack: 49,
        specialAttack: 65,
        defense: 49,
        specialDefense: 65,
        speed: 45,
      },
      gender: {
        femaleRatio: 0.5,
      },
      lvl: Math.floor(Math.random() * 100) + 1,
      health: Math.floor(Math.random() * 100) + 1,
      isAlolan: ALOLAN_LIST.includes(baseName) && Math.random() > 0.5,
      candyType: Math.random() < 0.25 ? getRandomCandy() : undefined,
    }
  })
}

function generateNickname(name: string): string {
  // 昵称生成逻辑...
  return name
}

function getRandomCandy(): CandyType {
  const candies: CandyType[] = ['mighty', 'tough', 'smart', 'courage', 'quick']
  return candies[Math.floor(Math.random() * candies.length)]
}

const team = ref<Pokemon[]>(generateTeam())
const selectedId = ref<number | null>(null)

const selectedPokemon = computed(() =>
  team.value.find(p => p.id === selectedId.value),
)

function handleSelect(pokemonId: number) {
  console.warn('Selected pokemon:', pokemonId)
  selectedId.value = pokemonId
}

function generateNewTeam() {
  team.value = generateTeam()
  selectedId.value = null
}

function confirmTeam() {
  // 这里可以添加确认团队的逻辑
  toggleShow()
}
</script>

<template>
  <Modal :modal-show="show">
    <button
      type="button"
      class="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
      data-modal-toggle="popup-modal"
      @click="toggleShow()"
    >
      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <div class="modal-dialog modal-dialog-scrollable w-[1400px]" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <div pt="12" flex flex-col items-center justify-center>
            <h5 id="teamViewModalLabel" class="modal-title">
              你的宝可梦团队
            </h5>
          </div>
        </div>
        <div class="modal-body">
          <h2 class="mb-4 text-xl text-purple-600 font-bold">
            {{ selectedPokemon ? `让我们一起上吧，${selectedPokemon.nickname}！` : '选择一个宝可梦' }}
          </h2>

          <div class="flex flex-wrap justify-center gap-4">
            <PokemonCard
              v-for="pokemon in team"
              :key="pokemon.id"
              :pokemon="pokemon"
              :is-selected="selectedId === pokemon.id"
              @select="handleSelect"
            />
          </div>

          <div class="mt-4 flex justify-center">
            <button
              type="button"
              class="btn-warning mx-2 btn"
              @click="generateNewTeam"
            >
              生成新队伍
            </button>
            <button
              type="button"
              class="btn-primary mx-2 btn"
              @click="confirmTeam"
            >
              确认选择
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.modal-content {
  background: linear-gradient(45deg, #d2ffde, #ceefff, #ded1ff);
}
</style>
