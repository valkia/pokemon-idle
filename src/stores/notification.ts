import { acceptHMRUpdate, defineStore } from 'pinia'
import type NotificationOption from '~/modules/notifications/NotificationOption'

export const useNotificationStore = defineStore('notification', {

  state: () => ({
    notification: [] as NotificationOption[],
  }),
  getters: {

  },
  actions: {
    addNotification(value: NotificationOption) {
      this.notification.unshift(value)
      setTimeout(() => {
        this.notification.splice(this.notification.length - 1, 1)
      }, value.timeout)
      console.log('this.notification', this.notification)
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot))
