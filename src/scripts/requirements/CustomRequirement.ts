import type { Observable } from 'knockout'
import Requirement from './Requirement'
import { AchievementOption } from '~/scripts/GameConstants'

export default class CustomRequirement<T> extends Requirement {
  constructor(
    private focus: Observable<T>,
    private required: T,
    private hintText: string,
    option = AchievementOption.more,
  ) {
    super(1, option)
  }

  public getProgress() {
    return Number(this.focus() === this.required)
  }

  public hint(): string {
    return this.hintText
  }
}
