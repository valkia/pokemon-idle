<!-- PokemonCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'

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

const props = defineProps<{
  pokemon: Pokemon
  isSelected: boolean
  topColor: {
    type: string
    default: '#eee'
  }
  bottomColor: {
    type: string
    default: '#888'
  }
}>()

const emit = defineEmits(['select'])
function select() {
  emit('select', props.pokemon.id)
}
// 计算属性
const sprite = computed(() => {
  let name = props.pokemon.name.toLowerCase()
  if (props.pokemon.isAlolan)
    name += '-alolan'
  return `https://img.pokemondb.net/sprites/lets-go-pikachu-eevee/normal/${name}.png`
})

const maxhp = computed(() => Math.ceil(2.23 * props.pokemon.lvl + 17))
const hitpoints = computed(() => Math.ceil(maxhp.value * (props.pokemon.health / 100)))
</script>

<template>
  <div
    class="pokemon relative m-5 min-w-[150px] w-48 transition-all"
    :class="{ selected: isSelected }"
    @click="select()"
  >
    <!-- 背景和精灵球 -->
    <svg class="cell" viewBox="0 0 300 436">
      <defs>
        <linearGradient id="bg-gradient" x1="157.02" y1="90.68" x2="157.02" y2="246.27" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="rgba( 255, 255, 255, 0.3 )" />
          <stop offset="1" stop-color="rgba( 255, 255, 255, 0.5 )" />
        </linearGradient>
        <linearGradient id="bg-gradient-selected" x1="157.02" y1="90.68" x2="157.02" y2="246.27" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="rgba(255, 246, 146, 0.7)" />
          <stop offset="1" stop-color="rgba(255, 225, 85, 0.8)" />
        </linearGradient>
      </defs>
      <path class="bg" d="M270.88,433C242,438,196,441,155,441s-93.84-3.61-115.88-8C14,428,11,405,9,368c-.92-17-4-70-4-145S9,77,9,77c1-37,5.23-59,30.12-64S114,5,155,5s91.77,2,115.88,8S300,40,301,77c0,0,4,71,4,146s-1.36,124.73-3,145C299,405,299.77,428,270.88,433Z" transform="translate(-5 -5)" style="fill: url(#bg-gradient)" />
      <path class="stroke" d="M155,15.31c18.41,0,80.61.55,108.25,7.62,10.49,2.69,17.29,8.7,21.39,18.91,3.59,8.94,5.34,21.33,5.87,41.45,0,.68,3.72,68.76,3.72,139.71,0,64.71-1,116.58-2.79,138.73-.22,2.86-.42,5.62-.62,8.3-2.22,30.4-3.56,48.75-27.5,53-26.06,4.64-68.58,7.64-108.32,7.64-38.49,0-88.09-3.5-108.3-7.64-22.62-4.63-25.37-26.25-27.21-61.29l-.13-2.36c-1-18.54-3.59-67.8-3.59-136.4,0-70.95,3.68-139,3.72-139.74,1-36.47,5.43-55.81,27.22-60.31,24.25-5,72.83-7.64,108.29-7.64m0-1c-38.14,0-85.35,2.87-108.5,7.66s-27.08,25.84-28,61.26c0,0-3.72,68-3.72,139.77s2.87,122.56,3.72,138.81c1.86,35.42,4.65,57.44,28,62.22,20.51,4.2,70.36,7.66,108.5,7.66s81.63-2.87,108.5-7.66,26.15-26.8,28.94-62.22c1.53-19.41,2.79-67,2.79-138.81s-3.72-139.77-3.72-139.77c-.93-35.42-5.58-55.52-28-61.26S193.14,14.31,155,14.31Z" transform="translate(-5 -5)" style="fill: #fff" />
    </svg>
    <svg class="pokeball" viewBox="0 0 204.54 207.46">
      <path d="M9.57,128.66l60.57,0s.42,1.17,1.49,3.35c10.51,22.12,34.09,31.79,56.93,22.92,12.07-4.69,20.49-13.53,24.76-26.27h60.6c-3.66,40.18-40.45,85.21-95.06,88.75C60.8,221.14,15.86,177.72,9.57,128.66Z" transform="translate(-9.57 -10.14)" />
      <path d="M214.11,99.09H153.33a15.33,15.33,0,0,0-1.28-3.46c-8-16.74-21.42-25.84-39.89-25.95C93.44,69.56,80,78.77,71.65,95.58c-.77,1.53-1.51,3.51-1.51,3.51H9.79c5.15-45.56,47-89.37,102.94-88.95S209.31,54.53,214.11,99.09Z" transform="translate(-9.57 -10.14)" />
      <path d="M111.72,134.54a20.39,20.39,0,1,1,20.53-19.9A20.5,20.5,0,0,1,111.72,134.54Z" transform="translate(-9.57 -10.14)" />
    </svg>
    <span v-if="isSelected" class="arrow">
      <svg id="Arrow" viewBox="0 0 232 232">
        <defs>
          <linearGradient id="arrow-gradient" x1="157.02" y1="90.68" x2="157.02" y2="246.27" gradientUnits="userSpaceOnUse">
            <stop offset="0" :stop-color="topColor" />
            <stop offset="1" :stop-color="bottomColor" />
          </linearGradient>
        </defs>
        <path data-name="Outer Stroke" d="M66.42,284.52a23.47,23.47,0,0,1-5-.55A22.91,22.91,0,0,1,47,273.77a22,22,0,0,1-2.7-17L66,168.44,44.56,80.21A22.17,22.17,0,0,1,45.84,66a22.82,22.82,0,0,1,20.9-13.45,23.06,23.06,0,0,1,8.56,1.64c20.44,8.05,56.57,23.67,90.92,41.11,38.22,19.41,80.64,43.46,98.4,54.06a22.74,22.74,0,0,1,7.13,6.71,22.27,22.27,0,0,1,3.35,17.17,22.54,22.54,0,0,1-10.3,14.4c-17.12,10.45-61.08,36.68-99.07,54.38l-12.88,6c-32.36,15.09-62.93,29.34-78.37,35.08A23,23,0,0,1,66.42,284.52Z" transform="translate(-43.6 -52.52)" style="fill: #4f5456" />
        <path data-name="Inner Stroke" d="M159,109.53C124.09,91.82,87.87,76.3,69.38,69a7,7,0,0,0-8.92,3.45,6.14,6.14,0,0,0-.36,4L82,166.63a6.3,6.3,0,0,1,0,3.65L59.78,260.6a6.45,6.45,0,0,0,5.08,7.75,7.17,7.17,0,0,0,4-.28c16.89-6.27,55.14-24.33,90.06-40.58,37.65-17.55,81.41-43.73,97.51-53.55a6.24,6.24,0,0,0,2-8.9,6.6,6.6,0,0,0-2.1-2C238.55,152.4,196.37,128.53,159,109.53Z" transform="translate(-43.6 -52.52)" style="fill: #fff" />
        <path d="M97.51,174.36a22.32,22.32,0,0,0,0-11.78L80,90.68c18.69,7.87,45.44,19.78,71.7,33.12,29.6,15,61.74,32.88,82.52,44.84-20.71,12.3-53.29,31-82,44.34l-12.89,6c-21.48,10-43.47,20.27-59.54,27.28Z" transform="translate(-43.6 -52.52)" style="fill: url(#arrow-gradient)" />
      </svg>
    </span>
    <!-- 宝可梦信息 -->
    <label>
      <input :id="name" v-model="selectedPokemon" class="radio" type="radio" name="poke" :value="name">
      <span class="lvl">Lv. {{ lvl }}</span>
      <span class="sex" :class="sex">
        <Female v-if="sex === 'female'" />
        <Male v-else />
      </span>
      <img class="sprite" :src="sprite">
      <span v-if="partner" class="heart" />
      <span v-if="candy" class="candy" :class="candy" />
      <div class="details">
        <h2 class="name">{{ nickname }}</h2>
        <div class="hp">
          <div class="bar">
            <div class="health" :style="{ width: healthPercent }" :class="{ low: health <= 50, critical: health <= 15 }" />
          </div>
          <span class="text">{{ hitpoints }} / {{ maxhp }}</span>
        </div>
      </div>
    </label>
  </div>
</template>

<style lang="scss" scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10%);
  }
}

// 自定义 pulse 动画（保持与 Tailwind 默认一致）
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// 动画类
.animate-bounce {
  animation: bounce 0.8s ease infinite !important;
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.arrow {
  position: absolute;
  left: 0;
  top: 50%;
  width: 36px;
  height: 36px;
  -webkit-animation: boing 0.8s ease infinite;
  animation: boing 0.8s ease infinite;
  transform-origin: right center;
  pointer-events: none;
}
.arrow svg {
  position: absolute;
  width: 36px;
  left: 0;
  top: 0;
  filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.4));
  -webkit-animation: smoosh 0.7s ease infinite;
  animation: smoosh 0.7s ease infinite;
}
.pokes {
  display: flex;
  flex: wrap;
  width: 100%;
  justify-content: center;
  margin-bottom: 30px;
}
.pokemon {
  text-align: center;
  position: relative;
  width: 180px;
  min-width: 150px;
  margin: 20px;
}
.pokemon * {
  vertical-align: middle;
}
.pokemon label {
  position: absolute;
  left: 10px;
  right: 10px;
  top: 10px;
  bottom: 10px;
  z-index: 1;
  cursor: pointer;
}
.pokemon .radio {
  position: absolute;
  opacity: 0;
}
.pokemon .lvl {
  color: #00b8ff;
  position: absolute;
  left: 14px;
  top: 12px;
  font-weight: 400;
  font-size: 18px;
}
.pokemon .sex {
  position: absolute;
  right: 14px;
  top: 11px;
}
.pokemon .sex .icon {
  width: 18px;
}
.pokemon .sex .icon.female {
  transform: rotate(-45deg);
}
.pokemon .sprite {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.pokemon .details {
  position: absolute;
  top: 65%;
  left: 0;
  right: 0;
}
.pokemon .details .name {
  font-size: 20px;
  font-weight: 400;
  color: #222;
  margin: 4px 0;
  display: inline-block;
}
.pokemon .details .hp {
  width: 60%;
  margin: auto;
}
.pokemon .details .hp .text {
  color: #666;
  display: inline-block;
  padding-top: 4px;
  font-size: 14px;
}
.pokemon .details .hp .bar {
  border-radius: 50px;
  background: #073fa7;
  border: 3.5px solid #00a3e2;
  height: 11px;
  overflow: hidden;
}
.pokemon .details .hp .bar .health {
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, lime, #8bf500);
}
.pokemon .details .hp .bar .health.low {
  background: linear-gradient(to right, #ffcc00, #f1f500);
}
.pokemon .details .hp .bar .health.critical {
  background: linear-gradient(to right, #d20000, #f51700);
}
.pokemon .pokeball {
  position: absolute;
  fill: white;
  opacity: 0.5;
  transition: all 0.5s ease;
  width: 76%;
  left: 12%;
  top: 47%;
  transform: translateY(-50%);
}
.pokemon .cell {
  transition: all 0.2s ease;
}
.pokemon .cell .bg {
  stroke: rgba(255, 255, 255, 0.5);
  fill: rgba(255, 255, 255, 0.5);
  transition: all 1.15s ease;
}
.pokemon .cell .stroke {
  stroke: white;
  stroke-width: 4px;
}
.pokemon:after {
  content: '';
  display: block;
  position: absolute;
  left: 7px;
  right: 7px;
  bottom: 2px;
  height: 180px;
  border-radius: 100% 100% 70% 70%/70% 70% 20% 20%;
  background: transparent;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  z-index: -2;
}
.pokemon.selected:after {
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.5);
}
.pokemon.selected .cell {
  filter: drop-shadow(0px 2px 6px white);
  transform: scale(1.02);
}
.pokemon.selected .cell .bg {
  fill: rgba(255, 246, 146, 0.9);
  fill: url(#bg-gradient-selected) !important;
}
.pokemon.selected .pokeball {
  opacity: 0.8;
}
.pokemon.selected .sprite {
  -webkit-animation: bounce 0.8s ease infinite;
  animation: bounce 0.8s ease infinite;
}
.button {
  position: relative;
  background: white;
  border: 2px solid #ffc55b;
  border-radius: 10px;
  min-height: 30px;
  vertical-align: middle;
  padding: 0 20px;
  outline: none !important;
  cursor: pointer;
  font-size: 18px;
}
.button:after {
  content: '';
  position: absolute;
  left: -5px;
  right: -5px;
  top: -5px;
  bottom: -5px;
  background: white;
  border-radius: 13px;
  z-index: -1;
  box-shadow: 0 3px 5px -2px rgba(0, 0, 0, 0.2);
}
.button:hover {
  background: linear-gradient(to bottom, #ffd78e, #ffc55b);
  border-color: white;
}
.button:hover:after {
  background: linear-gradient(to bottom, #ffd78e, #ffc55b);
  box-shadow:
    0 0 5px 2px white,
    0 0 15px #ffe9c1,
    0 3px 5px -2px rgba(0, 0, 0, 0.2);
}
.candy {
  display: block;
  position: absolute;
  top: 52%;
  left: 55%;
  height: 12px;
  width: 12px;
  transform: scale(1);
  margin: 12px;
}
.candy.mighty {
  filter: hue-rotate(300deg) saturate(2.2);
}
.candy.smart {
  filter: hue-rotate(200deg) saturate(1) brightness(0.65) contrast(3);
}
.candy.tough {
  filter: hue-rotate(170deg) saturate(1) brightness(0.65) contrast(3.1);
}
.candy.courage {
  filter: hue-rotate(40deg) saturate(1) brightness(0.8) contrast(2);
}
.candy.quick {
  filter: hue-rotate(140deg) saturate(1) brightness(0.8) contrast(1.8);
}
.candy:after {
  content: '';
  display: block;
  height: 1px;
  width: 1px;
  box-shadow:
    0px 5px #000000,
    0px 6px #000000,
    0px 7px #000000,
    1px 8px #000000,
    3px 9px #000000,
    2px 9px #000000,
    4px 10px #000000,
    5px 10px #000000,
    6px 11px #000000,
    7px 11px #000000,
    8px 11px #000000,
    9px 10px #000000,
    10px 9px #000000,
    10px 8px #000000,
    10px 7px #000000,
    10px 6px #000000,
    10px 5px #000000,
    10px 4px #000000,
    10px 3px #000000,
    9px 2px #000000,
    8px 1px #000000,
    7px 1px #000000,
    6px 1px #000000,
    5px 2px #000000,
    4px 2px #000000,
    3px 3px #000000,
    2px 3px #000000,
    1px 4px #000000,
    8px 2px #ffffff,
    7px 2px #ffffff,
    6px 3px #ffffff,
    7px 3px #ffffff,
    8px 3px #ffffff,
    9px 3px #ffffff,
    8px 4px #ffffff,
    6px 2px #fff69c,
    5px 3px #fff69c,
    4px 3px #fff69c,
    4px 4px #fff69c,
    2px 4px #fff69c,
    3px 5px #fff69c,
    6px 4px #fff69c,
    9px 5px #fff69c,
    9px 7px #fff69c,
    6px 8px #fff69c,
    3px 4px #fff6e6,
    2px 5px #fff6e6,
    3px 6px #fff6e6,
    7px 4px #fff6e6,
    9px 4px #fff6e6,
    7px 8px #fff6e6,
    8px 8px #ffffff,
    8px 10px #dea410,
    7px 10px #dea410,
    6px 10px #dea410,
    9px 9px #dea410,
    8px 9px #dea410,
    7px 9px #dea410,
    6px 9px #dea410,
    5px 9px #dea410,
    4px 9px #dea410,
    4px 8px #dea410,
    3px 8px #dea410,
    2px 8px #dea410,
    2px 7px #dea410,
    1px 7px #dea410,
    1px 6px #dea410,
    1px 5px #eec529,
    2px 6px #eec529,
    3px 7px #eec529,
    5px 8px #eec529,
    9px 8px #eec529,
    7px 6px #f6de41,
    8px 6px #f6de41,
    8px 7px #f6de41,
    7px 7px #f6de41,
    7px 5px #f6de41,
    6px 5px #f6de41,
    5px 5px #f6de41,
    6px 6px #f6de41,
    5px 4px #ffe65a,
    4px 5px #ffe65a,
    8px 5px #ffe65a,
    9px 6px #ffe65a,
    4px 6px #ffe65a,
    5px 6px #ffe65a,
    5px 7px #ffe65a,
    6px 7px #ffe65a,
    4px 7px #fff69c;
}
.heart {
  width: 18px;
  height: 18px;
  display: block;
  position: absolute;
  top: 54%;
  left: 39%;
  -webkit-animation: float 1s ease infinite;
  animation: float 1s ease infinite;
}
.heart:after {
  content: '';
  width: 1px;
  height: 1px;
  display: block;
  box-shadow:
    8px 15px #000000,
    9px 15px #000000,
    10px 14px #000000,
    11px 13px #000000,
    12px 12px #000000,
    13px 11px #000000,
    14px 10px #000000,
    15px 9px #000000,
    15px 8px #000000,
    15px 7px #000000,
    15px 6px #000000,
    14px 4px #000000,
    12px 3px #000000,
    11px 3px #000000,
    9px 5px #000000,
    8px 5px #000000,
    7px 14px #000000,
    6px 13px #000000,
    5px 12px #000000,
    4px 11px #000000,
    3px 10px #000000,
    2px 9px #000000,
    2px 8px #000000,
    2px 7px #000000,
    2px 6px #000000,
    3px 4px #000000,
    5px 3px #000000,
    6px 3px #000000,
    8px 14px #a53367,
    9px 14px #a53367,
    10px 13px #a53367,
    11px 12px #a53367,
    12px 11px #a53367,
    13px 10px #a53367,
    14px 9px #a53367,
    14px 5px #a53367,
    13px 4px #a53367,
    3px 5px #a53367,
    4px 4px #a53367,
    7px 13px #a53367,
    6px 12px #a53367,
    5px 11px #a53367,
    4px 10px #a53367,
    3px 9px #a53367,
    3px 6px #a53367,
    14px 6px #a53367,
    10px 4px #a53367,
    7px 4px #a53367,
    6px 4px #a53367,
    11px 4px #a53367,
    7px 5px #a53367,
    10px 5px #a53367,
    8px 6px #a53367,
    9px 6px #a53367,
    3px 7px #eb86ae,
    3px 8px #eb86ae,
    5px 4px #eb86ae,
    12px 4px #eb86ae,
    14px 7px #eb86ae,
    14px 8px #eb86ae,
    8px 13px #eb86ae,
    9px 13px #eb86ae,
    7px 12px #eb86ae,
    4px 9px #eb86ae,
    13px 9px #eb86ae,
    12px 10px #eb86ae,
    10px 12px #eb86ae,
    5px 10px #eb86ae,
    4px 5px #eb86ae,
    13px 5px #eb86ae,
    5px 6px #ffffff,
    6px 6px #ffffff,
    5px 7px #ffffff,
    11px 6px #ffffff,
    6px 7px #feccf1,
    5px 8px #feccf1,
    4px 6px #feccf1,
    5px 5px #feccf1,
    11px 7px #feccf1,
    9px 8px #ffc6f8,
    8px 8px #ffc6f8,
    8px 9px #ffc6f8,
    9px 9px #ffc6f8,
    7px 9px #f2d2f9,
    6px 8px #f2d2f9,
    7px 8px #f2d2f9,
    13px 8px #ffa5da,
    12px 9px #ffa5da,
    11px 10px #ffa5da,
    11px 11px #ffa5da,
    10px 11px #ffa5da,
    9px 12px #ffa5da,
    8px 12px #ffa5da,
    13px 7px #ffa5da,
    13px 6px #ffa5da,
    12px 5px #ffa5da,
    4px 7px #ffa5da,
    4px 8px #ffa5da,
    5px 9px #ffa5da,
    6px 10px #ffa5da,
    6px 11px #ffa5da,
    7px 11px #ffa5da,
    12px 7px #ffd2f2,
    12px 8px #ffd2f2,
    11px 9px #ffd2f2,
    10px 10px #ffd2f2,
    9px 11px #ffd2f2,
    8px 11px #ffd2f2,
    6px 9px #ffd2f2,
    7px 10px #ffd2f2,
    8px 10px #ffd2f2,
    9px 10px #ffd2f2,
    10px 9px #ffd2f2,
    11px 8px #ffd2f2,
    10px 8px #ffd2f2,
    10px 7px #ffd2f2,
    12px 6px #ffc6f8,
    7px 7px #ffc6f8,
    8px 7px #ff87c2,
    9px 7px #ff87c2,
    10px 6px #ff87c2,
    11px 5px #ff87c2,
    7px 6px #ff87c2,
    6px 5px #ff87c2,
    2px 4px #f2d2f9,
    3px 3px #f2d2f9,
    5px 2px #f2d2f9,
    6px 2px #f2d2f9,
    11px 2px #f2d2f9,
    12px 2px #f2d2f9,
    14px 3px #f2d2f9,
    15px 4px #f2d2f9,
    2px 10px #eb86ae,
    3px 11px #eb86ae,
    4px 12px #eb86ae,
    5px 13px #eb86ae,
    6px 14px #eb86ae,
    11px 14px #eb86ae,
    12px 13px #eb86ae,
    13px 12px #eb86ae,
    14px 11px #eb86ae,
    15px 10px #eb86ae,
    16px 7px #eb86ae,
    16px 8px #eb86ae,
    15px 5px #eb86ae,
    13px 3px #eb86ae,
    10px 3px #eb86ae,
    9px 4px #eb86ae,
    7px 3px #eb86ae,
    8px 4px #eb86ae,
    4px 3px #eb86ae,
    2px 5px #eb86ae,
    1px 7px #eb86ae,
    1px 8px #eb86ae,
    1px 6px #f2d2f9,
    1px 9px #f2d2f9,
    6px 15px #f2d2f9,
    5px 14px #f2d2f9,
    4px 13px #f2d2f9,
    3px 12px #f2d2f9,
    2px 11px #f2d2f9,
    4px 2px #f2d2f9,
    8px 3px #f2d2f9,
    9px 3px #f2d2f9,
    13px 2px #f2d2f9,
    11px 15px #f2d2f9,
    12px 14px #f2d2f9,
    13px 13px #f2d2f9,
    14px 12px #f2d2f9,
    15px 11px #f2d2f9,
    16px 9px #f2d2f9,
    16px 6px #f2d2f9,
    1px 10px #ffc6f8,
    16px 10px #ffc6f8,
    16px 5px #ffc6f8,
    1px 5px #ffc6f8,
    7px 2px #ffc6f8,
    10px 2px #ffc6f8,
    7px 15px #a53367,
    10px 15px #a53367,
    7px 16px #f2d2f9,
    10px 16px #f2d2f9,
    8px 16px #ffa5da,
    9px 16px #ffa5da;
}
@-webkit-keyframes boing {
  0%,
  100% {
    transform: translateY(-50%) translateX(-90%) scaleX(1) scaleY(1);
  }
  50% {
    transform: translateY(-50%) translateX(-60%) scaleX(0.95) scaleY(1.1);
  }
}
@keyframes boing {
  0%,
  100% {
    transform: translateY(-50%) translateX(-90%) scaleX(1) scaleY(1);
  }
  50% {
    transform: translateY(-50%) translateX(-60%) scaleX(0.95) scaleY(1.1);
  }
}
@-webkit-keyframes bounce {
  0%,
  100% {
    transform: translateY(-50%) translateX(-50%) scaleX(1) scaleY(1);
  }
  50% {
    transform: translateY(-60%) translateX(-50%) scaleX(0.95) scaleY(1.03);
  }
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-50%) translateX(-50%) scaleX(1) scaleY(1);
  }
  50% {
    transform: translateY(-60%) translateX(-50%) scaleX(0.95) scaleY(1.03);
  }
}
@-webkit-keyframes float {
  0%,
  100% {
    transform: translateY(-50%) translateX(-50%);
  }
  50% {
    transform: translateY(-57%) translateX(-50%);
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateY(-50%) translateX(-50%);
  }
  50% {
    transform: translateY(-57%) translateX(-50%);
  }
}
body,
html {
  min-height: 100%;
  text-align: center;
}
h1 {
  display: inline-block;
  font-size: 60px;
  margin: 10px;
  color: #805cff;
  font-weight: 900;
}
.logo {
  max-width: 400px;
  margin: 100px 40px;
}
body {
  color: black;
  background: red;
  background: linear-gradient(45deg, #d2ffde, #ceefff, #ded1ff);
  background-size: cover;
  background-repeat: no-repeat;
  padding: 20px;
  font-family: 'Heebo', sans-serif;
}
</style>
