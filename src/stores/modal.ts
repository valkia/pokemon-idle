import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const shopModalFlag = ref(false)
  const pickStarterModalFlag = ref(true)
  const receiveBadgeModal = ref(false)
  const hallOfFameModal = ref(false)
  const teamViewModalFlag = ref(false)
  const partyModalFlag = ref(false)

  const setShopModalFlag = (value: boolean) => {
    shopModalFlag.value = value
  }

  const setPickStarterModalFlag = (value: boolean) => {
    pickStarterModalFlag.value = value
  }

  const toggleShopModal = () => {
    shopModalFlag.value = !shopModalFlag.value
  }

  const togglePickStarterModal = () => {
    pickStarterModalFlag.value = !pickStarterModalFlag.value
  }

  const toggleTeamViewModal = () => {
    teamViewModalFlag.value = !teamViewModalFlag.value
  }

  return { shopModalFlag, pickStarterModalFlag, receiveBadgeModal, hallOfFameModal, teamViewModalFlag, partyModalFlag, setShopModalFlag, setPickStarterModalFlag, toggleShopModal, togglePickStarterModal, toggleTeamViewModal }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useModalStore, import.meta.hot))
