import AchievementRequirement from './AchievementRequirement'
import * as GameConstants from '~/scripts/GameConstants'

export default class BattleFrontierHighestStageRequirement extends AchievementRequirement {
  constructor(value: number, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
    super(value, option, GameConstants.AchievementType['Battle Frontier'])
  }

  public getProgress() {
    return Math.min(App.game.statistics.battleFrontierHighestStageCompleted(), this.requiredValue)
  }

  public hint(): string {
    return `Stage ${this.requiredValue} needs to be completed at the Battle Frontier.`
  }
}
