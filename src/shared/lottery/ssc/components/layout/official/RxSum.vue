<template>
  <div :class="[$style.lotteryArea, $style.multiRow]">
    <div :class="$style.positionsWrapper">
      <span :class="$style.positionsTitle">选择位置</span>
      <el-checkbox-group
          v-model="selectedPositions"
      >
        <el-checkbox
            v-for="(label, value) in positionsConfig.options"
            :key="value"
            :value="value"
            @change="togglePosition(value)"
        >
          {{ label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div
        :class="[$style.rowContainer, $style.longRow]"
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
    >
      <div :class="$style.leftRow">
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
      <div :class="$style.rightRow">
        <Buttons
            v-if="row.buttons"
            @click:handleQuick="(type: string) => handleQuick(rowIndex, type)"
            :row-index="rowIndex"
            :long-row="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { LotteryStore } from '@lottery/base/stores/storeTypes';
import { officialLogic } from '@lottery/base/logic/officialLogic';
import {MethodDefineItem, MethodRowNumber, SelectedUnit} from "@shared/types";
import Buttons from "@lottery/base/components/Buttons.vue";
import RowRender from "@lottery/ssc/components/layout/official/render/RowRender.vue";
import RowTitle from "@lottery/ssc/components/layout/official/render/RowTitle.vue";

import styles from '@/assets/scss/lottery/lottery.module.scss';
import { ElCheckbox, ElCheckboxGroup } from "element-plus";
import { storeToRefs } from "pinia";
import {combination} from "@lottery/base/utils/common";

const $style = styles;
const props = defineProps({
  store: {
    type: Object as PropType<LotteryStore>,
    required: true
  }
});

const { officialMethodCurrent, selectedPositions  } = storeToRefs(props.store);

const positionsConfig = officialMethodCurrent.value?.layout?.positions || {
  options: {},
  min_checked: 2,
  max_checked: 10
};

const handleOptionSelect = (rowIndex: number, ballData: MethodRowNumber) => {
  toggleBall(rowIndex, ballData);
};

function calculateBetCountFn(tickets: SelectedUnit[][], currentMethod: MethodDefineItem): number {
  const layoutRow = currentMethod?.layout?.rows?.[0];
  const numberArray = layoutRow?.number as MethodRowNumber[];
  const selectedTickets = tickets?.[0];
  const unitRepeat = currentMethod?.layout?.unit_repeat ?? false;
  const codeTotalCount = currentMethod?.layout?.code_total_count || { min: 1, max: Infinity };
  const minSelected = layoutRow?.min_selected || 1;
  const minChecked = currentMethod?.layout?.positions?.min_checked || 1;

  if (!selectedTickets || selectedTickets.length === 0 || !Array.isArray(numberArray)) {
    if (!Array.isArray(numberArray)) {
      console.warn("mapRx method expects layout.rows[0].number to be an array of objects like [{value: 0, count: 1},...]");
    }
    return 0;
  }

  if (selectedTickets.length < minSelected) {
    return 0;
  }

  if (!unitRepeat) {
    const values = selectedTickets.map(unit => unit.value);
    if (new Set(values).size !== values.length) {
      return 0;
    }
  }

  const totalSelected = selectedTickets.length;
  if (totalSelected < codeTotalCount.min || totalSelected > codeTotalCount.max) {
    return 0;
  }

  if (selectedPositions.value.length < minChecked) {
    return 0;
  }

  let sumBetCount = 0;
  for (const ticket of selectedTickets) {
    const matchingNumberData = numberArray.find(item => item.value.toString() === ticket.value.toString());
    if (matchingNumberData && matchingNumberData.count != null) {
      sumBetCount += Number(matchingNumberData.count);
    } else {
      return 0;
    }
  }

  const positionCombinations = combination(selectedPositions.value.length, minChecked);
  return positionCombinations * sumBetCount;
}


const {
  rows,
  toggleBall,
  togglePosition,
  handleQuick,
  randomOneBet,
  getHotColdClass,
  getOmissionClass,
  showColdHot,
  showOmission
} = officialLogic(props.store, {
  calculateCountFn: calculateBetCountFn,
});

defineExpose({
  randomOneBet
});

</script>