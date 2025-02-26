import type { Component } from 'vue'
import type { ModalInstance, ModalOptions, ModalProps, ModalType } from '../types/modal'
import { createApp, defineComponent, h } from 'vue'

import PickStarterTutorial from '../components/PickStarterTutorialModal.vue'
// 导入弹窗组件
import TeamView from '../components/pokemon/TeamView.vue'
// 导入其他弹窗组件...

// 弹窗组件映射
const modalComponents: Record<string, Component> = {
  'team-view': TeamView,
  'pick-starter': PickStarterTutorial,
  // 添加其他弹窗组件...
}

// 当前打开的弹窗实例
interface ActiveModal {
  type: ModalType
  instance: ModalInstance
}

let currentModal: ActiveModal | null = null

/**
 * 弹窗管理器组合式API
 */
export function useModal() {
  /**
   * 打开弹窗
   * @param type 弹窗类型
   * @param options 弹窗选项
   * @returns 弹窗实例
   */
  function openModal<T extends ModalType>(type: T, options: ModalOptions<T> = {}): ModalInstance {
    // 如果已有打开的弹窗，先关闭它
    if (currentModal) {
      currentModal.instance.close()
      currentModal = null
    }

    // 1. 创建容器元素
    const container = document.createElement('div')
    container.className = 'modal-container'
    document.body.appendChild(container)

    // 2. 创建包装组件
    const ModalWrapper = defineComponent({
      setup() {
        // 关闭弹窗的方法
        const handleClose = () => {
          // 调用onClose回调
          if (options.onClose) {
            options.onClose()
          }

          // 卸载组件并移除DOM
          app.unmount()
          container.remove()

          // 清除当前弹窗引用
          if (currentModal?.instance === modalInstance) {
            currentModal = null
          }
        }

        // 如果设置了onOpen回调，在下一个tick调用
        if (options.onOpen) {
          setTimeout(() => options.onOpen?.(), 0)
        }

        return () => h(modalComponents[type], {
          ...options.props,
          onClose: handleClose,
          modalShow: true, // 确保弹窗显示
        })
      },
    })

    // 3. 创建应用实例并挂载
    const app = createApp(ModalWrapper)
    app.mount(container)

    // 4. 创建并存储弹窗实例
    const modalInstance: ModalInstance = {
      close: () => {
        if (options.onClose) {
          options.onClose()
        }
        app.unmount()
        container.remove()

        // 清除当前弹窗引用
        if (currentModal?.instance === modalInstance) {
          currentModal = null
        }
      },
    }

    // 存储当前弹窗实例和类型
    currentModal = {
      type,
      instance: modalInstance,
    }

    return modalInstance
  }

  /**
   * 关闭当前打开的弹窗
   * @param type 可选的弹窗类型，如果提供，只关闭指定类型的弹窗
   */
  function closeModal(type?: ModalType): void {
    if (currentModal) {
      // 如果指定了类型，只关闭匹配类型的弹窗
      if (type && currentModal.type !== type) {
        return
      }

      currentModal.instance.close()
      currentModal = null
    }
  }

  /**
   * 检查弹窗是否打开
   * @param type 可选的弹窗类型，如果提供，只检查指定类型的弹窗
   * @returns 是否有弹窗打开
   */
  function isModalOpen(type?: ModalType): boolean {
    if (!currentModal) {
      return false
    }

    // 如果指定了类型，只检查匹配类型的弹窗
    if (type) {
      return currentModal.type === type
    }

    return true
  }

  // 返回弹窗管理器API
  return {
    openModal,
    closeModal,
    isModalOpen,
  }
}

// 导出类型，方便使用
export type { ModalInstance, ModalOptions, ModalProps, ModalType }
