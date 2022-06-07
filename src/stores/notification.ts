import { acceptHMRUpdate, defineStore } from 'pinia'
import { GameState } from '~/enums/GameConstants'
import type NotificationOption from '~/modules/notifications/NotificationOption'

export const useNotificationStore = defineStore('notification', {

  state: () => ({
    _notification: [] as NotificationOption[],
  }),
  getters: {
    notification: (state): NotificationOption[] => {
      return state._notification
    },
  },
  actions: {
    addNotification(value: NotificationOption) {
      this._notification.unshift(value)
      setTimeout(() => {
        this._notification.splice(this._notification.length - 1, 1)
      }, value.timeout)
      console.log('this._notification', this._notification)
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot))
