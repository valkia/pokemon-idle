<template>
  <div v-for="notification in notificationList" :id="toastID" class="toast bg-${NotificationOption[type]}" data-autohide="false">
    <div v-if="notification.title" class="toast-header">
      <img v-if="notification.image" :src="notification.image" class="icon">
      <strong class="mr-auto text-primary">{{ notification.title || '' }}</strong>
      <small class="text-muted">{{ notification.time }}</small>
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">
        ×
      </button>
    </div>
    <div v-else class="toast-body text-light">
      <img v-if="notification.image" src="{{notification.image}}" class="icon">
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { useNotificationStore } from '~/stores/notification'
const notificationList = useNotificationStore().notification
console.log('notificationList', notificationList)
window.add = useNotificationStore().addNotification
</script>

<style scoped>

</style>
