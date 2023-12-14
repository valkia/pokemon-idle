import { acceptHMRUpdate, defineStore } from 'pinia'
import type NotificationOption from '~/modules/notifications/NotificationOption'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<NotificationOption[]>([])

  const addNotification = (value: NotificationOption) => {
    notifications.value.unshift(value)
    setTimeout(() => {
      notifications.value.pop()
    }, value.timeout)
    console.log('notifications', notifications.value)
  }

  return { notifications, addNotification }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot))
