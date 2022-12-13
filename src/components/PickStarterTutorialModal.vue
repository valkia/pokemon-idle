<template>
  <Modal :modal-show="show">
    <button
      type="button"
      class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
      data-modal-toggle="popup-modal"
      @click="toggleShow()"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <div pt="12" justify-center flex flex-col items-center>
            <img src="/src/assets/images/oak.png" w="20">
            <h5 id="pickStarterTutorialModalLabel" class="modal-title">
              Professor Oak
            </h5>
          </div>
        </div>
        <div class="modal-body">
          <p id="pickStarterTutorialModalText">
            Oh No! We got ambushed by these Pokémon!<br>
            I can only hold off two! Pick the one you want to fight!
          </p>
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div id="starterSelection" class="row" flex justify-around>
                <div class="col">
                  <input
                    class="image-starter" type="image"
                    src="/src/assets/images/pokemon/1.png"
                    @click="bulbasaur"
                  >
                </div>
                <div class="col">
                  <input
                    class="image-starter" type="image"
                    src="/src/assets/images/pokemon/4.png"
                    @click="charmander"
                  >
                </div>
                <div class="col">
                  <input
                    class="image-starter" type="image"
                    src="/src/assets/images/pokemon/7.png"
                    @click="squirtle"
                  >
                </div>
              </div>
            </div>
          </div>
          <p pb="10">
            You can click on it to inflict damage
          </p>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { StartSequenceRunner } from '~/scripts/StartSequenceRunner'
import { usePlayerStore } from '~/stores/player'
import * as GameConstants from '~/scripts/GameConstants'
import { useModalStore } from '~/stores/modal'
import Modal from '~/components/common/Modal.vue'

const show = computed(() => {
  return useModalStore().pickStarterModalFlag
})
const toggleShow = useModalStore().togglePickStarterModal
const bulbasaur = () => {
  StartSequenceRunner.pickStarter(GameConstants.Starter.Bulbasaur)
  const player = usePlayerStore()
  player.setRegionStarters(0, 0)
  toggleShow()
}

const charmander = () => {
  StartSequenceRunner.pickStarter(GameConstants.Starter.Charmander)
  const player = usePlayerStore()
  player.setRegionStarters(0, 1)
  toggleShow()
}

const squirtle = () => {
  StartSequenceRunner.pickStarter(GameConstants.Starter.Squirtle)
  const player = usePlayerStore()
  player.setRegionStarters(0, 2)
  toggleShow()
}
</script>

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
