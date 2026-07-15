<template>
  <div :class="[$style.lotteryArea, $style.multiRow]">
    <div
        :class="$style.rowContainer"
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
    >
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
      <Buttons v-if="row.buttons" @click:handleQuick="(type: string) => handleQuick(rowIndex, type)" :row-index="rowIndex" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { LotteryStore } from '@lottery/base/stores/storeTypes';
import { officialLogic } from '@lottery/base/logic/officialLogic';
import {
  IssueItem,
  MethodDefineItem,
  MethodRowNumber,
  SelectedUnit
} from "@shared/types";
import Buttons from "@lottery/base/components/Buttons.vue";

import styles from '@/assets/scss/lottery/lottery.module.scss';
import RowRender from "@lottery/ssc/components/layout/official/render/RowRender.vue";
import RowTitle from "@lottery/ssc/components/layout/official/render/RowTitle.vue";
const $style = styles;

const props = defineProps({
  store: {
    type: Object as PropType<LotteryStore>,
    required: true
  }
});

const handleOptionSelect = (rowIndex: number, ballData: MethodRowNumber) => {
  toggleBall(rowIndex, ballData);
};

function calculateBetCountDwd(tickets: SelectedUnit[][], currentMethod: MethodDefineItem): number {
  if (!tickets) return 0;
  const totalSelected = tickets.reduce((sum, row) => sum + row.length, 0);
  const minTotal = currentMethod?.layout?.code_total_count?.min ?? 1;
  return totalSelected >= minTotal ? totalSelected : 0;
}

function calculateChmDwd(issue: IssueItem, ball: MethodRowNumber, positions: number[]): boolean {
  if (!issue || !issue.open_code || !positions || positions.length === 0) return false;
  const codes = issue.open_code.split(',');
  const positionIndex = (positions[0] ?? 0) - 1;
  if (positionIndex < 0) return false;
  return codes.length > positionIndex && codes[positionIndex]?.trim() === ball.value.toString();
}

const {
  rows,
  toggleBall,
  handleQuick,
  randomOneBet,
  getHotColdClass,
  getOmissionClass,
  showColdHot,
  showOmission
} = officialLogic(props.store, {
  calculateCountFn: calculateBetCountDwd,
  calculateChmFn: calculateChmDwd,
});

defineExpose({
  randomOneBet
});

</script>