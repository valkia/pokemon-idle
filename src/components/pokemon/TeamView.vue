<!-- TeamView.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import PokemonCard from './PokemonCard.vue'

export interface Pokemon {
  id: string
  name: string
  nickname: string
  lvl: number
  gender: 'male' | 'female'
  health: number
  isAlolan: boolean
  candyType?: CandyType
}

export type CandyType = 'mighty' | 'tough' | 'smart' | 'courage' | 'quick'

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
    console.log('generating pokemon...', index)
    const base = POKEMON_LIST[index]

    return {
      id: base,
      name: base,
      nickname: generateNickname(base),
      lvl: Math.floor(Math.random() * 100) + 1,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      health: Math.floor(Math.random() * 100) + 1,
      isAlolan: ALOLAN_LIST.includes(base) && Math.random() > 0.5,
      candyType: Math.random() < 0.25 ? getRandomCandy() : undefined,
    }
  })
}

function generateNickname(name: string): string {
  // 昵称生成逻辑...
}

function getRandomCandy(): CandyType {
  const candies: CandyType[] = ['mighty', 'tough', 'smart', 'courage', 'quick']
  return candies[Math.floor(Math.random() * candies.length)]
}

const team = ref<Pokemon[]>(generateTeam())
const selectedId = ref<string | null>(null)

const selectedPokemon = computed(() =>
  team.value.find(p => p.id === selectedId.value),
)

function handleSelect(pokemonId: string) {
  console.log('Selected pokemon:', pokemonId)
  selectedId.value = pokemonId
}

function generateNewTeam() {
  team.value = generateTeam()
  selectedId.value = null
}
</script>

<template>
  <div class="bg min-h-screen from-blue-50 to-purple-50 bg-gradient-to-br text-center">
    <h1 class="my-8 text-6xl text-purple-600 font-black">
      Let's Go, {{ selectedPokemon?.id }}!
    </h1>

    <div class="flex flex-wrap justify-center gap-8 p-4">
      <PokemonCard
        v-for="pokemon in team"
        :key="pokemon.id"
        :pokemon="pokemon"
        :is-selected="selectedId === pokemon.id"
        @select="handleSelect"
      />
    </div>

    <button
      class="mt-8 rounded-lg bg-yellow-400 px-6 py-3 font-bold transition-colors hover:bg-yellow-500"
      @click="generateNewTeam"
    >
      生成新队伍
    </button>
  </div>
</template>

<style lang="scss" scoped>
.bg {
  background: linear-gradient(45deg, #d2ffde, #ceefff, #ded1ff);
}
</style>
