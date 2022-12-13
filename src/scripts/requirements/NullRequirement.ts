import Requirement from './Requirement'
import * as GameConstants from '~/scripts/GameConstants'

export default class NullRequirement extends Requirement {
  constructor() {
    super(69420, GameConstants.AchievementOption.more)
  }

  public getProgress() {
    return Math.min(0, this.requiredValue)
  }

  // eslint-disable-next-line class-methods-use-this
  public hint(): string {
    return 'This is probably still under development.'
  }
}
