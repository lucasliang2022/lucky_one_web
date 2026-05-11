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
  </div>
</template>

<script setup>
import { useOfficialLayoutLogic } from '@/components/lottery/lhc/layout/composables/useOfficialLayoutLogic.ts';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const { getZodiacKey } = props.store;

function calculateHotCold(range, history, ballsData, positions) {
  const hotCold = {};
  ballsData.forEach(ball => hotCold[ball.value] = 0);
  if (!history?.length) return hotCold;

  const recentIssues = history.slice(0, range);
  recentIssues.forEach(issue => {
    const codes = issue.code.split(',');
    const zodiacSet = new Set();

    positions.forEach(pos => {
      const num = codes[pos - 1];
      const zodiacKey = getZodiacKey(num);
      if (zodiacKey) zodiacSet.add(zodiacKey);
    });

    const uniqueZodiacCount = zodiacSet.size - 2;
    if (uniqueZodiacCount >= 0 && uniqueZodiacCount <= 5) {
      hotCold[uniqueZodiacCount]++;
    }
  });

  return hotCold;
}

function calculateOmission(history, ballsData, positions) {
  const omission = {};
  ballsData.forEach(ball => omission[ball.value] = -1);
  if (!history?.length) return omission;

  const found = {};
  ballsData.forEach(ball => found[ball.value] = false);
  const totalIssues = history.length;

  for (let i = 0; i < totalIssues; i++) {
    const issue = history[i];
    const codes = issue.code.split(',');
    const zodiacSet = new Set();

    positions.forEach(pos => {
      const num = codes[pos - 1];
      const zodiacKey = getZodiacKey(num);
      if (zodiacKey) zodiacSet.add(zodiacKey);
    });

    const uniqueZodiacCount = zodiacSet.size - 2;
    if (uniqueZodiacCount >= 0 && uniqueZodiacCount <= 5 && !found[uniqueZodiacCount]) {
      omission[uniqueZodiacCount] = i;
      found[uniqueZodiacCount] = true;
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
  display: grid;
  grid-template-columns: repeat(6, 130px);
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
  width: 130px;
  background: #fff;
  border: 1px solid #e1e6ea;
  padding: 15px;
}

.ball-animate-wrapper {
  display: flex;
  flex-direction: column;
}

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
</style>