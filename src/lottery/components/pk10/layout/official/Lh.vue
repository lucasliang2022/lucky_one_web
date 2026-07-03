<template>
  <div :class="[$style.lotteryArea, $style.multiRow]">
    <div
        :class="$style.rowContainer"
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
    >
      <div :class="$style.ballList">
        <div
            :class="[$style.ballItem, row.shape === 'rectangle' ? $style.rectangle : $style.circle]"
            v-for="(ball, idx) in row.number"
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
              <b>{{ ball.title }}</b>
            </div>
            <div
                :class="$style.ballChm"
                v-if="showColdHot || showOmission"
            >
              <span
                  :class="[$style.hotCold, getHotColdClass(ball.hot_cold, rowIndex)]"
                  v-if="showColdHot"
              >
                {{ ball.hot_cold || 0 }}
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
    if (num1 > num2) hotCold['0'] += 1; // 龙
    if (num1 < num2) hotCold['1'] += 1; // 虎
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
    if (num1 > num2 && !found['0']) {
      omission['0'] = i;
      found['0'] = true;
    }
    if (num1 < num2 && !found['1']) {
      omission['1'] = i;
      found['1'] = true;
    }
    if (Object.values(found).every(f => f)) break;
  }

  for (let key in omission) {
    if (omission[key] === -1) omission[key] = totalIssues;
  }

  return omission;
}

function randomOneBetLh(rowsData, currentMethod) {
  const layoutRows = currentMethod?.layout?.rows[0] || {};
  const minSelected = layoutRows?.min_selected || 1;
  const availableBalls = [...rowsData[0].balls];
  const selectedBalls = [];

  for (let i = 0; i < Math.min(minSelected, availableBalls.length); i++) {
    const ballIndex = Math.floor(Math.random() * availableBalls.length);
    selectedBalls.push({
      value: availableBalls[ballIndex].value.toString(),
      title: availableBalls[ballIndex].title.toString()
    });
    availableBalls.splice(ballIndex, 1);
  }

  return selectedBalls.length > 0 ? [selectedBalls] : [];
}

function calculateBetCountLh(tickets, currentMethod) {
  if (!tickets || tickets.length === 0) {
    return 0;
  }
  return tickets[0].length; // 龙虎玩法注数等于选中选项数量
}

const {
  rows,
  toggleBall,
  randomOneBet,
  getHotColdClass,
  getOmissionClass,
  showColdHot,
  showOmission,
  updateSelectedBalls
} = useOfficialLogic(props.store, {
  calculateHotColdFn: calculateHotCold,
  calculateOmissionFn: calculateOmission,
  randomOneBetFn: randomOneBetLh,
  calculateCountFn: calculateBetCountLh
});

defineExpose({ randomOneBet });
</script>