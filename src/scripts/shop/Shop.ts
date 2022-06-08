
import type Requirement from '~/scripts/achievements/Requirement'
import type OneFromManyRequirement from '~/scripts/achievements/OneFromManyRequirement'
import { TownContent } from '~/scripts/towns/TownContent'
import type { Item } from '~/scripts/items/Item'

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
    $('#shopModal').modal('show')
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

  public amountInput = () => $('#shopModal').find('input[name="amountOfItems"]')
}
