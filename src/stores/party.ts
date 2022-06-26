import { acceptHMRUpdate, defineStore } from 'pinia'
import type { PartyPokemon } from '~/scripts/party/PartyPokemon'
import type { PokemonNameType } from '~/enums/PokemonNameType'
import { PokemonHelper } from '~/scripts/pokemons/PokemonHelper'
import type WeatherType from '~/enums/WeatherType'
import PokemonType from '~/enums/PokemonType'
import * as GameConstants from '~/enums/GameConstants'
import App from '~/scripts/App'
import Weather from '~/enums/Weather'
import Multiplier from '~/modules/multiplier/Multiplier'
import { AchievementHandler } from '~/scripts/achievements/AchievementHandler'
import BadgeCase from '~/modules/DataStore/BadgeCase'
import { PokemonFactory } from '~/scripts/pokemons/PokemonFactory'
import GameHelper from '~/enums/GameHelper'
import { LogBookTypes } from '~/modules/logbook/LogBookTypes'
import Notifier from '~/modules/notifications/Notifier'
import NotificationConstants from '~/modules/notifications/NotificationConstants'
export const usePartyStore = defineStore('party', {
  state: () => ({
    _caughtPokemon: [] as PartyPokemon[],
  }),
  getters: {
    caughtPokemon: (state): PartyPokemon[] => {
      return state._caughtPokemon
    },
  },
  actions: {
    addCaughtPokemon(value: PartyPokemon) {
      this._caughtPokemon.push(value)
    },
    alreadyCaughtPokemonByName(name: PokemonNameType, shiny = false) {
      return this.alreadyCaughtPokemon(PokemonHelper.getPokemonByName(name).id, shiny)
    },
    alreadyCaughtPokemon(id: number, shiny = false) {
      const pokemon = this._caughtPokemon.find(p => p.id == id)
      if (pokemon)
        return (!shiny || pokemon.shiny)

      return false
    },
    calculatePokemonAttack(type1: PokemonType = PokemonType.None, type2: PokemonType = PokemonType.None, ignoreRegionMultiplier = false, region: GameConstants.Region = player.region, includeBreeding = false, useBaseAttack = false, overrideWeather?: WeatherType, ignoreLevel = false, includeFlute = true): number {
      let attack = 0
      for (const pokemon of this.caughtPokemon)
        attack += this.calculateOnePokemonAttack(pokemon, type1, type2, region, ignoreRegionMultiplier, includeBreeding, useBaseAttack, overrideWeather, ignoreLevel, includeFlute)

      const bonus = new Multiplier().getBonus('shiny')

      return Math.round(attack * bonus)
    },
    calculateOnePokemonAttack(pokemon: PartyPokemon, type1: PokemonType = PokemonType.None, type2: PokemonType = PokemonType.None, region: GameConstants.Region = player.region, ignoreRegionMultiplier = false, includeBreeding = false, useBaseAttack = false, overrideWeather: WeatherType, ignoreLevel = false, includeFlute = true): number {
      let multiplier = 1; let attack = 0
      const pAttack = useBaseAttack ? pokemon.baseAttack : (ignoreLevel ? pokemon.calculateAttack(ignoreLevel) : pokemon.attack)
      const nativeRegion = PokemonHelper.calcNativeRegion(pokemon.name)

      // Check if the pokemon is in their native region
      if (!ignoreRegionMultiplier && nativeRegion != region && nativeRegion != GameConstants.Region.none) {
        // Check if the challenge mode is active
        if (App.game.challenges.list.regionalAttackDebuff.active()) {
          // Pokemon only retain a % of their total damage in other regions based on highest region.
          multiplier = this.getRegionAttackMultiplier()
        }
      }

      // Check if the Pokemon is currently breeding (no attack)
      if (includeBreeding || !pokemon.breeding) {
        if (type1 == PokemonType.None) {
          attack = pAttack * multiplier
        }
        else {
          const dataPokemon = PokemonHelper.getPokemonByName(pokemon.name)
          attack = pAttack * TypeHelper.getAttackModifier(dataPokemon.type1, dataPokemon.type2, type1, type2) * multiplier
        }
      }

      // Weather boost
      const weather = Weather.weatherConditions[overrideWeather ?? Weather.currentWeather()]
      const dataPokemon = PokemonHelper.getPokemonByName(pokemon.name)
      weather.multipliers?.forEach((value) => {
        if (value.type == dataPokemon.type1)
          attack *= value.multiplier

        if (value.type == dataPokemon.type2)
          attack *= value.multiplier
      })

      // Should we take flute boost into account
      if (includeFlute) {
        const dataPokemon = PokemonHelper.getPokemonByName(pokemon.name)
        FluteEffectRunner.activeGemTypes().forEach((value) => {
          if (value == dataPokemon.type1)
            attack *= GameConstants.FLUTE_TYPE_ATTACK_MULTIPLIER

          if (value == dataPokemon.type2)
            attack *= GameConstants.FLUTE_TYPE_ATTACK_MULTIPLIER
        })
      }

      return attack
    },
    getRegionAttackMultiplier(highestRegion = player.highestRegion()): number {
      // between 0.2 -> 1 based on highest region
      return Math.min(1, Math.max(0.2, 0.1 + (highestRegion / 10)))
    },
    calculateClickAttack(useItem = false): number {
      // Base power
      // Shiny pokemon help with a 50% boost
      //  * (1 + AchievementHandler.achievementBonus())
      const clickAttack = Math.pow(this.caughtPokemon.length + (this.caughtPokemon.filter(p => p.shiny).length / 2) + 1, 1.4)

      const bonus = new Multiplier().getBonus('clickAttack', useItem)

      return Math.floor(clickAttack * bonus)
    },
    gainExp(exp = 0, level = 1, trainer = false) {
      const multBonus = new Multiplier().getBonus('exp', true)
      const trainerBonus = trainer ? 1.5 : 1
      const expTotal = Math.floor(exp * level * trainerBonus * multBonus / 9)

      const maxLevel = new BadgeCase().maxLevel
      for (const pokemon of this.caughtPokemon) {
        if (pokemon.level < maxLevel.value)
          pokemon.gainExp(expTotal)
      }
    },
    gainPokemonById(id: number, shiny = false, suppressNotification = false) {
      this.gainPokemon(PokemonFactory.generatePartyPokemon(id, shiny), suppressNotification)
    },

    gainPokemon(pokemon: PartyPokemon, suppressNotification = false) {
      /* GameHelper.incrementObservable(App.game.statistics.pokemonCaptured[pokemon.id])
      GameHelper.incrementObservable(App.game.statistics.totalPokemonCaptured) */

      if (pokemon.shiny) {
        /* GameHelper.incrementObservable(App.game.statistics.shinyPokemonCaptured[pokemon.id])
        GameHelper.incrementObservable(App.game.statistics.totalShinyPokemonCaptured) */
        // Add all shiny catches to the log book
        // App.game.logbook.newLog(LogBookTypes.CAUGHT, `You have captured a shiny ${pokemon.name}!`)
        // Already caught (shiny)
        if (this.alreadyCaughtPokemon(pokemon.id, true))
          return

        // Notify if not already caught
        Notifier.notify({
          message: `✨ You have captured a shiny ${pokemon.name}! ✨`,
          type: NotificationConstants.NotificationOption.warning,
          sound: NotificationConstants.NotificationSound.General.new_catch,
          setting: NotificationConstants.NotificationSetting.General.new_catch,
        })

        // Already caught (non shiny) we need to update the party pokemon directly
        if (this.alreadyCaughtPokemon(pokemon.id, false)) {
          this.getPokemon(pokemon.id).shiny = true
          return
        }
      }

      // Already caught (non shiny)
      if (this.alreadyCaughtPokemon(pokemon.id, false))
        return

      if (!suppressNotification) {
        Notifier.notify({
          message: `You have captured ${GameHelper.anOrA(pokemon.name)} ${pokemon.name}!`,
          type: NotificationConstants.NotificationOption.success,
          sound: NotificationConstants.NotificationSound.General.new_catch,
          setting: NotificationConstants.NotificationSetting.General.new_catch,
        })
      }

      // App.game.logbook.newLog(LogBookTypes.CAUGHT, `You have captured ${GameHelper.anOrA(pokemon.name)} ${pokemon.name}!`)
      this._caughtPokemon.push(pokemon)
    },
    getPokemon(id: number) {
      for (let i = 0; i < this.caughtPokemon.length; i++) {
        if (this.caughtPokemon[i].id === id)
          return this.caughtPokemon[i]
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePartyStore, import.meta.hot))
