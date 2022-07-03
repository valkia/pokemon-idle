<script setup lang="ts">
import { ShopHandler } from '~/scripts/shop/ShopHandler'
import { useModalStore } from '~/stores/modal'

const show = computed(() => {
  return useModalStore().shopModalFlag
})
const toggleShow = useModalStore().toggleShopModal

const inputValue = ref(1)
</script>
<template>
  <div
    v-if="show" id="shopModal" class="modal fade noselect" tabindex="-1"
    role="dialog" aria-labelledby="shopModalLabel"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h4 data-bind="text: ">
            {{ ShopHandler.shopObservable?.displayName }}
          </h4>
          <button type="button" class="btn btn-primary" @click="toggleShow">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div>
            <div id="shopBodyTemplate">
              {{ ShopHandler.shopObservable }}
              <div v-for=" item in [...new Set(ShopHandler.shopObservable?.items.map(i => i.currency))]" class="row justify-content-center">
                <h4 class="col-6 col-sm-4 col-lg-2">
                  金钱组件
                </h4>
              </div>
              <div class="row justify-content-center" data-bind="foreach: ShopHandler.shopObservable().items">
                <div class="col-6 col-sm-4 col-lg-3">
                  <button
                    class="shopItem clickable btn btn-block btn-secondary"
                    data-bind="click: function() {ShopHandler.setSelected($index())},
               css: { active: ShopHandler.selected() == $index() },
               attr: { disabled: !$data.isAvailable() },
               tooltip: {
                  title: $data.description ? `<u>${$data.displayName}:</u><br/>${$data.description}` : '',
                  trigger: 'hover',
                  placement:'bottom',
                  html: true
                }"
                  >
                    <knockout data-bind="if: ($data instanceof CaughtIndicatingItem)">
                      <span
                        style="position: absolute; top: 15px; right: 20px;"
                        data-bind="template: { name: 'caughtStatusTemplate', data: {'status': $data.getCaughtStatus()}}"
                      />
                    </knockout>
                    <img src="" height="36px" data-bind="attr:{ src: $data.image }">
                    <p data-bind="text: $data.displayName">
                      Item Name
                    </p>
                    <div data-bind="if: $data.isAvailable()">
                      <span data-bind="template: { name: 'currencyTemplate', data: {'amount': totalPrice(ShopHandler.amount()), 'currency': currency, 'reducedThreshold': 1e10}}" />
                    </div>
                    <div data-bind="ifnot: $data.isAvailable()">
                      <span>Sold Out</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="row justify-content-center">
            <div class="input-group m-0" style="margin-bottom: 6px; margin-top: 6px">
              <div class="input-group-prepend">
                <button class="btn btn-warning btn-outline-dark smallButton smallFont" onclick="ShopHandler.resetAmount()">
                  Reset
                </button>
              </div>
              <input
                id="amountOfItems" v-model="inputValue" type="number"
                class="outline-dark form-control form-control-number" min="1" required
                name="amountOfItems"
                title=""
                @input="ShopHandler.amount(parseInt(inputValue, 10) || 0);" @change="ShopHandler.amount(parseInt(inputValue, 10) || 0);"
              >
              <div class="input-group-append">
                <!-- ko if: Settings.getSetting('shopButtons').observableValue() == 'original' -->
                <button class="btn btn-secondary smallButton smallFont" type="button" onclick="ShopHandler.increaseAmount(10)">
                  +10
                </button>
                <button class="btn btn-secondary smallButton smallFont" type="button" onclick="ShopHandler.increaseAmount(100)">
                  +100
                </button>
                <!-- /ko -->
                <!-- ko if: Settings.getSetting('shopButtons').observableValue() == 'multiplication' -->
                <button class="btn btn-secondary smallButton smallFont" type="button" onclick="ShopHandler.multiplyAmount(10)">
                  &times;10
                </button>
                <button class="btn btn-secondary smallButton smallFont" type="button" onclick="ShopHandler.multiplyAmount(0.1)">
                  &div;10
                </button>
                <!-- /ko -->
                <!-- ko if: Settings.getSetting('shopButtons').observableValue() == 'bigplus' -->
                <button class="btn btn-secondary smallButton smallFont" type="button" onclick="ShopHandler.increaseAmount(100)">
                  +100
                </button>
                <button class="btn btn-secondary smallButton smallFont" type="button" onclick="ShopHandler.increaseAmount(1000)">
                  +1000
                </button>
                <!-- /ko -->
                <button class="btn btn-primary smallButton smallFont" type="button" onclick="ShopHandler.maxAmount()">
                  Max
                </button>
                <button class="btn-outline-dark" data-bind="attr: {class: ShopHandler.calculateButtonCss()}" onclick="ShopHandler.buyItem()">
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
