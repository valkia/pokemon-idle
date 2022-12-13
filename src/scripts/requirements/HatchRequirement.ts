import AchievementRequirement from './AchievementRequirement'
import * as GameConstants from '~/scripts/GameConstants'

export default class HatchRequirement extends AchievementRequirement {
  constructor(value: number, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
    super(value, option, GameConstants.AchievementType.Hatchery)
  }

  public getProgress() {
    return Math.min(App.game.statistics.totalPokemonHatched(), this.requiredValue)
  }

  public hint(): string {
    return `${this.requiredValue} eggs need to be hatched.`
  }
}
