import GameHelper from '~/scripts/GameHelper'
import { LogBookTypes } from '~/modules/logbook/LogBookTypes'
import NotificationConstants from '~/modules/notifications/NotificationConstants'
import { PokemonFactory } from '~/scripts/pokemons/PokemonFactory'
import { PokemonHelper } from '~/scripts/pokemons/PokemonHelper'
import type { EvoData } from '~/scripts/pokemons/evolutions/Base'
import { beforeEvolve } from '~/scripts/pokemons/evolutions/Base'
import Notifier from '~/modules/notifications/Notifier'
import { usePlayerStore } from '~/stores/player'
import { usePartyStore } from '~/stores/party'
import { SHINY_CHANCE_STONE, STONE_EP_YIELD } from '~/scripts/GameConstants'

export class EvolutionHandler {
  static isSatisfied(data: EvoData): boolean {
    return data.restrictions.every(req => req.isCompleted())
  }

  static evolve(data: EvoData, notification = false) {
    // compare to false because it could be undefined
    if (beforeEvolve[data.trigger]?.(data) === false)
      return false

    const evolvedPokemon = data.evolvedPokemon

    // This Pokemon is from a region we haven't reached yet
    if (PokemonHelper.calcNativeRegion(evolvedPokemon) > usePlayerStore().highestRegion)
      return false

    const shiny = PokemonFactory.generateShiny(SHINY_CHANCE_STONE)
    const party = usePartyStore()
    const newPokemon = !party.alreadyCaughtPokemonByName(evolvedPokemon)
    if (newPokemon || shiny || notification) {
      // Notify the player if they haven't already caught the evolution, or notifications are forced
      Notifier.notify({
        message: `Your ${PokemonHelper.displayName(data.basePokemon)} evolved into ${shiny ? 'a shiny' : GameHelper.anOrA(evolvedPokemon)} ${PokemonHelper.displayName(evolvedPokemon)}!`,
        type: NotificationConstants.NotificationOption.success,
        sound: NotificationConstants.NotificationSound.General.new_catch,
        setting: NotificationConstants.NotificationSetting.General.new_catch,
      })
    }

    // Add shiny to logbook
    if (shiny) {
      /* App.game.logbook.newLog(
        LogBookTypes.SHINY,
        party.alreadyCaughtPokemonByName(evolvedPokemon, true)
          ? createLogContent.evolvedShinyDupe({ basePokemon: data.basePokemon, evolvedPokemon })
          : createLogContent.evolvedShiny({ basePokemon: data.basePokemon, evolvedPokemon }),
      ) */
    }

    party.gainPokemonById(PokemonHelper.getPokemonByName(evolvedPokemon).id, shiny, true)

    const evolvedPartyPokemon = party.getPokemonByName(evolvedPokemon)
    // && App.game.challenges.list.realEvolutions.active()
    if (newPokemon) {
      const basePartyPokemon = party.getPokemon(PokemonHelper.getPokemonByName(data.basePokemon).id)
      evolvedPartyPokemon.exp = basePartyPokemon.exp
      evolvedPartyPokemon.effortPoints = basePartyPokemon.effortPoints
      evolvedPartyPokemon.pokerus = basePartyPokemon.pokerus
      evolvedPartyPokemon.shiny = evolvedPartyPokemon.shiny || basePartyPokemon.shiny
      evolvedPartyPokemon.attackBonusAmount = basePartyPokemon.attackBonusAmount
      evolvedPartyPokemon.attackBonusPercent = basePartyPokemon.attackBonusPercent
      evolvedPartyPokemon.vitaminsUsed = basePartyPokemon.vitaminsUsed
      evolvedPartyPokemon.heldItem = basePartyPokemon.heldItem
      party.removePokemonByName(data.basePokemon)
    }

    // EVs
    // evolvedPartyPokemon.effortPoints += party.calculateEffortPoints(evolvedPartyPokemon, shiny, STONE_EP_YIELD)
    return shiny
  }
}
