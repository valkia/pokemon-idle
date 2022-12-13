import Requirement from './Requirement'
import * as GameConstants from '~/scripts/GameConstants'

export default class ClientRequirement extends Requirement {
  usingClient: boolean
  constructor(usingClient = true) {
    super(1, usingClient ? GameConstants.AchievementOption.more : GameConstants.AchievementOption.less)
    this.usingClient = usingClient
  }

  // eslint-disable-next-line class-methods-use-this
  public getProgress(): number {
    return App.isUsingClient ? 1 : 0
  }

  public hint(): string {
    return this.usingClient ? 'Use the client' : 'Use the browser version'
  }
}
