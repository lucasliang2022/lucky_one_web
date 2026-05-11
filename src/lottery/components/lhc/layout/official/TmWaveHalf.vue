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
import { waveHalf } from "@/config/lottery/lhc/define/defineOfficialCode.js";
import { useOfficialLayoutLogic } from '@/components/lottery/lhc/layout/composables/useOfficialLayoutLogic.ts';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

function calculateShape(number) {
  let shape = { wave: '', size: '', parity: '' };

  if (redWave.includes(number)) shape.wave = 'r';
  else if (blueWave.includes(number)) shape.wave = 'b';
  else if (greenWave.includes(number)) shape.wave = 'g';

  const num = parseInt(number);
  shape.size = num >= 25 ? 'b' : 's';
  shape.parity = num % 2 === 1 ? 'o' : 'e';

  return {
    sizeType: `${shape.wave}${shape.size}`,
    parityType: `${shape.wave}${shape.parity}`
  };
}

function calculateHotCold(range, history, ballsData, positions) {
  if (!history?.length) {
    return ballsData.reduce((acc, ball) => ({ ...acc, [ball.value]: 0 }), {});
  }

  const recentIssues = history.slice(0, range);
  const hotCold = {};

  ballsData.forEach(ball => {
    hotCold[ball.value] = 0;
  });

  recentIssues.forEach(issue => {
    const number = issue.code.split(',')[positions[0] - 1];
    if (!number || number === "49") return;

    const shape = calculateShape(number);
    const types = [shape.sizeType, shape.parityType];

    ballsData.forEach(ball => {
      if (types.includes(ball.sign)) {
        hotCold[ball.value] += 1;
      }
    });
  });

  return hotCold;
}

function calculateOmission(history, ballsData, positions) {
  if (!history?.length) {
    return ballsData.reduce((acc, ball) => ({ ...acc, [ball.value]: -1 }), {});
  }

  const omission = {};
  ballsData.forEach(ball => omission[ball.value] = -1);

  for (let index = 0; index < history.length; index++) {
    const issue = history[index];
    const number = issue.code.split(',')[positions[0] - 1];
    if (!number || number === "49") continue;

    const shape = calculateShape(number);
    const types = [shape.sizeType, shape.parityType];

    ballsData.forEach(ball => {
      if (types.includes(ball.sign) && omission[ball.value] === -1) {
        omission[ball.value] = index;
      }
    });

    if (!Object.values(omission).includes(-1)) break;
  }

  for (let key in omission) {
    omission[key] = omission[key] === -1 ? history.length : omission[key];
  }

  return omission;
}

function getBallColorClass(number) {
  if (redWave.includes(number)) return 'ball-red';
  if (blueWave.includes(number)) return 'ball-blue';
  if (greenWave.includes(number)) return 'ball-green';
  return '';
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  padding: 15px;
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