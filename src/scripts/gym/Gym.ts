
import { TownContent } from '~/scripts/towns/TownContent'
import App from '~/scripts/App'
import type OneFromManyRequirement from '~/scripts/achievements/OneFromManyRequirement'
import type Requirement from '~/scripts/achievements/Requirement'
import { GymList } from '~/scripts/gym/GymList'
import ClearGymRequirement from '~/scripts/achievements/ClearGymRequirement'
import BadgeEnums from '~/modules/enums/Badges'
import * as GameConstants from '~/scripts/GameConstants'
import BadgeCase from '~/modules/DataStore/BadgeCase'
import type { GymPokemon } from '~/scripts/gym/GymPokemon'
import { AchievementHandler } from '~/scripts/achievements/AchievementHandler'
import { GymRunner } from '~/scripts/gym/GymRunner'
import { GymBattle } from '~/scripts/gym/GymBattle'
import { useGymStore } from '~/stores/gym'
import { useModalStore } from '~/stores/modal'
import {GymState} from "~/types";
/**
 * Data list that contains all gymLeaders, accessible by townName.
 */
interface gymFlags {
  quest?: boolean
  achievement?: boolean
}
enum areaStatus {
  currentLocation,
  locked,
  unlockedUnfinished,
  questAtLocation,
  uncaughtPokemon,
  uncaughtShinyPokemonAndMissingAchievement,
  uncaughtShinyPokemon,
  missingAchievement,
  completed,
}
/**
 * Gym class.
 */
export class Gym extends TownContent {
  buttonText: string
  public tooltip = 'Battle Gym Leaders to earn badges'
  public cssClass() {
    if (new BadgeCase().hasBadge(this.badgeReward))
      return 'btn btn-success'

    return 'btn btn-secondary'
  }

  public text(): string {
    return this.buttonText
  }

  public isVisible(): boolean {
    return true
  }

  public onclick(): void {
    console.log('onclick')
    GymRunner.startGym(this)
  }

  public flags = {
    quest: true,
    achievement: true,
  }

  public areaStatus(): areaStatus {
    if (this.isUnlocked()) {
      if (!new BadgeCase().hasBadge(this.badgeReward))
        return areaStatus.unlockedUnfinished
      else if (this.isThereQuestAtLocation())
        return areaStatus.questAtLocation
      else if (!this.isAchievementsComplete())
        return areaStatus.missingAchievement
    }
    return areaStatus.completed
  }

  public clears() {
    if (!QuestLineHelper.isQuestLineCompleted('Tutorial Quests'))
      return undefined

    return App.game.statistics.gymsDefeated[GameConstants.getGymIndex(this.town)]()
  }

  constructor(
    public leaderName: string,
    public town: string,
    public pokemons: GymPokemon[],
    public badgeReward: BadgeEnums,
    public moneyReward: number,
    public defeatMessage: string,
    requirements: (OneFromManyRequirement | Requirement)[] = [],
    public rewardFunction = () => {},
    {
      quest = true,
      achievement = true,
    }: gymFlags = {},
  ) {
    super(requirements)
    this.flags.quest = quest
    this.flags.achievement = achievement
    if (!town.includes('Elite') && !town.includes('Champion'))
      this.buttonText = `${leaderName.replace(/\d/g, '')}'s gym`
    else
      this.buttonText = leaderName.replace(/\d/g, '')
  }

  private isAchievementsComplete() {
    const gymIndex = GameConstants.getGymIndex(this.town)
    return AchievementHandler.achievementList.every((achievement) => {
      return !(achievement.property instanceof ClearGymRequirement && achievement.property.gymIndex === gymIndex && !achievement.isCompleted())
    })
  }

  private isThereQuestAtLocation() {
    return App.game.quests.currentQuests().some((q) => {
      return q instanceof DefeatGymQuest && q.gymTown == this.town
    })
  }

  public static getLeaderByBadge(badge: BadgeEnums): string {
    for (const item in GymList) {
      const gym = GymList[item]
      if (BadgeEnums[gym.badgeReward] == BadgeEnums[BadgeEnums[badge]])
        return gym.leaderName
    }
    return 'Brock'
  }

  public firstWinReward() {
    // Give the player this gyms badge
    BadgeCase.gainBadge(this.badgeReward)
    // Show the badge modal
    useModalStore().receiveBadgeModal = true
    // Run the first time reward function
    this.rewardFunction()
  }

  get imagePath(): string {
    const gymStore:GymState = useGymStore()
    return `/src/assets/images/gymLeaders/${gymStore.gym.leaderName}.png`
  }
}
