<template>
  <ul class="ball-show-area">
    <li class="ball-row row-1">
      <div class="row-section">
        <div class="row-ball-list">
          <div class="ball" v-for="(ball, idx) in balls" :key="idx">
            <div
                class="ball-item ball-rectangle"
                :class="{ selected: ball.selected, animated: ball.animating, 'zoomIn': ball.animating }"
                @click="toggleBall(ball)"
            >
              <div class="content-wrapper">
                <div class="show-number">
                  <b :class="ball.colorClass">{{ ball.title }}</b>
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
      </div>
    </li>
  </ul>
</template>

<script setup>
import { redWave, greenWave, blueWave } from "@/utils/common.ts";
import { useOfficialLayoutLogic } from '@/lottery/lhc/components/layout/composables/useOfficialLayoutLogic.ts';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

function calculateHotCold(range, history, ballsData, positions) {
  const hotCold = {};
  ballsData.forEach(ball => hotCold[ball.value] = 0);
  if (!history?.length) return hotCold;

  const recentIssues = history.slice(0, range);
  recentIssues.forEach(issue => {
    const codes = issue.code.split(',');
    const posIndex = positions[0] - 1;
    const drawnNum = codes[posIndex];

    if (!drawnNum) return;

    let drawnColor = -1;
    if (redWave.includes(drawnNum)) drawnColor = 0;
    else if (blueWave.includes(drawnNum)) drawnColor = 1;
    else if (greenWave.includes(drawnNum)) drawnColor = 2;

    if (drawnColor !== -1 && hotCold[drawnColor] !== undefined) {
      hotCold[drawnColor]++;
    }
  });

  return hotCold;
}

function calculateOmission(history, ballsData, positions) {
  const omission = {};
  const found = {};
  ballsData.forEach(ball => {
    omission[ball.value] = -1;
    found[ball.value] = false;
  });
  const totalIssues = history?.length || 0;

  if (!history?.length) return omission;

  for (let i = 0; i < totalIssues; i++) {
    const issue = history[i];
    const codes = issue.code.split(',');
    const posIndex = positions[0] - 1;
    const drawnNum = codes[posIndex];

    if (!drawnNum) continue;

    let drawnColor = -1;
    if (redWave.includes(drawnNum)) drawnColor = 0;
    else if (blueWave.includes(drawnNum)) drawnColor = 1;
    else if (greenWave.includes(drawnNum)) drawnColor = 2;

    if (drawnColor !== -1 && !found[drawnColor]) {
      omission[drawnColor] = i;
      found[drawnColor] = true;
    }

    if (Object.values(found).every(f => f)) break;
  }

  ballsData.forEach(ball => {
    if (!found[ball.value]) {
      omission[ball.value] = totalIssues;
    }
  });

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
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.row-section {
  display: flex;
  align-items: center;
  width: 50%;
}

.row-ball-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.ball {
  position: relative;
  flex-basis: calc(33.33% - 10px);
  max-width: 120px;
  cursor: pointer;
}

.ball-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 70px;
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

    b {
      font-size: 16px;
      font-weight: bold;
    }

    .red-wave {
      color: #e53935;
    }
    .blue-wave {
      color: #1e88e5;
    }
    .green-wave {
      color: #43a047;
    }
  }
}
</style>