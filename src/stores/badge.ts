import { acceptHMRUpdate, defineStore } from 'pinia'
import GameHelper from '~/scripts/GameHelper'
import BadgeEnums from '~/modules/enums/Badges'

const emptyBadgeList = new Array(GameHelper.enumLength(BadgeEnums)).fill(false)
export const useBadgeStore = defineStore('badge', {

  state: () => ({
    _badgeList: emptyBadgeList.map(v => v) as Array<boolean>,
  }),
  getters: {
    badgeCount: (state): number => {
      return state._badgeList.reduce((acc, b) => (acc + Number(b)), 0)
    },
    maxLevel: (state): number => {
      return Math.min(100, (state.badgeCount + 2) * 10)
    },
  },
  actions: {
    gainBadge(badge: BadgeEnums) {
      this._badgeList[badge] = true
      // Track when users gains a badge and their total attack
      /* LogEvent('gained badge', 'badges', `gained badge (${camelCaseToString(BadgeEnums[badge])})`,
        App.game.party.calculatePokemonAttack(undefined, undefined, true, undefined, true, false, WeatherType.Clear)) */
    },

    hasBadge(badge: BadgeEnums): boolean {
      if (badge === null || badge === BadgeEnums.None) return true
      return this._badgeList[badge]
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useBadgeStore, import.meta.hot))
