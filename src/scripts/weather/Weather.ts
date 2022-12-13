/* eslint-disable arrow-body-style */
import { computed, watch } from 'vue'
import type { ComputedRef } from 'vue-demi'
import GameHelper from '~/scripts/GameHelper'
import { Region } from '~/scripts/GameConstants'
import PokemonType from '~/enums/PokemonType'
import SeededRand from '~/utilities/SeededRand'
import WeatherCondition from '~/scripts/weather/WeatherCondition'
import WeatherType from '~/scripts/weather/WeatherType'

export default class Weather {
  public static regionalWeather: WeatherType[] = Array<WeatherType>(GameHelper.enumLength(Region)).fill(WeatherType.Clear).map(v => <WeatherType>(v))

  public static currentWeather: ComputedRef<WeatherType> = computed(() => {
    const weather = Weather.regionalWeather[player.region]()

    // TODO: HLXII - Add weather overrides

    return weather
  })

  public static image: ComputedRef<string> = computed(() => {
    return `assets/images/weather/${WeatherType[Weather.currentWeather()]}.png`
  })

  public static color: ComputedRef<string> = computed(() => {
    return Weather.weatherConditions[Weather.currentWeather()].color
  })

  public static tooltip: ComputedRef<string> = computed(() => {
    return Weather.weatherConditions[Weather.currentWeather()].tooltip
  })

  public static weatherConditions: { [weather in WeatherType]?: WeatherCondition } = {
    [WeatherType.Clear]:
            new WeatherCondition(WeatherType.Clear, '#ffe57a', 'The weather is clear and pleasant.', 30),
    [WeatherType.Overcast]:
            new WeatherCondition(WeatherType.Overcast, '#bed8ff', 'Clouds fill the skies.', 20),
    [WeatherType.Rain]:
            new WeatherCondition(WeatherType.Rain, '#9db7f5', 'It\'s rainy and humid.', 10,
              [{ type: PokemonType.Water, multiplier: 1.1 }]),
    [WeatherType.Thunderstorm]:
            new WeatherCondition(WeatherType.Thunderstorm, '#a19288', 'It\'s currently raining heavily with thunder.', 5,
              [{ type: PokemonType.Electric, multiplier: 1.1 }, { type: PokemonType.Water, multiplier: 1.1 }]),
    [WeatherType.Snow]:
            new WeatherCondition(WeatherType.Snow, '#bbe6e6', 'It\'s cold and snowing.', 5,
              [{ type: PokemonType.Ice, multiplier: 1.05 }]),
    [WeatherType.Hail]:
            new WeatherCondition(WeatherType.Hail, '#74e6e6', 'It\'s cold and hailing.', 3,
              [{ type: PokemonType.Ice, multiplier: 1.1 }]),
    [WeatherType.Blizzard]:
            new WeatherCondition(WeatherType.Blizzard, '#98d8d8', 'A howling blizzard blows.', 2,
              [{ type: PokemonType.Ice, multiplier: 1.2 }, { type: PokemonType.Fire, multiplier: 0.9 }, { type: PokemonType.Grass, multiplier: 0.9 }]),
    [WeatherType.Sunny]:
            new WeatherCondition(WeatherType.Sunny, '#f5ac78', 'The sunlight is strong.', 10,
              [{ type: PokemonType.Fire, multiplier: 1.1 }, { type: PokemonType.Grass, multiplier: 1.1 }]),
    [WeatherType.Sandstorm]:
            new WeatherCondition(WeatherType.Sandstorm, '#d1c07d', 'A sandstorm is raging.', 10,
              [{ type: PokemonType.Rock, multiplier: 1.1 }, { type: PokemonType.Ground, multiplier: 1.1 }, { type: PokemonType.Steel, multiplier: 1.1 }]),
    [WeatherType.Fog]:
            new WeatherCondition(WeatherType.Fog, '#d2c2ef', 'The fog is deep...', 10,
              [{ type: PokemonType.Ghost, multiplier: 1.1 }]),
    [WeatherType.Windy]:
            new WeatherCondition(WeatherType.Windy, '#81c4ca', 'Mysterious strong winds blow.', 1,
              [{ type: PokemonType.Flying, multiplier: 1.2 }, { type: PokemonType.Dragon, multiplier: 1.1 }]),
  }

  /**
     * The probability distribution for Weather conditions
     */
  public static weatherDistribution: { [region in Region]?: WeatherType[] } = {
    [Region.kanto]: [
      WeatherType.Clear,
      WeatherType.Overcast,
      WeatherType.Rain,
      WeatherType.Thunderstorm,
      WeatherType.Sunny,
    ],
    [Region.johto]: [
      WeatherType.Clear,
      WeatherType.Overcast,
      WeatherType.Rain,
      WeatherType.Thunderstorm,
      WeatherType.Snow,
      WeatherType.Hail,
      WeatherType.Blizzard,
      WeatherType.Sunny,
    ],
    [Region.hoenn]: [
      WeatherType.Clear,
      WeatherType.Overcast,
      WeatherType.Rain,
      WeatherType.Thunderstorm,
      WeatherType.Snow,
      WeatherType.Hail,
      WeatherType.Blizzard,
      WeatherType.Sunny,
      WeatherType.Sandstorm,
    ],
    [Region.sinnoh]: [
      WeatherType.Clear,
      WeatherType.Overcast,
      WeatherType.Rain,
      WeatherType.Thunderstorm,
      WeatherType.Snow,
      WeatherType.Hail,
      WeatherType.Blizzard,
      WeatherType.Sunny,
      WeatherType.Sandstorm,
      WeatherType.Fog,
    ],
  }

  /**
     * The period for Weather changes (in hours)
     */
  public static period = 4

  /**
     * Generates the current Weather condition
     * @param date The current date
     */
  public static generateWeather(date: Date): void {
    SeededRand.seedWithDateHour(date, this.period)

    Weather.regionalWeather.forEach((weather: Observable<WeatherType>, region: Region) => {
      // If no distribution set, assume all weather available
      const dist = Weather.weatherDistribution[region] || GameHelper.enumNumbers(WeatherType)

      // Select weather based on weighted odds
      const selectedWeather = SeededRand.fromWeightedArray(dist, dist.map(w => Weather.weatherConditions[w].weight))

      // Set selected weather or Clear if failed
      weather(selectedWeather || WeatherType.Clear)
    })
  }
}
