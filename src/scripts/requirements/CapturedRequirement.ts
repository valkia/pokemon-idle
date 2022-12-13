import AchievementRequirement from './AchievementRequirement'
import * as GameConstants from '~/scripts/GameConstants'

export default class CapturedRequirement extends AchievementRequirement {
  constructor(value: number, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
    super(value, option, GameConstants.AchievementType['Total Captured'])
  }

  public getProgress() {
    return Math.min(App.game.statistics.totalPokemonCaptured(), this.requiredValue)
  }

  public hint(): string {
    return `${this.requiredValue} Pokémon need to be captured.`
  }
}
