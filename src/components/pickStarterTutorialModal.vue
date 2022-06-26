<template
  id="pickStarterTutorialModal" class="modal" tabindex="-1" role="dialog"
  aria-labelledby="pickStarterTutorialModalLabel" aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <div style="width: 100%;">
          <img src="/src/assets/images/oak.png">
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
            <div id="starterSelection" class="row">
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
        <p>You can click on it to inflict damage</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StartSequenceRunner } from '~/scripts/StartSequenceRunner'
import { usePlayerStore } from '~/stores/player'
import * as GameConstants from '~/enums/GameConstants'

const bulbasaur = () => {
  StartSequenceRunner.pickStarter(GameConstants.Starter.Bulbasaur)
  const player = usePlayerStore()
  // player.regionStarters[0](0)
}

const charmander = () => {
  StartSequenceRunner.pickStarter(GameConstants.Starter.Charmander)
  const player = usePlayerStore()
  // player.regionStarters[0](1)
}

const squirtle = () => {
  StartSequenceRunner.pickStarter(GameConstants.Starter.Squirtle)
  const player = usePlayerStore()
  // player.regionStarters[0](2)
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
