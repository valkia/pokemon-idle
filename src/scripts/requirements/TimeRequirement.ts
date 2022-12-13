import Requirement from './Requirement'
import GameHelper from '~/scripts/GameHelper'
import { AchievementOption } from '~/scripts/GameConstants'

export default class TimeRequirement extends Requirement {
  private updateTrigger = ref(0)
  constructor(public startHour: number, public endHour: number, option = AchievementOption.more) {
    super(1, option)
    setInterval(
      () => this.updateTrigger.value = this.updateTrigger.value + 1,
      60 * 1000,
    )
  }

  public getProgress() {
    // this.updateTrigger

    const [startHour, endHour] = [this.startHour, this.endHour]
    const currentHour = new Date().getHours()

    const satisfied = startHour < endHour
    // If the start time is before the end time, both need to be true
      ? currentHour >= startHour && currentHour < endHour
    // If the start time is after the end time, only 1 needs to be true
      : currentHour >= startHour || currentHour < endHour

    return Number(satisfied)
  }

  public hint(): string {
    return `Your local time must be between ${this.startHour}:00 and ${this.endHour}:00`
  }
}
