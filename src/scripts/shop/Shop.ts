
import type Requirement from '~/scripts/achievements/Requirement'
import type OneFromManyRequirement from '~/scripts/achievements/OneFromManyRequirement'
import { TownContent } from '~/scripts/towns/TownContent'
import type { Item } from '~/scripts/items/Item'
import { ItemList } from '~/scripts/items/Item'
import { PokeballItem } from '~/scripts/items/PokeballItem'
import * as GameConstants from '~/scripts/GameConstants'
import { ShopHandler } from '~/scripts/shop/ShopHandler'
import { useModalStore } from '~/stores/modal'

export class Shop extends TownContent {
  public cssClass() {
    return 'btn btn-secondary'
  }

  public text(): string {
    return this.name ?? 'Poké Mart'
  }

  public isVisible(): boolean {
    return true
  }

  public onclick(): void {
    ShopHandler.showShop(this)
    useModalStore().shopModalFlag = (true)
  }

  public tooltip = 'Visit shops to buy items.'
  constructor(
    public items: Item[],
    public name = undefined,
    requirements: (Requirement | OneFromManyRequirement)[] = [],
  ) {
    super(requirements)
  }

  get displayName() {
    if (this.name)
      return this.name

    if (!this.parent)
      return 'Poké Mart'

    return `Poké Mart ${this.parent.name}`
  }

  public amountInput = () => null// $('#shopModal').find('input[name="amountOfItems"]')
}

export const pokeMartShop = new Shop([
  ItemList.Pokeball,
  ItemList.Greatball,
  ItemList.Ultraball,
  ItemList.xAttack,
  ItemList.xClick,
  ItemList.Lucky_egg,
  ItemList.Token_collector,
  ItemList.Item_magnet,
  ItemList.Lucky_incense,
  ItemList.SmallRestore,
  ItemList.MediumRestore,
  ItemList.LargeRestore,
], 'Explorers Poké Mart')

export const DepartmentStoreShop = new Shop([
  ItemList.Pokeball,
  ItemList.Greatball,
  ItemList.Ultraball,
  ItemList.xAttack,
  ItemList.xClick,
  ItemList.Lucky_egg,
  ItemList.Item_magnet,
  ItemList.Token_collector,
  ItemList.Lucky_incense,
  ItemList.SmallRestore,
  ItemList.MediumRestore,
  ItemList.LargeRestore,
], 'Department Store')

export const pokeLeagueShop = () => new Shop([
  new PokeballItem(GameConstants.Pokeball.Masterball, 10000000, GameConstants.Currency.money, { multiplier: 1.35, multiplierDecrease: false, saveName: `${GameConstants.Pokeball[GameConstants.Pokeball.Masterball]}|${GameConstants.Currency[GameConstants.Currency.money]}` }),
  new PokeballItem(GameConstants.Pokeball.Masterball, 75000, GameConstants.Currency.dungeonToken, { multiplier: 1.35, multiplierDecrease: false, saveName: `${GameConstants.Pokeball[GameConstants.Pokeball.Masterball]}|${GameConstants.Currency[GameConstants.Currency.dungeonToken]}` }),
  new PokeballItem(GameConstants.Pokeball.Masterball, 3000, GameConstants.Currency.questPoint, { multiplier: 1.35, multiplierDecrease: false, saveName: `${GameConstants.Pokeball[GameConstants.Pokeball.Masterball]}|${GameConstants.Currency[GameConstants.Currency.questPoint]}` }),
  new PokeballItem(GameConstants.Pokeball.Masterball, 3000, GameConstants.Currency.farmPoint, { multiplier: 1.35, multiplierDecrease: false, saveName: `${GameConstants.Pokeball[GameConstants.Pokeball.Masterball]}|${GameConstants.Currency[GameConstants.Currency.farmPoint]}` }),
  new PokeballItem(GameConstants.Pokeball.Masterball, 50, GameConstants.Currency.diamond, { multiplier: 1.35, multiplierDecrease: false, saveName: `${GameConstants.Pokeball[GameConstants.Pokeball.Masterball]}|${GameConstants.Currency[GameConstants.Currency.diamond]}` }),
  // ItemList['RareCandy'],
  ItemList.Protein,
])

// Kanto Shops
export const PewterCityShop = new Shop([
  ItemList.Pokeball,
  ItemList.Token_collector,
  ItemList.Lucky_egg,
  ItemList.Mystery_egg,
])
export const Route3Shop = new Shop([
  ItemList.Magikarp,
])
export const CeruleanCityShop = new Shop([
  ItemList.Water_stone,
  ItemList.xAttack,
  ItemList.Water_egg,
])
export const VermilionCityShop = new Shop([
  ItemList.Thunder_stone,
  ItemList.Lucky_egg,
  ItemList.Electric_egg,
])
export const CeladonCityShop = new Shop([
  ItemList.Eevee,
  ItemList.Porygon,
  ItemList.Jynx,
  ItemList['Mr. Mime'],
  ItemList.Lickitung,
], 'Game Corner Shop')
export const CeladonDepartmentStoreShop = new Shop([
  ItemList.Pokeball,
  ItemList.Greatball,
  ItemList.xAttack,
  ItemList.xClick,
  ItemList.Lucky_egg,
  ItemList.Item_magnet,
  ItemList.Token_collector,
  ItemList.Lucky_incense,
], 'Department Store')
export const SaffronCityShop = new Shop([
  ItemList.Moon_stone,
  ItemList.xClick,
  ItemList.Leaf_stone,
  ItemList.Fighting_egg,
])
export const FuchsiaCityShop = new Shop([
  ItemList.Ultraball,
  ItemList.Trade_stone,
  ItemList.Lucky_egg,
  ItemList.Dragon_egg,
])
export const CinnabarIslandShop = new Shop([
  ItemList.Fire_stone,
  ItemList.Fire_egg,
  ItemList.SmallRestore,
  ItemList.Explorer_kit,
  ItemList.Explosive_Charge,
  ItemList.Treasure_Scanner,
  ItemList.HatcheryHelperKris,
])
export const ViridianCityShop = new Shop([
  ItemList.Pokeball,
  ItemList.xAttack,
  ItemList.xClick,
  ItemList.Dungeon_ticket,
])
export const LavenderTownShop = new Shop([
  ItemList.Greatball,
  ItemList.Item_magnet,
  ItemList.Lucky_incense,
  ItemList.Grass_egg,
])
