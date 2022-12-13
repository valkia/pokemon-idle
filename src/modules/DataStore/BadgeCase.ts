import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import BadgeEnums from '../enums/Badges'
import type { Feature } from './common/Feature'
import GameHelper from '~/scripts/GameHelper'
import { camelCaseToString } from '~/scripts/GameConstants'
import App from '~/scripts/App'
import WeatherType from '~/scripts/weather/WeatherType'
import { useBadgeStore } from '~/stores/badge'

const emptyBadgeList = new Array(GameHelper.enumLength(BadgeEnums)).fill(false)

export default class BadgeCase implements Feature {
  name = 'Badge Case'

  saveKey = 'badgeCase'

  defaults: Record<string, any> = {}

  badgeCaseTooltip: ComputedRef<string> = computed(() => {
    const maxLevel = this.maxLevel.value

    return `Earning badges raises the maximum possible level of your Pokémon, up to 100.<br>The max level your Pokémon can currently reach is <b>${maxLevel}</b>.`
  })

  badgeCount(): number {
    return useBadgeStore().badgeCount
  }

  static gainBadge(badge: BadgeEnums): void {
    useBadgeStore().gainBadge(badge)
  }

  static maxLevel(): number {
    return useBadgeStore().maxLevel
  }

  hasBadge(badge: BadgeEnums): boolean {
    return useBadgeStore().hasBadge(badge)
  }

  // This method intentionally left blank
  // eslint-disable-next-line class-methods-use-this
  initialize(): void { }

  // eslint-disable-next-line class-methods-use-this
  canAccess(): boolean { return true }

  fromJSON(json: Record<string, any>): void {
    if (json == null)
      return

    json.forEach((hasBadge, index) => {
      this.badgeList[index].value = (hasBadge)
    })
  }

  toJSON(): Record<string, any> {
    // We only want to save upto the highest badge we have obtained,
    // everything else is assumed to be false
    return GameHelper.filterArrayEnd(this.badgeList.map(ko.unwrap))
  }

  // This method intentionally left blank
  // eslint-disable-next-line class-methods-use-this
  update(): void { }
}
