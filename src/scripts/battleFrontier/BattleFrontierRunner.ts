/// <reference path="../../declarations/GameHelper.d.ts" />
import { computed, ref } from 'vue'
import * as GameConstants from '~/enums/GameConstants'
import App from '~/scripts/App'
import GameHelper from '~/enums/GameHelper'
import { BattleFrontierBattle } from '~/scripts/battleFrontier/BattleFrontierBattle'
export class BattleFrontierRunner {
  public static timeLeft = ref(GameConstants.GYM_TIME)
  public static timeLeftPercentage = ref(100)
  static stage = ref(1) // Start at stage 1
  public static checkpoint = ref(1) // Start at stage 1
  public static highest = ref(1)

  public static counter = 0

  public static started = ref(false)

  constructor() {}

  public static tick() {
    if (!this.started.value)
      return

    if (this.timeLeft.value < 0)
      this.battleLost()

    this.timeLeft.value = (this.timeLeft.value - GameConstants.GYM_TICK)
    this.timeLeftPercentage.value = (Math.floor(this.timeLeft.value / GameConstants.GYM_TIME * 100))
  }

  public static start(useCheckpoint: boolean) {
    this.started.value = (true)
    this.stage.value = (useCheckpoint ? this.checkpoint.value : 1)
    this.highest.value = (App.game.statistics.battleFrontierHighestStageCompleted())
    BattleFrontierBattle.pokemonIndex.value = (0)
    BattleFrontierBattle.generateNewEnemy()
    BattleFrontierRunner.timeLeft.value = (GameConstants.GYM_TIME)
    BattleFrontierRunner.timeLeftPercentage.value = (100)
    App.game.gameState = GameConstants.GameState.battleFrontier
  }

  public static nextStage() {
    // Gain any rewards we should have earned for defeating this stage
    BattleFrontierMilestones.gainReward(this.stage.value)
    if (App.game.statistics.battleFrontierHighestStageCompleted() < this.stage.value) {
      // Update our highest stage
      App.game.statistics.battleFrontierHighestStageCompleted(this.stage.value)
    }
    // Move on to the next stage
    GameHelper.incrementObservable(this.stage)
    GameHelper.incrementObservable(App.game.statistics.battleFrontierTotalStagesCompleted)
    BattleFrontierRunner.timeLeft.value = (GameConstants.GYM_TIME)
    BattleFrontierRunner.timeLeftPercentage.value = (100)

    this.checkpoint.value = (this.stage.value)
  }

  public static end() {
    BattleFrontierBattle.enemyPokemon(null)
    this.stage.value = (1)
    this.started.value = (false)
  }

  public static battleLost() {
    // Current stage - 1 as the player didn't beat the current stage
    const stageBeaten = this.stage.value - 1
    // Give Battle Points and Money based on how far the user got
    const battleMultiplier = Math.max(stageBeaten / 100, 1)
    const battlePointsEarned = Math.round(stageBeaten * battleMultiplier)
    const moneyEarned = stageBeaten * 100 * battleMultiplier

    Notifier.notify({
      title: 'Battle Frontier',
      message: `You managed to beat stage ${stageBeaten}.\nYou received ${battlePointsEarned} BP`,
      type: NotificationConstants.NotificationOption.success,
      setting: NotificationConstants.NotificationSetting.General.battle_frontier,
      timeout: 5 * GameConstants.MINUTE,
    })

    // Award battle points
    App.game.wallet.gainBattlePoints(battlePointsEarned)
    App.game.wallet.gainMoney(moneyEarned)
    const reward = BattleFrontierMilestones.nextMileStone()

    this.checkpoint.value = (1)

    this.end()
  }

  public static battleQuit() {
    Notifier.confirm({
      title: 'Battle Frontier',
      message: 'Are you sure you want to leave?\n\nYou can always return later and start off where you left.',
      type: NotificationConstants.NotificationOption.danger,
      confirm: 'leave',
    }).then((confirmed) => {
      if (confirmed) {
        // Don't give any points, user quit the challenge
        Notifier.notify({
          title: 'Battle Frontier',
          message: `Checkpoint set for stage ${this.stage()}`,
          type: NotificationConstants.NotificationOption.info,
          timeout: 1 * GameConstants.MINUTE,
        })

        this.end()
      }
    })
  }

  public static timeLeftSeconds = computed(() => {
    return (Math.ceil(BattleFrontierRunner.timeLeft.value / 100) / 10).toFixed(1)
  })

  public static pokemonLeftImages = computed(() => {
    let str = ''
    for (let i = 0; i < 3; i++)
      str += `<img class="pokeball-smallest" src="assets/images/pokeball/Pokeball.svg"${BattleFrontierBattle.pokemonIndex.value > i ? ' style="filter: saturate(0);"' : ''}>`

    return str
  })

  public static hasCheckpoint = computed(() => {
    return BattleFrontierRunner.checkpoint.value > 1
  })
}
