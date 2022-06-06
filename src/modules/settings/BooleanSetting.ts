import Setting from './Setting'
import SettingOption from './SettingOption'

export default class BooleanSetting extends Setting<boolean> {
  constructor(name: string, displayName: string, defaultValue: boolean) {
    super(
      name,
      displayName,
      [
        new SettingOption<boolean>('On', true),
        new SettingOption<boolean>('Off', false),
      ],
      defaultValue,
    )
  }

  toggle(): void {
    this.set(!this.value)
  }
}
