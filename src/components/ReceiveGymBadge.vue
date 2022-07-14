<script lang="ts" setup>
import {useGameStore} from '~/stores/game'
import * as GameConstants from '~/enums/GameConstants'
import {DungeonRunner} from '~/scripts/dungeons/DungeonRunner'
import {useDungeonStore} from '~/stores/dungeon'
import {useGymStore} from "~/stores/gym";
import BadgeEnums from "~/modules/enums/Badges";

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
</script>
<template class="modal fade" data-keyboard="false" data-backdrop="static" id="receiveBadgeModal" tabindex="-1"
          role="dialog"
          aria-labelledby="receiveBadgeModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <div style="width: 100%;">
          <img
              :src="'/src/assets/images/gymLeaders/' + gym.leaderName + '.png'"
               onerror="this.src='/src/assets/images/trainers/Mysterious Trainer.png'"
               data-bind="attr:{ src: }"
          >
          <h5 class="modal-title" id="receiveBadgeModalLabel"
              data-bind="text: GymRunner.gymObservable().leaderName.replace(/\d/g,'')">
            {{gym.leaderName.replace(/\d/g,'')}}
          </h5>

        </div>
      </div>
      <div class="modal-body">
        <p data-bind="text: GymRunner.gymObservable().defeatMessage">
          {{gym.defeatMessage}}
        </p>
        <!-- ko if: !BadgeEnums[GymRunner.gymObservable().badgeReward].startsWith('Elite') -->
        <img
            v-if="!BadgeEnums[gym.badgeReward].startsWith('Elite') "
            :src="'/src/assets/images/badges/' + BadgeEnums[gym.badgeReward] + '.png'" width="56px"
             data-bind="attr:{ src: }"
             onerror="this.src='/src/assets/images/badges/Unknown.png'">
        <!-- /ko -->

      </div>
      <div v-if="!gym instanceof Champion">
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
        </div>
      </div>
      <div v-else>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-dismiss="modal"
                  @click="$('#hallOfFameModal').modal('show')">
            Next
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
