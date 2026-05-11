<template>
  <ul class="ball-show-area">
    <li class="ball-row">
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
import { storeToRefs } from 'pinia';
import { useOfficialLayoutLogic } from '@/components/lottery/lhc/layout/composables/useOfficialLayoutLogic.ts';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const { zodiacMap } = storeToRefs(props.store);

function calculateSpecificHotCold(range, history, ballsData, positions) {
  const results = {};
  ballsData.forEach(ball => results[ball.value] = 0);
  if (!history || history.length === 0 || !positions || positions.length === 0) {
    return results;
  }
  const recentIssues = history.slice(0, range);
  const currentZodiacMap = zodiacMap.value;

  recentIssues.forEach(issue => {
    const codes = issue.code.split(',');
    const targetCode = codes[positions[0] - 1];
    if (targetCode && currentZodiacMap) {
      const zodiacEntry = Object.entries(currentZodiacMap).find(([_, data]) => data.numbers.includes(targetCode));
      if (zodiacEntry) {
        const zodiacKey = zodiacEntry[0];
        if (results[zodiacKey] !== undefined) {
          results[zodiacKey]++;
        }
      }
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
  const currentZodiacMap = zodiacMap.value;

  for (let i = 0; i < history.length; i++) {
    const issue = history[i];
    const codes = issue.code.split(',');
    const targetCode = codes[positions[0] - 1];

    if (targetCode && currentZodiacMap) {
      const zodiacEntry = Object.entries(currentZodiacMap).find(([_, data]) => data.numbers.includes(targetCode));
      if (zodiacEntry) {
        const zodiacKey = zodiacEntry[0];
        if (!found[zodiacKey]) {
          results[zodiacKey] = i;
          found[zodiacKey] = true;
        }
      }
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