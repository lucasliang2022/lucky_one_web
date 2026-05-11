<template>
  <div class="ball-show-area">
    <div class="ball" v-for="(ball, idx) in balls" :key="idx">
      <div
          class="ball-item ball-rectangle"
          :class="{ selected: ball.selected, animated: ball.animating, 'zoomIn': ball.animating }"
          @click="toggleBall(ball)"
      >
        <div class="ball-animate-wrapper">
          <div class="content-wrapper">
            <div class="show-number">
              <b>{{ ball.title }}</b>
            </div>
            <div class="show-price"></div> <!-- Placeholder for show-price -->
          </div>
          <div class="show-zodiac">
            <span v-for="(zodiac, index) in ball.zodiac" :key="index" class="zodiac-item">
              {{ zodiacNames[zodiac] }}
            </span>
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
import { useOfficialLayoutLogic } from '@/components/lottery/lhc/layout/composables/useOfficialLayoutLogic.ts';
import { storeToRefs } from 'pinia';
import { zodiacStat } from "@/config/lottery/lhc/define/defineOfficialCode.js";

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const {
  zodiacMap,
  zodiacNames,
  numberToZodiac
} = storeToRefs(props.store);

function calculateHotCold(range, history, ballsData, positions) {
  if (!history?.length || !zodiacMap.value || Object.keys(zodiacMap.value).length === 0) {
    return ballsData.reduce((acc, ball) => ({ ...acc, [ball.value]: 0 }), {});
  }

  const recentIssues = history.slice(0, range);
  const hotCold = {};

  ballsData.forEach(ball => {
    hotCold[ball.value] = 0;
  });

  recentIssues.forEach(issue => {
    const specialNum = issue.code.split(',')[6];
    console.log(specialNum);
    if (specialNum && specialNum !== '49') {
      const zodiacKey = numberToZodiac.value[specialNum]?.no;
      if (zodiacKey !== undefined) {
        ballsData.forEach(ball => {
          if (ball.zodiac.includes(zodiacKey)) {
            hotCold[ball.value] += 1;
          }
        });
      }
    }
  });

  return hotCold;
}

function calculateOmission(history, ballsData, positions) {
  if (!history?.length || !zodiacMap.value || Object.keys(zodiacMap.value).length === 0) {
    return ballsData.reduce((acc, ball) => ({ ...acc, [ball.value]: -1 }), {});
  }

  const omission = {};
  ballsData.forEach(ball => omission[ball.value] = -1);

  for (let index = 0; index < history.length; index++) {
    const issue = history[index];
    const specialNum = String(issue.code.split(',')[6]).padStart(2, '0');
    if (specialNum && specialNum !== '49') {
      const zodiacKey = numberToZodiac.value[specialNum]?.no;
      if (zodiacKey !== undefined) {
        ballsData.forEach(ball => {
          if (ball.zodiac.includes(zodiacKey) && omission[ball.value] === -1) {
            omission[ball.value] = index;
          }
        });
      }
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
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(2, 320px);
  grid-auto-rows: auto;
  gap: 15px;
  justify-content: flex-start;
  width: fit-content;
}

.ball {
  position: relative;
  cursor: pointer;
}

.ball-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 320px;
  background: #fff;
  border: 1px solid #e1e6ea;
  padding: 15px;

  .ball-animate-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .show-number {
    margin-bottom: 4px;

    b {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .show-zodiac {
    font-size: 14px;
    color: #179dff;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 5px;
    justify-content: center;

    .zodiac-item {
      padding: 2px 5px;
      background: #f5f5f5;
      border-radius: 4px;
      font-size: 12px;
      color: #179dff;
    }
  }
}
</style>