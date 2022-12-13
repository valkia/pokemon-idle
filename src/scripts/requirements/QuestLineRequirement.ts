import Requirement from './Requirement'
import QuestLineState from '~/modules/quests/QuestLineState'
import { AchievementOption } from '~/scripts/GameConstants'

export default class QuestLineRequirement extends Requirement {
  private questLineName: string

  constructor(questLineName: string, option: AchievementOption = AchievementOption.more) {
    super(1, option)
    this.questLineName = questLineName
  }

  public getProgress() {
    return +(App.game.quests.getQuestLine(this.questLineName).state() === QuestLineState.ended)
  }

  public hint(): string {
    return `The ${this.questLineName} quest line needs to be completed first.`
  }
}
