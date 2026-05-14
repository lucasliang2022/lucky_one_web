<template>
  <div class="currency-wrapper">
    <div class="flex items-center mt-3 gap-x-2.5">
      <div class="w-[140px]">
        <el-radio-group v-model="currentCurrency" size="default">
          <el-radio-button
              v-for="(item, index) in currencyOptions"
              :key="index"
              :value="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <p class="text-txt-secondary text-xs">
        余额：<span class="currency-balance">{{ currencySymbol }}{{ balance }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useUserStore } from '@/stores/userStore.ts';
import { useCommonStore } from '@/stores/commonStore';

const commonStore = useCommonStore();
const userStore = useUserStore();
const emit = defineEmits(['update:currency']);

// 货币下拉项；commonStore 在没拿到 SystemConfig 时也会返回内置兜底，
// 所以这里直接用 computed，不再用 ref 初始化期值（避免初始化时 [0] 不存在）。
const currencyOptions = computed(() => commonStore.currencyOptions ?? []);

// 当前选中的货币 code
const currentCurrency = ref(currencyOptions.value[0]?.value ?? 'cny');

// 当 currencyOptions 异步加载到位后，如果当前选中的不在列表里，自动校正到第一个
watch(currencyOptions, (list) => {
  if (!list || !list.length) return;
  if (!list.some(o => o.value === currentCurrency.value)) {
    currentCurrency.value = list[0].value;
  }
}, { immediate: true });

// 货币符号：从 commonStore.getCurrencyInfo 拿，拿不到再从 currencyOptions 兜底
const currencySymbol = computed(() => {
  const info = commonStore.getCurrencyInfo?.(currentCurrency.value);
  if (info && info.symbol) return info.symbol;
  const fb = currencyOptions.value.find(o => o.value === currentCurrency.value);
  return fb?.symbol ?? '';
});

// 余额：后端实际返回 { [currency]: { amount, frozen } }，
// 原 `userStore.balance.main.cny` 路径不对，这里按真实结构访问并加防御。
const balance = computed(() => {
  const bal = userStore?.balance;
  if (!bal || typeof bal !== 'object') return '0';

  const item = bal[currentCurrency.value];
  if (item && typeof item === 'object' && 'amount' in item) {
    return item.amount ?? '0';
  }
  // 兼容老的扁平 number 形态
  if (typeof item === 'number' || typeof item === 'string') {
    return String(item);
  }
  return '0';
});

watch(currentCurrency, (newVal) => {
  emit('update:currency', newVal);
});
</script>

<style scoped>
.currency-wrapper {
  font-size: 12px;
}

.currency-balance {
  color: red;
}
</style>