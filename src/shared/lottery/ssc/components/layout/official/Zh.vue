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
  MethodRow,
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

function calculateBetCountZh(tickets: SelectedUnit[][], currentMethod: MethodDefineItem): number {
  const layoutRows = currentMethod?.layout?.rows || [];
  const minPerRow = layoutRows.map(row => row.min_selected || 1);

  if (tickets.length !== layoutRows.length) {
    return 0;
  }

  const isValid = tickets.every((rowTickets, index) => {
    if (!rowTickets || rowTickets.length < minPerRow[index]) {
      return false;
    }
    return true;
  });

  if (!isValid) {
    return 0;
  }

  // 综合 = 每选一「组」(各位各取一号的一种组合)同时下「档数」注(1星…N星各一注)。
  // 总注数 = 组数(各位所选号码数之积) × 档数(= 位数)。
  // 例:前三综合全包 10×10×10 = 1000 组,每组 3 注 → 3000 注。
  // 旧写法「各位相乘」漏乘档数(全包只算 1000 注),单选五星更是只算 1 注(应为「共 5 注」)。
  const combos = tickets.reduce((product, rowTickets) => product * rowTickets.length, 1);
  return combos * tickets.length;
}

function randomOneBetZh(rowsData: MethodRow[], currentMethod: MethodDefineItem): SelectedUnit[][] {
  const result: SelectedUnit[][] = [];
  const layoutRows = currentMethod?.layout?.rows || [];

  layoutRows.forEach((_, index) => {
    const rowConfig = rowsData[index];
    const availableBalls = (rowConfig && Array.isArray(rowConfig.number)) ? [...rowConfig.number] : [];

    if (availableBalls.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableBalls.length);
      const randomBall = availableBalls[randomIndex];
      if (randomBall && randomBall.value != null) {
        result.push([{
          value: randomBall.value.toString(),
          title: randomBall.title?.toString() ?? randomBall.value.toString()
        }]);
      } else {
        result.push([]);
      }
    } else {
      result.push([]);
    }
  });
  return result;
}

function calculateChmZh(issue: IssueItem, ball: MethodRowNumber, positions: number[]): boolean {
  if (!issue?.open_code || !positions || positions.length === 0 || positions[0] == null) return false;
  const codes = issue.open_code.split(/[,\s]+/);
  const positionIndex = positions[0] - 1;
  if (positionIndex < 0 || codes.length <= positionIndex) return false;
  return codes[positionIndex]?.trim() === ball.value.toString();
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
  calculateCountFn: calculateBetCountZh,
  calculateChmFn: calculateChmZh,
  randomOneBetFn: randomOneBetZh
});

defineExpose({
  randomOneBet
});

</script>