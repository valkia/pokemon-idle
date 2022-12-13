import QuestLineState from '../quests/QuestLineState'

import Requirement from './Requirement'
import { AchievementOption } from '~/scripts/GameConstants'

export default class QuestLineStepCompletedRequirement extends Requirement {
  cachedQuest: any
  get quest() {
    if (!this.cachedQuest)
      this.cachedQuest = App.game.quests.getQuestLine(this.questLineName)

    return this.cachedQuest
  }

  constructor(private questLineName: string, private questIndex: number, option = AchievementOption.equal) {
    super(1, option)
  }

  public getProgress(): number {
    return (this.quest.state() === QuestLineState.ended || this.quest.curQuest() > this.questIndex) ? 1 : 0
  }

  public hint(): string {
    return `Progress further in questline ${this.questLineName}.`
  }
}
