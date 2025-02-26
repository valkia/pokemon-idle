import type { CandyType } from '~/components/pokemon/TeamView.vue'
import type { Pokemon } from '~/scripts/pokemons/PokemonList'

// 定义所有可用的弹窗类型
export type ModalType =
  | 'team-view' // 团队查看弹窗
  | 'pick-starter' // 选择初始宝可梦弹窗
  | 'receive-badge' // 获得徽章弹窗
  | 'hall-of-fame' // 名人堂弹窗
  | 'party' // 派对弹窗
  | 'shop' // 商店弹窗

// 每种弹窗类型的专用Props类型
export interface ModalProps {
  'team-view': {
    initialTeam?: Pokemon[]
    onSelect?: (pokemon: Pokemon) => void
  }
  'pick-starter': {
    starters?: Pokemon[]
    onSelect?: (starter: Pokemon) => void
  }
  'receive-badge': {
    badge: any
    gymLeader?: string
  }
  'hall-of-fame': {
    team: Pokemon[]
  }
  'party': Record<string, any>
  'shop': {
    items?: any[]
    playerMoney?: number
  }
}

// 通用弹窗选项接口
export interface ModalOptions<T extends ModalType> {
  props?: ModalProps[T]
  onOpen?: () => void
  onClose?: () => void
  persistent?: boolean // 点击外部是否关闭
  closeOnEsc?: boolean // 按ESC是否关闭
}

// 弹窗实例接口
export interface ModalInstance {
  close: () => void
}
