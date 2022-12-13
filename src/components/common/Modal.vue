<template>
  <div v-if="props.modalShow" id="popup-modal" tabindex="-1" class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center flex">
    <div class="relative  w-full max-w-md h-full md:h-auto">
      <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-700">
        <slot />
      </div>
    </div>
  </div>
  <div v-if="props.modalShow" modal-backdrop="" class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { StartSequenceRunner } from '~/scripts/StartSequenceRunner'
import { usePlayerStore } from '~/stores/player'
import * as GameConstants from '~/scripts/GameConstants'
import { useModalStore } from '~/stores/modal'
const show = computed(() => {
  return useModalStore().pickStarterModalFlag
})
const toggleShow = useModalStore().togglePickStarterModal
const props = defineProps<{ modalShow: Boolean;closeBtn: false }>()
</script>

<style scoped lang="scss">

</style>
