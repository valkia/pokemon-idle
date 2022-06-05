
import type Requirement from '~/scripts/achievements/Requirement'
import type OneFromManyRequirement from '~/scripts/achievements/OneFromManyRequirement'

export default class MultiRequirement {
  constructor(public requirements: (Requirement | OneFromManyRequirement)[] = []) {}

  public isCompleted() {
    return this.requirements.every((requirement) => {
      return requirement.isCompleted()
    })
  }

  public hint(): string {
    const output = []
    this.requirements.forEach((requirement) => {
      if (!requirement.isCompleted())
        output.push(requirement.hint().replace(/\./g, ''))
    })
    return `${output.join(' and ')}.`
  }
}
