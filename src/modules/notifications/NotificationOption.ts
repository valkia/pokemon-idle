import type Sound from '~/modules/utilities/Sound'
import type NotificationSetting from '~/modules/settings/NotificationSetting'
import type NotificationTypeOption from '~/modules/notifications/NotificationTypeOption'

export default interface NotificationOption {
  message: string
  type?: NotificationTypeOption
  title?: string
  timeout?: number
  time?: string
  sound?: Sound
  setting?: NotificationSetting
  image?: string
  strippedMessage?: string
}
