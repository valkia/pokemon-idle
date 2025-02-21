<template>
  <main class="px-4 text-center text-gray-700 dark:text-gray-200">
    <div class="fixed top-4 right-4 z-50">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        @click="modalStore.setPartyModalFlag(true)"
      >
        View Party
      </button>
    </div>
    <router-view />
    <PartyModal />
  </main>
</template>

<script setup lang="ts">
import PartyModal from '~/components/PartyModal.vue'
import { useModalStore } from '~/stores/modal'

const modalStore = useModalStore()
</script>

<style lang="scss">
.fixed {
  position: fixed;
}

.top-4 {
  top: 1rem;
}

.right-4 {
  right: 1rem;
}

.z-50 {
  z-index: 50;
}

button {
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>