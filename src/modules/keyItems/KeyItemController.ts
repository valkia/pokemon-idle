import type { Ref } from 'vue'
import { ref } from 'vue'
import KeyItemType from '~/modules/enums/KeyItemType'

export default class KeyItemController {
  private static inspectedItem: Ref<KeyItemType> = ref(KeyItemType.Teachy_tv)
  private static selectedItem: Ref<KeyItemType> = ref(KeyItemType.Teachy_tv)
  private static latestGainedItem: Ref<KeyItemType> = ref(KeyItemType.Teachy_tv)

  static showGainModal(item: KeyItemType) {
    this.latestGainedItem.value = (item)
    $('.modal').modal('hide')
    $('#keyItemModal').modal({
      backdrop: 'static',
      keyboard: false,
    })
  }

  public static hover(item: KeyItemType) {
    this.inspectedItem.value = (item)
  }

  public static hoverRelease() {
    this.selectedItem.value = (this.inspectedItem.value)
  }
}
