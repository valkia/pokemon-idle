import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Town } from '~/scripts/towns/Town'
import type { Gym } from '~/scripts/gym/Gym'
import type Amount from '~/modules/wallet/Amount'
import { useStatisticsStore } from '~/stores/statistics'
import { Currency } from '~/enums/GameConstants'
import Multiplier from '~/modules/multiplier/Multiplier'

export const useWalletStore = defineStore('wallet', {

  state: () => ({
    _townList: {} as Record<string, Town>,
    _gymList: {} as Record<string, Gym>,
  }),
  getters: {
    TownList: (state): any => {
      return state._townList
    },
    GymList: (state): any => {
      return state._gymList
    },
  },
  actions: {
    calcBonus(amount: Amount) {
      switch (amount.currency) {
        case Currency.money:
          return new Multiplier().getBonus('money', true)
        case Currency.dungeonToken:
          return new Multiplier().getBonus('dungeonToken', true)
        case Currency.questPoint:
        case Currency.diamond:
        case Currency.farmPoint:
        case Currency.battlePoint:
        default:
          return 1
      }
    },
    addAmount(amount: Amount, ignoreBonus = false) {
      if (Number.isNaN(amount.amount) || amount.amount <= 0) {
        console.trace('Could not add amount:', amount)
        amount.amount = 1
      }

      // Calculate the bonuses
      if (!ignoreBonus)
        amount.amount = Math.floor(amount.amount * this.calcBonus(amount))

      const statisticsStore = useStatisticsStore()
      console.log(statisticsStore)
      switch (amount.currency) {
        case Currency.money:
          statisticsStore.setTotalMoney(amount.amount)
          break
        case Currency.dungeonToken:
          GameHelper.incrementObservable(App.game.statistics.totalDungeonTokens, amount.amount)
          break
        case Currency.questPoint:
          GameHelper.incrementObservable(App.game.statistics.totalQuestPoints, amount.amount)
          break
        case Currency.diamond:
          GameHelper.incrementObservable(App.game.statistics.totalDiamonds, amount.amount)
          break
        case Currency.farmPoint:
          GameHelper.incrementObservable(App.game.statistics.totalFarmPoints, amount.amount)
          break
        case Currency.battlePoint:
          GameHelper.incrementObservable(App.game.statistics.totalBattlePoints, amount.amount)
          break
        default:
          break
      }

      return amount
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWalletStore, import.meta.hot))
