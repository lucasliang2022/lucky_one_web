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
import { getZjhType} from "@lottery/base/utils/common";

import { IssueItem, MethodRowNumber } from "@/types";
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

function calculateChmZjh(issue: IssueItem, ball: MethodRowNumber, positions: number[]): boolean {
  if (!issue?.open_code || !positions || positions.length < 3) return false;
  const codes = issue.open_code.split(/[,\s]+/);
  const nums: number[] = [];

  for (let i = 0; i < 3; i++) {
    const posIndex = positions[i] - 1;
    if (posIndex < 0 || codes.length <= posIndex) return false;
    const num = parseInt(codes[posIndex]?.trim(), 10);
    if (isNaN(num)) return false;
    nums.push(num);
  }

  const outcome = getZjhType(nums);
  if (outcome === null) return false;

  return outcome === ball.value;
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
} = officialLogic(props.store, {calculateChmFn: calculateChmZjh,});

defineExpose({
  randomOneBet
});

</script>