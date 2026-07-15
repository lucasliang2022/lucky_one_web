<template>
  <div class="ball-show-area">
    <div class="ball" v-for="(ball, index) in balls" :key="index">
      <div
          class="ball-item ball-rectangle"
          :class="{ selected: ball.selected, animated: ball.animating, 'zoomIn': ball.animating }"
          @click="toggleBall(ball)"
      >
        <div class="wave-title">
          <b :class="ball.colorClass">{{ ball.title }}</b>
          <div class="ball-number" v-if="ball.numbers.length > 0">
            <span v-for="num in ball.numbers" :key="num">
              <span class="ball-small ball-circle" :class="getBallColorClass(num)">{{ num }}</span>
            </span>
          </div>
        </div>
        <div class="content-wrapper">
          <div class="show-number"></div>
          <div class="show-price">
            <span>{{ ball.prize }}</span>
          </div>
        </div>
        <div class="show-chm" v-if="showColdHot || showOmission">
          <span class="ball-ch chm" v-if="showColdHot && hotColdData[ball.value] !== null">
            <span :class="getHotColdClass(hotColdData[ball.value])">{{ hotColdData[ball.value] ?? 0 }}</span>
          </span>
          <span class="ball-m chm" v-if="showOmission && omissionData[ball.value] !== null">
            <span :class="getOmissionClass(omissionData[ball.value])">{{ omissionData[ball.value] ?? 0 }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { blueWave, greenWave, redWave } from '@shared/utils/common.ts';
import { useOfficialLayoutLogic } from '@shared/lottery/lhc/components/layout/composables/useOfficialLayoutLogic.ts';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

function getWaveIndex(numberStr) {
  if (redWave.includes(numberStr)) return 0;
  if (blueWave.includes(numberStr)) return 1;
  if (greenWave.includes(numberStr)) return 2;
  return 3;
}

function getBallColorClass(number) {
  if (redWave.includes(number)) return 'ball-red';
  if (blueWave.includes(number)) return 'ball-blue';
  if (greenWave.includes(number)) return 'ball-green';
  return '';
}

function getIssueResult(issue) {
  if (!issue || !issue.code) return null;
  const codes = issue.code.split(',');
  if (codes.length < 7) return null;

  const regularCodes = codes.slice(0, 6);
  const specialCode = codes[6];

  const waveCount = { 0: 0, 1: 0, 2: 0 };
  let regularCounts = { 0: 0, 1: 0, 2: 0 };

  regularCodes.forEach(numStr => {
    const waveIndex = getWaveIndex(numStr);
    if (waveIndex !== null && waveIndex !== 3) {
      waveCount[waveIndex] += 1;
      regularCounts[waveIndex] += 1;
    }
  });

  const specialWaveIndex = getWaveIndex(specialCode);
  if (specialWaveIndex !== null && specialWaveIndex !== 3) {
    waveCount[specialWaveIndex] += 1.5;
  }

  const isDraw1 = regularCounts[1] === 3 && regularCounts[2] === 3 && specialWaveIndex === 0;
  const isDraw2 = regularCounts[1] === 3 && regularCounts[0] === 3 && specialWaveIndex === 2;
  const isDraw3 = regularCounts[0] === 3 && regularCounts[2] === 3 && specialWaveIndex === 1;

  if (isDraw1 || isDraw2 || isDraw3) {
    return 3; // 和局
  }

  let maxCount = -1;
  let winningWave = null;
  let isTie = false;
  let winners = [];

  for (const waveIndex in waveCount) {
    const currentWaveIndex = parseInt(waveIndex, 10);
    if (waveCount[currentWaveIndex] > maxCount) {
      maxCount = waveCount[currentWaveIndex];
      winningWave = currentWaveIndex;
      winners = [currentWaveIndex];
      isTie = false;
    } else if (waveCount[currentWaveIndex] === maxCount) {
      winners.push(currentWaveIndex);
      isTie = true;
    }
  }

  if (isTie) {
    return 3;
  }

  return winningWave;
}

function calculateHotCold(range, history, ballsData, positions) {
  const currentHotCold = { 0: 0, 1: 0, 2: 0, 3: 0 };
  if (!history?.length) {
    return currentHotCold;
  }

  const recentIssues = history.slice(0, range);
  recentIssues.forEach(issue => {
    const result = getIssueResult(issue);
    if (result !== null) {
      currentHotCold[result]++;
    }
  });

  return currentHotCold;
}

function calculateOmission(history, ballsData, positions) {
  const currentOmission = { 0: -1, 1: -1, 2: -1, 3: -1 };
  let foundCount = 0;
  const totalIssues = history?.length || 0;

  if (!history?.length) {
    return currentOmission;
  }

  for (let i = 0; i < totalIssues; i++) {
    const result = getIssueResult(history[i]);
    if (result !== null && currentOmission[result] === -1) {
      currentOmission[result] = i;
      foundCount++;
    }
    if (foundCount === 4) break;
  }

  for (const key in currentOmission) {
    if (currentOmission[key] === -1) {
      currentOmission[key] = totalIssues;
    }
  }
  return currentOmission;
}

const {
  balls,
  hotColdData,
  omissionData,
  toggleBall,
  randomOneBet,
  showColdHot,
  showOmission,
  getHotColdClass,
  getOmissionClass
} = useOfficialLayoutLogic(props.store, {
  calculateHotColdFn: calculateHotCold,
  calculateOmissionFn: calculateOmission
});

defineExpose({ randomOneBet });
</script>

<style lang="scss" scoped>
.ball-show-area {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
}

.ball {
  position: relative;
  cursor: pointer;
}

.ball-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 20px 35px;
  border: 1px solid #e1e6ea;

  .wave-title {
    white-space: nowrap;
    display: flex;
    align-items: center;

    b {
      font-size: 16px;
      font-weight: bold;
    }

    .ball-number {
      display: flex;
      margin-left: 10px;
      gap: 4px;
    }
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .show-number {
      margin-bottom: 4px;
    }
  }
}
</style>