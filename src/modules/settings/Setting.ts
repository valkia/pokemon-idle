
import { computed, ref } from 'vue'
import type { ComputedRef, Ref, UnwrapRef } from 'vue'
import type SettingOption from './SettingOption'
export default class Setting<T> {
  value: T
  observableValue: UnwrapRef<T>

  // Leave options array empty to allow all options.
  constructor(
    public name: string,
    public displayName: string,
    public options: SettingOption<T>[],
    public defaultValue: T,
  ) {
    this.observableValue = ref(defaultValue).value
    this.set(defaultValue)
  }

  set(value: T): void {
    if (this.validValue(value)) {
      this.value = value
      this.observableValue = ref(value).value
    }
    else {
      // eslint-disable-next-line no-console
      console.warn(`${value} is not a valid value for setting ${this.name}`)
    }
  }

  validValue(value: T): boolean {
    if (!this.isUnlocked(value))
      return false

    if (this.options.length === 0)
      return true

    for (let i = 0; i < this.options.length; i += 1) {
      if (this.options[i].value === value)
        return true
    }

    return false
  }

  isSelected(value: T): ComputedRef<boolean> {
    return computed(() => (this.observableValue.value === value))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  isUnlocked(value: T): boolean {
    return true
  }
}
