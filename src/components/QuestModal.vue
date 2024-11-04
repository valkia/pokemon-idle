<template>
  <div class="modal noselect fade" id="QuestModal" tabindex="-1" role="dialog" aria-labelledby="QuestModalLabel">
    <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <div class="col-3">
            <h5>
              <span>{{ `Quests (${currentQuests.length}/${questSlots})` }}</span>
            </h5>
          </div>
          <div class='col-6'>
            <div>Lvl. {{ questsLevel }}</div>
            <div class="progress" style='height: 5px'>
              <div class="progress-bar bg-info" role="progressbar"
                   :style="{ width: percentToNextQuestLevel + '%' }"
                   aria-valuemin="0" aria-valuemax="100">
              </div>
            </div>
          </div>
          <div class="col-3">
            <currency-display :amount="questPoints" :currency="questCurrency"></currency-display>
          </div>
        </div>
        <div class="modal-body p-0">
          <table class='table table-hover m-0'>
            <thead>
            <tr>
              <td><h5>Description</h5></td>
              <td><h5>Reward</h5></td>
              <td><h5>Status</h5></td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(quest, index) in questList" :key="index">
              <td class="align-middle" style="text-align:left">{{ quest.description }}</td>
              <td class="align-middle py-0" style="text-align:left">
                <currency-display :amount="quest.pointsReward" :currency="questCurrency"></currency-display>
              </td>
              <td class="align-middle py-0">
                <button class='btn btn-primary btn-sm btn-block'
                        v-if="canStartNewQuest && !quest.inProgress && !quest.isCompleted && !quest.claimed"
                        @click="startQuest(quest.index)">
                  Start
                </button>
                <button class='btn btn-success btn-sm btn-block' v-if="!quest.claimed && quest.isCompleted"
                        @click="claimQuest(quest.index)">
                  Claim
                </button>
                <span v-if="quest.inProgress && !quest.isCompleted">{{ Math.floor(quest.progress * 100) + "%" }}</span>
                <button class='btn btn-success btn-sm btn-block' disabled v-if="quest.claimed">Completed</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <div id='refreshQuests'>
            <button class="btn btn-primary" v-if="freeRefresh" @click="refreshQuests(false, true)">Free Refresh</button>
            <button class="btn btn-primary" v-else-if="canAffordRefresh" @click="refreshQuests(false, true)">
              <amount-display :amount="refreshCost"></amount-display> - Refresh
            </button>
          </div>
          <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CurrencyDisplay from './CurrencyDisplay.vue'; // 假设你有一个CurrencyDisplay组件
import AmountDisplay from './AmountDisplay.vue'; // 假设你有一个AmountDisplay组件

// 示例响应式数据，需根据实际逻辑调整
const currentQuests = ref([]);
const questSlots = ref(0);
const questsLevel = ref(0);
const percentToNextQuestLevel = ref(0);
const questPoints = ref(0);
const questCurrency = GameConstants.Currency.questPoint; // 假设 GameConstants 是全局可用的
const questList = ref([]);
const freeRefresh = ref(false);
const canAffordRefresh = ref(false);
const refreshCost = ref(0);

// 示例方法，需根据实际逻辑实现
const canStartNewQuest = computed(() => {
  // 实现逻辑
});

const startQuest = (index) => {
  // 开始任务的逻辑
};

const claimQuest = (index) => {
  // 领取任务的逻辑
};

const refreshQuests = (param1, param2) => {
  // 刷新任务的逻辑
};
</script>
