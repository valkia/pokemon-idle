import * as GameConstants from '~/scripts/GameConstants'
import { debug } from '~/scripts/GameConstants'
export default abstract class Requirement {
  public requiredValue: number
  public option: GameConstants.AchievementOption

  constructor(requiredValue: number, option: GameConstants.AchievementOption) {
    this.requiredValue = requiredValue
    this.option = option
  }

  abstract getProgress(): number
  abstract hint(): string

  public getProgressPercentage() {
    return (this.getProgress() / this.requiredValue * 100).toFixed(1)
  }

  public isCompleted() {
    switch (this.option) {
      case GameConstants.AchievementOption.less:
        return debug ? true : this.getProgress() < this.requiredValue
      case GameConstants.AchievementOption.equal:
        return debug ? true : this.getProgress() == this.requiredValue
      case GameConstants.AchievementOption.more:
        return debug ? true : this.getProgress() >= this.requiredValue
    }
  }
}
