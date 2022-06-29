
import { Game } from '~/scripts/Game'
import Multiplier from '~/modules/multiplier/Multiplier'
import * as GameConstants from '~/enums/GameConstants'
import LogBook from '~/modules/logbook/LogBook'
import {Preload} from "~/scripts/utilities/Preload";
import {Save} from "~/scripts/Save";
import {Pokeballs} from "~/scripts/pokeballs/Pokeballs";
import BadgeCase from "~/modules/DataStore/BadgeCase";
import NotificationConstants from "~/modules/notifications/NotificationConstants";
import Statistics from "~/modules/DataStore/StatisticStore";
import Notifier from "~/modules/notifications/Notifier";
export default class App {
  static readonly debug = false
  static game: Game

  static start() {
    if (!App.debug)
      Object.freeze(GameConstants)

    Preload.load(App.debug).then(() => {
      //ko.options.deferUpdates = true

      console.log(`[${GameConstants.formatDate(new Date())}] %cLoading Game Data..`, 'color:#8e44ad;font-weight:900;')
      // Needs to be loaded first so save data can be updated (specifically "player" data)
      //const update = new Update()
      const multiplier = new Multiplier()

      player = Save.load()
      App.game = new Game(
        //update,
        //new Profile(),
        //new Breeding(multiplier),
        new Pokeballs(),
        new Wallet(multiplier),
        //new KeyItems(),
        new BadgeCase(),
        //new OakItems([20, 50, 100], multiplier),
        //new OakItemLoadouts(),
        new PokemonCategories(),
        new Party(multiplier),
        //new Shards(),
       // new Underground(),
        //new Farming(multiplier),
        new LogBook(),
        //new RedeemableCodes(),
        new Statistics(),
        //new Quests(),
        //new SpecialEvents(),
        //new Discord(),
        //new AchievementTracker(),
        //new Challenges(),
        //new BattleFrontier(),
        multiplier,
      )

      console.log(`[${GameConstants.formatDate(new Date())}] %cGame loaded`, 'color:#8e44ad;font-weight:900;')
      Notifier.notify({ message: 'Game loaded', type: NotificationConstants.NotificationOption.info })

      //GameController.bindToolTips()
      //GameController.addKeyListeners()

     // PokedexHelper.populateFilters()
      //PokedexHelper.updateList()

      App.game.initialize()

      //GameController.applyRouteBindings()
      Preload.hideSplashScreen()

      App.game.start()
    })
  }
}
