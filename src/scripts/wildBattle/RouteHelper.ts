import type * as GameConstants from '~/enums/GameConstants'
import type { PokemonNameType } from '~/enums/PokemonNameType'
import App from '~/scripts/App'
import { PokemonHelper } from '~/scripts/pokemons/PokemonHelper'
import Routes from '~/scripts/wildBattle/Routes'
import { usePartyStore } from '~/stores/party'
/**
 * Helper class to retrieve information from RoutePokemon
 */
export class RouteHelper {
  /**
     * Retrieves a list of all Pokémon that can be caught on that route.
     * @param route
     * @param region
     * @param includeHeadbutt
     * @returns {string[]} list of all Pokémons that can be caught
     */
  public static getAvailablePokemonList(route: number, region: GameConstants.Region, includeHeadbutt = true): PokemonNameType[] {
    // If the route is somehow higher than allowed, use the first route to generateWildPokemon Pokémon
    const possiblePokemons = Routes.getRoute(region, route)?.pokemon
    if (!possiblePokemons)
      return ['Rattata']

    // Land Pokémon
    let pokemonList = possiblePokemons.land

    // Water Pokémon
    /*    if (App.game.keyItems.hasKeyItem(KeyItems.KeyItem.Super_rod) || possiblePokemons.land.length == 0)
      pokemonList = pokemonList.concat(possiblePokemons.water) */

    // Headbutt Pokémon
    if (includeHeadbutt)
      pokemonList = pokemonList.concat(possiblePokemons.headbutt)

    // Special requirement Pokémon
    pokemonList = pokemonList.concat(...possiblePokemons.special.filter(p => p.isAvailable()).map(p => p.pokemon))

    return pokemonList
  }

  /**
     * Checks if all Pokémons on this route are caught by the player.
     * @param route
     * @param region
     * @param includeShiny
     * @param includeHeadbutt
     * @returns {boolean} true if all Pokémon on this route are caught.
     */

  public static routeCompleted(route: number, region: GameConstants.Region, includeShiny: boolean, includeHeadbutt = true): boolean {
    const possiblePokemon: PokemonNameType[] = RouteHelper.getAvailablePokemonList(route, region, includeHeadbutt)
    return RouteHelper.listCompleted(possiblePokemon, includeShiny)
  }

  public static listCompleted(possiblePokemon: PokemonNameType[], includeShiny: boolean) {
    for (let i = 0; i < possiblePokemon.length; i++) {
      const partyStore = usePartyStore()
      if (!partyStore.alreadyCaughtPokemon(PokemonHelper.getPokemonByName(possiblePokemon[i]).id))
        return false

      if (includeShiny && !partyStore.alreadyCaughtPokemon(PokemonHelper.getPokemonByName(possiblePokemon[i]).id, true))
        return false
    }
    return true
  }
}
