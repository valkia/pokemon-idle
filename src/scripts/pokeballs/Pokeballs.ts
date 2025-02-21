import App from '~/scripts/App'
import GameHelper from '~/scripts/GameHelper'
import MapHelper from '~/scripts/worldmap/MapHelper'
import Routes from '~/scripts/wildBattle/Routes'
import type { Feature } from '~/modules/DataStore/common/Feature'
import RouteKillRequirement from '~/scripts/achievements/RouteKillRequirement'
import { Battle } from '~/scripts/Battle'
import NotificationConstants from '~/modules/notifications/NotificationConstants'
import Notifier from '~/modules/notifications/Notifier'
import { Pokeball } from '~/scripts/pokeballs/Pokeball'
import * as GameConstants from '~/scripts/GameConstants'
import { usePlayerStore } from '~/stores/player'
import { usePartyStore } from '~/stores/party'
export class Pokeballs implements Feature {
  name = 'Pokeballs'
  saveKey = 'pokeballs'

  defaults = {
    alreadyCaughtSelection: GameConstants.Pokeball.None,
    alreadyCaughtShinySelection: GameConstants.Pokeball.Pokeball,
    notCaughtSelection: GameConstants.Pokeball.Pokeball,
    notCaughtShinySelection: GameConstants.Pokeball.Pokeball,
  }

  public pokeballs: Pokeball[]
  private _alreadyCaughtSelection: GameConstants.Pokeball
  private _alreadyCaughtShinySelection: GameConstants.Pokeball
  private _notCaughtSelection: GameConstants.Pokeball
  private _notCaughtShinySelection: GameConstants.Pokeball

  public selectedSelection: GameConstants.Pokeball
  public selectedTitle: string

  constructor() {
    const player = usePlayerStore()
    const stats = useStatisticsStore()
    this.pokeballs = [
      new Pokeball(GameConstants.Pokeball.Pokeball, () => 0, 1250, 'A standard Pokéball', undefined, 25),
      new Pokeball(GameConstants.Pokeball.Greatball, () => 5, 1000, '+5% chance to catch'),
      new Pokeball(GameConstants.Pokeball.Ultraball, () => 10, 750, '+10% chance to catch'),
      new Pokeball(GameConstants.Pokeball.Masterball, () => 100, 500, '100% chance to catch'),
      new Pokeball(GameConstants.Pokeball.Fastball, () => 0, 500, 'Reduced catch time', new RouteKillRequirement(10, GameConstants.Region.johto, 34)),
      new Pokeball(GameConstants.Pokeball.Quickball, () => {
        if (App.game.gameState == GameConstants.GameState.fighting && player.route) {
          const kills = App.game.statistics.routeKills[GameConstants.Region[player.region]]?.[player.route]?.() || 0
          // between 15 (0 kills) → 0 (4012 kills)
          return Math.min(15, Math.max(0, Math.pow(16, 1 - Math.pow(Math.max(0, kills - 10), 0.6) / 145) - 1))
        }
        if (App.game.gameState == GameConstants.GameState.dungeon)
          return Math.min(15, Math.pow(DungeonRunner.timeLeftPercentage(), 2) / 500)

        return 0
      }, 1000, 'Increased catch rate on routes with less Pokémon defeated', new RouteKillRequirement(10, GameConstants.Region.johto, 34)),
      new Pokeball(GameConstants.Pokeball.Timerball, () => {
        if (App.game.gameState == GameConstants.GameState.fighting && player.route) {
          const kills = App.game.statistics.routeKills[GameConstants.Region[player.region]]?.[player.route]?.() || 0
          // between 0 (0 kills) → 15 (9920 kills)
          return Math.min(15, Math.max(0, Math.pow(16, Math.pow(kills, 0.6) / 250) - 1))
        }
        if (App.game.gameState == GameConstants.GameState.dungeon) {
          const maxBonus = 15
          const timeLeftPercent = DungeonRunner.timeLeftPercentage()
          const timeLeftPercentWhenMax = 15
          return (timeLeftPercentWhenMax < timeLeftPercent) ? (200 / timeLeftPercent - 2) : maxBonus
        }
        return 0
      }, 1000, 'Increased catch rate on routes with more Pokémon defeated', new RouteKillRequirement(10, GameConstants.Region.johto, 34)),
      new Pokeball(GameConstants.Pokeball.Duskball, () => {
        const now = new Date()
        // If player in a dungeon or it's night time
        if (App.game.gameState == GameConstants.GameState.dungeon || now.getHours() >= 18 || now.getHours() < 6)
          return 15

        return 0
      }, 1000, 'Increased catch rate at night time or in dungeons', new RouteKillRequirement(10, GameConstants.Region.johto, 34)),
      // TODO: this needs some sort of bonus, possibly extra dungeon tokens
      new Pokeball(GameConstants.Pokeball.Luxuryball, () => 0, 1250, 'A Luxury Pokéball', new RouteKillRequirement(10, GameConstants.Region.johto, 34)),

      new Pokeball(GameConstants.Pokeball.Diveball, () => {
        // If area is a water environment,
        if (MapHelper.getCurrentEnvironment() == 'Water')
          return 15

        return 0
      }, 1250, 'Increased catch rate on water routes', new RouteKillRequirement(10, GameConstants.Region.hoenn, 101)),

      new Pokeball(GameConstants.Pokeball.Lureball, () => {
        const numLandPokemon = Routes.getRoute(player.region, player.route).pokemon.land.length > 0
        const isWaterPokemon = Routes.getRoute(player.region, player.route).pokemon.water.includes(Battle.enemyPokemon().name)

        // If route has Land Pokémon and the current pokémon is a Water Pokémon
        if (numLandPokemon == true && isWaterPokemon == true)
          return 15

        return 0
      }, 1250, 'Increased catch rate on fished Pokémon', new RouteKillRequirement(10, GameConstants.Region.hoenn, 101)),

      new Pokeball(GameConstants.Pokeball.Nestball, () => {
        const maxRoute = MapHelper.normalizeRoute(Routes.getRoute(player.highestRegion, Routes.getRoutesByRegion(player.highestRegion).length - 1).number, player.highestRegion)
        const currentRoute = MapHelper.normalizeRoute(player.route, player.region)

        // Increased rate for earlier routes, scales with regional progression
        return Math.min(15, Math.max(1, player.highestRegion) * Math.max(1, (maxRoute / currentRoute)))
      }, 1250, 'Increased catch rate on earlier routes', new RouteKillRequirement(10, GameConstants.Region.johto, 34)),

      new Pokeball(GameConstants.Pokeball.Repeatball, () => {
        const amountCaught = App.game.statistics.pokemonCaptured[Battle.enemyPokemon().id]()

        return Math.min(15, Math.pow(amountCaught, 2) / 5000)
      }, 1250, 'Increased catch rate with more catches', new RouteKillRequirement(10, GameConstants.Region.johto, 34)),

    ]
    this._alreadyCaughtSelection = (this.defaults.alreadyCaughtSelection)
    this._alreadyCaughtShinySelection = (this.defaults.alreadyCaughtShinySelection)
    this._notCaughtSelection = (this.defaults.notCaughtSelection)
    this._notCaughtShinySelection = (this.defaults.notCaughtShinySelection)
    this.selectedTitle = ('')
    this.selectedSelection = (this._alreadyCaughtSelection)
  }

  resetToDefaults(): void {
    this._notCaughtSelection = this.defaults.notCaughtSelection
    this._notCaughtShinySelection = this.defaults.notCaughtShinySelection
    this._alreadyCaughtSelection = this.defaults.alreadyCaughtSelection
    this._alreadyCaughtShinySelection = this.defaults.alreadyCaughtShinySelection
    this.pokeballs.forEach(ball => ball.quantity = 0)
  }

  initialize(): void {
    ([
      this._alreadyCaughtSelection,
      this._alreadyCaughtShinySelection,
      this._notCaughtSelection,
      this._notCaughtShinySelection,
    ]).forEach((selection) => {
      selection.subscribe((value) => {
        // switch to Ultraball if Masterball is selected
        if (value == GameConstants.Pokeball.Masterball && App.game.challenges.list.disableMasterballs.active()) {
          selection(GameConstants.Pokeball.Ultraball)
          Notifier.notify({
            title: 'Challenge Mode',
            message: 'Masterballs are disabled!',
            type: NotificationConstants.NotificationOption.danger,
          })
        }
        else if (!this.pokeballs[value]?.unlocked()) {
          selection(GameConstants.Pokeball.None)
        }
      })
    })
  }

  /**
     * Checks the players preferences to see what pokéball needs to be used on the next throw.
     * Checks from the players pref to the most basic ball to see if the player has any.
     * @param id the pokemon we are trying to catch.
     * @param isShiny if the Pokémon is shiny.
     * @returns {GameConstants.Pokeball} pokéball to use.
     */
  public calculatePokeballToUse(id: number, isShiny: boolean): GameConstants.Pokeball {
    const party = usePartyStore()
    const alreadyCaught = party.alreadyCaughtPokemon(id)
    const alreadyCaughtShiny = party.alreadyCaughtPokemon(id, true)
    let pref: GameConstants.Pokeball
    // just check against alreadyCaughtShiny as this returns false when you don't have the pokemon yet.
    if (isShiny) {
      if (!alreadyCaughtShiny) {
        // if the pokemon is also not caught, use the higher selection since a notCaughtShiny is also a notCaught pokemon
        pref = !alreadyCaught ? Math.max(this.notCaughtSelection, this.notCaughtShinySelection) : this.notCaughtShinySelection
      }
      else {
        // if the shiny is already caught, use the higher selection since the pokemon is also a caught pokemon
        pref = Math.max(this.alreadyCaughtSelection, this.alreadyCaughtShinySelection)
      }
    }
    else {
      if (!alreadyCaught)
        pref = this.notCaughtSelection
      else
        pref = this.alreadyCaughtSelection
    }

    let use: GameConstants.Pokeball = GameConstants.Pokeball.None

    if (this.pokeballs[pref]?.quantity) {
      return pref
    }
    else if (pref <= GameConstants.Pokeball.Masterball) {
      // Check which Pokeballs we have in stock that are of equal or lesser than selection (upto Masterball)
      for (let i: number = pref; i >= 0; i--) {
        if (this.pokeballs[i].quantity > 0) {
          use = i
          break
        }
      }
      return use
    }
    else {
      // Use a normal Pokeball or None if we don't have Pokeballs in stock
      return this.pokeballs[GameConstants.Pokeball.Pokeball].quantity ? GameConstants.Pokeball.Pokeball : GameConstants.Pokeball.None
    }
  }

  calculateCatchTime(ball: GameConstants.Pokeball): number {
    return this.pokeballs[ball].catchTime
  }

  gainPokeballs(ball: GameConstants.Pokeball, amount: number, purchase = true): void {
    if(!this.pokeballs[ball] || amount <= 0) return

    GameHelper.incrementObservable(this.pokeballs[ball].quantity, amount)
    GameHelper.incrementObservable(App.game.statistics.pokeballsObtained[ball], amount)
    if (purchase === true) {
      GameHelper.incrementObservable(App.game.statistics.pokeballsBought[ball], amount)
      App.game.logbook.newLog(LogBookTypes.ITEM, `Purchased ${amount} ${this.pokeballs[ball].name}`)
    }
  }

  public usePokeball(ball: GameConstants.Pokeball): void {
    if(this.pokeballs[ball].quantity <= 0) return
    GameHelper.incrementObservable(this.pokeballs[ball].quantity, -1)
    GameHelper.incrementObservable(App.game.statistics.pokeballsUsed[ball])
  }

  getCatchBonus(ball: GameConstants.Pokeball): number {
    return this.pokeballs[ball].catchBonus()
  }

  getBallQuantity(ball: GameConstants.Pokeball): number {
    const pokeball = this.pokeballs[ball]
    return pokeball ? pokeball.quantity : 0
  }

  canAccess(): boolean {
    return true
  }

  fromJSON(json: Record<string, any>): void {
    if (json == null)
      return

    try {
      if (json.pokeballs != null) {
        json.pokeballs.forEach((amt: number, type: number) => {
          if (this.pokeballs[type]) {
            this.pokeballs[type].quantity = Math.max(0, amt)
          }
        })
      }

      this.notCaughtSelection = this.pokeballs[json.notCaughtSelection] ? json.notCaughtSelection : this.defaults.notCaughtSelection
      this.notCaughtShinySelection = this.pokeballs[json.notCaughtShinySelection] ? json.notCaughtShinySelection : this.defaults.notCaughtShinySelection 
      this.alreadyCaughtSelection = this.pokeballs[json.alreadyCaughtSelection] ? json.alreadyCaughtSelection : this.defaults.alreadyCaughtSelection
      this.alreadyCaughtShinySelection = this.pokeballs[json.alreadyCaughtShinySelection] ? json.alreadyCaughtShinySelection : this.defaults.alreadyCaughtShinySelection
    } catch (e) {
      console.error('Error loading pokeball data:', e)
      this.resetToDefaults()
    }
  }

  toJSON(): Record<string, any> {
    return {
      pokeballs: this.pokeballs.map(p => p.quantity),
      notCaughtSelection: this.notCaughtSelection,
      notCaughtShinySelection: this.notCaughtShinySelection,
      alreadyCaughtSelection: this.alreadyCaughtSelection,
      alreadyCaughtShinySelection: this.alreadyCaughtShinySelection,
    }
  }

  update(delta: number): void {
    // This method intentionally left blank
  }

  // Knockout getters/setters
  get notCaughtSelection() {
    return this._notCaughtSelection
  }

  set notCaughtSelection(ball: GameConstants.Pokeball) {
    this._notCaughtSelection = (ball)
  }

  get notCaughtShinySelection() {
    return this._notCaughtShinySelection
  }

  set notCaughtShinySelection(ball: GameConstants.Pokeball) {
    this._notCaughtShinySelection = (ball)
  }

  get alreadyCaughtSelection() {
    return this._alreadyCaughtSelection
  }

  set alreadyCaughtSelection(ball: GameConstants.Pokeball) {
    this._alreadyCaughtSelection = (ball)
  }

  get alreadyCaughtShinySelection() {
    return this._alreadyCaughtShinySelection
  }

  set alreadyCaughtShinySelection(ball: GameConstants.Pokeball) {
    this._alreadyCaughtShinySelection = (ball)
  }
}
