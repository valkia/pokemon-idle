// @ts-check
import { acceptHMRUpdate, defineStore } from 'pinia'
import type * as GameConstants from '~/enums/GameConstants'
import { getDungeonIndex } from '~/enums/GameConstants'

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
    _routeKills: {} as Record<string, Record<string, number>>,
    gymsDefeated: [0],
    _dungeonsCleared: {} as Record<string, number>,
    temporaryBattleDefeated: [0],
  }),
  getters: {
    totalMoney: (state): any => {
      return state._totalMoney
    },
    routeKills: (state): any => {
      return state._routeKills
    },
  },
  actions: {
    setTotalMoney(number: number) {
      this._totalMoney = number
    },
    setRouteKills(region: GameConstants.Region, route: number) {
      const value = this.getRouteKills(region, route)
      const tmp = this._routeKills[region] || {}
      console.log('setRouteKills', region, route, value)
      tmp[route] = value + 1
      this._routeKills[region] = tmp
    },
    getRouteKills(region: GameConstants.Region, route: number) {
      const tmp = this._routeKills[region] || {}
      const tmp2 = tmp[route] || 0
      return tmp2
    },
    getDungeonsCleared(dungeonName: string) {
      return this._dungeonsCleared[getDungeonIndex(dungeonName)] || 0
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useStatisticsStore, import.meta.hot))
