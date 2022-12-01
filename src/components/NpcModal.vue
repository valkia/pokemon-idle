<template>
  <Modal :modal-show="npcStore.npcModalFlag" :close-btn="true">
    <div class="modal-dialog modal-dialog-scrollable modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-body text-center">
          <u><h5 class="npc-name">{{ npcStore.name }}</h5></u><br>
          <img v-show="npcStore.image" mx-auto class="npc-image" :src="npcStore.image">
          <div class="npc-dialog" v-html="npcStore.dialogHTML" />
          <button type="button" mt-4 class="btn btn-primary btn-block" data-dismiss="modal" @click="npcStore.close()">
            Close
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { useNpcStore } from '~/stores/npc'
import Modal from '~/components/common/Modal.vue'
const npcStore = useNpcStore()
</script>
