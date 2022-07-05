import * as GameConstants from '~/enums/GameConstants'
import type OneFromManyRequirement from '~/scripts/achievements/OneFromManyRequirement'
import type Requirement from '~/scripts/achievements/Requirement'
import type { TownContent } from '~/scripts/towns/TownContent'
import { DockTownContent, NextRegionTownContent } from '~/scripts/towns/TownContent'
import type { NPC } from '~/scripts/towns/NPC'
import { useDataStore } from '~/stores/data'
import type { Dungeon } from '~/scripts/dungeons/Dungeon'
import { dungeonList } from '~/scripts/dungeons/Dungeon'

interface TownOptionalArgument {
  requirements?: (Requirement | OneFromManyRequirement)[]
  npcs?: NPC[]
}

export class Town {
  public name: string
  public region: GameConstants.Region
  public requirements: (Requirement | OneFromManyRequirement)[]
  public dungeon?: Dungeon
  public npcs?: NPC[]
  public startingTown: boolean
  public content: TownContent[]

  constructor(
    name: string,
    region: GameConstants.Region,
    content: TownContent[] = [],
    // Optional arguments are in a named object, so that we don't need
    // to pass undefined to get to the one we want
    optional: TownOptionalArgument = {},
  ) {
    this.name = name
    this.region = region
    this.requirements = optional.requirements || []
    this.npcs = optional.npcs
    this.startingTown = GameConstants.StartingTowns.includes(this.name)
    this.content = content
    const GymList = useDataStore().GymList
    if (GymList[name]) {
      const gym = GymList[name]
      this.content.unshift(gym)
    }
    if (GameConstants.DockTowns.includes(name))
      this.content.push(new DockTownContent())

    if (GameConstants.StartingTowns.includes(name))
      this.content.push(new NextRegionTownContent())

    content.forEach((c) => {
      c.addParent(this)
    })
  }

  public isUnlocked() {
    return this.requirements.every(requirement => requirement.isCompleted())
  }
}

export class DungeonTown extends Town {
  dungeon: Dungeon

  constructor(name: string, region: GameConstants.Region, requirements: (Requirement | OneFromManyRequirement)[] = [], content: TownContent[] = []) {
    super(name, region, content, { requirements })
    this.dungeon = dungeonList[name]
  }
}
