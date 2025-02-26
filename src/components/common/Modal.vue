<script setup lang="ts">
import { storeToRefs } from 'pinia'
import * as GameConstants from '~/scripts/GameConstants'
import { StartSequenceRunner } from '~/scripts/StartSequenceRunner'
import { useModalStore } from '~/stores/modal'
import { usePlayerStore } from '~/stores/player'

const props = defineProps({
  modalShow: {
    type: Boolean,
    default: false,
  },
  closeBtn: {
    type: Boolean,
    default: false,
  },
})
// 定义关闭事件
const emit = defineEmits(['close'])
const show = computed(() => {
  return useModalStore().pickStarterModalFlag
})
const toggleShow = useModalStore().togglePickStarterModal

function closeModal() {
  emit('close')
}
</script>

<template>
  <div v-if="props.modalShow" id="popup-modal" tabindex="-1" class="h-modal fixed left-0 right-0 top-0 z-50 w-full flex items-center justify-center overflow-x-hidden overflow-y-auto md:inset-0 md:h-full">
    <div class="relative h-full max-w-md w-full md:h-auto">
      <div class="relative rounded-lg bg-white p-4 shadow dark:bg-gray-700">
        <slot />
      </div>
    </div>
  </div>
  <div v-if="props.modalShow" modal-backdrop="" class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 dark:bg-opacity-80" />
</template>

<style scoped lang="scss">

</style>
