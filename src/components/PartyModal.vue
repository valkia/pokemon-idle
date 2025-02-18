<template>
  <Modal :modal-show="modalStore.partyModalFlag">
    <div class="party-modal">
      <div class="header">
        <h2>Party Pokemon</h2>
        <button class="close-btn" @click="modalStore.setPartyModalFlag(false)">×</button>
      </div>

      <div class="pokemon-list">
        <div v-for="pokemon in partyStore.caughtPokemon" :key="pokemon.id" class="pokemon-card">
          <img :src="`/src/assets/images/pokemon/${pokemon.id}.png`" :alt="pokemon.name" class="pokemon-img">
          <div class="pokemon-info">
            <h3>{{ pokemon.name }}</h3>
            <p>Level: {{ pokemon.level }}</p>
            <p v-if="pokemon.shiny" class="shiny-badge">✨ Shiny</p>
          </div>
        </div>
      </div>

      <div v-if="!partyStore.caughtPokemon.length" class="empty-state">
        No Pokemon caught yet! Go catch some Pokemon to build your team.
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Modal from './common/Modal.vue'
import { useModalStore } from '~/stores/modal'
import { usePartyStore } from '~/stores/party'

const modalStore = useModalStore()
const partyStore = usePartyStore()
</script>

<style lang="scss">
.party-modal {
  min-width: 320px;
  padding: 1rem;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h2 {
      margin: 0;
      color: #2c3e50;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      color: #666;

      &:hover {
        color: #333;
      }
    }
  }

  .pokemon-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    max-height: 70vh;
    overflow-y: auto;

    .pokemon-card {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 8px;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-2px);
      }

      .pokemon-img {
        width: 64px;
        height: 64px;
        object-fit: contain;
        margin-right: 1rem;
      }

      .pokemon-info {
        h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
        }

        p {
          margin: 0;
          font-size: 0.875rem;
          color: #666;
        }

        .shiny-badge {
          color: #ffd700;
          font-weight: bold;
          margin-top: 0.25rem;
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
}
</style>