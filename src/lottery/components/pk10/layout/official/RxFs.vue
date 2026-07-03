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
    if (Array.isArray(positions)) {
      positions.forEach(pos => {
        const num = codes[pos - 1];
        if (num && hotCold[num] !== undefined) {
          hotCold[num]++;
        }
      });
    } else {
      const num = codes[positions - 1];
      if (num && hotCold[num] !== undefined) {
        hotCold[num]++;
      }
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
    if (Array.isArray(positions)) {
      positions.forEach(pos => {
        const num = codes[pos - 1];
        if (num && !found[num]) {
          omission[num] = i;
          found[num] = true;
        }
      });
    } else {
      const num = codes[positions - 1];
      if (num && !found[num]) {
        omission[num] = i;
        found[num] = true;
      }
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

function randomOneBetZxFs(rowsData, currentMethod) {
  const layoutRows = currentMethod?.layout?.rows || [];
  const result = [];
  rowsData.forEach((rowConfig, rowIndex) => {
    const minSelected = layoutRows[rowIndex]?.min_selected || 1;
    const availableBalls = [...rowConfig.balls];
    const selectedBalls = [];
    for (let i = 0; i < Math.min(minSelected, availableBalls.length); i++) {
      const ballIndex = Math.floor(Math.random() * availableBalls.length);
      selectedBalls.push({
        value: availableBalls[ballIndex].value.toString(),
        title: availableBalls[ballIndex].value.toString()
      });
      availableBalls.splice(ballIndex, 1);
    }
    result.push(selectedBalls.length > 0 ? selectedBalls : []);
  });
  return result;
}

function calculateBetCountZxFs(tickets, currentMethod) {
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

  function generateCombinations(index, currentCombination) {
    if (index === selectedRows.length) {
      if (new Set(currentCombination).size === currentCombination.length) {
        combinations.push([...currentCombination]);
      }
      return;
    }

    for (const value of selectedRows[index].selected) {
      currentCombination.push(value);
      generateCombinations(index + 1, currentCombination);
      currentCombination.pop();
    }
  }

  const combinations = [];
  generateCombinations(0, []);
  return combinations.length;
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
  randomOneBetFn: randomOneBetZxFs,
  calculateCountFn: calculateBetCountZxFs
});

defineExpose({ randomOneBet });
</script>