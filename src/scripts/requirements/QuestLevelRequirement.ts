import AchievementRequirement from './AchievementRequirement'
import * as GameConstants from '~/scripts/GameConstants'

export default class QuestLevelRequirement extends AchievementRequirement {
  constructor(levelRequired: number) {
    super(levelRequired, GameConstants.AchievementOption.more, GameConstants.AchievementType.Quest)
  }

  public getProgress() {
    return Math.min(App.game.quests.level(), this.requiredValue)
  }

  public hint(): string {
    return `Needs quest level ${this.requiredValue}.`
  }
}
