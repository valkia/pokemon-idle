/// <reference path="AchievementRequirement.ts"/>

import AchievementRequirement from '~/scripts/achievements/AchievementRequirement'
import * as GameConstants from '~/enums/GameConstants'
import App from '~/scripts/App'
import { useStatisticsStore } from '~/stores/statistics'
export default class ClearDungeonRequirement extends AchievementRequirement {
  public dungeonIndex: number // Gym name index in array GameConstants.Gyms

  constructor(value: number, dungeonIndex: number, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
    super(value, option, GameConstants.AchievementType['Clear Dungeon'])
    this.dungeonIndex = dungeonIndex
  }

  public getProgress() {
    const statistics = useStatisticsStore()
    // return Math.min(statistics.dungeonsCleared[this.dungeonIndex], this.requiredValue)
    return Math.min(0, this.requiredValue)
  }

  public hint(): string {
    if (this.requiredValue != 1)
      return `${GameConstants.RegionDungeons.flat()[this.dungeonIndex]} needs to be completed ${this.requiredValue} times.`
    else
      return `${GameConstants.RegionDungeons.flat()[this.dungeonIndex]} needs to be completed.`
  }
}
