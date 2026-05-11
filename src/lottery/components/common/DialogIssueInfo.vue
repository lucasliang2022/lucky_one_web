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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const { issueCurrent, sign, name } = storeToRefs(props.store);
const { fetchIssueCurrent } = props.store;

const countdownTime = ref('00:00');
const remainingSeconds = ref(0);
const isBetting = ref(true);
let countdownTimer = null;

const issueNo = computed(() => issueCurrent.value?.issue_no);

const updateCountdown = async () => {
  if (!issueCurrent.value || !issueCurrent.value.sale_end_time) {
    countdownTime.value = '00:00';
    isBetting.value = false;
    await fetchIssueCurrent(sign.value);
    return;
  }

  const now = Math.floor(Date.now() / 1000);
  const endTime = issueCurrent.value.sale_end_time;
  const remaining = Math.max(0, endTime - now);

  if (remaining <= 0) {
    isBetting.value = false;
    countdownTime.value = '00:00';
    await fetchIssueCurrent(sign.value);
    console.log('Issue updated to:', issueCurrent.value?.issue_no);
    return;
  }

  const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
  const seconds = (remaining % 60).toString().padStart(2, '0');
  countdownTime.value = `${minutes}:${seconds}`;
  remainingSeconds.value = remaining;
  isBetting.value = true;
};

const startCountdown = () => {
  updateCountdown();
  countdownTimer = setInterval(async () => {
    await updateCountdown();
  }, 1000);
};

const stopCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
};

onMounted(() => {
  startCountdown();
});

onUnmounted(() => {
  stopCountdown();
});
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