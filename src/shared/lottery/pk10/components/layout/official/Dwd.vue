<template>
  <div :class="[$style.lotteryArea, $style.multiRow]">
    <div
        :class="$style.rowContainer"
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
    >
      <div :class="$style.rowTitle">
        <span>{{ row.title }}</span>
      </div>
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
                  [$style.animated]: ball.animating,
                  [$style.zoomIn]: ball.selected
                }
              ]"
              @click="toggleBall(rowIndex, ball)"
          >
            <div :class="$style.showNumber">
              <b>{{ ball.value }}</b>
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
        <span @click="handleQuick(rowIndex, 'big')">大</span>
        <span @click="handleQuick(rowIndex, 'small')">小</span>
        <span @click="handleQuick(rowIndex, 'odd')">奇</span>
        <span @click="handleQuick(rowIndex, 'even')">偶</span>
        <span @click="handleQuick(rowIndex, 'clear')">清</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { LotteryStore } from '@lottery/base/stores/storeTypes';
import { useOfficialLogic } from '@lottery/pk10/components/layout/logic/useOfficialLogic';
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
    positions.forEach(pos => {
      const num = codes[pos - 1]; // 调整为 pos - 1，因为 positions 是数组 [1, 2, ...]
      if (num && hotCold[num] !== undefined) {
        hotCold[num]++;
      }
    });
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
    positions.forEach(pos => {
      const num = codes[pos - 1];
      if (num && !found[num]) {
        omission[num] = i;
        found[num] = true;
      }
    });

    if (Object.values(found).every(f => f)) break;
  }

  ballsData.forEach(ball => {
    if (!found[ball.value]) {
      omission[ball.value] = totalIssues;
    }
  });

  return omission;
}

function randomOneBetDwd(rowsData, currentMethod) {
  const layoutRows = currentMethod?.layout?.rows || [];
  const result = [];
  if (layoutRows.length > 0) {
    const randomIndex = Math.floor(Math.random() * layoutRows.length);
    for (let i = 0; i < layoutRows.length; i++) {
      if (i === randomIndex) {
        const randomRow = rowsData[i];
        const minSelected = layoutRows[i].min_selected || 1;
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
      } else {
        result.push([]); // 空数组表示未选中
      }
    }
  }
  return result;
}

function calculateBetCountDwd(tickets) {
  if (!tickets || tickets.length === 0) {
    return 0;
  }
  return tickets.reduce((sum, row) => sum + row.length, 0);
}

const {
  rows,
  toggleBall,
  handleQuick,
  randomOneBet,
  getHotColdClass,
  getOmissionClass,
  showColdHot,
  showOmission,
  updateSelectedBalls
} = useOfficialLogic(props.store, {
  calculateHotColdFn: calculateHotCold,
  calculateOmissionFn: calculateOmission,
  randomOneBetFn: randomOneBetDwd,
  calculateCountFn: calculateBetCountDwd
});

defineExpose({ randomOneBet });
</script>