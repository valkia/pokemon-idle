<script lang="ts" setup>
import Modal from '~/components/common/Modal.vue'
import BadgeEnums from '~/modules/enums/Badges'
import { useDungeonStore } from '~/stores/dungeon'
import { useGameStore } from '~/stores/game'
import { useGymStore } from '~/stores/gym'
import { useModalStore } from '~/stores/modal'

const gameState = useGameStore()
const dungeonStore = useDungeonStore()
const gymStore = useGymStore()
const gym = computed(() => {
  return gymStore.gym
})
const dungeon = computed(() => {
  return dungeonStore.dungeon
})
const map = computed(() => {
  return dungeonStore.map
})
const showReceiveBadgeModal = computed(() => {
  return useModalStore().receiveBadgeModal
})
function toggleShow() {
  useModalStore().receiveBadgeModal = !useModalStore().receiveBadgeModal
}
function openHallOfFameModal() {
  useModalStore().hallOfFameModal = true
}
</script>

<template>
  <Modal :modal-show="showReceiveBadgeModal">
    <div class="modal-header">
      <div style="width: 100%;">
        <button
          type="button"
          class="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
          data-modal-toggle="popup-modal"
          @click="toggleShow()"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <div class="mt-2 flex justify-center">
          <img
            :src="`/src/assets/images/gymLeaders/${gym.leaderName}.png`"
            onerror="this.src='/src/assets/images/trainers/Mysterious Trainer.png'"
            data-bind="attr:{ src: }"
          >
        </div>
        <h5
          id="receiveBadgeModalLabel" class="modal-title"
          data-bind="text: GymRunner.gymObservable().leaderName.replace(/\d/g,'')"
        >
          {{ gym.leaderName.replace(/\d/g, '') }}
        </h5>
      </div>
    </div>
    <div class="modal-body">
      <p data-bind="text: GymRunner.gymObservable().defeatMessage">
        {{ gym.defeatMessage }}
      </p>
      <!-- ko if: !BadgeEnums[GymRunner.gymObservable().badgeReward].startsWith('Elite') -->
      <div class="mt-2 flex justify-center">
        <img
          v-if="!BadgeEnums[gym.badgeReward].startsWith('Elite') "
          :src="`/src/assets/images/badges/${BadgeEnums[gym.badgeReward]}.png`" width="56px"
          data-bind="attr:{ src: }"
          onerror="this.src='/src/assets/images/badges/Unknown.png'"
        >
      </div>
      <!-- /ko -->
    </div>
    <!--  gym instanceof Champion    -->
    <div v-if="false">
      <div class="modal-footer mt-2">
        <button type="button" class="btn-primary btn" data-dismiss="modal">
          Close
        </button>
      </div>
    </div>
    <div v-else>
      <div class="modal-footer mt-2">
        <button
          type="button" class="btn-primary btn" data-dismiss="modal"
          @click="openHallOfFameModal"
        >
          Next
        </button>
      </div>
    </div>
  </Modal>
</template>
