import AchievementRequirement from './AchievementRequirement'
import * as GameConstants from '~/scripts/GameConstants'

export default class VitaminObtainRequirement extends AchievementRequirement {
  constructor(value: number, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
    super(value, option, GameConstants.AchievementType.Vitamins)
  }

  public getProgress() {
    return Math.min(App.game.statistics.totalVitaminsObtained(), this.requiredValue)
  }

  public hint(): string {
    return `${this.requiredValue} Proteins need to be obtained.`
  }
}
