import { usePlayerStore } from '~/stores/player'
import * as GameConstants from '~/enums/GameConstants'
import Routes from '~/scripts/wildBattle/Routes'
import App from '~/scripts/App'
import { RouteHelper } from '~/scripts/wildBattle/RouteHelper'
import { Battle } from '~/scripts/Battle'
import { useGameStore } from '~/stores/game'
import Notifier from '~/modules/notifications/Notifier'
import NotificationConstants from '~/modules/notifications/NotificationConstants'
import { init } from '~/scripts/towns/init'
import { useDataStore } from '~/stores/data'
import { useStatisticsStore } from '~/stores/statistics'
import GameHelper from '~/enums/GameHelper'
import { Gym } from '~/scripts/gym/Gym'
import { DungeonTown } from '~/scripts/towns/Town'
import { PokemonHelper } from '~/scripts/pokemons/PokemonHelper'
import dataStore from '~/modules/DataStore'
import { usePartyStore } from '~/stores/party'
import {MaxIDPerRegion} from "~/enums/GameConstants";
enum areaStatus {
  currentLocation,
  locked,
  unlockedUnfinished,
  questAtLocation,
  uncaughtPokemon,
  uncaughtShinyPokemonAndMissingAchievement,
  uncaughtShinyPokemon,
  missingAchievement,
  completed,
}
export default class MapHelper {
  public static moveToRoute = function(route: number, region: GameConstants.Region) {
    if (isNaN(route))
      return
    const player = usePlayerStore()
    let genNewEnemy = false
    if (route != player.route)
      genNewEnemy = true

    if (this.accessToRoute(route, region)) {
      console.log('accessToRoute', route, region)
      player.setRoute(route)
      if (player.region != region) {
        player.setRegion(region)
        // Always go back to the main island when changing regions
        player.subregion = 0
      }
      if (genNewEnemy && !Battle.catching.value)
        Battle.generateNewEnemy()

      const gameStore = useGameStore()
      gameStore.setGameState(GameConstants.GameState.fighting)
    }
    else {
      if (!MapHelper.routeExist(route, region)) {
        return Notifier.notify({
          message: `${Routes.getName(route, region)} does not exist in the ${GameConstants.Region[region]} region.`,
          type: NotificationConstants.NotificationOption.danger,
        })
      }

      const routeData = Routes.getRoute(region, route)
      const reqsList = []

      /* routeData.requirements?.forEach((requirement) => {
        if (!requirement.isCompleted())
          reqsList.push(requirement.hint())
      }) */

      Notifier.notify({
        message: `You don't have access to that route yet.<br/>${reqsList.join('<br/>')}`,
        type: NotificationConstants.NotificationOption.warning,
      })
    }
  }

  public static routeExist(route: number, region: GameConstants.Region): boolean {
    return !!Routes.getRoute(region, route)
  }

  public static normalizeRoute(route: number, region: GameConstants.Region): number {
    return Routes.normalizedNumber(region, route)
  }

  public static accessToRoute = function(route: number, region: GameConstants.Region) {
    return this.routeExist(route, region) && Routes.getRoute(region, route).isUnlocked()
  }

  public static getCurrentEnvironment(): GameConstants.Environment {
    const area = player.route() || player.town()?.name || undefined

    const [env] = Object.entries(GameConstants.Environments).find(
      ([, regions]) => regions[player.region]?.has(area),
    ) || []

    return (env as GameConstants.Environment)
  }

  public static calculateBattleCssClass(): string {
    return GameConstants.EnvironmentCssClass[this.getCurrentEnvironment()]
  }

  public static calculateRouteCssClass(route: number, region: GameConstants.Region): string {
    let cls = ''
    const player = usePlayerStore()
    if (player.route == route && player.region == region)
      cls = 'currentLocation'
    else if (!MapHelper.accessToRoute(route, region))
      cls = 'locked'
    /* else if (useStatisticsStore().routeKills[region][route] < GameConstants.ROUTE_KILLS_NEEDED)
      cls = 'unlockedUnfinished' */
    /* else if (!RouteHelper.routeCompleted(route, region, false))
      cls = 'uncaughtPokemon'
    else if (!RouteHelper.routeCompleted(route, region, true))
      cls = 'uncaughtShinyPokemon' */
    else
      cls = 'completed'

    // Water routes
    if (GameConstants.Environments.Water[region]?.has(route))
      cls = `${cls} waterRoute`

    return cls
  }

  public static calculateTownCssClass(townName: string): string {
    const player = usePlayerStore()

    // Check if we are currently at this location
    if (!player.route && player.town?.name == townName)
      return areaStatus[areaStatus.currentLocation]

    // Check if this location is locked
    if (!MapHelper.accessToTown(townName))
      return areaStatus[areaStatus.locked]

    const states = []
    // Is this location a dungeon
    /* if (dungeonList[townName]) {
      if (!App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(townName)]())
        return areaStatus[areaStatus.unlockedUnfinished]
      else if (DungeonRunner.isThereQuestAtLocation(dungeonList[townName]))
        return areaStatus[areaStatus.questAtLocation]
      else if (!DungeonRunner.dungeonCompleted(dungeonList[townName], false))
        return areaStatus[areaStatus.uncaughtPokemon]
      else if (!DungeonRunner.dungeonCompleted(dungeonList[townName], true) && !DungeonRunner.isAchievementsComplete(dungeonList[townName]))
        return areaStatus[areaStatus.uncaughtShinyPokemonAndMissingAchievement]
      else if (!DungeonRunner.dungeonCompleted(dungeonList[townName], true))
        return areaStatus[areaStatus.uncaughtShinyPokemon]
      else if (!DungeonRunner.isAchievementsComplete(dungeonList[townName]))
        return areaStatus[areaStatus.missingAchievement]
    } */
    const TownList = useDataStore().TownList
    const town = TownList[townName]
    town.content.forEach((c) => {
      states.push(c.areaStatus())
    })
    if (states.length)
      return areaStatus[Math.min(...states)]

    return areaStatus[areaStatus.completed]
  }

  public static accessToTown(townName: string): boolean {
    const dataStore = useDataStore()
    const town = dataStore.TownList[townName]
    if (!town)
      return false

    return town.isUnlocked()
  }

  public static moveToTown(townName: string) {
    const TownList = useDataStore().TownList
    if (MapHelper.accessToTown(townName)) {
      const player = usePlayerStore()
      const gameStore = useGameStore()
      gameStore.setGameState(GameConstants.GameState.idle)
      player.setRoute(0)

      const town = TownList[townName]
      player.setTown(town)
      Battle.enemyPokemon = null
      // this should happen last, so all the values all set beforehand
      gameStore.setGameState(GameConstants.GameState.town)
    }
    else {
      const town = TownList[townName]
      const reqsList = []
      console.log('else town', town)
      town.requirements?.forEach((requirement) => {
        if (!requirement.isCompleted())
          reqsList.push(requirement.hint())
      })

      Notifier.notify({
        message: `You don't have access to that location yet.<br/>${reqsList.join('<br/>')}`,
        type: NotificationConstants.NotificationOption.warning,
      })
    }
  }

  public static validRoute(route = 0, region: GameConstants.Region = 0): boolean {
    return !!Routes.getRoute(region, route)
  }

  public static openShipModal() {
    const openModal = () => {
      $('#ShipModal').modal('show')
    }
    switch (player.region) {
      case GameConstants.Region.kanto:
        if (TownList['Vermilion City'].isUnlocked() && player.highestRegion() > 0) {
          openModal()
          return
        }
      case GameConstants.Region.johto:
        if (TownList['Olivine City'].isUnlocked()) {
          openModal()
          return
        }
      case GameConstants.Region.hoenn:
        if (TownList['Slateport City'].isUnlocked()) {
          openModal()
          return
        }
      case GameConstants.Region.sinnoh:
        if (TownList['Canalave City'].isUnlocked()) {
          openModal()
          return
        }
      case GameConstants.Region.unova:
        if (TownList['Castelia City'].isUnlocked()) {
          openModal()
          return
        }
      case GameConstants.Region.kalos:
        if (TownList['Coumarine City'].isUnlocked()) {
          openModal()
          return
        }
      case GameConstants.Region.alola:
        if (TownList['Hau\'oli City'].isUnlocked()) {
          openModal()
          return
        }
    }

    Notifier.notify({
      message: 'You cannot access this dock yet',
      type: NotificationConstants.NotificationOption.warning,
    })
  }

  public static ableToTravel() {
    const player = usePlayerStore()
    // If player already reached highest region, they can't move on
    if (player.highestRegion >= GameConstants.MAX_AVAILABLE_REGION)
      return false
    const TownList = useDataStore().TownList
    // Check if player doesn't require complete dex to move on to the next region and has access to next regions starter town
    // !App.game.challenges.list.requireCompletePokedex.active()
    if (false)
      return TownList[GameConstants.StartingTowns[player.highestRegion + 1]]?.isUnlocked() ?? false

    // Check if all regional pokemon are obtained
    const party = usePartyStore()
    return new Set(party.caughtPokemon.filter(p => p.id > 0 && PokemonHelper.calcNativeRegion(p.name) <= player.highestRegion).map(p => Math.floor(p.id))).size >= GameConstants.MaxIDPerRegion[player.highestRegion]
  }

  public static travelToNextRegion() {
    if (MapHelper.ableToTravel()) {
      // Gain queue slots based on highest region
      App.game.breeding.gainQueueSlot(App.game.breeding.queueSlotsGainedFromRegion(player.highestRegion()))
      GameHelper.incrementObservable(player.highestRegion)
      MapHelper.moveToTown(GameConstants.StartingTowns[player.highestRegion()])
      player.region = player.highestRegion()
      // Track when users move region and how long it took in seconds
      LogEvent('new region', 'new region',
        GameConstants.Region[player.highestRegion()],
        App.game.statistics.secondsPlayed())
      // Gather users attack when they moved regions
      LogEvent('attack measurement', 'new region',
        GameConstants.Region[player.highestRegion()],
        App.game.party.calculatePokemonAttack(undefined, undefined, true, undefined, true, false, false))
    }
  }
}
