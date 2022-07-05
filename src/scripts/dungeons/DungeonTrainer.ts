/// <reference path="../trainers/Trainer.ts"/>

import { Trainer } from '~/scripts/trainers/Trainer'
import type { GymPokemon } from '~/scripts/gym/GymPokemon'

export class DungeonTrainer extends Trainer {
  constructor(
    trainerClass: string,
    team: GymPokemon[],
    public options?: EnemyOptions,
    name?: string,
    subTrainerClass?: string) {
    super(trainerClass, team, name, subTrainerClass)
  }
}
