import AchievementRequirement from './AchievementRequirement'
import * as GameConstants from '~/scripts/GameConstants'

export default class TokenRequirement extends AchievementRequirement {
  constructor(value: number, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
    super(value, option, GameConstants.AchievementType['Dungeon Token'])
  }

  public getProgress() {
    return Math.min(App.game.statistics.totalDungeonTokens(), this.requiredValue)
  }

  public hint(): string {
    return `${this.requiredValue} Dungeon Tokens need to be obtained.`
  }
}
