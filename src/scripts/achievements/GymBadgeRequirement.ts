
import Requirement from '~/scripts/achievements/Requirement'
import BadgeEnums from '~/enums/Badges'
import App from '~/scripts/App'
import * as GameConstants from '~/scripts/GameConstants'
import BadgeCase from '~/modules/DataStore/BadgeCase'
export default class GymBadgeRequirement extends Requirement {
  public badge: BadgeEnums
  constructor(badge: BadgeEnums, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
    super(1, option)
    this.badge = badge
  }

  public getProgress() {
    return new BadgeCase().hasBadge(this.badge)
  }

  public hint(): string {
    return `Requires the ${GameConstants.camelCaseToString(BadgeEnums[this.badge])} badge.`
  }
}
