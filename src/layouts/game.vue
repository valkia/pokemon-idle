<script setup lang="ts">
import PartyModal from '~/components/PartyModal.vue'
import TeamView from '~/components/pokemon/TeamView.vue'
import { useModalStore } from '~/stores/modal'

const modalStore = useModalStore()
</script>

<template>
  <main class="px-4 text-center text-gray-700 dark:text-gray-200">
    <div class="fixed right-4 top-4 z-50">
      <button
        class="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        @click="modalStore.setPartyModalFlag(true)"
      >
        View Party
      </button>
    </div>
    <router-view />
    <PartyModal />
    <TeamView />
  </main>
</template>

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
