import type { PokemonNameType } from '~/enums/PokemonNameType'
import { PokemonHelper } from '~/scripts/pokemons/PokemonHelper'
import App from '~/scripts/App'
import NotificationConstants from '~/modules/notifications/NotificationConstants'
import { PokemonFactory } from '~/scripts/pokemons/PokemonFactory'
import Notifier from '~/modules/notifications/Notifier'
import type { EvolutionType } from '~/enums/EvolutionType'
import * as GameConstants from '~/enums/GameConstants'
import { usePlayerStore } from '~/stores/player'
export abstract class Evolution {
  type: EvolutionType[]

  constructor(
    public basePokemon: PokemonNameType,
  ) {
    this.type = []
  }

  isSatisfied(): boolean {
    // Check that evolution is within reached regions
    const player = usePlayerStore()
    return PokemonHelper.calcNativeRegion(this.getEvolvedPokemon()) <= player.highestRegion
  }

  abstract getEvolvedPokemon(): PokemonNameType

  evolve(notification = false): boolean {
    const evolvedPokemon = this.getEvolvedPokemon()

    // This Pokemon is from a region we haven't reached yet
    const player = usePlayerStore()
    if (PokemonHelper.calcNativeRegion(evolvedPokemon) > player.highestRegion)
      return false

    // Notify the player if they haven't already caught the evolution, or notifications are forced
    if (!App.game.party.alreadyCaughtPokemonByName(evolvedPokemon) || notification) {
      Notifier.notify({
        message: `Your ${this.basePokemon} evolved into a ${evolvedPokemon}`,
        type: NotificationConstants.NotificationOption.success,
      })
    }

    const shiny = PokemonFactory.generateShiny(GameConstants.SHINY_CHANCE_STONE)
    App.game.party.gainPokemonById(PokemonHelper.getPokemonByName(evolvedPokemon).id, shiny, true)
    return shiny
  }
}

export type MinimalEvo = ConstructorImplementing<Evolution, 'getEvolvedPokemon'>

export function restrictEvoWith(restrictionTest: () => boolean, type: EvolutionType = null) {
  return function<T extends MinimalEvo>(Base: T): T {
    return class extends Base {
      constructor(...args: any[]) {
        super(...args)
        if (type !== null)
          this.type.push(type)
      }

      isSatisfied(): boolean {
        return restrictionTest() && super.isSatisfied()
      }
    }
  }
}
