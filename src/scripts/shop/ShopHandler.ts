import { Shop } from '~/scripts/shop/Shop'
import { usePlayerStore } from '~/stores/player'
import { useWalletStore } from '~/stores/wallet'
import { Pokeballs } from '~/scripts/pokeballs/Pokeballs'
import Amount from '~/modules/wallet/Amount'
import GameHelper from '~/scripts/GameHelper'
import App from '~/scripts/App'

export class ShopHandler {
  static shopObservable: Shop
  static selected = 0
  static amount = 1

  public static showShop(shop: Shop) {
    this.setSelected(0)
    this.shopObservable = new Shop([])
    this.shopObservable = (shop)
    const player = usePlayerStore()
    const wallet = useWalletStore()

    // Apply discounts based on player's multipliers
    shop.items.forEach((item) => {
      if (item.basePrice && player.itemMultipliers[item.saveName]) {
        item.price = Math.round(item.basePrice * player.itemMultipliers[item.saveName])
      }
    })
  }

  // #region Controls

  public static setSelected(i: number) {
    this.selected = (i)
  }

  public static buyItem() {
    const item = this.shopObservable.items[ShopHandler.selected]
    const wallet = useWalletStore()
    const totalCost = item.price * this.amount

    if (wallet.hasAmount(new Amount(totalCost))) {
      if (item.type === 'pokeball') {
        App.game.pokeballs.gainPokeballs(item.ballType, this.amount, true)
        wallet.loseAmount(new Amount(totalCost))
      } else {
        item.buy(this.amount)
      }

      if (Settings.getSetting('resetShopAmountOnPurchase').observableValue()) {
        ShopHandler.resetAmount()
      }
    } else {
      Notifier.notify({
        message: 'Not enough money!',
        type: NotificationConstants.NotificationOption.danger
      })
    }
  }

  public static resetAmount() {
    this.shopObservable.amountInput().val(1).change()
  }

  public static increaseAmount(n: number) {
    const newVal = (parseInt(this.shopObservable.amountInput().val().toString(), 10) || 0) + n
    this.shopObservable.amountInput().val(newVal > 1 ? newVal : 1).change()
  }

  public static multiplyAmount(n: number) {
    const newVal = (parseInt(this.shopObservable.amountInput().val().toString(), 10) || 0) * n
    this.shopObservable.amountInput().val(newVal > 1 ? newVal : 1).change()
  }

  public static maxAmount() {
    const item: Item = this.shopObservable.items[ShopHandler.selected]

    if (!item || !item.isAvailable())
      return this.shopObservable.amountInput().val(0).change()

    const tooMany = (amt: number) => amt > item.maxAmount || !App.game.wallet.hasAmount(new Amount(item.totalPrice(amt), item.currency))
    const amt = GameHelper.binarySearch(tooMany, 0, Number.MAX_SAFE_INTEGER)

    this.shopObservable.amountInput().val(amt).change()
  }

  // #endregion

  // #region UI

  public static calculateCss(i: number): string {
    if (this.selected == i)
      return 'shopItem clickable btn btn-secondary active'
    else
      return 'shopItem clickable btn btn-secondary'
  }

  public static calculateButtonCss(): string {
    const item: Item = this.shopObservable.items[ShopHandler.selected]

    if (item && !(item.isAvailable() && App.game.wallet.hasAmount(new Amount(item.totalPrice(this.amount), item.currency)))
                || this.amount < 1)
      return 'btn btn-danger smallButton smallFont'
    else
      return 'btn btn-success smallButton smallFont'
  }

  // #endregion
}
