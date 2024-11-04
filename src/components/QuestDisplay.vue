<template>
  <div id="questDisplayContainer" class="card sortable border-secondary mb-3">
    <div v-if="isDailyQuestsUnlocked" class="card-header p-0" @click="toggleQuestDisplay">
      <span>{{ `Quests (${currentQuests.length}/${questSlots})` }}</span>
    </div>
    <button v-if="isDailyQuestsUnlocked" class="btn btn-sm btn-primary" style="position: absolute; right: 0px; top: 0px; width: auto; height: 41px;" @click="showQuestModal">
      List
    </button>

    <div id="questDisplayBody" class="card-body p-0 show">
      <span v-if="currentQuests.length == 0 && isDailyQuestsUnlocked" class="pt-2 pb-2">No active quest</span>
      <table width="100%">
        <tbody>
        <tr v-for="(quest, index) in currentQuests" :key="index" class="text-center">
          <td colspan="2">{{ quest.description }}</td>
          <tr>
            <td width="70%" class="p-0">
              <div class="progress p-0">
                <div class="progress-bar bg-primary" role="progressbar" :style="{ width: quest.progress * 100 + '%' }">
                  <span>{{ quest.progressText }}</span>
                </div>
              </div>
            </td>
            <td width="30%" class="p-0">
              <button v-if="!quest.isCompleted" class="btn btn-danger btn-sm btn-block p-0" @click="quitQuest(index)">
                Quit
              </button>
              <button v-else class="btn btn-success btn-sm btn-block p-0" @click="claimQuest(index)">
                Claim
              </button>
            </td>
          </tr>
        </tr>
        </tbody>

        <tbody id="questLines">
        <tr v-for="(questLine, qIndex) in questLines" :key="qIndex" v-if="questLine.state === 'started'">
          <td colspan="2">
            <div class="card-header">
              {{ questLine.name }}
              <span class="info text-primary">ⓘ</span>
            </div>
          </td>
          <tr class="text-center">
            <td colspan="2">{{ questLine.curQuestObject.description }}</td>
          </tr>
          <tr>
            <td colspan="2" class="p-0">
              <div class="progress p-0">
                <div class="progress-bar bg-success" role="progressbar" :style="{ width: questLine.curQuestObject.progress * 100 + '%' }">
                  <span>{{ questLine.curQuestObject.progressText }}</span>
                </div>
              </div>
            </td>
          </tr>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentQuests = ref([]); // 示例数据，需根据实际情况调整
const questSlots = ref(0); // 示例数据
const questLines = ref([]); // 示例数据

const isDailyQuestsUnlocked = computed(() => {
  // 根据实际逻辑计算是否解锁每日任务
});

const showQuestModal = () => {
  // 显示任务模态框的逻辑
};

const toggleQuestDisplay = () => {
  // 切换任务显示的逻辑
};

const quitQuest = (index) => {
  // 放弃任务的逻辑
};

const claimQuest = (index) => {
  // 领取任务的逻辑
};
</script>
