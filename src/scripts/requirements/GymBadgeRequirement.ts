import BadgeEnums from '../enums/Badges'
import Requirement from './Requirement'
import * as GameConstants from '~/scripts/GameConstants'

export default class GymBadgeRequirement extends Requirement {
  public badge: BadgeEnums
  constructor(badge: BadgeEnums, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
    super(1, option)
    this.badge = badge
  }

  public getProgress() {
    return +App.game.badgeCase.hasBadge(this.badge)
  }

  public hint(): string {
    return `Requires the ${GameConstants.camelCaseToString(BadgeEnums[this.badge])} badge.`
  }
}
