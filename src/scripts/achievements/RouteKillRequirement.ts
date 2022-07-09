import * as GameConstants from '~/enums/GameConstants'
import Routes from '~/scripts/wildBattle/Routes'
import AchievementRequirement from '~/scripts/achievements/AchievementRequirement'
import { useStatisticsStore } from '~/stores/statistics'
export default class RouteKillRequirement extends AchievementRequirement {
  constructor(
    value: number,
    public region: GameConstants.Region,
    public route: number,
    option: GameConstants.AchievementOption = GameConstants.AchievementOption.more,
  ) {
    super(GameConstants.debug ? 1 : value, option, GameConstants.AchievementType['Route Kill'])
  }

  public getProgress() {
    const statistics = useStatisticsStore()
    const routeKills = statistics.getRouteKills(this.region, this.route)
    return Math.min(routeKills, this.requiredValue)
  }

  public hint(): string {
    console.log('RouteKillRequirement hint')
    /* if (this.requiredValue != GameConstants.ROUTE_KILLS_NEEDED)
      return `${this.requiredValue} Pokémon need to be defeated on ${Routes.getName(this.route, this.region)}.`
    else
      return `${Routes.getName(this.route, this.region)} still needs to be completed.` */
    if (this.requiredValue != GameConstants.ROUTE_KILLS_NEEDED)
      return `${this.requiredValue} Pokémon need to be defeated on .`
    else
      return 'still needs to be completed.'
  }
}
