
import { computed } from 'vue'
// For helper functions that may be needed across all files
// TODO: Convert this to not be a class after everything is TS modules
export default class GameHelper {
  public static counter = ref(0)
  private static currentTime = ref(new Date())
  private static tomorrow = ref(GameHelper.getTomorrow())

  public static msUntilTomorrow = computed(() => Number(GameHelper.tomorrow.value) - Number(GameHelper.currentTime.value))
  public static formattedTimeUntilTomorrow = computed(() => GameHelper.formatTime(GameHelper.msUntilTomorrow.value))
  public static formattedLetterTimeUntilTomorrow = computed(() => GameHelper.formatLetterTime(GameHelper.msUntilTomorrow.value))

  private static readonly MS_IN_MIN = 1000 * 60
  private static readonly MS_IN_HOUR = GameHelper.MS_IN_MIN * 60

  public static enumLength(enumerable: any): number {
    return Object.keys(enumerable).length / 2
  }

  public static enumStrings(enumerable: any): string[] {
    return Object.keys(enumerable).filter(k => Number.isNaN(Number(k)))
  }

  public static enumNumbers(enumerable: any): number[] {
    return Object.keys(enumerable).map(Number).filter(k => !Number.isNaN(k))
  }

  public static enumSelectOption(enumerable: any): { name: string; value: any }[] {
    return Object.keys(enumerable).filter(k => Number.isNaN(Number(k))).map(key => ({ name: key, value: enumerable[key] }))
  }

  public static objectFromEnumStrings<T extends {}, V>(enumerable: T, defaultValue: () => V): Record<keyof T, V> {
    return (this.enumStrings(enumerable).reduce((keys, type) => ({ ...keys, [type]: defaultValue() }), {}) as Record<keyof T, V>)
  }

  public static tick(): void {
    GameHelper.counter.value = 0
    GameHelper.updateTime()
  }

  private static updateTime(): void {
    const now = new Date()
    if (now.getDate() === GameHelper.tomorrow.value.getDate())
      GameHelper.tomorrow.value = GameHelper.getTomorrow()

    GameHelper.currentTime.value = new Date()
  }

  public static formatAmount(n: number): string {
    if (n >= 1e9) return `${Math.floor(n / 1e9)}b`
    if (n >= 1e6) return `${Math.floor(n / 1e6)}m`
    if (n >= 1e3) return `${Math.floor(n / 1e3)}k`
    return `${n}`
  }

  public static getIndexFromDistribution(a: number[]): number {
    const rand = Math.random()
    for (let i = 0; i < a.length; i += 1) {
      if (rand <= a[i])
        return i
    }
    // If none matched for whatever reason (should never happen) return the
    // last index
    return a.length - 1
  }

  public static createArray(start: number, max: number, step: number): Array<number> {
    const array = []
    for (let i = start; i <= max; i += step)
      array.push(i)

    return array
  }

  public static anOrA(name: string): string {
    return ['a', 'e', 'i', 'o', 'u'].includes(name[0].toLowerCase()) ? 'an' : 'a'
  }

  public static shallowEqual(object1: any, object2: any): boolean {
    const keys1 = Object.keys(object1)
    const keys2 = Object.keys(object2)

    if (keys1.length !== keys2.length) return false

    return keys1.every(key => object1[key] === object2[key])
  }

  public static binarySearch(testTooHigh: (guess: number) => boolean, min: number, max: number): number {
    if (max - min <= 1) return min

    const mid = Math.floor((max + min) / 2)
    const [newMin, newMax] = testTooHigh(mid) ? [min, mid] : [mid, max]

    return GameHelper.binarySearch(testTooHigh, newMin, newMax)
  }

  private static getTomorrow(): Date {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  }

  private static twoDigitNumber(n: number): string {
    // For use in clocks / showing time
    // Turns 4 into 04, does nothing to 23, turns 173 into 73
    return (`0${n}`).slice(-2)
  }

  private static formatTime(milliseconds: number): string {
    const hours = Math.floor(milliseconds / GameHelper.MS_IN_HOUR)
    const remainingMs = milliseconds % GameHelper.MS_IN_HOUR
    const minutes = Math.floor(remainingMs / GameHelper.MS_IN_MIN)
    return `${hours}:${GameHelper.twoDigitNumber(minutes)}`
  }

  private static formatLetterTime(milliseconds: number): string {
    const hours = Math.floor(milliseconds / GameHelper.MS_IN_HOUR)
    const remainingMs = milliseconds % GameHelper.MS_IN_HOUR
    const minutes = Math.floor(remainingMs / GameHelper.MS_IN_MIN)
    return `${hours}h${GameHelper.twoDigitNumber(minutes)}m`
  }
}
