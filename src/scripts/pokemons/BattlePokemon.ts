/// <reference path="../../declarations/GameHelper.d.ts" />

import type { ComputedRef, Ref } from 'vue-demi'
import { computed, ref } from 'vue'
import type { PokemonNameType } from '~/enums/PokemonNameType'
import PokemonType from '~/enums/PokemonType'
import type BagItem from '~/interfaces/BagItem'
import GameHelper from '~/scripts/GameHelper'
import App from '~/scripts/App'
import type { EnemyPokemonInterface } from '~/scripts/pokemons/EnemyPokemonInterface'
import Amount from '~/modules/wallet/Amount'
import * as GameConstants from '~/scripts/GameConstants'
import Notifier from '~/modules/notifications/Notifier'
import NotificationConstants from '~/modules/notifications/NotificationConstants'
import { LogBookTypes } from '~/modules/logbook/LogBookTypes'
import { useWalletStore } from '~/stores/wallet'
import { usePartyStore } from '~/stores/party'
export class BattlePokemon implements EnemyPokemonInterface {
  health: number
  maxHealth: number
  healthPercentage: number

  /**
     * In case you want to manually create a Pokémon instead of generating it from the route number
     * @param name Pokémon name
     * @param id Pokémon
     * @param type1 First type of the Pokémon
     * @param type2 Second type of the Pokémon
     * @param maxHealth max health that the Pokémon can have
     * @param level level is 2 times the current route
     * @param catchRate base chance of catching this Pokémon
     * @param exp base exp reward for defeating this Pokémon
     * @param reward currency reward for defeating this Pokémon
     * @param shiny is a shiny variant
     * @param [heldItem] item to possibly gain for defeating this Pokémon
     */

  constructor(
    public name: PokemonNameType,
    public id: number,
    public type1: PokemonType = PokemonType.None,
    public type2: PokemonType = PokemonType.None,
    maxHealth: number,
    public level: number,
    public catchRate: number,
    public exp: number,
    public reward: Amount = new Amount(0, GameConstants.Currency.money),
    public shiny: boolean,
    public gemReward = 1,
    public heldItem?: BagItem,
  ) {
    this.health = (maxHealth)
    this.maxHealth = (maxHealth)
    this.healthPercentage = (100)
  }

  public isAlive(): boolean {
    return this.health > 0
  }

  /**
     * Lost health without
     * @param damage
     */
  public damage(damage: number): void {
    this.health = (Math.max(0, this.health - damage))
    this.healthPercentage = (Math.floor(this.health / this.maxHealth * 100))
  }

  public defeat(trainer = false): void {
    /* GameHelper.incrementObservable(App.game.statistics.pokemonDefeated[this.id])
    GameHelper.incrementObservable(App.game.statistics.totalPokemonDefeated)
    if (this.shiny) {
      GameHelper.incrementObservable(App.game.statistics.shinyPokemonDefeated[this.id])
      GameHelper.incrementObservable(App.game.statistics.totalShinyPokemonDefeated)
    } */
    const wallet = useWalletStore()
    if (this.reward.amount > 0)
      wallet.addAmount(this.reward)

    if (this.heldItem) {
      const name = BagHandler.displayName(this.heldItem)
      BagHandler.gainItem(this.heldItem)
      const msg = `${this.name} dropped ${GameHelper.anOrA(name)} ${name}!`
      Notifier.notify({
        message: `The enemy ${msg}`,
        type: NotificationConstants.NotificationOption.success,
        setting: NotificationConstants.NotificationSetting.Items.dropped_item,
      })
      App.game.logbook.newLog(LogBookTypes.FOUND, `An enemy ${msg}`)
    }
    const partyStore = usePartyStore()
    partyStore.gainExp(this.exp, this.level, trainer)
    /*    App.game.gems.gainGems(this.gemReward, this.type1)
    App.game.gems.gainGems(this.gemReward, this.type2) */
  }
}
