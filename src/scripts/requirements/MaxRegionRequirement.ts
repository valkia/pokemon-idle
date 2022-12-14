import Requirement from './Requirement'
import { AchievementOption, Region } from '~/scripts/GameConstants'
import { usePartyStore } from '~/stores/party'
import { usePlayerStore } from '~/stores/player'

export default class MaxRegionRequirement extends Requirement {
  constructor(maxRegion = Region.none, option: AchievementOption = AchievementOption.more) {
    super(maxRegion, option)
  }

  public getProgress() {
    return Math.min(usePlayerStore().highestRegion, this.requiredValue)
  }

  public hint(): string {
    return `You need to reach the ${Region[this.requiredValue]} region.`
  }
}
