import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import BadgeEnums from '../enums/Badges'
import type { Feature } from './common/Feature'
import GameHelper from '~/enums/GameHelper'
import { camelCaseToString } from '~/enums/GameConstants'
import App from '~/scripts/App'
import WeatherType from '~/enums/WeatherType'

const emptyBadgeList = new Array(GameHelper.enumLength(BadgeEnums)).fill(false)

export default class BadgeCase implements Feature {
  name = 'Badge Case'

  saveKey = 'badgeCase'

  defaults: Record<string, any> = {}

  badgeList: Array<Ref<boolean>> = emptyBadgeList.map(v => ref(v))

  maxLevel: ComputedRef<number> = computed(() => Math.min(100, (this.badgeCount() + 2) * 10))

  badgeCaseTooltip: ComputedRef<string> = computed(() => {
    const maxLevel = this.maxLevel.value

    return `Earning badges raises the maximum possible level of your Pokémon, up to 100.<br>The max level your Pokémon can currently reach is <b>${maxLevel}</b>.`
  })

  badgeCount(): number {
    return this.badgeList.reduce((acc, b) => (acc + Number(b())), 0)
  }

  gainBadge(badge: BadgeEnums): void {
    this.badgeList[badge].value = (true)

    // Track when users gains a badge and their total attack
    LogEvent('gained badge', 'badges', `gained badge (${camelCaseToString(BadgeEnums[badge])})`,
      App.game.party.calculatePokemonAttack(undefined, undefined, true, undefined, true, false, WeatherType.Clear))
  }

  hasBadge(badge: BadgeEnums): boolean {
    if (badge === null || badge === BadgeEnums.None) return true
    return !!this.badgeList[badge].value
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
