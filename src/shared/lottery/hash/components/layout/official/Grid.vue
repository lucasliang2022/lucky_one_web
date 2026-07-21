<template>
  <div :class="[$style.lotteryArea, $style.multiRow]">
    <div
        :class="$style.rowContainer"
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
    >
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
import { officialLogic } from '@lottery/base/logic/officialLogic';

import styles from '@/assets/scss/lottery/lottery.module.scss';
// RowRender/RowTitle 无彩种耦合(仅依赖 shared),直接复用 ssc 的实现。
import RowRender from "@lottery/ssc/components/layout/official/render/RowRender.vue";
import RowTitle from "@lottery/ssc/components/layout/official/render/RowTitle.vue";
const $style = styles;

const props = defineProps({
  store: {
    type: Object as PropType<LotteryStore>,
    required: true
  }
});

// 快三官方盘统一「格子盘」:单/双行,点选累加。注数由 define 的 calc.type 决定
// (length=选中格数 / combination=C(n,base) 复选 / zx=行间乘积 二同号复选)。
const {
  rows,
  toggleBall,
  randomOneBet,
  getHotColdClass,
  getOmissionClass,
  showColdHot,
  showOmission,
} = officialLogic(props.store, {});

defineExpose({ randomOneBet });
</script>
