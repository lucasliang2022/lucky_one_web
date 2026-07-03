<template>
  <div :class="[$style.lotteryArea, $style.multiRow]">
    <div
        :class="$style.rowContainer"
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
    >
      <div  :class="$style.rowLeft">
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
import type { PropType } from 'vue';
import type { LotteryStore } from '@lottery/stores/storeTypes';
import { officialLogic } from '@lottery/logic/officialLogic';
import {IssueItem, MethodDefineItem, MethodRowNumber, SelectedUnit} from "@/types";
import Buttons from "@lottery/components/common/Buttons.vue";
import RowRender from "@lottery/components/ssc/layout/official/render/RowRender.vue";
import RowTitle from "@lottery/components/ssc/layout/official/render/RowTitle.vue";

import styles from '@/assets/scss/lottery/lottery.module.scss';
const $style = styles;

const handleOptionSelect = (rowIndex: number, ballData: MethodRowNumber) => {
  toggleBall(rowIndex, ballData);
};

function calculateChmZxFs(issue: IssueItem, ball: MethodRowNumber, positions: number[]): boolean {
  if (!issue || !issue.open_code || !positions || positions.length === 0) return false;
  const codes = issue.open_code.split(',');
  const positionIndex = positions[0] - 1;
  if (positionIndex < 0) return false;
  return codes.length > positionIndex && codes[positionIndex]?.trim() === ball.value.toString();
}

function calculateCountRxZx(tickets: SelectedUnit[][], currentMethod: MethodDefineItem): number {
  const layoutRows = currentMethod?.layout?.rows || [];
  const unitRepeat = currentMethod?.layout?.unit_repeat ?? false;
  const rowRepeat = currentMethod?.layout?.row_repeat ?? true;
  const codeTotalCount = currentMethod?.layout?.code_total_count || { min: 1, max: Infinity };
  const rowMin = currentMethod?.calc?.position || 1;

  if (!tickets || tickets.length < rowMin) {
    return 0;
  }

  const minSelectedMet = tickets.every((rowTickets, index) => {
    const minRequired = layoutRows[index]?.min_selected || 0;
    if (rowTickets.length < minRequired) {
      return false;
    }
    if (!unitRepeat && rowTickets.length > 0) {
      const values = rowTickets.map(unit => unit.value);
      return new Set(values).size === values.length;
    }
    return true;
  });

  const ballCounts = tickets.map(row => (row ? row.length : 0));

  if (!minSelectedMet) {
    return 0;
  }

  const selectedRows = tickets.filter(row => row.length > 0).length;
  if (selectedRows < rowMin) {
    return 0;
  }

  const totalSelected = tickets.reduce((sum, row) => sum + row.length, 0);
  if (totalSelected < codeTotalCount.min || totalSelected > codeTotalCount.max) {
    return 0;
  }

  if (!rowRepeat) {
    const allValues = tickets.flatMap(row => row.map(unit => unit.value));
    const uniqueValues = new Set(allValues);
    if (uniqueValues.size !== allValues.length) {
      return 0;
    }
  }


  let totalBetCount = 0;
  for (let i = 0; i < ballCounts.length - 1; i++) {
    if (ballCounts[i] === 0) continue;
    for (let j = i + 1; j < ballCounts.length; j++) {
      if (ballCounts[j] === 0) continue;
      totalBetCount += ballCounts[i] * ballCounts[j];
    }
  }

  return totalBetCount;
}

const props = defineProps({
  store: {
    type: Object as PropType<LotteryStore>,
    required: true
  }
});

const {
  rows,
  toggleBall,
  handleQuick,
  randomOneBet,
  calculateHotCold,
  calculateOmission,
  getHotColdClass,
  getOmissionClass,
  showColdHot,
  showOmission
} = officialLogic(props.store, {
  calculateCountFn: calculateCountRxZx,
  calculateChmFn: calculateChmZxFs
});

defineExpose({ randomOneBet });

</script>