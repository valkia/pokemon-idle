import NotificationSetting from '../settings/NotificationSetting'
import Sound from '../utilities/Sound'
import NotificationOption from './NotificationOption'

/**
 * Contains all notification constants for easy access.
 */

const NotificationConstants = {
  NotificationOption,
  NotificationSound: {
    General: {
      shiny_long: new Sound('shiny_long', 'Shiny Pokémon encountered/hatched'),
      new_catch: new Sound('new_catch', 'New Pokémon/shiny captured'),
      achievement: new Sound('achievement', 'New achievement earned'),
      battle_item_timer: new Sound('battle_item_timer', 'Battle item about to wear off'),
      underground_energy_full: new Sound('underground_energy_full', 'Mining energy reached maximum capacity'),
    },
    Hatchery: {
      ready_to_hatch: new Sound('ready_to_hatch', 'Egg ready to hatch'),
      empty_queue: new Sound('empty_queue', 'Hatchery queue is empty'),
    },
    Quests: {
      quest_ready_to_complete: new Sound('quest_ready_to_complete', 'Quest is ready to be completed'),
      quest_level_increased: new Sound('quest_level_increased', 'Quest level increased'),
    },
    Farming: {
      ready_to_harvest: new Sound('ready_to_harvest', 'Berry ready to harvest'),
      berry_wither: new Sound('ready_to_harvest', 'Berry about to wither/has withered'),
      berry_mutated: new Sound('ready_to_harvest', 'Berry has mutated'),
      berry_replanted: new Sound('ready_to_harvest', 'Berry has been replanted'),
      berry_dropped: new Sound('ready_to_harvest', 'Berry has been dropped'),
      mulch_ran_out: new Sound('ready_to_harvest', 'Mulch has run out'),
      wandering_pokemon: new Sound('ready_to_harvest', 'Wandering Pokémon encountered'),
    },
  },
  NotificationSetting: {
    General: {
      encountered_shiny: new NotificationSetting('notification.encountered_shiny', 'Encountered a shiny Pokémon', true),
      quest_ready_to_complete: new NotificationSetting('notification.quest_ready_to_complete', 'Quest is ready to be completed', true),
      underground_energy_full: new NotificationSetting('notification.underground_energy_full', 'Mining energy reached maximum capacity', true),
      underground_energy_restore: new NotificationSetting('notification.underground_energy_restore', 'Mining energy restored', true),
      event_start_end: new NotificationSetting('notification.event_start_end', 'Event start/end information', true),
      gym_won: new NotificationSetting('notification.gym_won', 'Gym leader defeated', true),
      offline_earnings: new NotificationSetting('notification.offline_earnings', 'Offline earnings', true),
      achievement_complete: new NotificationSetting('notification.achievement_complete', 'Achievement complete', true, true),
      new_catch: new NotificationSetting('notification.new_catch', 'New Pokémon/shiny captured', true, true),
      battle_frontier: new NotificationSetting('notification.battle_frontier', 'Battle Frontier', true, true),
    },
    Hatchery: {
      ready_to_hatch: new NotificationSetting('notification.ready_to_hatch', 'Egg ready to hatch', true),
      hatched: new NotificationSetting('notification.hatched', 'Egg hatched', true),
      hatched_shiny: new NotificationSetting('notification.hatched_shiny', 'Egg hatched a shiny', true),
      empty_queue: new NotificationSetting('empty_queue', 'Hatchery queue is empty', true),
    },
    Items: {
      route_item_found: new NotificationSetting('notification.route_item_found', 'Item found during route battle', true),
      dungeon_item_found: new NotificationSetting('notification.dungeon_item_found', 'Item found in dungeon chest', true),
      battle_item_timer: new NotificationSetting('notification.battle_item_timer', 'Battle item about to wear off', true),
      dropped_item: new NotificationSetting('notification.dropped_item', 'Enemy Pokémon dropped an item', true),
    },
    Farming: {
      ready_to_harvest: new NotificationSetting('notification.ready_to_harvest', 'Berry ready to harvest', true),
      about_to_wither: new NotificationSetting('notification.about_to_wither', 'Berry about to wither', true),
      berry_withered: new NotificationSetting('notification.berry_withered', 'Berry has withered', true),
      berry_mutated: new NotificationSetting('notification.berry_mutated', 'Berry has mutated', true),
      berry_replanted: new NotificationSetting('notification.berry_replanted', 'Berry has been replanted', true),
      berry_dropped: new NotificationSetting('notification.berry_dropped', 'Berry has been dropped', true),
      mulch_ran_out: new NotificationSetting('notification.mulch_ran_out', 'Mulch has run out', true),
      wandering_pokemon: new NotificationSetting('notification.wandering_pokemon', 'Wandering Pokémon encountered', true),
    },
  },
}

export default NotificationConstants
