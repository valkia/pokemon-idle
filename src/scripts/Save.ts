import NotificationConstants from '~/modules/notifications/NotificationConstants'
import App from '~/scripts/App'
import Settings from '~/modules/settings'
import Notifier from '~/modules/notifications/Notifier'

export class Save {
  static counter = 0
  static key = ''

  public static store(player: Player) {
    localStorage.setItem(`player${Save.key}`, JSON.stringify(player))
    localStorage.setItem(`save${Save.key}`, JSON.stringify(this.getSaveObject()))
    localStorage.setItem(`settings${Save.key}`, JSON.stringify(Settings.toJSON()))

    this.counter = 0
    console.log('%cGame saved', 'color:#3498db;font-weight:900;')
  }

  public static getSaveObject() {
    const saveObject = {}

    Object.keys(App.game).filter(key => App.game[key].saveKey).forEach((key) => {
      saveObject[App.game[key].saveKey] = App.game[key].toJSON()
    })

    return saveObject
  }

  public static load(): Player {
    const saved = localStorage.getItem(`player${Save.key}`)

    // Load our settings, or the saved default settings, or no settings
    const settings = localStorage.getItem(`settings${Save.key}`) || localStorage.getItem('settings') || '{}'
    Settings.fromJSON(JSON.parse(settings))

    // Sort modules now, save settings, load settings
    SortModules()

    if (saved !== 'null')
      return new Player(JSON.parse(saved))
    else
      return new Player()
  }

  public static download() {
    const backupSaveData = { player, save: this.getSaveObject(), settings: Settings.toJSON() }
    try {
      const element = document.createElement('a')
      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(btoa(JSON.stringify(backupSaveData)))}`)
      const datestr = GameConstants.formatDate(new Date())
      const filename = `[v${App.game.update.version}] PokeClickerSave_${datestr}.txt`
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    }
    catch (err) {
      console.error('Error trying to download save', err)
      Notifier.notify({
        title: 'Failed to download save data',
        message: 'Please check the console for errors, and report them on our Discord.',
        type: NotificationConstants.NotificationOption.primary,
        timeout: 6e4,
      })
      try {
        localStorage.backupSave = JSON.stringify(backupSaveData)
      }
      catch (e) {}
    }
  }

  public static async delete(): Promise<void> {
    const confirmDelete = await Notifier.prompt({
      title: 'Delete save file',
      message: 'Are you sure you want delete your save file?\n\nTo confirm, type "DELETE"',
      type: NotificationConstants.NotificationOption.danger,
      timeout: 6e4,
    })

    if (confirmDelete == 'DELETE') {
      localStorage.removeItem(`player${Save.key}`)
      localStorage.removeItem(`save${Save.key}`)
      localStorage.removeItem(`settings${Save.key}`)

      location.reload()
    }
  }

  /** Filters an object by property names
     * @param     object : any The object you want to filter
     * @param       keep : string[] An array of property names that should be kept
     * @returns {Object} : The original object with only the specified properties
     */
  public static filter(object: any, keep: string[]): Record<string, any> {
    const filtered = {}
    let prop
    for (prop in object) {
      if (keep.includes(prop))
        filtered[prop] = object[prop]
    }
    return filtered
  }

  public static initializeMultipliers(): Record<string, number> {
    const res = {}
    for (const obj in ItemList)
      res[obj] = 1

    return res
  }

  public static initializeItemlist(): Record<string, KnockoutObservable<number>> {
    const res = {}
    for (const obj in ItemList)
      res[obj] = ko.observable(0).extend({ numeric: 0 })

    return res
  }

  public static initializeGems(saved?: Array<Array<number>>): Array<Array<KnockoutObservable<number>>> {
    let res
    if (saved) {
      res = saved.map((type) => {
        return type.map((effectiveness) => {
          return ko.observable(effectiveness)
        })
      })
    }
    else {
      res = []
      for (const item in PokemonType) {
        if (!isNaN(Number(item))) {
          res[item] = []
          res[item][GameConstants.TypeEffectiveness.Immune] = ko.observable(0)
          res[item][GameConstants.TypeEffectiveness.NotVery] = ko.observable(0)
          res[item][GameConstants.TypeEffectiveness.Normal] = ko.observable(0)
          res[item][GameConstants.TypeEffectiveness.Very] = ko.observable(0)
        }
      }
    }

    return res
  }

  public static initializeEffects(saved?: Array<string>): Record<string, KnockoutObservable<number>> {
    const res = {}
    for (const obj in GameConstants.BattleItemType)
      res[obj] = ko.observable(saved ? saved[obj] || 0 : 0)

    return res
  }

  public static initializeEffectTimer(saved?: Array<string>): Record<string, KnockoutObservable<string>> {
    const res = {}
    for (const obj in GameConstants.BattleItemType)
      res[obj] = ko.observable(saved ? saved[obj] || '00:00' : '00:00')

    return res
  }

  public static loadFromFile(file) {
    const fileToRead = file
    const fr = new FileReader()
    fr.readAsText(fileToRead)

    setTimeout(() => {
      try {
        const decoded = atob(fr.result as string)
        console.debug('decoded:', decoded)
        const json = JSON.parse(decoded)
        console.debug('json:', json)
        if (decoded && json && json.player && json.save) {
          localStorage.setItem(`player${Save.key}`, JSON.stringify(json.player))
          localStorage.setItem(`save${Save.key}`, JSON.stringify(json.save))
          if (json.settings)
            localStorage.setItem(`settings${Save.key}`, JSON.stringify(json.settings))
          else
            localStorage.removeItem(`settings${Save.key}`)

          location.reload()
        }
        else {
          Notifier.notify({
            message: 'This is not a valid decoded savefile',
            type: NotificationConstants.NotificationOption.danger,
          })
        }
      }
      catch (err) {
        Notifier.notify({
          message: 'This is not a valid savefile',
          type: NotificationConstants.NotificationOption.danger,
        })
      }
    }, 1000)
  }

  public static convert() {
    const base64 = $('#convertTextArea').val().toString()
    try {
      const json = atob(base64)
      const p = JSON.parse(json)
      Save.convertShinies(p.caughtPokemonList)
      $('#saveModal').modal('hide')
    }
    catch (e) {
      Notifier.notify({
        message: 'Invalid save data.',
        type: NotificationConstants.NotificationOption.danger,
      })
    }
  }

  public static convertShinies(list: Array<any>) {
    const converted = []
    list = list.filter(p => p.shiny)
    for (const pokemon of list) {
      const id = +pokemon.id
      const partyPokemon = App.game.party.getPokemon(id)
      if (partyPokemon) {
        converted.push(pokemon.name)
        partyPokemon.shiny = true
      }
    }
    if (converted.length > 0) {
      Notifier.notify({
        message: `You have gained the following shiny Pokémon:</br>${converted.join(',</br>')}`,
        type: NotificationConstants.NotificationOption.success,
        timeout: 1e4,
      })
    }
    else {
      Notifier.notify({
        message: 'No new shiny Pokémon to import.',
        type: NotificationConstants.NotificationOption.info,
      })
    }
  }
}
