<template>
  <ul class="ball-show-area">
    <li class="ball-row">
      <div class="row-ball-list">
        <div class="ball" v-for="(ball, idx) in balls" :key="idx">
          <div
              class="ball-item ball-rectangle"
              :class="{ selected: ball.selected, animated: ball.animating, 'zoomIn': ball.animating }"
              @click="toggleBall(ball)"
          >
            <div class="content-wrapper">
              <div class="show-number">
                <b>{{ ball.title }}</b>
              </div>
              <div class="show-price" v-if="ball.prize !== undefined && ball.prize !== null">
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
    </li>
  </ul>
</template>

<script setup>
import { useOfficialLayoutLogic } from '@/lottery/lhc/components/layout/composables/useOfficialLayoutLogic.ts';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

function getNumber(issue, positions) {
  if (!positions || !positions.length) return { 0: false, 1: false, 2: false, 3: false };

  const codeArray = issue.code.split(',');
  let sum = 0;

  for (const pos of positions) {
    const numStr = codeArray[pos - 1];
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return { 0: false, 1: false, 2: false, 3: false };
    sum += num;
  }

  return {
    0: sum > 175,
    1: sum < 175,
    2: sum % 2 !== 0,
    3: sum % 2 === 0
  };
}

function calculateHotCold(range, history, ballsData, positions) {
  const hotCold = { 0: 0, 1: 0, 2: 0, 3: 0 };
  if (!history?.length) return hotCold;

  const recentIssues = history.slice(0, range);
  recentIssues.forEach(issue => {
    const stat = getNumber(issue, positions);
    if (!stat) return;

    if (stat[0]) hotCold[0]++;
    if (stat[1]) hotCold[1]++;
    if (stat[2]) hotCold[2]++;
    if (stat[3]) hotCold[3]++;
  });

  return hotCold;
}

function calculateOmission(history, ballsData, positions) {
  const omission = { 0: -1, 1: -1, 2: -1, 3: -1 };
  let foundCount = 0;
  const totalIssues = history?.length || 0;

  if (!history?.length) return omission;

  for (let i = 0; i < totalIssues; i++) {
    const issue = history[i];
    const stat = getNumber(issue, positions);
    if (!stat) continue;

    if (stat[0] && omission[0] === -1) { omission[0] = i; foundCount++; }
    if (stat[1] && omission[1] === -1) { omission[1] = i; foundCount++; }
    if (stat[2] && omission[2] === -1) { omission[2] = i; foundCount++; }
    if (stat[3] && omission[3] === -1) { omission[3] = i; foundCount++; }

    if (foundCount === 4) break;
  }

  for (const key in omission) {
    if (omission[key] === -1) {
      omission[key] = totalIssues;
    }
  }

  return omission;
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
  padding: 10px;
}

.ball-row {
  display: flex;
  align-items: center;
  width: 680px;
  margin-bottom: 16px;
}

.row-ball-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
}

.ball {
  position: relative;
  flex-basis: calc(25% - 10px);
  max-width: 130px;
  cursor: pointer;
}

.ball-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 65px;
  background: #fff;
  border: 1px solid #e1e6ea;

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .show-number {
    margin-bottom: 4px;
  }

  b {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>