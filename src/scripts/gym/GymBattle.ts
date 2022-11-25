/// <reference path="../Battle.ts"/>
import { Battle } from '~/scripts/Battle'
import { GymRunner } from '~/scripts/gym/GymRunner'
import { useGymStore } from '~/stores/gym'
import { PokemonFactory } from '~/scripts/pokemons/PokemonFactory'

export class GymBattle extends Battle {
  public static pokemonAttack() {
    const gymStore = useGymStore()
    if (gymStore.running)
      super.pokemonAttack()
  }

  public static clickAttack() {
    const gymStore = useGymStore()
    if (gymStore.running)
      super.clickAttack(gymStore)
  }

  /**
     * Award the player with exp, and go to the next pokemon
     */
  public static defeatPokemon() {
    const gymStore = useGymStore()
    gymStore.enemyPokemon.defeat(true)

    // Make gym "route" regionless
    // App.game.breeding.progressEggsBattle(this.gym.badgeReward * 3 + 1, Region.none)
    gymStore.index = (gymStore.index + 1)
    console.log('gymStore.index', gymStore.index)
    console.log('gymStore.gym.pokemons.length', gymStore.gym.pokemons.length)
    if (gymStore.index >= gymStore.gym.pokemons.length)
      GymRunner.gymWon(gymStore.gym)
    else
      this.generateNewEnemy()

    // player.lowerItemMultipliers(MultiplierDecreaser.Battle)
  }

  /**
     * Reset the counter.
     */
  public static generateNewEnemy() {
    const gymStore = useGymStore()
    this.counter = 0
    gymStore.enemyPokemon = (PokemonFactory.generateGymPokemon(gymStore.gym, gymStore.index))
  }

  public static pokemonsDefeatedComputable = computed(() => {
    const gymStore = useGymStore()
    return gymStore.index
  })

  public static pokemonsUndefeatedComputable = computed(() => {
    const gymStore = useGymStore()
    return gymStore.totalPokemons - gymStore.index
  })
}
