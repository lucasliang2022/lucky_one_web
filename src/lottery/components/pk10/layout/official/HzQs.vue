<template>
  <div :class="[$style.lotteryArea, $style.multiRow]">
    <div
        :class="$style.rowContainer"
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
    >
      <div v-if="row.title" :class="$style.rowTitle">
        <span>{{ row.title }}</span>
      </div>
      <div :class="$style.ballList">
        <div
            :class="[$style.ballItem, row.shape === 'rectangle' ? $style.rectangle : $style.circle]"
            v-for="(ball, idx) in row.balls"
            :key="idx"
        >
          <div
              :class="[
                row.shape === 'rectangle' ? $style.ballRectangle : $style.ballCircle,
                {
                  [$style.selected]: ball.selected,
                  [$style.animated]: ball.selected,
                  [$style.zoomIn]: ball.selected
                }
              ]"
              @click="toggleBall(rowIndex, ball)"
          >
            <div :class="$style.showNumber">
              <b>{{ ball.value }}</b>
            </div>
            <div v-if="ball.prize" :class="$style.showPrize">
              <span>{{ ball.prize }} 元</span>
            </div>
            <div
                :class="$style.ballChm"
                v-if="showColdHot || showOmission"
            >
              <span
                  :class="[$style.hotCold, getHotColdClass(ball.hotCount, rowIndex)]"
                  v-if="showColdHot"
              >
                {{ ball.hotCount || 0 }}
              </span>
              <span
                  :class="[$style.omission, getOmissionClass(ball.omission, rowIndex)]"
                  v-if="showOmission"
              >
                {{ ball.omission || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div :class="$style.btnRow">
        <span @click="handleQuick(rowIndex, 'all')">全</span>
        <span @click="handleQuick(rowIndex, 'big', 17)">大</span>
        <span @click="handleQuick(rowIndex, 'small', 16)">小</span>
        <span @click="handleQuick(rowIndex, 'odd')">奇</span>
        <span @click="handleQuick(rowIndex, 'even')">偶</span>
        <span @click="handleQuick(rowIndex, 'clear')">清</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { LotteryStore } from '@lottery/stores/storeTypes';
import { useOfficialLogic } from '@lottery/components/pk10/layout/logic/useOfficialLogic';
import styles from '@/assets/scss/lottery/pk10.module.scss';

const $style = styles;

const props = defineProps({
  store: {
    type: Object as PropType<LotteryStore>,
    required: true
  }
});

function calculateHotCold(issueCount, history, ballsData, positions) {
  const hotCold = {};
  ballsData.forEach(ball => hotCold[ball.value] = 0);
  if (!history?.length) return hotCold;

  const recentIssues = history.slice(0, issueCount);
  recentIssues.forEach(issue => {
    const codes = issue.code.split(',');
    const num1 = parseInt(codes[positions[0] - 1], 10);
    const num2 = parseInt(codes[positions[1] - 1], 10);
    if (isNaN(num1) || isNaN(num2)) return;
    const sum = num1 + num2;
    if (hotCold[sum] !== undefined) {
      hotCold[sum]++;
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
    const num1 = parseInt(codes[positions[0] - 1], 10);
    const num2 = parseInt(codes[positions[1] - 1], 10);
    if (isNaN(num1) || isNaN(num2)) continue;
    const sum = num1 + num2;
    if (!found[sum]) {
      omission[sum] = i;
      found[sum] = true;
    }
    if (Object.values(found).every(f => f)) break;
  }

  for (let key in omission) {
    if (omission[key] === -1) omission[key] = totalIssues;
  }

  return omission;
}

function randomOneBetHzGy(rowsData, currentMethod) {
  const layoutRows = currentMethod?.layout?.rows || [];
  const result = [];
  if (layoutRows.length > 0) {
    const randomRow = rowsData[0];
    const minSelected = layoutRows[0].min_selected || 1;
    const availableBalls = [...randomRow.balls];
    const selectedBalls = [];
    for (let j = 0; j < Math.min(minSelected, availableBalls.length); j++) {
      const ballIndex = Math.floor(Math.random() * availableBalls.length);
      selectedBalls.push({
        value: availableBalls[ballIndex].value.toString(),
        title: availableBalls[ballIndex].value.toString()
      });
      availableBalls.splice(ballIndex, 1);
    }
    result.push(selectedBalls);
  }
  return result;
}

function calculateBetCountHzGy(tickets, currentMethod) {
  if (!tickets || tickets.length === 0) {
    return 0;
  }

  const layoutRows = currentMethod?.layout?.rows || [];
  const selectedRows = tickets.map((row, index) => {
    const minSelected = layoutRows[index]?.min_selected || 1;
    return {
      selected: row.map(item => item.value),
      minSelected
    };
  });

  // 检查每行是否满足 min_selected
  if (selectedRows.some(row => row.selected.length < row.minSelected)) {
    return 0;
  }

  // 注数为选中号码数量
  return selectedRows[0].selected.length;
}

function updateDisplayPrize() {
  const levels = officialMethodCurrent.value?.levels || [];
  let nowPrizeLevels = levels;
  if (officialSelectedBalls.value.length && officialSelectedBalls.value[0].length) {
    nowPrizeLevels = levels.filter(level =>
        officialSelectedBalls.value[0].some(ball => level.codes.includes(parseInt(ball.value)))
    );
  }
  props.store.setDisplayPrize(nowPrizeLevels);
}

const {
  rows,
  toggleBall,
  handleQuick,
  getHotColdClass,
  getOmissionClass,
  showColdHot,
  showOmission,
  updateSelectedBalls
} = useOfficialLogic(props.store, {
  calculateHotColdFn: calculateHotCold,
  calculateOmissionFn: calculateOmission,
  randomOneBetFn: randomOneBetHzGy,
  calculateCountFn: calculateBetCountHzGy
});

defineExpose({ randomOneBet: randomOneBetHzGy, calculateHotCold, calculateOmission, updateDisplayPrize });
</script>