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
import { IssueItem, MethodRowNumber, SelectedUnit, MethodDefineItem } from "@shared/types";
import Buttons from "@lottery/base/components/Buttons.vue";
import RowRender from "@lottery/ssc/components/layout/official/render/RowRender.vue";
import RowTitle from "@lottery/ssc/components/layout/official/render/RowTitle.vue";

import styles from '@/assets/scss/lottery/lottery.module.scss';
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

function calculateChmZu3(issue: IssueItem, ball: MethodRowNumber, positions: number[]): boolean {
  if (!issue?.open_code || !positions || positions.length === 0) return false;
  const codes = issue.open_code.split(/[,\s]+/);
  const positionIndex = positions[0] - 1;
  if (positionIndex < 0 || codes.length <= positionIndex) return false;
  return codes[positionIndex]?.trim() === ball.value.toString();
}

// 组三 = 选一对号(a,b)对应「2 注」:(a,a,b) 与 (b,b,a),对子数字有序。
// 故注数 = C(n,2) × 2 = n(n-1)(全包 10 选 = 90 注)。通用 'combination' 只算 C(n,2) 少一半,
// 会与后端 getBetCount(= C(n,2)×2)对不上被校验拦截。与后端一致必须自己算。
function calculateBetCountZu3(tickets: SelectedUnit[][], currentMethod: MethodDefineItem): number {
  const row = tickets?.[0] || [];
  const layoutRow = currentMethod?.layout?.rows?.[0];
  const min = layoutRow?.min_selected || 2;
  const codeTotal = currentMethod?.layout?.code_total_count || { min: 2, max: Infinity };
  const n = row.length;
  if (n < min || n < codeTotal.min || n > codeTotal.max) return 0;
  return n * (n - 1);
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
} = officialLogic(props.store, {calculateChmFn: calculateChmZu3, calculateCountFn: calculateBetCountZu3});

defineExpose({
  randomOneBet
});

</script>