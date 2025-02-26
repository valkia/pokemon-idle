import type { ModalInstance, ModalOptions, ModalType } from './modal'

declare global {
  interface Window {
    useModal: () => {
      openModal: <T extends ModalType>(type: T, options?: ModalOptions<T>) => ModalInstance
      closeModal: (type?: ModalType) => void
      isModalOpen: (type?: ModalType) => boolean
    }
  }
}
