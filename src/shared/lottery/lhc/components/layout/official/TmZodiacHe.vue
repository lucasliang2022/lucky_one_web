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
                <div class="ball-number">
                  <span v-for="numItem in ball.numbers" :key="numItem.number">
                    <span class="ball-small ball-circle" :class="numItem.color">{{ numItem.number }}</span>
                  </span>
                </div>
              </div>
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
    </li>
  </ul>
</template>

<script setup>
import { useOfficialLayoutLogic } from '@shared/lottery/lhc/components/layout/composables/useOfficialLayoutLogic.ts';
import { storeToRefs } from 'pinia';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const { zodiacMap } = storeToRefs(props.store);

function calculateHotCold(range, history, ballsData, positions) {
  if (!history?.length || !zodiacMap.value || Object.keys(zodiacMap.value).length === 0) {
    console.warn('zodiacMap is not initialized or history is empty');
    return ballsData.reduce((acc, ball) => ({ ...acc, [ball.value]: 0 }), {});
  }

  const recentIssues = history.slice(0, range);
  const hotCold = {};

  ballsData.forEach(ball => {
    hotCold[ball.value] = 0;
  });

  recentIssues.forEach(issue => {
    const specialNum = issue.code.split(',')[6];
    if (specialNum) {
      const zodiac = Object.entries(zodiacMap.value).find(([_, data]) => data.numbers.includes(specialNum));
      if (zodiac) {
        const zodiacKey = zodiac[0];
        if (hotCold[zodiacKey] !== undefined) {
          hotCold[zodiacKey] += 1;
        }
      }
    }
  });

  return hotCold;
}

function calculateOmission(history, ballsData, positions) {
  if (!history?.length || !zodiacMap.value || Object.keys(zodiacMap.value).length === 0) {
    console.warn('zodiacMap is not initialized or history is empty');
    return ballsData.reduce((acc, ball) => ({ ...acc, [ball.value]: -1 }), {});
  }

  const omission = {};
  ballsData.forEach(ball => omission[ball.value] = -1);

  for (let index = 0; index < history.length; index++) {
    const issue = history[index];
    const specialNum = issue.code.split(',')[6];
    if (specialNum) {
      const zodiac = Object.entries(zodiacMap.value).find(([_, data]) => data.numbers.includes(specialNum));
      if (zodiac) {
        const zodiacKey = zodiac[0];
        if (omission[zodiacKey] === -1) {
          omission[zodiacKey] = index;
        }
      }
    }
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
  getHotColdClass,
  getOmissionClass,
  showColdHot,
  showOmission
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
  justify-content: center;
  flex-wrap: wrap;
  flex: 1;
}

.row-ball-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: flex-start;
}

.ball {
  position: relative;
  width: 270px;
  margin-bottom: 15px;
  flex: 0 0 auto;
  cursor: pointer;
}

.ball-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70px;
  background: #fff;
  padding: 0 20px;
  border: 1px solid #e1e6ea;

  .content-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .show-number {
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
}
</style>