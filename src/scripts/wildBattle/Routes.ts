
import * as GameConstants from '~/enums/GameConstants'
import type RegionRoute from '~/scripts/wildBattle/RegionRoute'
import { RoutePokemon, SpecialRoutePokemon } from '~/scripts/wildBattle/RoutePokemon'
import BadgeEnums from '~/enums/Badges'
import RouteKillRequirement from '~/scripts/achievements/RouteKillRequirement'
import OneFromManyRequirement from '~/scripts/achievements/OneFromManyRequirement'
import GymBadgeRequirement from '~/scripts/achievements/GymBadgeRequirement'
import ClearGymRequirement from '~/scripts/achievements/ClearGymRequirement'
import ClearDungeonRequirement from '~/scripts/achievements/ClearDungeonRequirement'
import ObtainedPokemonRequirement from '~/scripts/achievements/ObtainedPokemonRequirement'
import MultiRequirement from '~/scripts/achievements/MultiRequirement'
import WeatherRequirement from '~/scripts/achievements/WeatherRequirement'
import { pokemonMap } from '~/data/PokemonList'
import WeatherType from '~/enums/WeatherType'
export default class Routes {
  public static regionRoutes: RegionRoute[] = []
  constructor() {}

  public static add(route: RegionRoute): void {
    this.regionRoutes.push(route)
    // Sort the routes so we can normalize the route number
    this.sortRegionRoutes()
  }

  public static sortRegionRoutes(): void {
    this.regionRoutes
      .sort((routeA, routeB) => routeA.orderNumber - routeB.orderNumber)
      .sort((routeA, routeB) => routeA.region - routeB.region)
  }

  public static getRoute(region: GameConstants.Region, route: number): RegionRoute {
    return this.regionRoutes.find(routeData => routeData.region == region && routeData.number == route)
  }

  public static getRoutesByRegion(region: GameConstants.Region): RegionRoute[] {
    return this.regionRoutes.filter(routeData => routeData.region == region)
  }

  public static getRegionByRoute(route: number): GameConstants.Region {
    return this.regionRoutes.find(routeData => routeData.number == route).region
  }

  public static getName(route: number, region: number): string {
    return this.regionRoutes.find(routeData => routeData.region == region && routeData.number == route)?.routeName ?? 'Unknown Route'
  }

  public static unnormalizeRoute(normalizedRoute: number): number {
    return this.regionRoutes[normalizedRoute - 1].number
  }

  public static normalizedNumber(region: GameConstants.Region, route: number): number {
    if (region == GameConstants.Region.none)
      return route

    return this.regionRoutes.findIndex(routeData => routeData.region == region && routeData.number == route) + 1
  }
}
