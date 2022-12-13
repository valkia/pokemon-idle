import AchievementRequirement from './AchievementRequirement'
import * as GameConstants from '~/scripts/GameConstants'

export default class MoneyRequirement extends AchievementRequirement {
  constructor(requiredValue: number, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
    super(requiredValue, option, GameConstants.AchievementType.Pokedollars)
  }

  public getProgress() {
    return Math.min(App.game.statistics.totalMoney(), this.requiredValue)
  }

  public hint(): string {
    return `${this.requiredValue} Pokédollars need to be obtained.`
  }
}
