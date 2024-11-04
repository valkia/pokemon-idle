import type { ViteSSGContext } from 'vite-ssg'
import {BattlePokemon} from "~/scripts/pokemons/BattlePokemon";
import {Gym} from "~/scripts/gym/Gym";

export type UserModule = (ctx: ViteSSGContext) => void

export interface GymState {
    timeLeft: number;
    timeLeftPercentage: number;
    gym: Gym | null;
    running: boolean;
    autoRestart: boolean;
    initialRun: boolean;
    index: number;
    totalPokemons: number;
    enemyPokemon: BattlePokemon | null;
}