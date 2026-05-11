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
import { officialLogic } from '@lottery/logic/officialLogic';
import { getSuoHaType } from "@lottery/utils/common";

import { IssueItem, MethodRowNumber } from "@/types";
import Buttons from "@lottery/components/common/Buttons.vue";

import styles from '@/assets/scss/lottery/lottery.module.scss';
import RowRender from "@lottery/components/ssc/layout/official/render/RowRender.vue";
import RowTitle from "@lottery/components/ssc/layout/official/render/RowTitle.vue";

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

function calculateChmSh(issue: IssueItem, ball: MethodRowNumber, positions: number[]): boolean {
  if (!issue?.open_code || !positions || positions.length < 5) return false;
  const codes = issue.open_code.split(/[,\s]+/).map(num => parseInt(num.trim(), 10));
  const adjustedCodes = positions.map(pos => codes[pos - 1]).filter(num => !isNaN(num));
  if (adjustedCodes.length < 5) return false;
  const outcome = getSuoHaType(adjustedCodes);
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
} = officialLogic(props.store, {calculateChmFn: calculateChmSh,});

defineExpose({
  randomOneBet
});

</script>