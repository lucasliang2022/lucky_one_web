<template>
  <div class="method-display-container">
    <template v-for="(row, rowIndex) in creditGroupCurrent.layout" :key="rowIndex">
      <el-divider v-if="rowIndex > 0" border-style="dashed" />
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

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { watch } from "vue";
import Ball from "@shared/lottery/ssc/components/layout/credit/Ball.vue";
import Bs from "@shared/lottery/ssc/components/layout/credit/Bs.vue";
import Oe from "@shared/lottery/ssc/components/layout/credit/Oe.vue";
import SumBs from "@shared/lottery/ssc/components/layout/credit/SumBs.vue";
import SumOe from "@shared/lottery/ssc/components/layout/credit/SumOe.vue";
import Ps from "@shared/lottery/ssc/components/layout/credit/Ps.vue";
import Lh from "@shared/lottery/ssc/components/layout/credit/Lh.vue";
import Zjh from "@shared/lottery/ssc/components/layout/credit/Zjh.vue";

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const componentMap = {
  Ball: Ball,
  Bs: Bs,
  Oe: Oe,
  SumBs: SumBs,
  SumOe: SumOe,
  Ps: Ps,
  Zjh: Zjh,
  Lh: Lh,
};

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