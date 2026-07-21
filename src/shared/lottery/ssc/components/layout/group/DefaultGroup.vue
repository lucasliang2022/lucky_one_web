<template>
  <div class="method-display-container">
    <template v-for="(method, methodKey, idx) in (creditGroupCurrent?.methods || {})" :key="methodKey">
      <!-- 组内多玩法同页展示:每个玩法块用带标题的分割线区隔(单玩法时也显示,作小节标题)。 -->
      <el-divider v-if="multiMethod || idx > 0" content-position="center" border-style="dashed">
        <span class="method-title">
          {{ resolveMethodTitle(method, t, te) }}
          <el-icon class="method-title-arrow"><ArrowDown /></el-icon>
        </span>
      </el-divider>
      <div class="ball-row">
        <component
            v-if="componentMap[method.layout.type]"
            :is="componentMap[method.layout.type]"
            :sort="idx + 1"
            :method-current="method"
            :store="store"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { resolveMethodTitle } from "@lottery/base/utils/common";
import Ball from "@shared/lottery/ssc/components/layout/credit/Ball.vue";
import Form from "@shared/lottery/ssc/components/layout/credit/Form.vue";
import Combo from "@shared/lottery/ssc/components/layout/credit/Combo.vue";
import { ArrowDown } from '@element-plus/icons-vue';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

// 信用盘每个玩法按自身 layout.type 取渲染组件;所有组件都是 ItemDefault 的薄封装(仅 calculateChm 不同)。
const componentMap = {
  Ball: Ball,
  Form: Form,
  Combo: Combo,  // 组合玩法(连码/连肖连尾/自选/不中):多选 + 统一金额 + 注数=C(n,k)
};

const { t, te } = useI18n();
const { creditGroupCurrent, creditDisplayMethodDesc } = storeToRefs(props.store);

// 组内是否多于一个玩法:多玩法时每块都带标题分割线;单玩法也显示一条(小节标题)。
const multiMethod = computed(() => Object.keys(creditGroupCurrent.value?.methods || {}).length > 1);

watch(
    () => creditGroupCurrent.value,
    (newGroup) => {
      creditDisplayMethodDesc.value = newGroup && newGroup.methods
          ? Object.values(newGroup.methods)
              .map((method: any) => (method && method.desc ? { sign: method.sign, desc: method.desc } : null))
              .filter((item) => item)
          : [];
    },
    { immediate: true }
);
</script>

<style lang="scss" scoped>
.method-display-container {
  padding: 10px;
}

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
</style>
