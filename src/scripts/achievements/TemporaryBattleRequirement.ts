import Requirement from './Requirement'
import * as GameConstants from '~/scripts/GameConstants'
import App from '~/scripts/App'
export default class TemporaryBattleRequirement extends Requirement {
  constructor(public battleName: string, defeatsRequired = 1) {
    super(defeatsRequired, GameConstants.AchievementOption.more)
  }

  public getProgress() {
    return App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex(this.battleName)]()
  }

  public hint(): string {
    return `Requires beating ${this.battleName}.`
  }
}
