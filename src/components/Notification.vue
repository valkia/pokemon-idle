<script setup>
import { useNotificationStore } from '~/stores/notification'

const notificationList = computed(() => {
  return useNotificationStore().notification
})
console.log('notificationList', notificationList)
</script>

<template>
  <div class="toaster">
    <div v-for="notification in notificationList" :id="toastID" class="toast bg-${NotificationOption[type]}" data-autohide="false">
      <div v-if="notification.title" class="toast-header">
        <img v-if="notification.image" :src="notification.image" class="icon">
        <strong class="text-primary mr-auto">{{ notification.title || '' }}</strong>
        <small class="text-muted">{{ notification.time }}</small>
        <button type="button" class="close mb-1 ml-2" data-dismiss="toast">
          ×
        </button>
      </div>
      <div v-else class="toast-body">
        <img v-if="notification.image" :src="notification.image" class="icon">
        {{ notification.message }}
        <button type="button" class="close mb-1 ml-2" data-dismiss="toast">
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toaster {
  position: fixed;
  right: 0px;
  top: 0px;
  padding: 10px;
  width: 370px;
  z-index: 10020;
  pointer-events: none;

  .toast {
    pointer-events: all;
  }

  .toast-body .close {
    color: whitesmoke;
  }

  img.icon {
    height: 28px;
    margin-right: 5px;
  }
}
</style>
