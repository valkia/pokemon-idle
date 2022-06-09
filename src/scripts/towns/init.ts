import { DungeonTown, Town } from '~/scripts/towns/Town'
import * as GameConstants from '~/enums/GameConstants'
import {
  CeladonCityShop,
  CeladonDepartmentStoreShop,
  CeruleanCityShop, CinnabarIslandShop, FuchsiaCityShop,
  LavenderTownShop,
  PewterCityShop, Route3Shop,
  SaffronCityShop, VermilionCityShop,
  ViridianCityShop, pokeLeagueShop,
} from '~/scripts/shop/Shop'
import RouteKillRequirement from '~/scripts/achievements/RouteKillRequirement'
import ClearDungeonRequirement from '~/scripts/achievements/ClearDungeonRequirement'
import { MoveToDungeon } from '~/scripts/towns/TownContent'
import GymBadgeRequirement from '~/scripts/achievements/GymBadgeRequirement'
import BadgeEnums from '~/enums/Badges'
import OneFromManyRequirement from '~/scripts/achievements/OneFromManyRequirement'
import { GymList } from '~/scripts/gym/GymList'
import { ProfNPC } from '~/scripts/towns/ProfNPC'
import { NPC } from '~/scripts/towns/NPC'
import { KantoBerryMasterNPC } from '~/scripts/towns/KantoBerryMasterNPC'
import { RoamerNPC } from '~/scripts/towns/RoamerNPC'

export const init = () => {
  // Kanto NPCs
  const PalletProfOak = new ProfNPC('Prof. Oak',
    GameConstants.Region.kanto,
    'Congratulations on completing your Kanto Pokédex!',
    'Your journey isn\'t over yet, a whole world awaits you! Onwards to Johto!',
    'assets/images/oak.png')

  const PalletMom = new NPC('Mom', [
    'Traveling on your own can be scary. But remember that there are nice people everywhere you go. So strike up a converstation. You will probably learn something useful.',
  ])

  const ViridianCityOldMan = new NPC('Old Man', [
    'Ahh, I\'ve had my coffee now and I feel great!',
    'You can use the Pokéball Selector to select which type of Pokéball to use on specific Pokémon based on caught status.',
  ])

  const PewterBattleItemRival = new NPC('Battle Item Master', [
    'Hey kid, you look new! Let me offer some advice: Battle Items like xAttack can be acquired along Routes, inside Dungeons and in Shops!',
    'Use them to help you out whenever you feel like time is against you!',
  ])

  const PewterScientist = new NPC('Gem Scientist', [
    'I see you are carrying a Shard Case. Here at the museum we study space, fossils and gems!',
    'When you defeat a Pokémon you gain a gem of that Pokémon\'s type. If the Pokémon has two types you gain one for each! Defeating very strong Pokémon, such as those owned by gym leaders, gets you five!',
    'You can click Gems in the Start Menu to boost your damage using these gems. For example, using rock gems you can boost the super effective damage of your rock type Pokémon! Those flying types had better watch out for your might!',
    'You can even use this to eliminate immunities! By using electric gems to boost your electric type immune damage, your electric Pokémon can suddenly do damage against ground types!',
  ],
  { requirement: new GymBadgeRequirement(BadgeEnums.Earth) })

  const Route3ShadySalesman = new NPC('Shady Salesman', [
    'Have I got a deal just for you!',
    'I\'ll let you have a super secret Pokémon. For the right price!',
  ])

  const CeruleanKantoBerryMaster = new KantoBerryMasterNPC('Berry Master', [
    'Bah! You younglings have no appreciation of the art of Berry farming!',
    'Come back when you are ready to learn!',
  ])

  const CeruleanSuperNerd = new NPC('Super Nerd Jovan', [
    'In my spare time I like to play this kickass browser game. It takes ages to get all the best stuff.',
    'Then one day, all my progress was gone. I don\'t know exactly what happened. Something updated, some cookies got cleaned up, I don\'t know. I had to start all over from the beginning.',
    'That day I learned that I should frequently download a save.',
  ])

  const VermilionFanClubChairman = new NPC('Fan Club Chairman', [
    'You won’t find a Pokémon as wonderful as my favorite Rapidash in those Typed Eggs in the shops, but they might hatch rare Pokémon you can’t find anywhere else!',
  ])

  const LavenderMrFuji = new NPC('Mr. Fuji', [
    'Welcome. In our Volunteer House here we take in all kinds of Pokémon to care for them.',
    'Did you know that sparkling Pokémon are more often found in Dungeons, on Farms, from Eggs, and even from Shops, the Safari Zone, and Evolutions from Items?',
  ])

  const BigSpender = new NPC('Big Spender', [
    'I love shopping! When I come in, the cashiers know I want tons of items.',
    'You can use the Shop Amount Button settings to make it easy for big purchases, too!',
  ])

  const SaffronBattleItemRival = new NPC('Battle Item Master', [
    'Do I know you? Wait... Have you met my worthless rival? Ha! Let me guess, he gave you some unwanted advice?',
    'I bet he forget to tell you that although all Battle Items only last for 30 seconds, they can stack and last for days! Now scram!',
  ])

  const SaffronBreeder = new NPC('Breeder', [
    'You can leave your level 100 Pokémon with us up at the Hatchery. Breeding them will reset their level, but they will be stronger! They gain 25% of their base attack!',
    'And the best part is you can keep doing it over and over and over again! The sky is the limit! Reach for the stars!',
    'With Protein your Pokémon will become even stronger when you breed them. I hear they sell it at the Indigo Plateau.',
  ],
  { requirement: new GymBadgeRequirement(BadgeEnums.Earth) })

  const FuchsiaKantoRoamerNPC = new RoamerNPC('Youngster Wendy', [
    'There\'s been some recent sightings of roaming Pokémon on {ROUTE_NAME}!',
  ], GameConstants.Region.kanto)

  const CinnabarIslandResearcher = new NPC('Researcher', [
    'They were trying to clone an ancient Pokémon in the mansion... I wonder if they succeeded.',
    'Apparently the ancient Pokémon escaped, and can be found roaming around Kanto!',
  ])
  const TownList: Record<string, Town> = {}
  // Kanto Towns
  TownList['Pallet Town'] = new Town(
    'Pallet Town',
    GameConstants.Region.kanto,
    [],
    {
      npcs: [PalletProfOak, PalletMom],
    },
  )
  TownList['Pewter City'] = new Town(
    'Pewter City',
    GameConstants.Region.kanto,
    [PewterCityShop],
    {
      requirements: [
        new RouteKillRequirement(10, GameConstants.Region.kanto, 2),
        new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Viridian Forest')),
      ],
      npcs: [PewterBattleItemRival, PewterScientist],
    },
  )
  TownList['Route 3 Pokémon Center'] = new Town(
    'Route 3 Pokémon Center',
    GameConstants.Region.kanto,
    [Route3Shop],
    {
      requirements: [
        new RouteKillRequirement(10, GameConstants.Region.kanto, 3),
      ],
      npcs: [Route3ShadySalesman],
    },
  )
  TownList['Cerulean City'] = new Town(
    'Cerulean City',
    GameConstants.Region.kanto,
    [CeruleanCityShop],
    {
      requirements: [new RouteKillRequirement(10, GameConstants.Region.kanto, 4)],
      npcs: [CeruleanKantoBerryMaster, CeruleanSuperNerd],
    },
  )
  TownList['Vermilion City'] = new Town(
    'Vermilion City',
    GameConstants.Region.kanto,
    [VermilionCityShop],
    {
      requirements: [new RouteKillRequirement(10, GameConstants.Region.kanto, 6)],
      npcs: [VermilionFanClubChairman],
    },
  )
  TownList['Lavender Town'] = new Town(
    'Lavender Town',
    GameConstants.Region.kanto,
    [LavenderTownShop],
    {
      requirements: [new RouteKillRequirement(10, GameConstants.Region.kanto, 10)],
      npcs: [LavenderMrFuji],
    },
  )
  TownList['Celadon City'] = new Town(
    'Celadon City',
    GameConstants.Region.kanto,
    [CeladonDepartmentStoreShop, CeladonCityShop],
    {
      requirements: [new RouteKillRequirement(10, GameConstants.Region.kanto, 7)],
      npcs: [BigSpender],
    },
  )
  TownList['Saffron City'] = new Town(
    'Saffron City',
    GameConstants.Region.kanto,
    [SaffronCityShop],
    {
      requirements: [new GymBadgeRequirement(BadgeEnums.Rainbow)],
      npcs: [SaffronBattleItemRival, SaffronBreeder],
    },
  )
  TownList['Fuchsia City'] = new Town(
    'Fuchsia City',
    GameConstants.Region.kanto,
    [FuchsiaCityShop],
    {
      requirements: [new OneFromManyRequirement([
        new RouteKillRequirement(10, GameConstants.Region.kanto, 18),
        new RouteKillRequirement(10, GameConstants.Region.kanto, 15),
      ])],
      npcs: [FuchsiaKantoRoamerNPC],
    },
  )
  TownList['Cinnabar Island'] = new Town(
    'Cinnabar Island',
    GameConstants.Region.kanto,
    [CinnabarIslandShop],
    {
      requirements: [new OneFromManyRequirement([
        new RouteKillRequirement(10, GameConstants.Region.kanto, 20),
        new RouteKillRequirement(10, GameConstants.Region.kanto, 21),
      ])],
      npcs: [CinnabarIslandResearcher],
    },
  )
  TownList['Viridian City'] = new Town(
    'Viridian City',
    GameConstants.Region.kanto,
    [ViridianCityShop],
    {
      requirements: [new RouteKillRequirement(10, GameConstants.Region.kanto, 1)],
      npcs: [ViridianCityOldMan],
    },
  )
  TownList['Indigo Plateau Kanto'] = new Town(
    'Indigo Plateau Kanto',
    GameConstants.Region.kanto,
    [GymList['Elite Lorelei'], GymList['Elite Bruno'], GymList['Elite Agatha'], GymList['Elite Lance'], GymList['Champion Blue'], pokeLeagueShop()],
    {
      requirements: [
        new RouteKillRequirement(10, GameConstants.Region.kanto, 23),
        new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Victory Road')),
      ],
    },

  )

  // Kanto Dungeons
  TownList['Viridian Forest'] = new DungeonTown(
    'Viridian Forest',
    GameConstants.Region.kanto,
    [new RouteKillRequirement(10, GameConstants.Region.kanto, 2)],
  )
  TownList['Mt. Moon'] = new DungeonTown(
    'Mt. Moon',
    GameConstants.Region.kanto,
    [new RouteKillRequirement(10, GameConstants.Region.kanto, 3)],
  )
  TownList['Diglett\'s Cave'] = new DungeonTown(
    'Diglett\'s Cave',
    GameConstants.Region.kanto,
    [new RouteKillRequirement(10, GameConstants.Region.kanto, 6)],
  )
  TownList['Rock Tunnel'] = new DungeonTown(
    'Rock Tunnel',
    GameConstants.Region.kanto,
    [
      new RouteKillRequirement(10, GameConstants.Region.kanto, 9),
      new GymBadgeRequirement(BadgeEnums.Cascade),
    ],
  )
  TownList['Power Plant'] = new DungeonTown(
    'Power Plant',
    GameConstants.Region.kanto,
    [
      new RouteKillRequirement(10, GameConstants.Region.kanto, 9),
      new GymBadgeRequirement(BadgeEnums.Soul),
    ],
  )
  TownList['Pokémon Tower'] = new DungeonTown(
    'Pokémon Tower',
    GameConstants.Region.kanto,
    [
      new RouteKillRequirement(10, GameConstants.Region.kanto, 10),
      new GymBadgeRequirement(BadgeEnums.Rainbow),
    ],
  )
  TownList['Seafoam Islands'] = new DungeonTown(
    'Seafoam Islands',
    GameConstants.Region.kanto,
    [new RouteKillRequirement(10, GameConstants.Region.kanto, 19)],
  )
  TownList['Pokémon Mansion'] = new DungeonTown(
    'Pokémon Mansion',
    GameConstants.Region.kanto,
    [new OneFromManyRequirement([
      new RouteKillRequirement(10, GameConstants.Region.kanto, 20),
      new RouteKillRequirement(10, GameConstants.Region.kanto, 21),
    ])],
  )
  TownList['Victory Road'] = new DungeonTown(
    'Victory Road',
    GameConstants.Region.kanto,
    [new RouteKillRequirement(10, GameConstants.Region.kanto, 23)],
  )
  TownList['Cerulean Cave'] = new DungeonTown(
    'Cerulean Cave',
    GameConstants.Region.kanto,
    [new GymBadgeRequirement(BadgeEnums.Elite_KantoChampion)],
  )
  return TownList
}
