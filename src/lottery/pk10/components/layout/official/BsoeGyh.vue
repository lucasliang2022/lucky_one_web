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
            <div v-if="ball.prize" :class="$style.showPrize">
              <span>{{ ball.prize }} 元</span>
            </div>
            <div
                :class="$style.ballChm"
                v-if="showColdHot || showOmission"
            >
              <span
                  :class="$style.hotCold"
                  v-if="showColdHot"
              >
                <span :class="getHotColdClass(ball.hot_cold??null, rowIndex)">
                  {{ ball.hot_cold || 0 }}
                </span>
              </span>
              <span
                  :class="$style.omission"
                  v-if="showOmission"
              >
                <span :class="getOmissionClass(ball.omission??null, rowIndex)">
                  {{ ball.omission || 0 }}
                </span>
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
import type { LotteryStore } from '@lottery/base/stores/storeTypes';
import { useOfficialLogic } from '@lottery/pk10/components/layout/logic/useOfficialLogic';
import styles from '@/assets/scss/lottery/pk10.module.scss';
import {IssueItem, MethodDefineItem, MethodRow, MethodRowNumber, SelectedUnit} from "@/types";

const $style = styles;

const props = defineProps({
  store: {
    type: Object as PropType<LotteryStore>,
    required: true
  }
});

function calculateHotCold(issueCount: number, history: IssueItem[], ballsData: MethodRowNumber[], positions: number[]): Record<string, number> {
  const hotCold: Record<string, number> = {};
  ballsData.forEach(ball => hotCold[ball.value] = 0);
  if (!history?.length) return hotCold;

  const recentIssues = history.slice(0, issueCount);
  recentIssues.forEach(issue => {
    const codes = issue.code.split(',');
    positions.forEach(pos => {
      const num = parseInt(codes[pos - 1], 10);
      if (isNaN(num)) return;
      if (num >= 6 && num <= 10) hotCold['0'] += 1;
      if (num >= 1 && num <= 5) hotCold['1'] += 1;
      if (num % 2 === 1) hotCold['2'] += 1;
      if (num % 2 === 0) hotCold['3'] += 1;
    });
  });

  return hotCold;
}

function calculateOmission(history: any[], ballsData: MethodRowNumber[], positions: number[]): Record<string, number> {
  const omission: Record<string, number> = {};
  ballsData.forEach(ball => omission[ball.value] = -1);
  if (!history?.length) return omission;

  const found: Record<string, boolean> = {};
  ballsData.forEach(ball => found[ball.value] = false);
  const totalIssues = history.length;

  for (let i = 0; i < totalIssues; i++) {
    const issue = history[i];
    const codes = issue.code.split(',');
    positions.forEach(pos => {
      const num = parseInt(codes[pos - 1], 10);
      if (isNaN(num)) return;
      if (num >= 6 && num <= 10 && !found['0']) {
        omission['0'] = i;
        found['0'] = true;
      }
      if (num >= 1 && num <= 5 && !found['1']) {
        omission['1'] = i;
        found['1'] = true;
      }
      if (num % 2 === 1 && !found['2']) {
        omission['2'] = i;
        found['2'] = true;
      }
      if (num % 2 === 0 && !found['3']) {
        omission['3'] = i;
        found['3'] = true;
      }
    });

    if (Object.values(found).every(f => f)) break;
  }

  for (let key in omission) {
    if (omission[key] === -1) omission[key] = totalIssues;
  }

  return omission;
}

function randomOneBet(rowsData: MethodRow[], currentMethod: MethodDefineItem): SelectedUnit[][] {
  const layoutRows = currentMethod?.layout?.rows || [];
  const result = [];
  if (layoutRows.length > 0) {
    const randomIndex = Math.floor(Math.random() * layoutRows.length);
    for (let i = 0; i < layoutRows.length; i++) {
      if (i === randomIndex) {
        const randomRow = rowsData[i];
        const minSelected = layoutRows[i].min_selected || 1;
        const availableBalls = [...(randomRow.number??[])];
        const selectedBalls = [];
        for (let j = 0; j < Math.min(minSelected, availableBalls.length); j++) {
          const ballIndex = Math.floor(Math.random() * availableBalls.length);
          selectedBalls.push({
            value: availableBalls[ballIndex].value.toString(),
            title: availableBalls[ballIndex].title.toString()
          });
          availableBalls.splice(ballIndex, 1);
        }
        result.push(selectedBalls);
      } else {
        result.push([]);
      }
    }
  }
  return result;
}

function calculateBetCountDxDs(tickets: SelectedUnit[][]): number {
  if (!tickets || tickets.length === 0) {
    return 0;
  }
  return tickets.reduce((sum: number, row: SelectedUnit[]) => sum + row.length, 0);
}

const {
  rows,
  toggleBall,
  getHotColdClass,
  getOmissionClass,
  showColdHot,
  showOmission,
} = useOfficialLogic(props.store, {
  calculateHotColdFn: calculateHotCold,
  calculateOmissionFn: calculateOmission,
  randomOneBetFn: randomOneBet,
  calculateCountFn: calculateBetCountDxDs
});

defineExpose({ randomOneBet});
</script>