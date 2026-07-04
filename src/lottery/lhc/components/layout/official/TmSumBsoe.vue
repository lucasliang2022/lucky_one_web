<template>
  <div class="ball-show-area tm-bsoe-sum">
    <div class="row-ball-list">
      <div class="ball" v-for="(ball) in balls" :key="ball.value">
        <div
            class="ball-item ball-rectangle"
            :class="{ selected: ball.selected, animated: ball.animating, 'zoomIn': ball.animating }"
            @click="toggleBall(ball)"
        >
          <div class="content-wrapper">
            <div class="show-number">
              <b>{{ ball.title }}</b>
            </div>
            <div class="show-price" v-if="ball.prize">
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
  </div>
</template>

<script setup>
import { useOfficialLayoutLogic } from '@/lottery/lhc/components/layout/composables/useOfficialLayoutLogic.ts';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const getSumCondition = (codeValue) => {
  const num = parseInt(codeValue);
  if (isNaN(num) || num < 1 || num > 48) {
    return { isSumBig: false, isSumSmall: false, isSumOdd: false, isSumEven: false };
  }
  const tens = Math.floor(num / 10);
  const ones = num % 10;
  const sum = tens + ones;

  return {
    isSumBig: sum >= 7 && sum <= 12,
    isSumSmall: sum >= 1 && sum <= 6,
    isSumOdd: sum % 2 !== 0,
    isSumEven: sum % 2 === 0
  };
};

function calculateSpecificHotCold(range, history, ballsData, positions) {
  const results = { 0: 0, 1: 0, 2: 0, 3: 0 };
  if (!history || history.length === 0 || !positions || positions.length === 0) {
    return results;
  }
  const recentIssues = history.slice(0, range);
  recentIssues.forEach(issue => {
    const codes = issue.code.split(',');
    const targetCode = codes[positions[0] - 1];
    if (targetCode) {
      const conditions = getSumCondition(targetCode);
      if (conditions.isSumBig) results[0]++;
      if (conditions.isSumSmall) results[1]++;
      if (conditions.isSumOdd) results[2]++;
      if (conditions.isSumEven) results[3]++;
    }
  });
  return results;
}

function calculateSpecificOmission(history, ballsData, positions) {
  const results = { 0: 0, 1: 0, 2: 0, 3: 0 };
  if (!history || history.length === 0 || !positions || positions.length === 0) {
    return results;
  }
  const found = { 0: false, 1: false, 2: false, 3: false };

  for (let i = 0; i < history.length; i++) {
    const issue = history[i];
    const codes = issue.code.split(',');
    const targetCode = codes[positions[0] - 1];

    if (targetCode) {
      const conditions = getSumCondition(targetCode);

      if (conditions.isSumBig && !found[0])   { results[0] = i; found[0] = true; }
      if (conditions.isSumSmall && !found[1]) { results[1] = i; found[1] = true; }
      if (conditions.isSumOdd && !found[2])   { results[2] = i; found[2] = true; }
      if (conditions.isSumEven && !found[3])  { results[3] = i; found[3] = true; }
    }

    Object.keys(found).forEach(key => {
      if (!found[key]) {
        results[key] = i + 1;
      }
    });

    if (Object.values(found).every(f => f)) break;
  }

  Object.keys(found).forEach(key => {
    if (!found[key]) {
      results[key] = history.length;
    }
  });

  return results;
}

const {
  balls,
  hotColdData,
  omissionData,
  toggleBall,
  randomOneBet,
  getHotColdClass,
  getOmissionClass,
  showColdHot,
  showOmission
} = useOfficialLayoutLogic(props.store, {
  calculateHotColdFn: calculateSpecificHotCold,
  calculateOmissionFn: calculateSpecificOmission
});

defineExpose({ randomOneBet });
</script>

<style lang="scss" scoped>
.ball-show-area {
  padding: 10px;
}

.row-ball-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: flex-start;
}

.ball {
  position: relative;
  width: 145px;
  margin-bottom: 18px;
  flex: 0 0 auto;
  cursor: pointer;
}

.ball-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
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