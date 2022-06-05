import type WeatherType from '~/enums/WeatherType'
import type { PokemonNameType } from '~/enums/PokemonNameType'
import { LevelEvolution } from '~/enums/LevelEvolution'
import Weather from '~/enums/Weather'
import { EvolutionType } from '~/enums/EvolutionType'

export class WeatherRestrictedLevelEvolution extends LevelEvolution {
  constructor(
    basePokemon: PokemonNameType,
    evolvedPokemon: PokemonNameType,
    level: number,
    public weather: WeatherType[],
  ) {
    super(basePokemon, evolvedPokemon, level)
    this.type.push(EvolutionType.Other)
  }

  isSatisfied(): boolean {
    return super.isSatisfied()
            // Check Weather conditions
            && this.weather.includes(Weather.currentWeather())
  }
}
