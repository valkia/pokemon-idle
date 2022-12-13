/* eslint-disable array-bracket-newline */

import type { Town } from '~/scripts/towns/Town'
import { DungeonTown } from '~/scripts/towns/Town'
import * as GameConstants from '~/scripts/GameConstants'
import {
  CeladonCityShop, CeladonDepartmentStoreShop, CeruleanCityShop,
  CinnabarIslandShop, FuchsiaCityShop, LavenderTownShop,
  PewterCityShop, Route3Shop, SaffronCityShop,
  Shop,
  VermilionCityShop,
  ViridianCityShop,
  pokeLeagueShop,
} from '~/scripts/shop/Shop'
import { PokeballItem } from '~/scripts/items/PokeballItem'
import RouteKillRequirement from '~/scripts/achievements/RouteKillRequirement'
import ClearDungeonRequirement from '~/scripts/achievements/ClearDungeonRequirement'
import MultiRequirement from '~/scripts/achievements/MultiRequirement'
import { Item, ItemList } from '~/scripts/items/Item'
import { ProfNPC } from '~/scripts/towns/ProfNPC'
import GymBadgeRequirement from '~/scripts/achievements/GymBadgeRequirement'
import BadgeEnums from '~/enums/Badges'
import { NPC } from '~/scripts/towns/NPC'
import { KantoBerryMasterNPC } from '~/scripts/towns/KantoBerryMasterNPC'
import { RoamerNPC } from '~/scripts/towns/RoamerNPC'
import NullRequirement from '~/scripts/achievements/NullRequirement'
import { MoveToDungeon } from '~/scripts/towns/TownContent'
import OneFromManyRequirement from '~/scripts/achievements/OneFromManyRequirement'
import { GymList } from '~/scripts/gym/GymList'
import { init } from '~/scripts/towns/init'

export const TownList: Record<string, Town> = {}
