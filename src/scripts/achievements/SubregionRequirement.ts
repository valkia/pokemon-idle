import Requirement from './Requirement'
import { usePlayerStore } from '~/stores/player'
import { AchievementOption, Region, camelCaseToString } from '~/scripts/GameConstants'

export default class SubregionRequirement extends Requirement {
  constructor(public region: Region, public subregion: number, option: AchievementOption = AchievementOption.equal) {
    super(subregion, option)
  }

  public getProgress() {
    const player = usePlayerStore()
    return this.region === player.region && this.subregion === player.subregion ? 100 : 0
  }

  public hint(): string {
    return `You need to be in the ${SubRegions.getSubRegionById(this.region, this.subregion)} subregion of ${camelCaseToString(Region[this.region])}.`
  }

  public getProgressPercentage() {
    const player = usePlayerStore()
    return this.region === player.region && this.subregion === player.subregion ? '100' : '0'
  }

  public isCompleted() {
    const player = usePlayerStore()
    return this.region === player.region && this.subregion === player.subregion
  }
}
