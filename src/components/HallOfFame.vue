<script lang="ts" setup>

import { usePlayerStore } from '~/stores/player'
import { Starter } from '~/enums/GameConstants'
import { useModalStore } from '~/stores/modal'

const player = usePlayerStore()

const show = computed(() => {
  return useModalStore().hallOfFameModal
})
</script>
<template>
  <div
    v-show="show"
    id="hallOfFameModal" data-keyboard="false" data-backdrop="static" tabindex="-1"
    role="dialog"
    aria-labelledby="hallOfFameModalLabel" aria-hidden="true"
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center flex"
  >
    <div class="relative p-4 w-full max-w-md h-full md:h-auto relative bg-white rounded-lg shadow dark:bg-gray-700">
      <div class="modal-header">
        <div style="width: 100%;">
          <img src="/src/assets/images/oak.png">
          <h5 id="hallOfFameModalLabel" class="modal-title">
            Professor Oak
          </h5>
        </div>
      </div>
      <div class="modal-body">
        <p>
          So, you won! Congratulations!<br>
          You are the new Pokémon League champion!<br>
          You have grown up so much since you first left with <span
            data-bind="text: GameConstants.Starter[player.starter()]"
          >{{ Starter[player.starter] }}</span>!<br>
          <br>
          There are many more regions to explore!
          <!-- ko if: App.game.challenges.list.requireCompletePokedex.active() -->
          <br>In order to move on you will need to capture all available Pokémon from the current region!
          <!-- /ko -->
        </p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="useModalStore().hallOfFameModal=false">
          Close
        </button>
      </div>
    </div>
  </div>
</template>
