import * as GameConstants from '~/enums/GameConstants'
import Requirement from '~/scripts/achievements/Requirement'
export default abstract class AchievementRequirement extends Requirement {
  constructor(
    requiredValue: number,
    option: GameConstants.AchievementOption,
    public achievementType: GameConstants.AchievementType = GameConstants.AchievementType.None,
  ) {
    super(requiredValue, option)
  }
}
