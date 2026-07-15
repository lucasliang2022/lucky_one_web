<template>
  <ul class="ball-show-area">
    <li class="ball-row head">
      <div class="row-ball-list">
        <div class="ball" v-for="(ball) in headBalls" :key="ball.value">
          <div
              class="ball-item ball-rectangle"
              :class="[
                ball.colorClass,
                { selected: ball.selected, animated: ball.animating, 'zoomIn': ball.animating }
              ]"
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
    </li>
    <li class="ball-row tail">
      <div class="row-ball-list">
        <div class="ball" v-for="(ball) in tailBalls" :key="ball.value">
          <div
              class="ball-item ball-rectangle"
              :class="[
                ball.colorClass,
                { selected: ball.selected, animated: ball.animating, 'zoomIn': ball.animating }
              ]"
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
    </li>
  </ul>
</template>

<script setup>
import { computed } from "vue";
import { useOfficialLayoutLogic } from '@shared/lottery/lhc/components/layout/composables/useOfficialLayoutLogic.ts';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const getBsoeCondition = (codeValue) => {
  const num = parseInt(codeValue);
  if (isNaN(num) || num < 1 || num > 48) {
    return { isBig: false, isSmall: false, isOdd: false, isEven: false };
  }
  return {
    isBig: num >= 25,
    isSmall: num <= 24,
    isOdd: num % 2 !== 0,
    isEven: num % 2 === 0
  };
};

function calculateSpecificHotCold(range, history, ballsData, positions) {
  const results = {};
  ballsData.forEach(ball => results[ball.value] = 0);
  if (!history || history.length === 0 || !positions || positions.length === 0) {
    return results;
  }
  const recentIssues = history.slice(0, range);
  recentIssues.forEach(issue => {
    const codes = issue.code.split(',');
    const targetCode = codes[positions[0] - 1];
    if (targetCode) {
      const conditions = getBsoeCondition(targetCode);
      if (conditions.isBig)   results[0]++;
      if (conditions.isSmall) results[1]++;
      if (conditions.isOdd)   results[2]++;
      if (conditions.isEven)  results[3]++;
      if (conditions.isBig && conditions.isOdd)   results[4]++;
      if (conditions.isSmall && conditions.isOdd) results[5]++;
      if (conditions.isBig && conditions.isEven)  results[6]++;
      if (conditions.isSmall && conditions.isEven) results[7]++;
    }
  });
  return results;
}

function calculateSpecificOmission(history, ballsData, positions) {
  const results = {};
  ballsData.forEach(ball => results[ball.value] = 0);
  if (!history || history.length === 0 || !positions || positions.length === 0) {
    return results;
  }
  const found = {};
  ballsData.forEach(ball => found[ball.value] = false);

  for (let i = 0; i < history.length; i++) {
    const issue = history[i];
    const codes = issue.code.split(',');
    const targetCode = codes[positions[0] - 1];

    if (targetCode) {
      const conditions = getBsoeCondition(targetCode);
      if (conditions.isBig && !found[0])     { results[0] = i; found[0] = true; }
      if (conditions.isSmall && !found[1])   { results[1] = i; found[1] = true; }
      if (conditions.isOdd && !found[2])     { results[2] = i; found[2] = true; }
      if (conditions.isEven && !found[3])    { results[3] = i; found[3] = true; }
      if (conditions.isBig && conditions.isOdd && !found[4])   { results[4] = i; found[4] = true; }
      if (conditions.isSmall && conditions.isOdd && !found[5]) { results[5] = i; found[5] = true; }
      if (conditions.isBig && conditions.isEven && !found[6])  { results[6] = i; found[6] = true; }
      if (conditions.isSmall && conditions.isEven && !found[7]) { results[7] = i; found[7] = true; }
    }

    ballsData.forEach(ball => {
      if (!found[ball.value]) {
        results[ball.value] = i + 1;
      }
    });

    if (Object.values(found).every(f => f)) break;
  }

  ballsData.forEach(ball => {
    if (!found[ball.value]) {
      results[ball.value] = history.length;
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

const headBalls = computed(() => balls.value.filter(ball => ball.row === 1));
const tailBalls = computed(() => balls.value.filter(ball => ball.row === 2));

defineExpose({ randomOneBet });
</script>

<style lang="scss" scoped>
.ball-show-area {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ball-row {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.row-ball-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 15px;
  justify-content: flex-start;
}

.ball {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
  position: relative;
  margin-bottom: 18px;
  width: 145px;
  flex: 0 0 auto;
}

.ball-item {
  position: relative;
  width: 100%;
  height: 65px;
  background: #fff;
  border: 1px solid #e1e6ea;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .show-number {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  b {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>