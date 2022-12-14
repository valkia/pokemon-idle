import type { Saveable } from '~/modules/DataStore/common/Saveable'
import { PokemonHelper } from '~/scripts/pokemons/PokemonHelper'
import App from '~/scripts/App'
import GameHelper from '~/scripts/GameHelper'
import NotificationConstants from '~/modules/notifications/NotificationConstants'
import { levelRequirements } from '~/enums/LevelType'
import type { PokemonNameType } from '~/enums/PokemonNameType'
import Settings from '~/modules/settings'
import Notifier from '~/modules/notifications/Notifier'
import type { EvoData, StoneEvoData } from '~/scripts/pokemons/evolutions/Base'
import { EvoTrigger, LevelEvolution } from '~/scripts/pokemons/evolutions/Base'
import { EvolutionHandler } from '~/scripts/party/evolutions/EvolutionHandler'
import Rand from '~/modules/utilities/Rand'
enum PartyPokemonSaveKeys {
  attackBonusPercent = 0,
  attackBonusAmount,
  vitaminsUsed,
  exp,
  breeding,
  shiny,
  category,
  levelEvolutionTriggered,
  pokerus,
  effortPoints,
  heldItem,
  defaultFemaleSprite,
  hideShinyImage,
  nickname,
  megaStone,
}

export class PartyPokemon {
  defaults = {
    attackBonusPercent: 0,
    attackBonusAmount: 0,
    proteinsUsed: 0,
    exp: 0,
    breeding: false,
    shiny: false,
    category: 0,
    levelEvolutionTriggered: false,
  }

  _breeding: boolean
  _shiny: boolean
  _level: number
  _attack: number
  _attackBonusPercent: number
  _attackBonusAmount: number
  _category: number
  proteinsUsed: number

  constructor(
    public id: number,
    public name: PokemonNameType,
    public evolutions: EvoData[],
    public baseAttack: number,
    attackBonusPercent = 0,
    attackBonusAmount = 0,
    proteinsUsed,
    public exp: number = 0,
    breeding = false,
    shiny = false,
    category = 0,
  ) {
    this.proteinsUsed = proteinsUsed
    this._breeding = breeding
    this._shiny = shiny
    this._level = 1
    this._attackBonusPercent = attackBonusPercent
    this._attackBonusAmount = attackBonusAmount
    this._attack = this.calculateAttack()
    this._category = category
  }

  public calculateAttack(ignoreLevel = false): number {
    const attackBonusMultiplier = 1 + (this.attackBonusPercent / 100)
    const levelMultiplier = ignoreLevel ? 1 : this.level / 100
    return Math.max(1, Math.floor((this.baseAttack * attackBonusMultiplier + this.attackBonusAmount) * levelMultiplier))
  }

  calculateLevelFromExp() {
    const levelType = PokemonHelper.getPokemonByName(this.name).levelType
    for (let i = this.level - 1; i < levelRequirements[levelType].length; i++) {
      if (levelRequirements[levelType][i] > this.exp)
        return i
    }
    return this.level
  }

  public gainExp(exp: number) {
    this.exp += exp * this.getExpMultiplier()
    const oldLevel = this.level
    const newLevel = this.calculateLevelFromExp()
    if (oldLevel !== newLevel) {
      this.level = newLevel
      this.checkForLevelEvolution()
    }
  }

  private getExpMultiplier() {
    const result = 1
    /* if (this.heldItem() && this.heldItem() instanceof ExpGainedBonusHeldItem)
      result *= (this.heldItem() as ExpGainedBonusHeldItem).gainedBonus
*/
    return result
  }

  public checkForLevelEvolution() {
    if (this.breeding || this.evolutions == null || this.evolutions.length == 0)
      return

    for (const evo of this.evolutions) {
      if (evo.trigger === EvoTrigger.LEVEL && EvolutionHandler.isSatisfied(evo))
        EvolutionHandler.evolve(evo)
    }
  }

  public useStone(stoneType: GameConstants.StoneType): boolean {
    const possibleEvolutions: EvoData[] = []
    for (const evo of this.evolutions) {
      if (evo.trigger === EvoTrigger.STONE && (evo as StoneEvoData).stone == stoneType && EvolutionHandler.isSatisfied(evo))
        possibleEvolutions.push(evo)
    }
    if (possibleEvolutions.length !== 0)
      return EvolutionHandler.evolve(Rand.fromArray(possibleEvolutions))

    return false
  }

  public useProtein(amount: number): void {
    if (App.game.challenges.list.disableProteins.active()) {
      Notifier.notify({
        title: 'Challenge Mode',
        message: 'Proteins are disabled',
        type: NotificationConstants.NotificationOption.danger,
      })
      return
    }

    const usesRemaining = this.proteinUsesRemaining()

    // If no more proteins can be used on this Pokemon
    if (!usesRemaining) {
      Notifier.notify({
        message: 'This Pokémon cannot increase their power any higher!',
        type: NotificationConstants.NotificationOption.warning,
      })
      return
    }

    // The lowest number of amount they want to use, total in inventory, uses remaining for this Pokemon
    amount = Math.min(amount, player.itemList.Protein(), usesRemaining)

    // Apply the proteins
    if (ItemHandler.useItem('Protein', amount))
      GameHelper.incrementObservable(this.proteinsUsed, amount)
  }

  proteinUsesRemaining = (): number => {
    // Allow 5 for every region visited (including Kanto)
    return (player.highestRegion() + 1) * 5 - this.proteinsUsed()
  }

  public hideFromProteinList = (): boolean => {
    return this.breeding
            || (this.proteinUsesRemaining() == 0 && Settings.getSetting('proteinHideMaxedPokemon').observableValue())
            || (this.shiny && Settings.getSetting('proteinHideShinyPokemon').observableValue())
  }

  public fromJSON(json: Record<string, any>): void {
    if (json == null)
      return

    if (json.id == null)
      return

    this.attackBonusPercent = json[PartyPokemonSaveKeys.attackBonusPercent] ?? this.defaults.attackBonusPercent
    this.attackBonusAmount = json[PartyPokemonSaveKeys.attackBonusAmount] ?? this.defaults.attackBonusAmount
    this.proteinsUsed = json[PartyPokemonSaveKeys.proteinsUsed] ?? this.defaults.proteinsUsed
    this.exp = json[PartyPokemonSaveKeys.exp] ?? this.defaults.exp
    this.breeding = json[PartyPokemonSaveKeys.breeding] ?? this.defaults.breeding
    this.shiny = json[PartyPokemonSaveKeys.shiny] ?? this.defaults.shiny
    this.category = json[PartyPokemonSaveKeys.category] ?? this.defaults.category
    this.level = this.calculateLevelFromExp()
    this.attack = this.calculateAttack()

    if (this.evolutions != null) {
      for (const evolution of this.evolutions) {
        if (evolution instanceof LevelEvolution)
          evolution.triggered = json[PartyPokemonSaveKeys.levelEvolutionTriggered] ?? this.defaults.levelEvolutionTriggered
      }
    }
  }

  public toJSON() {
    let levelEvolutionTriggered = false
    if (this.evolutions != null) {
      for (const evolution of this.evolutions) {
        if (evolution instanceof LevelEvolution && evolution.triggered)
          levelEvolutionTriggered = true
      }
    }
    const output = {
      id: this.id,
      [PartyPokemonSaveKeys.attackBonusPercent]: this.attackBonusPercent,
      [PartyPokemonSaveKeys.attackBonusAmount]: this.attackBonusAmount,
      [PartyPokemonSaveKeys.proteinsUsed]: this.proteinsUsed,
      [PartyPokemonSaveKeys.exp]: this.exp,
      [PartyPokemonSaveKeys.breeding]: this.breeding,
      [PartyPokemonSaveKeys.shiny]: this.shiny,
      [PartyPokemonSaveKeys.levelEvolutionTriggered]: levelEvolutionTriggered,
      [PartyPokemonSaveKeys.category]: this.category,
    }

    // Don't save anything that is the default option
    Object.entries(output).forEach(([key, value]) => {
      if (value === this.defaults[PartyPokemonSaveKeys[key]])
        delete output[key]
    })

    return output
  }

  // Knockout getters/setter
  get level(): number {
    return this._level
  }

  set level(level: number) {
    this._level = (level)
  }

  get attack(): number {
    return this._attack
  }

  set attack(attack: number) {
    this._attack = (attack)
  }

  get attackBonusAmount(): number {
    return this._attackBonusAmount
  }

  set attackBonusAmount(attackBonusAmount: number) {
    this._attackBonusAmount = (attackBonusAmount)
  }

  get attackBonusPercent(): number {
    return this._attackBonusPercent
  }

  set attackBonusPercent(attackBonusPercent: number) {
    this._attackBonusPercent = (attackBonusPercent)
  }

  get breeding(): boolean {
    return this._breeding
  }

  set breeding(bool: boolean) {
    this._breeding = (bool)
  }

  get shiny(): boolean {
    return this._shiny
  }

  set shiny(bool: boolean) {
    this._shiny = (bool)
  }

  get category(): number {
    return this._category
  }

  set category(index: number) {
    this._category = (index)
  }
}
