import Requirement from './Requirement'
import * as GameConstants from '~/scripts/GameConstants'

export default abstract class AchievementRequirement extends Requirement {
  constructor(
    requiredValue: number,
    option: GameConstants.AchievementOption,
    public achievementType: GameConstants.AchievementType = GameConstants.AchievementType.None,
  ) {
    super(requiredValue, option)
  }
}
