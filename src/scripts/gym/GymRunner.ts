import type { Gym } from '~/scripts/gym/Gym'
import Amount from '~/modules/wallet/Amount'
import KeyItemController from '~/modules/keyItems/KeyItemController'
import KeyItemType from '~/modules/enums/KeyItemType'
import NotificationConstants from '~/modules/notifications/NotificationConstants'
import Settings from '~/modules/settings'
import Notifier from '~/modules/notifications/Notifier'
import { useGymStore } from '~/stores/gym'
import { useGameStore } from '~/stores/game'
import { Currency, GYM_COUNTDOWN, GYM_TICK, GYM_TIME, GameState, getGymIndex } from '~/scripts/GameConstants'
import { GymBattle } from '~/scripts/gym/GymBattle'
import BadgeCase from '~/modules/DataStore/BadgeCase'
import { useStatisticsStore } from '~/stores/statistics'
import { usePlayerStore } from '~/stores/player'
import BadgeEnums from '~/modules/enums/Badges'

export class GymRunner {
  public static startGym(
    gym: Gym,
    autoRestart = false,
    initialRun = true,
  ) {
    const gymStore = useGymStore()
    gymStore.initialRun = (initialRun)
    gymStore.autoRestart = (autoRestart)
    gymStore.running = (false)
    gymStore.gym = (gym)
    /* todo 冠军gym
    if (gym instanceof Champion)
      gym.setPokemon(player.regionStarters[player.region]())
*/
    const gameStore = useGameStore()
    gameStore.gameState = (GameState.idle)

    gymStore.timeLeft = (GYM_TIME)
    gymStore.timeLeftPercentage = (100)

    gymStore.totalPokemons = (gym.pokemons.length)
    gymStore.index = (0)
    GymBattle.generateNewEnemy()
    gameStore.gameState = (GameState.gym)
    gymStore.running = (true)
    // todo
    // this.resetGif()

    /* setTimeout(() => {
      this.hideGif()
    }, GYM_COUNTDOWN) */
  }

  private static hideGif() {
    $('#gymGoContainer').hide()
  }

  public static resetGif() {
    // If the user doesn't want the animation, just return
    if (!Settings.getSetting('showGymGoAnimation').value)
      return

    const gymStore = useGymStore()
    if (!gymStore.autoRestart || gymStore.initialRun) {
      $('#gymGoContainer').show()
      setTimeout(() => {
        $('#gymGo').attr('src', 'assets/gifs/go.gif')
      }, 0)
    }
  }

  public static tick() {
    const gymStore = useGymStore()
    if (!gymStore.running)
      return

    if (gymStore.timeLeft < 0)
      GymRunner.gymLost()

    gymStore.timeLeft = (gymStore.timeLeft - GYM_TICK)
    gymStore.timeLeftPercentage = (Math.floor(gymStore.timeLeft / GYM_TIME * 100))
  }

  public static gymLost() {
    const gymStore = useGymStore()
    if (gymStore.running) {
      gymStore.running = (false)
      Notifier.notify({
        message: `It appears you are not strong enough to defeat ${GymBattle.gym.leaderName}`,
        type: NotificationConstants.NotificationOption.danger,
      })
      const gameStore = useGameStore()
      gameStore.gameState = (GameState.town)
    }
  }

  public static gymWon(gym: Gym) {
    console.log('gymWon')
    const gymStore = useGymStore()
    if (gymStore.running) {
      gymStore.running = (false)
      Notifier.notify({
        message: `Congratulations, you defeated ${gymStore.gym.leaderName}!`,
        type: NotificationConstants.NotificationOption.success,
        setting: NotificationConstants.NotificationSetting.General.gym_won,
      })
      // If this is the first time defeating this gym
      if (!new BadgeCase().hasBadge(gym.badgeReward))
        gym.firstWinReward()

      const statistics = useStatisticsStore()
      statistics.addGymsDefeated[getGymIndex(gym.town)]

      // Auto restart gym battle
      if (gymStore.autoRestart) {
        const cost = (gymStore.gym.moneyReward || 10) * 2
        const amt = new Amount(cost, Currency.money)
        // If the player can afford it, restart the gym
        // if (App.game.wallet.loseAmount(amt)) {
        this.startGym(gymStore.gym, gymStore.autoRestart, false)
        return
        // }
      }

      // Award money for defeating gym
      // App.game.wallet.gainMoney(gym.moneyReward)
      const player = usePlayerStore()
      // Send the player back to the town they were in
      player.town = (gym.parent)
      const gameStore = useGameStore()
      gameStore.gameState = (GameState.town)
      // App.game.gameState = GameConstants.GameState.town
    }
  }

  public static timeLeftSeconds = computed(() => {
    const gymStore = useGymStore()
    return (Math.ceil(gymStore.timeLeft / 100) / 10).toFixed(1)
  })

  public static timeLeftPercentage = computed(() => {
    const gymStore = useGymStore()
    return Math.floor(gymStore.timeLeft / GYM_TIME * 100)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  $('#receiveBadgeModal').on('hidden.bs.modal', () => {
    if (GymBattle.gym.badgeReward == BadgeEnums.Soul)
      KeyItemController.showGainModal(KeyItemType.Safari_ticket)

    if (GymBattle.gym.badgeReward == BadgeEnums.Earth)
      KeyItemController.showGainModal(KeyItemType.Gem_case)
  })
})
