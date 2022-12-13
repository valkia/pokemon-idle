import Requirement from './Requirement'
import { AchievementOption, GameState, camelCaseToString } from '~/scripts/GameConstants'
import { useGameStore } from '~/stores/game'

export default class GameStateRequirement extends Requirement {
  constructor(public gameState: GameState, expect = true) {
    super(1, expect ? AchievementOption.more : AchievementOption.less)
  }

  public getProgress() {
    return Number(useGameStore().gameState === this.gameState)
  }

  public hint(): string {
    return `The game must be in the ${
      camelCaseToString(GameState[this.gameState])
    } state`
  }
}
