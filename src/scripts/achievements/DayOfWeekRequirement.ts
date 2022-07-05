import Requirement from './Requirement'
import * as GameConstants from '~/enums/GameConstants'

export default class DayOfWeekRequirement extends Requirement {
  public static date = new Date().getDay()
  DayOfWeekNum: number
  constructor(DayOfWeekNum: number, option: GameConstants.AchievementOption = GameConstants.AchievementOption.equal) {
    super(1, option)
    this.DayOfWeekNum = DayOfWeekNum
  }

  public getProgress(): number {
    return +(DayOfWeekRequirement.date() === this.DayOfWeekNum)
  }

  // eslint-disable-next-line class-methods-use-this
  public hint(): string {
    return `Come back on ${GameConstants.DayOfWeek[this.DayOfWeekNum]}.`
  }
}
