<template>
  <div class="method-display-container">
    <template v-for="(row, rowIndex) in creditGroupCurrent.layout" :key="rowIndex">
      <el-divider v-if="rowIndex > 0" border-style="dashed">
        <span class="method-title">
          <span class="icon-sd-check_02" style="margin-right: 2px; color: #999;font-size: 10px;"></span>
          <span style="color: #000; font-size: 14px;">{{row.title}}</span>
          <el-icon class="method-title-arrow"><ArrowDown /></el-icon>
        </span>
      </el-divider>
      <div class="ball-row" :class="{ 'ball-row-column': row.direction === 'column' }">
        <template v-for="(methodConfig, methodKey) in row.methods" :key="methodKey">
          <component
              :is="componentMap[methodConfig.layout]"
              :sort="getSort(methodKey, rowIndex)"
              :method-current="creditGroupCurrent['methods'][methodConfig.target]"
              :store="store"
          />
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { watch } from "vue";
import { ArrowDown } from '@element-plus/icons-vue';
import Number from "../credit/Number.vue";
import Bs from "../credit/Bs.vue";
import Oe from "../credit/Oe.vue";
import BsSum from "../credit/BsSum.vue";
import OeSum from "../credit/OeSum.vue";
import TotalSumBs from "../credit/TotalSumBs.vue";
import TotalSumOe from "../credit/TotalSumOe.vue";
import BsTail from "../credit/BsTail.vue";
import BsoeMix from "../credit/BsoeMix.vue";
import ZodiacStatTd from "../credit/ZodiacStatTd.vue";
import ZodiacStatQh from "../credit/ZodiacStatQh.vue";
import ZodiacStatJy from "../credit/ZodiacStatJy.vue";
import Zodiac from "../credit/Zodiac.vue";
import ZodiacAll from "../credit/ZodiacAll.vue";
import ZodiacAllStat from "../credit/ZodiacAllStat.vue";
import Wave from "../credit/Wave.vue";
import WaveSeven from "../credit/WaveSeven.vue";
import WaveHalf from "../credit/WaveHalf.vue";
import WaveHalfHalf from "../credit/WaveHalfHalf.vue";
import Head from "../credit/Head.vue";
import Tail from "../credit/Tail.vue";
import TailAll from "../credit/TailAll.vue";

const componentMap = {
  Number: Number,
  Bs: Bs,
  Oe: Oe,
  BsSum: BsSum,
  OeSum: OeSum,
  TotalSumBs: TotalSumBs,
  TotalSumOe: TotalSumOe,
  BsTail: BsTail,
  BsoeMix: BsoeMix,
  Zodiac: Zodiac,
  ZodiacStatTd: ZodiacStatTd,
  ZodiacStatQh: ZodiacStatQh,
  ZodiacStatJy: ZodiacStatJy,
  ZodiacAll: ZodiacAll,
  ZodiacAllStat: ZodiacAllStat,
  Wave: Wave,
  WaveSeven: WaveSeven,
  WaveHalf: WaveHalf,
  WaveHalfHalf: WaveHalfHalf,
  Head: Head,
  Tail: Tail,
  TailAll: TailAll,
};

const props = defineProps({
  store: {
    type: Object,
    required: true,
  },
});

const { creditGroupCurrent, creditDisplayMethodDesc } = storeToRefs(props.store);

const getSort = (methodKey, rowIndex) => {
  return Object.keys(creditGroupCurrent.value.layout[rowIndex].methods).indexOf(methodKey) + 1 + rowIndex * creditGroupCurrent.value.layout[0].methods.length;
};

watch(
    () => creditGroupCurrent.value,
    (newGroup) => {
      if (newGroup && newGroup.layout) {
        creditDisplayMethodDesc.value = newGroup.layout.flatMap(row =>
            Object.values(row.methods).map(methodConfig => {
              const method = newGroup.methods[methodConfig.target];
              return method && method.desc ? { sign: method.sign, desc: method.desc } : null;
            })
        ).filter(item => item);
      } else {
        creditDisplayMethodDesc.value = [];
      }
    },
    { immediate: true }
);
</script>

<style lang="scss" scoped>
// 玩法标题右侧的向下标识图标
.method-title {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  .method-title-arrow {
    font-size: 12px;
    color: var(--el-text-color-secondary, #909399);
  }
}

.method-display-container {
  padding: 10px;
  .ball-row-column {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    width: calc(20% - 12px);
    gap: 12px;
    max-height: calc(60px * 10 + 12px * 9);
  }
}
</style>