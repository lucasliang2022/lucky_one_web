<template>
  <div class="issue-info">
    <div class="issue-info-left">
      <div class="bet-game-name">{{ name || '秒速时时彩' }}</div>
      <div class="issue-no">
        第 <span class="issue-no-text" :key="issueNo">{{ issueNo || '未知期号' }}</span> 期
      </div>
      <div class="label" :class="{ 'color-green': isBetting, 'color-red': !isBetting }">
        {{ isBetting ? '投注中' : '封盘中' }}
      </div>
    </div>
    <div class="issue-info-right">
      <span class="countdown-status">本期倒计时</span>
      <span :class="['countdown-time', { 'color-red': remainingSeconds <= 10, 'color-green': remainingSeconds > 10 }]">{{ countdownTime }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useIssueRollover } from '@lottery/base/composables/useIssueRollover';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const { name } = storeToRefs(props.store);

// 与开奖区共用同一滚期 controller(同一 store 共享 tick + 轮询) → 「本期倒计时」与「开奖倒计时」严格同步,
// 不再各自跑一个 setInterval(两个独立定时器 floor 秒会错开 1 秒,即之前看到的差 1 秒)。
const { countdownMs, isClosed, issueNo } = useIssueRollover(props.store);

const remainingSeconds = computed(() => Math.floor(countdownMs.value / 1000));
const countdownTime = computed(() => {
  const r = remainingSeconds.value;
  const minutes = Math.floor(r / 60).toString().padStart(2, '0');
  const seconds = (r % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
});
const isBetting = computed(() => !isClosed.value && remainingSeconds.value > 0);
</script>

<style lang="scss" scoped>
.issue-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eeeeee;
  .issue-info-left {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .bet-game-name {
      font-size: 14px;
      color: #333;
      font-weight: bold;
      margin-right: 10px;
    }
    .label {
      font-size: 14px;
      color: #666;
      margin-right: 10px;
    }
    .color-green {
      color: green;
    }
    .color-red {
      color: red;
    }
    .issue-no {
      font-size: 14px;
      font-weight: 500;
      margin-right: 20px;
      color: #1a1a1a;
    }
  }
  .issue-info-right {
    display: flex;
    align-items: center;
    .countdown-time {
      background-color: #f5f5f5;
      padding: 2px 8px;
      border-radius: 4px;
      margin: 0 5px;
    }
    .color-red {
      color: #e02020;
    }
    .color-green {
      color: green;
    }
    .countdown-status {
      color: #333;
    }
  }
}

.issue-no-text {
  display: inline-block;
  animation: scaleAndColorAnimation 0.3s ease-in-out;
}

@keyframes scaleAndColorAnimation {
  0% {
    transform: scale(1);
    color: #1a1a1a;
  }
  50% {
    transform: scale(1.2);
    color: #e02020;
  }
  100% {
    transform: scale(1);
    color: #1a1a1a;
  }
}
</style>