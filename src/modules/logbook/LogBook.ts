/* eslint-disable class-methods-use-this */
import type { Observable, ObservableArray, PureComputed } from 'knockout'
import type { Feature } from '../DataStore/common/Feature'
import LogBookLog from './LogBookLog'
import type { LogBookType } from './LogBookTypes'
import { LogBookTypes } from './LogBookTypes'

export default class LogBook implements Feature {
  name = 'Log Book'
  saveKey = 'logbook'
  defaults: Record<string, any>

  public filters: Record<string, Observable<boolean>> = Object.keys(LogBookTypes).reduce((_dict, setting) => Object.assign(_dict, { [setting]: ko.observable(true).extend({ boolean: null }) }), {})
  public logs: ObservableArray<LogBookLog> = ko.observableArray([])
  public filteredLogs: PureComputed<LogBookLog[]> = ko.pureComputed(() => this.logs().filter(log => this.filters[log.type.label]?.()))

  newLog(type: LogBookType, message: string) {
    const length = this.logs.unshift(new LogBookLog(type, message))
    if (length > 1000)
      this.logs.pop()
  }

  fromJSON(json: any): void {
    if (json == null)
      return

    json.logs?.forEach((entry) => {
      this.logs.push(new LogBookLog(entry.type, entry.description, entry.date))
    })

    Object.entries(json.filters || {}).forEach(([key, value]: [string, boolean]) => {
      this.filters[key]?.(value)
    })
  }

  toJSON(): { logs: Array<{ type: LogBookType; description: string; date: number }> } {
    return ko.toJS({
      logs: this.logs.slice(0, 100),
      filters: this.filters,
    })
  }

  initialize(): void {}

  canAccess(): boolean {
    return true
  }

  update(): void {} // This method intentionally left blank
}
