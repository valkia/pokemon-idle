/// <reference path="Requirement.ts"/>

import Weather from '~/scripts/weather/Weather'
import Requirement from '~/scripts/achievements/Requirement'
import WeatherType from '~/scripts/weather/WeatherType'
import * as GameConstants from '~/scripts/GameConstants'
export default class WeatherRequirement extends Requirement {
  private weather: WeatherType[]

  constructor(weather: WeatherType[], option: GameConstants.AchievementOption = GameConstants.AchievementOption.equal) {
    super(1, option)
    this.weather = weather
  }

  public getProgress(): number {
    return +this.weather.includes(Weather.currentWeather())
  }

  public hint(): string {
    return `The weather needs to be ${this.weather.map(weather => WeatherType[weather]).join(' or ')}`
  }
}
