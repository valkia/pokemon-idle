<script lang="ts" setup>
import { useGameStore } from '~/stores/game'
import * as GameConstants from '~/enums/GameConstants'
import { DungeonRunner } from '~/scripts/dungeons/DungeonRunner'
import { useDungeonStore } from '~/stores/dungeon'
import { useGymStore } from '~/stores/gym'
import BadgeEnums from '~/modules/enums/Badges'
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
const toggleShow = () => {
  useModalStore().receiveBadgeModal = !useModalStore().receiveBadgeModal
}
</script>
<template>
  <div
    v-if="showReceiveBadgeModal"
    id="receiveBadgeModal"
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center flex"
    data-keyboard="false"
    data-backdrop="static"
    tabindex="-1"
    role="dialog"
    aria-labelledby="receiveBadgeModalLabel" aria-hidden="true"
  >
    <div class="relative p-4 w-full max-w-md h-full md:h-auto relative bg-white rounded-lg shadow dark:bg-gray-700">
      <div class="modal-header">
        <div style="width: 100%;">
          <button
            type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-toggle="popup-modal"
            @click="toggleShow()"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <img
            mx-auto
            :src="'/src/assets/images/gymLeaders/' + gym.leaderName + '.png'"
            onerror="this.src='/src/assets/images/trainers/Mysterious Trainer.png'"
            data-bind="attr:{ src: }"
          >
          <h5
            id="receiveBadgeModalLabel" class="modal-title"
            data-bind="text: GymRunner.gymObservable().leaderName.replace(/\d/g,'')"
          >
            {{ gym.leaderName.replace(/\d/g,'') }}
          </h5>
        </div>
      </div>
      <div class="modal-body">
        <p data-bind="text: GymRunner.gymObservable().defeatMessage">
          {{ gym.defeatMessage }}
        </p>
        <!-- ko if: !BadgeEnums[GymRunner.gymObservable().badgeReward].startsWith('Elite') -->
        <img
          v-if="!BadgeEnums[gym.badgeReward].startsWith('Elite') "
          :src="'/src/assets/images/badges/' + BadgeEnums[gym.badgeReward] + '.png'" width="56px"
          data-bind="attr:{ src: }"
          onerror="this.src='/src/assets/images/badges/Unknown.png'"
        >
        <!-- /ko -->
      </div>
      <!--  gym instanceof Champion    -->
      <div v-if="false">
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-dismiss="modal">
            Close
          </button>
        </div>
      </div>
      <div v-else>
        <div class="modal-footer">
          <button
            type="button" class="btn btn-primary" data-dismiss="modal"
            @click="$('#hallOfFameModal').modal('show')"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showReceiveBadgeModal" modal-backdrop="" class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40" />
</template>
