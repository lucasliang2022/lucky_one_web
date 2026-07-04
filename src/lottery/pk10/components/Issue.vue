<template>
  <div class="issue-container">
    <div class="lottery-icon">
      <img src="/images/lottery/ks180.png" alt="" />
    </div>
    <div class="last-issue">
      <div class="lottery-info">
        <p class="lottery-title">{{ name }}</p>
        <p class="last-issue-no">{{ issueLast.issue_no ? `${issueLast.issue_no}期` : '加载中...' }}</p>
        <p class="lottery-detail">
          <span class="icon-sd-info" style="font-size: 12px;"></span>
          游戏介绍
        </p>
      </div>
      <div class="voice-btn"></div>
      <div class="last-issue-code">
        <div class="last-issue-no">第<span class="issue-no-display">{{ issueLast.issue_no || '加载中...' }}</span>期</div>
        <div v-if="isOpening" class="code-container">
          <div class="ball-row">
            <div v-for="(randomRow, sIndex) in shuffledBallData" :key="sIndex" class="ball-item">
              <ul class="ul scroll-animating" :style="{ animationDuration: randomRow.seconds }" @animationend="onAnimationDone">
                <li v-for="(ball, index) in randomRow.randomBall" :key="index" class="code-ball" :class="ball.color">
                  {{ ball.number }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-else-if="issueLastCodeArr.length" class="code-container">
          <div class="ball-row">
            <div v-for="(item, idx) in issueLastCodeArr" :key="idx" class="ball-item">
              <div class="code-ball">
                {{ item.number }}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="isWaiting && waitRemainingTime > 0" class="wait-countdown">
          等待开奖: <span class="wait-countdown-number" :key="waitCountdown">{{ waitCountdown }}</span> 秒
        </div>
        <div v-else class="opening-text">
          {{ isWaiting ? '等待开奖中' : '开奖中' }}
        </div>
      </div>
    </div>
    <div class="current-issue">
      <div>
        <div class="current-issue-top flex items-center justify-between">
          <p class="current-issue-no">第<span class="issue-no-display">{{ issueCurrent.issue_no }}</span>期</p>
          <div class="lock-time">
            <div class="lock-time-title">销售中</div>
          </div>
        </div>
        <div class="open-countdown">
          <div class="flex items-center">
            <div class="open-countdown-time">
              <span class="countdown-time-number">{{ saleCountdown.hours.charAt(0) }}</span>
              <span class="countdown-time-number">{{ saleCountdown.hours.charAt(1) }}</span>
              <span class="countdown-time-gap">:</span>
              <span class="countdown-time-number">{{ saleCountdown.minutes.charAt(0) }}</span>
              <span class="countdown-time-number">{{ saleCountdown.minutes.charAt(1) }}</span>
              <span class="countdown-time-gap">:</span>
              <span class="countdown-time-number">{{ saleCountdown.seconds.charAt(0) }}</span>
              <span class="countdown-time-number">{{ saleCountdown.seconds.charAt(1) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { storeToRefs } from "pinia";

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const {
  issueLastCodeArr,
  issueCurrent,
  issueLast,
  name,
} = storeToRefs(props.store);

const { fetchIssueCurrent, fetchIssueLast, setIssueLast } = props.store;

const saleRemainingTime = ref(0);
let saleIntervalId = null;

const waitRemainingTime = ref(0);
const isWaiting = ref(false);
const isOpening = ref(false);
let waitIntervalId = null;
let historyPollId = null;

const animationBallData = ref([
  ["1", "2", "3", "4", "5", "7"],
  ["8", "9", "6", "3", "2", "1"],
  ["5", "8", "3", "0", "2", "9"],
  ["2", "7", "8", "4", "1", "9"],
  ["5", "4", "6", "9", "2", "0"]
]);

const shuffledBallData = computed(() => {
  const totalBalls = animationBallData.value.length;
  return animationBallData.value.map((group, index) => {
    const reverseIndex = totalBalls - index;
    return {
      randomBall: group.map((num) => ({
        number: num,
      })),
      seconds: `${(1.6449 / Math.sqrt(reverseIndex)).toFixed(5) - 0.1}s`,
    };
  });
});

function updateSaleCountdown() {
  if (!issueCurrent.value.end_time) return;
  const now = Math.floor(Date.now() / 1000);
  saleRemainingTime.value = Math.max(0, issueCurrent.value.end_time - now);
  if (saleRemainingTime.value === 0) {
    stopSaleCountdown();
    handleSaleCountdownEnd();
  }
}

function startSaleCountdown() {
  if (!saleIntervalId) {
    updateSaleCountdown();
    saleIntervalId = setInterval(updateSaleCountdown, 1000);
  }
}

function stopSaleCountdown() {
  if (saleIntervalId) {
    clearInterval(saleIntervalId);
    saleIntervalId = null;
  }
}

async function fetchNextIssue() {
  try {
    await fetchIssueCurrent();
    startSaleCountdown();
  } catch (error) {}
}

async function handleSaleCountdownEnd() {
  setIssueLast({ ...issueCurrent.value });
  await fetchNextIssue();
  startWaitCountdown();
}

const saleCountdown = computed(() => ({
  hours: Math.floor(saleRemainingTime.value / 3600).toString().padStart(2, '0'),
  minutes: Math.floor((saleRemainingTime.value % 3600) / 60).toString().padStart(2, '0'),
  seconds: (saleRemainingTime.value % 60).toString().padStart(2, '0'),
}));

function startWaitCountdown() {
  if (issueCurrent.value.wait_time) {
    waitRemainingTime.value = issueCurrent.value.wait_time;
    isWaiting.value = true;
    if (!waitIntervalId) {
      waitIntervalId = setInterval(() => {
        waitRemainingTime.value = Math.max(0, waitRemainingTime.value - 1);
        if (waitRemainingTime.value === 0) {
          stopWaitCountdown();
          pollIssueLast();
        }
      }, 1000);
    }
  } else {
    pollIssueLast();
  }
}

function stopWaitCountdown() {
  if (waitIntervalId) {
    clearInterval(waitIntervalId);
    waitIntervalId = null;
    isWaiting.value = false;
  }
}

function startLastIssueAnimation() {
  if (issueLast.value.code) {
    isOpening.value = true;
    animationBallData.value = animationBallData.value.map((row, index) => {
      const realBall = issueLastCodeArr.value[index % issueLastCodeArr.value.length];
      return [realBall.number, ...row];
    });
    setTimeout(() => {
      isOpening.value = false;
    }, 700);
  }
}

function onAnimationDone() {}

async function pollIssueLast() {
  try {
    const response = await fetchIssueLast();
    if (response && response.issue_no) {
      if (response.code) {
        issueLastCodeArr.value.length = 0;
        issueLastCodeArr.value.push(...response.code.split(',').map(num => ({ number: num })));
        startLastIssueAnimation();
        if (historyPollId) {
          clearTimeout(historyPollId);
          historyPollId = null;
        }
      } else {
        isWaiting.value = true;
        historyPollId = setTimeout(pollIssueLast, 2000);
      }
    }
  } catch (error) {
    isWaiting.value = true;
    historyPollId = setTimeout(pollIssueLast, 2000);
  }
}

const waitCountdown = computed(() => waitRemainingTime.value);

function checkInitialWaitTime() {
  const now = Math.floor(Date.now() / 1000);
  if (issueCurrent.value.end_time && issueCurrent.value.wait_time) {
    const endTime = issueCurrent.value.end_time;
    const waitEndTime = endTime + issueCurrent.value.wait_time;
    if (now >= endTime && now < waitEndTime) {
      waitRemainingTime.value = Math.max(0, waitEndTime - now);
      isWaiting.value = true;
      startWaitCountdown();
    } else {
      pollIssueLast();
    }
  } else {
    pollIssueLast();
  }
}

function triggerLotteryChange() {
  startSaleCountdown();
  checkInitialWaitTime();
}

watch(issueLastCodeArr, (newVal) => {
  if (newVal.length && !isOpening.value && !isWaiting.value) {
    startLastIssueAnimation();
  }
});

watch(
    () => props.store.sign,
    (newSign, oldSign) => {
      if (newSign !== oldSign) {
        triggerLotteryChange();
      }
    },
    { immediate: true }
);

onBeforeUnmount(() => {
  stopSaleCountdown();
  stopWaitCountdown();
  if (historyPollId) {
    clearTimeout(historyPollId);
    historyPollId = null;
  }
});
</script>

<style lang="scss" scoped>
.issue-container {
  margin-bottom: 0.325rem;
  display: flex;
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--color-gray-3);
  background-color: rgb(255 255 255);
  padding: 0.625rem;
}

.lottery-icon {
  height: 72px;
  width: 72px;
}

.lottery-icon img {
  width: 100%;
  height: 100%;
}

.last-issue {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lottery-info {
  margin-left: 15px;
}

.lottery-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--color-txt-primary);
}

.last-issue-no {
  font-size: 0.75rem;
  color: var(--color-txt-secondary);
}

.lottery-detail {
  margin-top: 0.125rem;
  display: flex;
  cursor: pointer;
  align-items: center;
  column-gap: 5px;
  font-size: 0.75rem;
  color: var(--color-primary-1);
}

.last-issue-code .last-issue-no {
  font-size: 0.875rem;
  color: var(--color-txt-secondary);
  text-align: center;
  margin-bottom: 5px;
}

.code-container .ball-row {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
  justify-content: center;
  row-gap: .125rem;
  column-gap: .375rem;
}

.opening-text {
  font-size: 1.3rem;
  color: var(--color-txt-secondary);
  text-align: center;
  width: 100%;
}

.wait-countdown {
  margin-top: 5px;
  font-size: 1.3rem;
  color: #1c9eff;
  text-align: center;
}

.wait-countdown-number {
  display: inline-block;
  color: #ff5722; /* 橙红色，与 #1c9eff 区分 */
  font-weight: bold;
}

.wait-countdown-number {
  animation: scale-down 0.3s ease-in-out;
}

.voice-btn {
  margin-left: 33px;
  height: 30px;
  width: 30px;
  transform: translateY(0.25rem);
  cursor: pointer;
  color: var(--color-txt-secondary);
}

.current-issue {
  margin-left: auto;
}

.current-issue-top .current-issue-no {
  margin-right: 1.25rem;
  white-space: nowrap;
  font-size: 0.875rem;
  color: var(--color-txt-secondary);
}

.lock-time {
  font-size: 0.875rem;
}

.lock-time-title {
  margin-right: 5px;
  display: inline-block;
  color: green;
}

.open-countdown {
  margin-top: 0.625rem;
  font-size: 0.875rem;
}

.open-countdown-time {
  display: flex;
  flex: 1 1 0%;
  align-items: center;
  justify-content: center;
  column-gap: 3px;
  text-align: center;
  font-size: 22px;
}

.countdown-time-number {
  height: 2.25rem;
  width: 1.75rem;
  border-radius: 0.25rem;
  background-color: var(--color-txt-primary);
  text-align: center;
  line-height: 2.25rem;
  color: rgb(255 255 255);
}

.countdown-time-gap {
  padding: 0 0.25rem;
  font-weight: 500;
}

.code-ball {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border: 2px solid #1e88e5;
  transition: all 0.3s ease-in-out;
}

.issue-no-display {
  font-weight: 600;
  margin: 0 3px;
  font-size: 16px;
}

.scroll-animating {
  animation: scroll-animation 1s linear forwards;
  height: 30px;
  overflow: hidden;
}

@keyframes scroll-animation {
  0% {
    transform: translateY(-150px) scale(1.2);
    opacity: 0;
  }
  50% {
    transform: translateY(-50px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

@keyframes scale-down {
  0% {
    transform: scale(1.5);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>