import AchievementRequirement from './AchievementRequirement'
import * as GameConstants from '~/scripts/GameConstants'

export default class FarmPointsRequirement extends AchievementRequirement {
  constructor(requiredValue: number, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
    super(requiredValue, option, GameConstants.AchievementType.Farming)
  }

  public getProgress() {
    return Math.min(App.game.statistics.totalFarmPoints(), this.requiredValue)
  }

  public hint(): string {
    return `${this.requiredValue} Farm Points need to be obtained.`
  }
}
