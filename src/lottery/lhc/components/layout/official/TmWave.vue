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
          <div class="ball-number">
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
import { blueWave, greenWave, redWave } from '@/utils/common.ts';
import { wave } from "@/config/lottery/lhc/define/defineOfficialCode.js";
import { useOfficialLayoutLogic } from '@/lottery/lhc/components/layout/composables/useOfficialLayoutLogic.ts';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

function getBallColorClass(number) {
  if (redWave.includes(number)) return 'ball-red';
  if (blueWave.includes(number)) return 'ball-blue';
  if (greenWave.includes(number)) return 'ball-green';
  return '';
}

function calculateHotCold(range, history, ballsData, positions) {
  const hotCold = {};
  ballsData.forEach(ball => hotCold[ball.value] = 0);
  if (!history?.length) return hotCold;

  const recentIssues = history.slice(0, range);
  recentIssues.forEach(issue => {
    const codes = issue.code.split(',');
    const specialNum = String(codes[positions[0] - 1]).padStart(2, '0');
    if (specialNum) {
      if (redWave.includes(specialNum)) hotCold[0] += 1;
      if (blueWave.includes(specialNum)) hotCold[1] += 1;
      if (greenWave.includes(specialNum)) hotCold[2] += 1;
    }
  });

  return hotCold;
}

function calculateOmission(history, ballsData, positions) {
  const omission = {};
  ballsData.forEach(ball => omission[ball.value] = -1);
  if (!history?.length) return omission;

  for (let index = 0; index < history.length; index++) {
    const issue = history[index];
    const specialNum = String(issue.code.split(',')[positions[0] - 1]).padStart(2, '0');
    if (specialNum) {
      if (redWave.includes(specialNum) && omission[0] === -1) omission[0] = index;
      if (blueWave.includes(specialNum) && omission[1] === -1) omission[1] = index;
      if (greenWave.includes(specialNum) && omission[2] === -1) omission[2] = index;
    }
    if (!Object.values(omission).includes(-1)) break;
  }

  for (let key in omission) {
    omission[key] = omission[key] === -1 ? history.length : omission[key];
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