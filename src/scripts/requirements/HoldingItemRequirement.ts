import GameHelper from '../GameHelper'
import type { ItemNameType } from '../items/ItemNameType'
import type { PokemonNameType } from '../pokemons/PokemonNameType'
import Requirement from './Requirement'
import { AchievementOption, humanifyString } from '~/scripts/GameConstants'

export default class HoldingItemRequirement extends Requirement {
  constructor(public pokemon: PokemonNameType, public itemName: ItemNameType, option = AchievementOption.more) {
    super(1, option)
  }

  public getProgress() {
    const heldItem = App.game.party.getPokemonByName(this.pokemon)?.heldItem()
    return Number(heldItem && heldItem.name === this.itemName)
  }

  public hint(): string {
    return `Your pokemon must be holding ${
      GameHelper.anOrA(this.itemName)
    } ${
      humanifyString(this.itemName)
    }`
  }
}
