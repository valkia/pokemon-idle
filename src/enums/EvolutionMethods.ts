import { StoneEvolution } from './StoneEvolution'
import { LevelEvolution } from '~/enums/LevelEvolution'
import { DayTimeRestricted, NightTimeRestricted, TimeRestricted } from '~/enums/TimedRestriction'
import type { MinimalEvo } from '~/enums/Evolution'
import { AnyDungeonRestricted, DungeonRestricted } from '~/enums/DungeonRestriction'
import { RegionRestricted } from '~/enums/RegionRestriction'
import { EnvironmentRestricted } from '~/enums/EnvironmentRestriction'
import { AnyGymRestricted } from '~/enums/GymRestriction'
// Used for custom time ranges
function TimeRestrictedBase<T extends MinimalEvo>(Base: T) {
  return function(start: number, end: number, ...rest: ConstructorParameters<T>) {
    const tmpClass = TimeRestricted(start, end, Base)
    return new tmpClass(...rest)
  }
}
// new TimeRestrictedLevelEvolution(start: number, end: number, basePokemon: string, evolvedPokemon: string, level: number)
export const TimeRestrictedLevelEvolution = TimeRestrictedBase(LevelEvolution)

// new DayTimedLevelEvolution(basePokemon: string, evolvedPokemon: string, level: number)
const DayTimedLevelEvolution = DayTimeRestricted(LevelEvolution)
// new NightTimedLevelEvolution(basePokemon: string, evolvedPokemon: string, level: number)
const NightTimedLevelEvolution = NightTimeRestricted(LevelEvolution)

// new DayTimedStoneEvolution(basePokemon: string, evolvedPokemon: string, stone: GameConstants.StoneType)
export const DayTimedStoneEvolution = DayTimeRestricted(StoneEvolution)
// NightTimedStoneEvolution(basePokemon: string, evolvedPokemon: string, stone: GameConstants.StoneType)
export const NightTimedStoneEvolution = NightTimeRestricted(StoneEvolution)

// new DungeonRestrictedLevelEvolution(dungeon: string, basePokemon: string, evolvedPokemon: string, level: number)
export const DungeonRestrictedLevelEvolution = DungeonRestricted(LevelEvolution)

// new AnyDungeonLevelEvolution(basePokemon: string, evolvedPokemon: string, level: number)
const AnyDungeonLevelEvolution = AnyDungeonRestricted(LevelEvolution)

// new AnyGymLevelEvolution(basePokemon: string, evolvedPokemon: string, level: number)
const AnyGymLevelEvolution = AnyGymRestricted(LevelEvolution)

// new EnvironmentRestrictedLevelEvolution(environment: Environment, basePokemon: string, evolvedPokemon: string, level: number)
// an Environment is any key of GameConstants.Environments, eg 'Cave' or 'PowerPlant'
export const EnvironmentRestrictedLevelEvolution = EnvironmentRestricted(LevelEvolution)

// new EnvironmentDungeonLevelEvolution(environment: Environment, basePokemon: string, evolvedPokemon: string, level: number)
const EnvironmentDungeonLevelEvolution = EnvironmentRestricted(AnyDungeonLevelEvolution)

// new EnvironmentGymLevelEvolution(environment: Environment, basePokemon: string, evolvedPokemon: string, level: number)
const EnvironmentGymLevelEvolution = EnvironmentRestricted(AnyGymLevelEvolution)

// RegionStoneEvolution(region: GameConstants.Region, basePokemon: string, evolvedPokemon: string, stone: GameConstants.StoneType)
export const RegionStoneEvolution = RegionRestricted(StoneEvolution)

// new RegionLevelEvolution(region: GameConstants.Region, basePokemon: string, evolvedPokemon: string, level: number)
export const RegionLevelEvolution = RegionRestricted(LevelEvolution)
