<template>
  <div :class="[$style.lotteryArea, $style.multiRow]">
    <div :class="$style.rowContainer" v-for="(row, rowIndex) in rows" :key="rowIndex">
      <RowTitle v-if="row.title" :title="row.title" :class="$style.rowTitle" />
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
            @select="toggleBall(rowIndex, $event)"
        >
          <template #afterTitle>
            <div :class="$style.showPrize" v-if="ball.prize !== undefined && ball.prize !== null">
              <span>{{ ball.prize }}</span>
            </div>
          </template>
        </RowRender>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { LotteryStore } from '@lottery/base/stores/storeTypes';
import type { SelectedUnit } from "@shared/types";
import { officialLogic } from '@lottery/base/logic/officialLogic';

import styles from '@/assets/scss/lottery/lottery.module.scss';
import RowRender from "@lottery/ssc/components/layout/official/render/RowRender.vue";
import RowTitle from "@lottery/ssc/components/layout/official/render/RowTitle.vue";
const $style = styles;

const props = defineProps({
  store: { type: Object as PropType<LotteryStore>, required: true },
});

// 两面盘:5 位每位一行(大小单双质合),可只投部分位 → 注数 = 全部选中格数(不要求每行都选),
// 与 ks/hash 通用 Grid 不同(通用 Grid 的默认注数要求每行至少 1 个)。
const sumAllCount = (tickets: SelectedUnit[][]): number => {
  const n = tickets.reduce((sum, row) => sum + row.length, 0);
  return n >= 1 ? n : 0;
};

const {
  rows,
  toggleBall,
  randomOneBet,
  getHotColdClass,
  getOmissionClass,
  showColdHot,
  showOmission,
} = officialLogic(props.store, { calculateCountFn: sumAllCount });

defineExpose({ randomOneBet });
</script>
