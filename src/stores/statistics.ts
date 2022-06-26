// @ts-check
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useStatisticsStore = defineStore({
  id: 'statistics',
  state: () => ({
    rawItems: [],
    // 获取总数
    _totalMoney: 0, // 总金币
    totalDungeonTokens: 0, // 地下城点数
    totalQuestPoints: 0, // 探索点数
    totalDiamonds: 0, // 钻石
    totalFarmPoints: 0, // 田地点数
    totalBattlePoints: 0, // 战斗点数
    // 当前数量
    currencyMoney: 0, // 总金币
    currencyDungeonTokens: 0, // 地下城点数
    currencyQuestPoints: 0, // 探索点数
    currencyDiamonds: 0, // 钻石
    currencyFarmPoints: 0, // 田地点数
    currencyBattlePoints: 0, // 战斗点数
    // Pokemon
    totalPokemonCaptured: 0, // 宝可梦抓捕数量
    totalPokemonDefeated: 0, // 宝可梦打败数量
    totalPokemonEncountered: 0, // 宝可梦遭遇数量
    totalPokemonHatched: 0, // 宝可梦孵化数量
    totalShinyPokemonCaptured: 0, // 闪光宝可梦抓捕数量
    totalShinyPokemonDefeated: 0, // 闪光宝可梦打败数量
    totalShinyPokemonEncountered: 0, // 闪光宝可梦遭遇数量
    totalShinyPokemonHatched: 0, // 闪光宝可梦孵化数量
    //
    capturedPokemonList: [], // 抓捕到的宝可梦列表

    // Battle
    routeKills: {} as Record<string, Record<string, number>>,
    gymsDefeated: [0],
    dungeonsCleared: [0],
    temporaryBattleDefeated: [0],
  }),
  getters: {
    totalMoney: (state): any => {
      return state._totalMoney
    },
  },
  actions: {
    setTotalMoney(number: number) {
      this._totalMoney = number
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useStatisticsStore, import.meta.hot))
