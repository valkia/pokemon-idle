import { EvolutionType } from '~/enums/EvolutionType'
import type { Evolution } from '~/enums/Evolution'

interface LocationRestricted extends Evolution {
  atLocation(): boolean
}

type LocationEvo = ConstructorImplementing<LocationRestricted, 'getEvolvedPokemon' | 'atLocation'>

export function LocationRestricted<EvoClass extends LocationEvo>(Base: EvoClass) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args)
      this.type.push(EvolutionType.Location)
    }

    isSatisfied(): boolean {
      return this.atLocation()
                && super.isSatisfied()
    }
  }
}
