<template>
  <div :class="[$style.lotteryArea, $style.multiRow]">
    <div
        :class="$style.rowContainer"
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
    >
      <div :class="$style.rowLeft">
        <RowTitle :title="row.title" :class="$style.rowTitle" />
        <div :class="$style.ballList">
          <RowRender
              v-for="(ball, ballIndex) in row.number"
              :key="`${rowIndex}-${ballIndex}`"
              :class="$style.ballItem"
              :option-data="ball"
              :shape="row.shape || 'rectangle'"
              :show-cold-hot="showColdHot"
              :show-omission="showOmission"
              :hot-cold-class="getHotColdClass(ball.hot_cold ?? null, rowIndex)"
              :omission-class="getOmissionClass(ball.omission ?? null, rowIndex)"
              @select="handleOptionSelect(rowIndex, $event)"
          >
            <template #afterTitle>
              <div :class="$style.showPrize" v-if="ball.prize !== undefined && ball.prize !== null">
                <span>{{ ball.prize }}</span>
              </div>
            </template>
          </RowRender>
        </div>
      </div>
      <Buttons v-if="row.buttons" @click:handleQuick="(type: string) => handleQuick(rowIndex, type)" :row-index="rowIndex" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOfficialLogic } from '@lottery/components/pk10/layout/logic/useOfficialLogic';

import {
  HotCold,
  IssueItem,
  MethodDefineItem,
  MethodRow,
  MethodRowNumber,
  Omission,
  SelectedUnit
} from "@types";
import Buttons from "@lottery/components/common/Buttons.vue";
import RowRender from "@lottery/components/ssc/layout/official/render/RowRender.vue";
import RowTitle from "@lottery/components/ssc/layout/official/render/RowTitle.vue";

import styles from '@/assets/scss/lottery/lottery.module.scss';
const $style = styles;
const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const handleOptionSelect = (rowIndex: number, ballData: MethodRowNumber) => {
  toggleBall(rowIndex, ballData);
};

function calculateHotCold(issueCount: number, history: IssueItem[], ballsData: MethodRowNumber[], positions: any) {
  const hotCold: HotCold = {};
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

function calculateOmission(history: any[], ballsData: MethodRowNumber[], positions: number[]): Record<string, number> {
  const omission: Omission = {};
  ballsData.forEach(ball => omission[ball.value] = -1);
  if (!history?.length) return omission;

  const found: Record<string, boolean> = {};
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

function randomOneBetZxFs(rowsData: MethodRow[], currentMethod: MethodDefineItem): SelectedUnit[][] {
  const layoutRows = currentMethod?.layout?.rows || [];
  const result: SelectedUnit[][] = [];
  rowsData.forEach((rowConfig, rowIndex) => {
    const minSelected = layoutRows[rowIndex]?.min_selected || 1;
    const availableBalls = [...(rowConfig.number??[])];
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

function calculateBetCountZxFs(tickets: SelectedUnit[][], currentMethod: MethodDefineItem) {
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

  if (selectedRows.some(row => row.selected.length < row.minSelected)) {
    return 0;
  }

  function generateCombinations(index: number, currentCombination:Array<any>) {
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
  getHotColdClass,
  getOmissionClass,
  showColdHot,
  showOmission,
  randomOneBet,
} = useOfficialLogic(props.store, {
  calculateHotColdFn: calculateHotCold,
  calculateOmissionFn: calculateOmission,
  randomOneBetFn: randomOneBetZxFs,
  calculateCountFn: calculateBetCountZxFs
});

defineExpose({ randomOneBet });
</script>