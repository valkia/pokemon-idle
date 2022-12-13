import * as GameConstants from '~/scripts/GameConstants'
import App from '~/scripts/App'
import ObtainedPokemonRequirement from '~/scripts/achievements/ObtainedPokemonRequirement'
import KeyItemType from '~/modules/enums/KeyItemType'
import GymBadgeRequirement from '~/scripts/achievements/GymBadgeRequirement'
import { pokemonMap } from '~/scripts/pokemons/PokemonList'
import type { Gym } from '~/scripts/gym/Gym'
import { DungeonTrainer } from '~/scripts/dungeons/DungeonTrainer'
import Notifier from '~/modules/notifications/Notifier'
import { GymList } from '~/scripts/gym/GymList'
import type Amount from '~/modules/wallet/Amount'
import type BerryNameType from '~/modules/enums/BerryNameType'
import type MultiRequirement from '~/scripts/achievements/MultiRequirement'
import type Requirement from '~/scripts/achievements/Requirement'
import type OneFromManyRequirement from '~/scripts/achievements/OneFromManyRequirement'
import NotificationConstants from '~/modules/notifications/NotificationConstants'
import ClearDungeonRequirement from '~/scripts/achievements/ClearDungeonRequirement'
import type { PokemonNameType } from '~/enums/PokemonNameType'
import { GymPokemon } from '~/scripts/gym/GymPokemon'
import { DungeonBossPokemon } from '~/scripts/dungeons/DungeonBossPokemon'
import SeededRand from '~/utilities/SeededRand'
import type BadgeEnums from '~/modules/enums/Badges'
import SeededDateRequirement from '~/scripts/achievements/SeededDateRequirement'
import DayOfWeekRequirement from '~/scripts/achievements/DayOfWeekRequirement'
import SeededDateRand from '~/utilities/SeededDateRand'
import { usePartyStore } from '~/stores/party'
export interface EnemyOptions {
  weight?: number
  requirement?: MultiRequirement | OneFromManyRequirement | Requirement
  reward?: Amount
  hide?: boolean
}

interface DetailedPokemon {
  pokemon: PokemonNameType
  options: EnemyOptions
}

interface Loot {
  loot: ItemNameType | PokemonNameType | UndergroundItemNameType | BerryNameType
  weight?: number
  requirement?: MultiRequirement | OneFromManyRequirement | Requirement
  amount?: number
}

type Enemy = PokemonNameType | DetailedPokemon | DungeonTrainer

type Boss = DungeonBossPokemon | DungeonTrainer

interface EncounterInfo {
  image: string
  shiny: boolean
  hide: boolean
  hidden: boolean
  locked: boolean
  lockMessage: string
}

// Gain a gym badge after first completion of a dungeon
const DungeonGainGymBadge = (gym: Gym, badge: BadgeEnums) => {
  // Check that the player hasn't already obtained the badge
  if (!App.game.badgeCase.hasBadge(badge)) {
    // Set the set to our expected gym
    // This updates our modal values
    GymRunner.gymObservable(gym)
    GymBattle.gym = gym
    // Give the player the badge
    App.game.badgeCase.gainBadge(badge)
    // Show the modal
    $('#receiveBadgeModal').modal('show')
  }
}

/**
 * Gym class.
 */
export class Dungeon {
  constructor(
    public name: string,
    public enemyList: Enemy[],
    public itemList: Loot[],
    public baseHealth: number,
    public bossList: Boss[],
    public tokenCost: number,
    public difficultyRoute: number, // Closest route in terms of difficulty, used for egg steps, dungeon tokens etc.
    public rewardFunction = () => {},
  ) { }

  public isUnlocked(): boolean {
    // Player requires the Dungeon Ticket to access the dungeons
    /* if (!App.game.keyItems.hasKeyItem(KeyItemType.Dungeon_ticket)) {
      Notifier.notify({
        message: 'You need the Dungeon ticket to access dungeons',
        type: NotificationConstants.NotificationOption.danger,
      })
      return false
    } */
    return true
  }

  /**
     * Finds the possible Bosses in the dungeon
     * @param includeTrainers Whether to include Trainer Bosses. Defaults to true
     * @param ignoreRequirement Whether to check if requirements are met. Defaults to false
     */
  public availableBosses(includeTrainers = true, ignoreRequirement = false): Boss[] {
    // TODO: HLXII - We need this check as this method is called somewhere during initialization when App isn't initialized yet
    // the requirement.isCompleted call can sometimes use the App object, which will cause this to crash
    // Once App is moved to modules, this check might be able to be removed.
    /* if (!App.game)
      return [] */

    if (includeTrainers) {
      return this.bossList.filter((boss) => {
        return (!ignoreRequirement && boss.options?.requirement) ? boss.options.requirement.isCompleted() : true
      })
    }
    else {
      return this.bossList.filter((b) => {
        if (b instanceof DungeonBossPokemon)
          return (!ignoreRequirement && b.options?.requirement) ? b.options.requirement.isCompleted() : true

        return false
      }).map(b => <DungeonBossPokemon>b)
    }
  }

  /**
     * Retreives the weights for all the possible bosses
     */
  get bossWeightList(): number[] {
    return this.availableBosses().map((boss) => {
      return boss.options?.weight ?? 1
    })
  }

  /**
     * Returns the possible enemies in the dungeon.
     * @param ignoreRequirement Whether to check if requirements are met. Defaults to false
     */
  public availableMinions(ignoreRequirement = false): Enemy[] {
    return this.enemyList.filter((enemy) => {
      if (typeof enemy === 'string')
        return true
      else
        return (!ignoreRequirement && enemy.options?.requirement) ? enemy.options.requirement.isCompleted() : true
    })
  }

  /**
     * Gets all available Pokemon in the dungeon
     */
  public allAvailablePokemon(): PokemonNameType[] {
    const encounterInfo = []

    // Handling minions
    this.enemyList.forEach((enemy) => {
      // Handling Pokemon
      if (typeof enemy === 'string' || enemy.hasOwnProperty('pokemon')) {
        let pokemonName: PokemonNameType
        if (enemy.hasOwnProperty('pokemon')) {
          // Check if requirements have been met
          if ((enemy as DetailedPokemon).options?.requirement) {
            if (!(enemy as DetailedPokemon).options.requirement.isCompleted())
              return
          }
          pokemonName = (<DetailedPokemon>enemy).pokemon
        }
        else {
          pokemonName = <PokemonNameType>enemy
        }
        encounterInfo.push(pokemonName)
        // Handling Trainers
      }
      else { /* We don't include Trainers */ }
    })

    // Handling Bosses
    this.bossList.forEach((boss) => {
      // Handling Pokemon
      if (boss instanceof DungeonBossPokemon) {
        if (boss.options?.requirement) {
          if (!boss.options.requirement.isCompleted())
            return
        }
        const pokemonName = boss.name
        encounterInfo.push(pokemonName)
        // Handling Trainer
      }
      else { /* We don't include Trainers */ }
    })

    return encounterInfo
  }

  /**
     * Retrieves the weights for all the possible enemies
     */
  get weightList(): number[] {
    return this.availableMinions().map((enemy) => {
      if (typeof enemy === 'string')
        return 1
      else if (enemy.hasOwnProperty('pokemon'))
        return (<DetailedPokemon>enemy).options.weight ?? 1
      else
        return (<DungeonTrainer>enemy).options?.weight ?? 1
    })
  }

  /**
     * Retrieves the weights for all the possible Loot, weight values are utilized as 10^Weight. Should use values in Dungeon Initialization from 0 (least likely) to 4 (most likely), anything > 4 is probably too much
     */
  get lootWeightList(): number[] {
    return this.itemList.map((loot) => {
      if (loot.requirement && !loot.requirement.isCompleted())
        return 0

      if (loot.weight < 2 && GameConstants.getDungeonRegion(this.name) < player.highestRegion() - 2)
        return 0.1 * Math.max(0.5, loot.weight)

      // Minimum of 1 times cleared for division
      const timesCleared = Math.min(500, Math.max(1, App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(this.name)]()))
      // Calculate total weight based on times cleared, minimum weight being original number specified
      return Math.max(loot.weight, Math.pow(15, loot.weight) / timesCleared) + 1 || 1
    })
  }

  /**
     * Returns the possible minion Pokemon in the dungeon.
     * Filters out Trainers and collapses DetailedPokemon
     */
  get pokemonList(): PokemonNameType[] {
    // Filtering out Trainers
    return this.enemyList.filter((enemy) => {
      return !enemy.hasOwnProperty('name')
    }).map((enemy) => {
      // Collapsing DetailedPokemon
      if (typeof enemy === 'string')
        return enemy
      else if (enemy.hasOwnProperty('pokemon'))
        return (<DetailedPokemon>enemy).pokemon
    })
  }

  /**
     * Returns the possible boss Pokemon in the dungeon.
     * Filters out Trainers
     */
  get bossPokemonList(): PokemonNameType[] {
    // Filtering out Trainers
    return this.bossList.filter((enemy) => {
      return enemy instanceof DungeonBossPokemon
    }).map((enemy) => {
      return enemy.name as PokemonNameType
    })
  }

  /**
     * Gets all possible Pokemon in the dungeon
     */
  get allPokemon(): PokemonNameType[] {
    return this.pokemonList.concat(this.bossPokemonList)
  }

  /**
     * Gets all non-boss Pokemon encounters in the dungeon
     * Used for generating the dungeon encounter list view
     */
  get normalEncounterList(): EncounterInfo[] {
    const encounterInfo = []

    // Handling minions
    this.enemyList.forEach((enemy) => {
      // Handling Pokemon
      if (typeof enemy === 'string' || enemy.hasOwnProperty('pokemon')) {
        let pokemonName: PokemonNameType
        if (enemy.hasOwnProperty('pokemon'))
          pokemonName = (<DetailedPokemon>enemy).pokemon
        else
          pokemonName = <PokemonNameType>enemy

        const party = usePartyStore()
        const encounter = {
          image: `/src/assets/images/${(party.alreadyCaughtPokemonByName(pokemonName, true) ? 'shiny' : '')}pokemon/${pokemonMap[pokemonName].id}.png`,
          shiny: party.alreadyCaughtPokemonByName(pokemonName, true),
          hidden: !party.alreadyCaughtPokemonByName(pokemonName),
          lock: false,
          lockMessage: '',
        }
        encounterInfo.push(encounter)
        // Handling Trainers
      }
      else { /* We don't display minion Trainers */ }
    })

    return encounterInfo
  }

  /**
     * Gets all boss encounters in the dungeon
     * Used for generating the dungeon encounter list view
     */
  get bossEncounterList(): EncounterInfo[] {
    const encounterInfo = []
    const party = usePartyStore()
    // Handling Bosses
    this.bossList.forEach((boss) => {
      // Handling Pokemon
      if (boss instanceof DungeonBossPokemon) {
        const pokemonName = boss.name
        const encounter = {
          image: `/src/assets/images/${(party.alreadyCaughtPokemonByName(pokemonName, true) ? 'shiny' : '')}pokemon/${pokemonMap[pokemonName].id}.png`,
          shiny: party.alreadyCaughtPokemonByName(pokemonName, true),
          hide: boss.options?.hide ? (boss.options?.requirement ? !boss.options?.requirement.isCompleted() : boss.options?.hide) : false,
          hidden: !party.alreadyCaughtPokemonByName(pokemonName),
          lock: boss.options?.requirement ? !boss.options?.requirement.isCompleted() : false,
          lockMessage: boss.options?.requirement ? boss.options?.requirement.hint() : '',
        }
        encounterInfo.push(encounter)
        // Handling Trainer
      }
      else {
        const encounter = {
          image: boss.image,
          shiny: false,
          hide: boss.options?.hide ? (boss.options?.requirement ? !boss.options?.requirement.isCompleted() : boss.options?.hide) : false,
          hidden: false,
          lock: boss.options?.requirement ? !boss.options?.requirement.isCompleted() : false,
          lockMessage: boss.options?.requirement ? boss.options?.requirement.hint() : '',
        }
        encounterInfo.push(encounter)
      }
    })

    return encounterInfo
  }
}

/**
 * Data list that contains all dungeons, accessible by name.
 */

export const dungeonList: Record<string, Dungeon> = {}

// Kanto Dungeons

dungeonList['Viridian Forest'] = new Dungeon('Viridian Forest',
  [
    { pokemon: 'Caterpie', options: { weight: 2.67 } },
    { pokemon: 'Metapod', options: { weight: 2.67 } },
    { pokemon: 'Weedle', options: { weight: 2.67 } },
    { pokemon: 'Kakuna', options: { weight: 2.67 } },
    { pokemon: 'Pidgey', options: { weight: 2.67 } },
    { pokemon: 'Pidgeotto', options: { weight: 2.67 } },
    new DungeonTrainer('Bug Catcher',
      [
        new GymPokemon('Weedle', 50, 6),
        new GymPokemon('Caterpie', 50, 6),
      ], { weight: 1 }, 'Rick'),
    new DungeonTrainer('Bug Catcher',
      [
        new GymPokemon('Weedle', 50, 7),
        new GymPokemon('Kakuna', 50, 7),
        new GymPokemon('Weedle', 50, 7),
      ], { weight: 1 }, 'Doug'),
    new DungeonTrainer('Bug Catcher',
      [
        new GymPokemon('Caterpie', 50, 7),
        new GymPokemon('Caterpie', 50, 8),
      ], { weight: 1 }, 'Anthony'),
    new DungeonTrainer('Bug Catcher',
      [
        new GymPokemon('Metapod', 50, 7),
        new GymPokemon('Caterpie', 50, 7),
        new GymPokemon('Metapod', 50, 7),
      ], { weight: 1 }, 'Charlie'),
  ],
  [
    { loot: 'xAttack', weight: 4 },
    { loot: 'Pecha', weight: 3.5 },
    { loot: 'Pokeball', weight: 3 },
    { loot: 'SmallRestore', weight: 1.75 },
    { loot: 'Grass_egg', weight: 1, requirement: new ClearDungeonRequirement(100, GameConstants.getDungeonIndex('Viridian Forest')) },
    { loot: 'Leaf_stone', weight: 0 },
  ],
  102,
  [
    new DungeonBossPokemon('Pikachu', 510, 7),
    new DungeonTrainer('Bug Catcher',
      [new GymPokemon('Weedle', 510, 9)],
      { weight: 1 }, 'Sammy'),
  ],
  50, 1)

dungeonList['Diglett\'s Cave'] = new Dungeon('Diglett\'s Cave',
  ['Diglett'],
  [
    { loot: 'xClick', weight: 4 },
    { loot: 'Lucky_incense', weight: 4 },
    { loot: 'Mystery_egg', weight: 1, requirement: new ClearDungeonRequirement(100, GameConstants.getDungeonIndex('Diglett\'s Cave')) },
    { loot: 'Max Revive', weight: 0 },
    { loot: 'Wiki', weight: 0 },
  ],
  1208,
  [new DungeonBossPokemon('Dugtrio', 6040, 31)],
  95, 2)

dungeonList['Mt. Moon'] = new Dungeon('Mt. Moon',
  [
    { pokemon: 'Sandshrew', options: { weight: 8.8 } },
    { pokemon: 'Clefairy', options: { weight: 8.8 } },
    { pokemon: 'Zubat', options: { weight: 8.8 } },
    { pokemon: 'Paras', options: { weight: 8.8 } },
    { pokemon: 'Geodude', options: { weight: 8.8 } },
    new DungeonTrainer('Bug Catcher',
      [
        new GymPokemon('Weedle', 75, 11),
        new GymPokemon('Kakuna', 75, 11),
      ], { weight: 1 }, 'Kent'),
    new DungeonTrainer('Lass',
      [new GymPokemon('Clefairy', 75, 14)],
      { weight: 1 }, 'Iris'),
    new DungeonTrainer('Super Nerd',
      [
        new GymPokemon('Magnemite', 75, 11),
        new GymPokemon('Voltorb', 75, 11),
      ], { weight: 1 }, 'Jovan'),
    new DungeonTrainer('Bug Catcher',
      [
        new GymPokemon('Caterpie', 75, 10),
        new GymPokemon('Metapod', 75, 10),
        new GymPokemon('Caterpie', 75, 10),
      ], { weight: 1 }, 'Robby'),
    new DungeonTrainer('Lass',
      [
        new GymPokemon('Oddish', 75, 11),
        new GymPokemon('Bellsprout', 75, 11),
      ], { weight: 1 }, 'Miriam'),
    new DungeonTrainer('Youngster',
      [
        new GymPokemon('Rattata', 75, 10),
        new GymPokemon('Rattata', 75, 10),
        new GymPokemon('Zubat', 75, 10),
      ], { weight: 1 }, 'Josh'),
    new DungeonTrainer('Hiker',
      [
        new GymPokemon('Geodude', 75, 10),
        new GymPokemon('Geodude', 75, 10),
        new GymPokemon('Onix', 75, 10),
      ], { weight: 1 }, 'Marcos'),
    new DungeonTrainer('Team Rocket Grunt',
      [
        new GymPokemon('Sandshrew', 75, 11),
        new GymPokemon('Rattata', 75, 11),
        new GymPokemon('Zubat', 75, 11),
      ], { weight: 1 }, undefined, '(male)'),
    new DungeonTrainer('Team Rocket Grunt',
      [
        new GymPokemon('Zubat', 75, 13),
        new GymPokemon('Ekans', 75, 13),
      ], { weight: 1 }, undefined, '(male)'),
    new DungeonTrainer('Team Rocket Grunt',
      [
        new GymPokemon('Rattata', 75, 13),
        new GymPokemon('Sandshrew', 75, 13),
      ], { weight: 1 }, undefined, '(male)'),
    new DungeonTrainer('Team Rocket Grunt',
      [
        new GymPokemon('Rattata', 75, 13),
        new GymPokemon('Zubat', 75, 13),
      ], { weight: 1 }, undefined, '(male)'),
  ],
  [
    { loot: 'xClick', weight: 4 },
    { loot: 'Item_magnet', weight: 4 },
    { loot: 'SmallRestore', weight: 1.75 },
    { loot: 'Greatball', weight: 1 },
    { loot: 'Star Piece', weight: 1 },
    { loot: 'Helix Fossil', weight: 0, requirement: new ClearDungeonRequirement(100, GameConstants.getDungeonIndex('Mt. Moon')) },
    { loot: 'Dome Fossil', weight: 0, requirement: new ClearDungeonRequirement(100, GameConstants.getDungeonIndex('Mt. Moon')) },
    { loot: 'Moon_stone', weight: 0 },
  ],
  834,
  [
    new DungeonTrainer('Super Nerd',
      [
        new GymPokemon('Grimer', 2780, 12),
        new GymPokemon('Voltorb', 2780, 12),
        new GymPokemon('Koffing', 2780, 12),
      ], { weight: 1 }, 'Miguel'),
  ],
  75, 4,
  () => {
    if (App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex('Mt. Moon')]() <= 1) {
      const item = Rand.boolean() ? 'Dome Fossil' : 'Helix Fossil'
      Underground.gainMineItem(Underground.getMineItemByName(item).id, 1)
      Notifier.notify({
        message: `You were awarded a ${GameConstants.humanifyString(item)} for defeating the Super Nerd`,
        type: NotificationConstants.NotificationOption.success,
        setting: NotificationConstants.NotificationSetting.Items.dungeon_item_found,
      })
    }
  })

dungeonList['Rock Tunnel'] = new Dungeon('Rock Tunnel',
  [
    { pokemon: 'Zubat', options: { weight: 20 } },
    { pokemon: 'Geodude', options: { weight: 20 } },
    { pokemon: 'Machop', options: { weight: 20 } },
    new DungeonTrainer('PokéManiac',
      [
        new GymPokemon('Cubone', 500, 23),
        new GymPokemon('Slowpoke', 500, 23),
      ], { weight: 1 }, 'Ashton'),
    new DungeonTrainer('PokéManiac',
      [new GymPokemon('Slowpoke', 500, 25)],
      { weight: 1 }, 'Winston'),
    new DungeonTrainer('Picnicker',
      [
        new GymPokemon('Oddish', 500, 22),
        new GymPokemon('Bulbasaur', 500, 22),
      ], { weight: 1 }, 'Martha'),
    new DungeonTrainer('PokéManiac',
      [
        new GymPokemon('Charmander', 500, 22),
        new GymPokemon('Cubone', 500, 22),
      ], { weight: 1 }, 'Steve'),
    new DungeonTrainer('Hiker',
      [new GymPokemon('Geodude', 500, 25)],
      { weight: 1 }, 'Allen'),
    new DungeonTrainer('Hiker',
      [
        new GymPokemon('Machop', 500, 20),
        new GymPokemon('Onix', 500, 20),
      ], { weight: 1 }, 'Eric'),
    new DungeonTrainer('Hiker',
      [
        new GymPokemon('Geodude', 500, 19),
        new GymPokemon('Onix', 500, 19),
        new GymPokemon('Geodude', 500, 19),
        new GymPokemon('Geodude', 500, 19),
      ], { weight: 1 }, 'Lenny'),
    new DungeonTrainer('Hiker',
      [
        new GymPokemon('Onix', 500, 20),
        new GymPokemon('Onix', 500, 20),
        new GymPokemon('Geodude', 500, 20),
      ], { weight: 1 }, 'Oliver'),
    new DungeonTrainer('Hiker',
      [
        new GymPokemon('Geodude', 500, 21),
        new GymPokemon('Graveler', 500, 21),
      ], { weight: 1 }, 'Lucas'),
    new DungeonTrainer('Picnicker',
      [
        new GymPokemon('Jigglypuff', 500, 21),
        new GymPokemon('Pidgey', 500, 21),
        new GymPokemon('Meowth', 500, 21),
      ], { weight: 1 }, 'Sofia'),
    new DungeonTrainer('Hiker',
      [
        new GymPokemon('Geodude', 500, 21),
        new GymPokemon('Geodude', 500, 21),
        new GymPokemon('Graveler', 500, 21),
      ], { weight: 1 }, 'Dudley'),
    new DungeonTrainer('PokéManiac',
      [
        new GymPokemon('Slowpoke', 500, 20),
        new GymPokemon('Slowpoke', 500, 20),
        new GymPokemon('Slowpoke', 500, 20),
      ], { weight: 1 }, 'Cooper'),
    new DungeonTrainer('Picnicker',
      [
        new GymPokemon('Bellsprout', 500, 22),
        new GymPokemon('Clefairy', 500, 22),
      ], { weight: 1 }, 'Leah'),
    new DungeonTrainer('Picnicker',
      [
        new GymPokemon('Meowth', 500, 20),
        new GymPokemon('Oddish', 500, 20),
        new GymPokemon('Pidgey', 500, 20),
      ], { weight: 1 }, 'Dana'),
  ],
  [
    { loot: 'xClick', weight: 4 },
    { loot: 'Leppa', weight: 3.5 },
    { loot: 'Pokeball', weight: 3 },
    { loot: 'Greatball', weight: 2 },
    { loot: 'Revive', weight: 1.75 },
    { loot: 'MediumRestore', weight: 1 },
    { loot: 'Oval Stone', weight: 1 },
    { loot: 'Heart Scale', weight: 0 },
    { loot: 'Star Piece', weight: 0 },
  ],
  4117,
  [
    new DungeonBossPokemon('Onix', 20585, 17),
    new DungeonTrainer('Picnicker',
      [
        new GymPokemon('Pidgey', 5147, 19),
        new GymPokemon('Rattata', 5147, 19),
        new GymPokemon('Rattata', 5147, 19),
        new GymPokemon('Bellsprout', 5147, 19),
      ], { weight: 1 }, 'Ariana'),
  ],
  500, 5)

dungeonList['Power Plant'] = new Dungeon('Power Plant',
  ['Pikachu', 'Raichu', 'Magnemite', 'Magneton', 'Grimer', 'Muk', 'Voltorb', 'Electrode'],
  [
    { loot: 'Lucky_incense', weight: 4 },
    { loot: 'Cheri', weight: 3.5 },
    { loot: 'Electrode', weight: 3.5 },
    { loot: 'Electric_egg', weight: 1, requirement: new ClearDungeonRequirement(100, GameConstants.getDungeonIndex('Power Plant')) },
    { loot: 'Max Revive', weight: 0 },
    { loot: 'Thunder_stone', weight: 0 },
    { loot: 'Metal_coat', weight: 0, requirement: new ClearDungeonRequirement(200, GameConstants.getDungeonIndex('Power Plant')) },
    { loot: 'Electirizer', weight: 0, requirement: new ClearDungeonRequirement(200, GameConstants.getDungeonIndex('Power Plant')) },
  ],
  13507,
  [
    new DungeonBossPokemon('Electabuzz', 67535, 35),
    new DungeonBossPokemon('Zapdos', 101302, 50),
  ],
  1000, 8)

dungeonList['Pokémon Tower'] = new Dungeon('Pokémon Tower',
  [
    { pokemon: 'Gastly', options: { weight: 21.3 } },
    { pokemon: 'Haunter', options: { weight: 21.3 } },
    { pokemon: 'Cubone', options: { weight: 21.3 } },
    new DungeonTrainer('Channeler',
      [new GymPokemon('Gastly', 750, 23)],
      { weight: 1 }, 'Hope'),
    new DungeonTrainer('Channeler',
      [new GymPokemon('Gastly', 750, 22)],
      { weight: 1 }, 'Patricia'),
    new DungeonTrainer('Channeler',
      [new GymPokemon('Gastly', 750, 24)],
      { weight: 1 }, 'Carly'),
    new DungeonTrainer('Channeler',
      [
        new GymPokemon('Gastly', 750, 23),
        new GymPokemon('Gastly', 750, 23),
      ], { weight: 1 }, 'Laurel'),
    new DungeonTrainer('Channeler',
      [new GymPokemon('Gastly', 750, 22)],
      { weight: 1 }, 'Jody'),
    new DungeonTrainer('Channeler',
      [new GymPokemon('Gastly', 750, 24)],
      { weight: 1 }, 'Paula'),
    new DungeonTrainer('Channeler',
      [new GymPokemon('Gastly', 750, 22)],
      { weight: 1 }, 'Ruth'),
    new DungeonTrainer('Channeler',
      [new GymPokemon('Haunter', 750, 23)],
      { weight: 1 }, 'Tammy'),
    new DungeonTrainer('Channeler',
      [new GymPokemon('Gastly', 750, 24)],
      { weight: 1 }, 'Karina'),
    new DungeonTrainer('Channeler',
      [new GymPokemon('Gastly', 750, 22)],
      { weight: 1 }, 'Janae'),
    new DungeonTrainer('Channeler',
      [
        new GymPokemon('Gastly', 750, 22),
        new GymPokemon('Gastly', 750, 22),
        new GymPokemon('Gastly', 750, 22),
      ], { weight: 1 }, 'Angelica'),
    new DungeonTrainer('Channeler',
      [new GymPokemon('Gastly', 750, 24)],
      { weight: 1 }, 'Jennifer'),
    new DungeonTrainer('Channeler',
      [new GymPokemon('Gastly', 750, 24)],
      { weight: 1 }, 'Emilia'),
    new DungeonTrainer('Team Rocket Grunt',
      [
        new GymPokemon('Zubat', 750, 25),
        new GymPokemon('Zubat', 750, 25),
        new GymPokemon('Golbat', 750, 25),
      ], { weight: 1 }, undefined, '(male)'),
    new DungeonTrainer('Team Rocket Grunt',
      [
        new GymPokemon('Koffing', 750, 26),
        new GymPokemon('Drowzee', 750, 26),
      ], { weight: 1 }, undefined, '(male)'),
    new DungeonTrainer('Team Rocket Grunt',
      [
        new GymPokemon('Zubat', 750, 23),
        new GymPokemon('Rattata', 750, 23),
        new GymPokemon('Raticate', 750, 23),
        new GymPokemon('Zubat', 750, 23),
      ], { weight: 1 }, undefined, '(male)'),
  ],
  [
    { loot: 'xAttack', weight: 4 },
    { loot: 'Chesto', weight: 3.5 },
    { loot: 'Greatball', weight: 2.5 },
    { loot: 'Fighting_egg', weight: 1, requirement: new ClearDungeonRequirement(100, GameConstants.getDungeonIndex('Pokémon Tower')) },
    { loot: 'MediumRestore', weight: 0.5 },
    { loot: 'Star Piece', weight: 0.5 },
    { loot: 'Revive', weight: 0.5 },
    { loot: 'Rare Bone', weight: 0 },
    { loot: 'Ultraball', weight: 0 },
    { loot: 'LargeRestore', weight: 0 },
    { loot: 'Soothe_bell', weight: 0, requirement: new ClearDungeonRequirement(200, GameConstants.getDungeonIndex('Pokémon Tower')) },
    { loot: 'Trade_stone', weight: 0, requirement: new ClearDungeonRequirement(200, GameConstants.getDungeonIndex('Pokémon Tower')) },
  ],
  7523,
  [new DungeonBossPokemon('Marowak', 37615, 30)],
  750, 10)

dungeonList['Seafoam Islands'] = new Dungeon('Seafoam Islands',
  ['Zubat', 'Golbat', 'Goldeen', 'Poliwag', 'Magikarp', 'Slowpoke', 'Slowbro', 'Tentacool', 'Krabby', 'Kingler', 'Staryu'],
  [
    { loot: 'xAttack', weight: 4 },
    { loot: 'Aspear', weight: 3.5 },
    { loot: 'Revive', weight: 1.75 },
    { loot: 'Water_egg', weight: 1, requirement: new ClearDungeonRequirement(100, GameConstants.getDungeonIndex('Seafoam Islands')) },
    { loot: 'Ultraball', weight: 1 },
    { loot: 'Water_stone', weight: 0 },
  ],
  17226,
  [
    new DungeonBossPokemon('Seel', 86130, 35),
    new DungeonBossPokemon('Articuno', 129195, 50),
  ],
  1250, 15)

dungeonList['Pokémon Mansion'] = new Dungeon('Pokémon Mansion',
  [
    { pokemon: 'Rattata', options: { weight: 3.5 } },
    { pokemon: 'Raticate', options: { weight: 3.5 } },
    { pokemon: 'Growlithe', options: { weight: 3.5 } },
    { pokemon: 'Grimer', options: { weight: 3.5 } },
    { pokemon: 'Muk', options: { weight: 3.5 } },
    { pokemon: 'Koffing', options: { weight: 3.5 } },
    { pokemon: 'Weezing', options: { weight: 3.5 } },
    { pokemon: 'Ditto', options: { weight: 3.5 } },
    new DungeonTrainer('Youngster',
      [
        new GymPokemon('Ekans', 1500, 33),
        new GymPokemon('Ekans', 1500, 33),
        new GymPokemon('Raticate', 1500, 34),
      ], { weight: 1 }, 'Johnson'),
    new DungeonTrainer('Burglar',
      [
        new GymPokemon('Charmander', 1500, 34),
        new GymPokemon('Charmeleon', 1500, 34),
      ], { weight: 1 }, 'Arnie'),
    new DungeonTrainer('Burglar',
      [new GymPokemon('Ninetales', 1500, 38)],
      { weight: 1 }, 'Simon'),
    new DungeonTrainer('Scientist',
      [
        new GymPokemon('Magnemite', 1500, 33),
        new GymPokemon('Magneton', 1500, 33),
        new GymPokemon('Voltorb', 1500, 33),
      ], { weight: 1 }, 'Braydon', '(male)'),
    new DungeonTrainer('Scientist',
      [
        new GymPokemon('Electrode', 1500, 29),
        new GymPokemon('Weezing', 1500, 29),
      ], { weight: 1 }, 'Ted', '(male)'),
    new DungeonTrainer('Burglar',
      [
        new GymPokemon('Growlithe', 1500, 34),
        new GymPokemon('Ponyta', 1500, 34),
      ], { weight: 1 }, 'Lewis'),
    new DungeonTrainer('Scientist',
      [
        new GymPokemon('Magnemite', 1500, 34),
        new GymPokemon('Electrode', 1500, 34),
      ], { weight: 1 }, 'Ivan', '(male)'),
  ],
  [
    { loot: 'xAttack', weight: 4 },
    { loot: 'Rawst', weight: 3.5 },
    { loot: 'Figy', weight: 3 },
    { loot: 'Ultraball', weight: 1.75 },
    { loot: 'Mystery_egg', weight: 1.5, requirement: new ClearDungeonRequirement(50, GameConstants.getDungeonIndex('Pokémon Mansion')) },
    { loot: 'Fire_egg', weight: 0.5, requirement: new ClearDungeonRequirement(100, GameConstants.getDungeonIndex('Pokémon Mansion')) },
    { loot: 'Max Revive', weight: 0 },
    { loot: 'Moon_stone', weight: 0 },
    { loot: 'Fire_stone', weight: 0 },
    { loot: 'Magmarizer', weight: 0, requirement: new ClearDungeonRequirement(200, GameConstants.getDungeonIndex('Pokémon Mansion')) },
  ],
  17760,
  [new DungeonBossPokemon('Magmar', 88800, 40)],
  1500, 16)

dungeonList['Victory Road'] = new Dungeon('Victory Road',
  [
    { pokemon: 'Zubat', options: { weight: 8.8 } },
    { pokemon: 'Golbat', options: { weight: 8.8 } },
    { pokemon: 'Geodude', options: { weight: 8.8 } },
    { pokemon: 'Graveler', options: { weight: 8.8 } },
    { pokemon: 'Onix', options: { weight: 8.8 } },
    new DungeonTrainer('Cooltrainer',
      [
        new GymPokemon('Persian', 2000, 42),
        new GymPokemon('Ponyta', 2000, 42),
        new GymPokemon('Rapidash', 2000, 42),
        new GymPokemon('Vulpix', 2000, 42),
        new GymPokemon('Ninetales', 2000, 42),
      ], { weight: 1 }, 'Naomi', '(female)'),
    new DungeonTrainer('Cooltrainer',
      [
        new GymPokemon('Raticate', 2000, 42),
        new GymPokemon('Ivysaur', 2000, 42),
        new GymPokemon('Wartortle', 2000, 42),
        new GymPokemon('Charmeleon', 2000, 42),
        new GymPokemon('Charizard', 2000, 42),
      ], { weight: 1 }, 'Rolando', '(male)'),
    new DungeonTrainer('Black Belt',
      [
        new GymPokemon('Machoke', 2000, 43),
        new GymPokemon('Machop', 2000, 43),
        new GymPokemon('Machoke', 2000, 43),
      ], { weight: 1 }, 'Daisuke'),
    new DungeonTrainer('Juggler',
      [
        new GymPokemon('Drowzee', 2000, 41),
        new GymPokemon('Hypno', 2000, 41),
        new GymPokemon('Kadabra', 2000, 41),
        new GymPokemon('Kadabra', 2000, 41),
      ], { weight: 1 }, 'Nelson'),
    new DungeonTrainer('Tamer',
      [
        new GymPokemon('Persian', 2000, 44),
        new GymPokemon('Golduck', 2000, 44),
      ], { weight: 1 }, 'Vincent'),
    new DungeonTrainer('Juggler',
      [new GymPokemon('Mr. Mime', 2000, 48)],
      { weight: 1 }, 'Gregory'),
    new DungeonTrainer('Cooltrainer',
      [
        new GymPokemon('Exeggutor', 2000, 42),
        new GymPokemon('Sandslash', 2000, 42),
        new GymPokemon('Cloyster', 2000, 42),
        new GymPokemon('Electrode', 2000, 42),
        new GymPokemon('Arcanine', 2000, 42),
      ], { weight: 1 }, 'George', '(male)'),
    new DungeonTrainer('PokéManiac',
      [
        new GymPokemon('Charmeleon', 2000, 40),
        new GymPokemon('Lapras', 2000, 40),
        new GymPokemon('Lickitung', 2000, 40),
      ], { weight: 1 }, 'Dawson'),
    new DungeonTrainer('Cooltrainer',
      [
        new GymPokemon('Clefairy', 2000, 42),
        new GymPokemon('Jigglypuff', 2000, 42),
        new GymPokemon('Persian', 2000, 42),
        new GymPokemon('Dewgong', 2000, 42),
        new GymPokemon('Chansey', 2000, 42),
      ], { weight: 1 }, 'Alexa', '(female)'),
    new DungeonTrainer('Cooltrainer',
      [
        new GymPokemon('Kingler', 2000, 41),
        new GymPokemon('Poliwhirl', 2000, 42),
        new GymPokemon('Tentacruel', 2000, 42),
        new GymPokemon('Seadra', 2000, 42),
        new GymPokemon('Blastoise', 2000, 42),
      ], { weight: 1 }, 'Colby', '(male)'),
    new DungeonTrainer('Cooltrainer',
      [
        new GymPokemon('Bellsprout', 2000, 42),
        new GymPokemon('Weepinbell', 2000, 42),
        new GymPokemon('Victreebel', 2000, 42),
        new GymPokemon('Paras', 2000, 42),
        new GymPokemon('Parasect', 2000, 42),
      ], { weight: 1 }, 'Caroline', '(female)'),
  ],
  [
    { loot: 'xClick', weight: 3.75 },
    { loot: 'Lucky_egg', weight: 3.75 },
    { loot: 'Ultraball', weight: 1.75 },
    { loot: 'SmallRestore', weight: 1.75 },
    { loot: 'Star Piece', weight: 1 },
    { loot: 'Dragon_egg', weight: 1, requirement: new ClearDungeonRequirement(100, GameConstants.getDungeonIndex('Victory Road')) },
    { loot: 'Leaf_stone', weight: 0 },
    { loot: 'Max Revive', weight: 0 },
    { loot: 'Heart Scale', weight: 0 },
  ],
  24595,
  [
    new DungeonBossPokemon('Machoke', 122975, 42),
    new DungeonBossPokemon('Moltres', 184462, 50),
    new DungeonTrainer('Cool Couple',
      [
        new GymPokemon('Nidoking', 61488, 45),
        new GymPokemon('Nidoqueen', 61488, 45),
      ], { weight: 1 }, 'Ray & Tyra'),
  ],
  2000, 20)

dungeonList['Cerulean Cave'] = new Dungeon('Cerulean Cave',
  ['Arbok', 'Raichu', 'Sandslash', 'Golbat', 'Gloom', 'Parasect', 'Venomoth', 'Weepinbell', 'Graveler', 'Ditto', 'Chansey', 'Magikarp', 'Poliwag', 'Goldeen', 'Seaking'],
  [
    { loot: 'Pokeball', weight: 4 },
    { loot: 'Token_collector', weight: 4 },
    { loot: 'Lucky_incense', weight: 4 },
    { loot: 'Graveler', weight: 3.5 },
    { loot: 'Greatball', weight: 3 },
    { loot: 'Ultraball', weight: 2 },
    { loot: 'LargeRestore', weight: 1 },
    { loot: 'Old Amber', weight: 0, requirement: new ClearDungeonRequirement(100, GameConstants.getDungeonIndex('Cerulean Cave')) },
    { loot: 'Max Revive', weight: 0 },
    { loot: 'Protein', weight: 0, requirement: new ClearDungeonRequirement(500, GameConstants.getDungeonIndex('Cerulean Cave')) },
    { loot: 'Dusk_stone', weight: 0, requirement: new ClearDungeonRequirement(200, GameConstants.getDungeonIndex('Cerulean Cave')) },
  ],
  28735,
  [
    new DungeonBossPokemon('Rhydon', 183675, 60),
    new DungeonBossPokemon('Mewtwo', 255512, 100),
  ],
  2500, 20)
