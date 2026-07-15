<template>
  <div class="currency-wrapper">
    <div class="flex items-center mt-3 gap-x-2.5">
      <el-select
          v-model="currentCurrency"
          size="default"
          class="currency-select"
          :teleported="false"
      >
        <el-option
            v-for="(item, index) in currencyOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <p class="text-txt-secondary text-xs">
        余额：<span class="currency-balance">{{ currencySymbol }}{{ balance }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useUserStore } from '@shared/stores/userStore.ts';
import { useCommonStore } from '@shared/stores/commonStore';

const commonStore = useCommonStore();
const userStore = useUserStore();
const emit = defineEmits(['update:currency']);

// 货币下拉项；commonStore 在没拿到 SystemConfig 时也会返回内置兜底，
// 所以这里直接用 computed，不再用 ref 初始化期值（避免初始化时 [0] 不存在）。
const currencyOptions = computed(() => commonStore.currencyOptions ?? []);

// 投注页币种：默认跟顶部选中的一致（userStore.currentCurrency），
// 但只是本组件的「本地」选择——切换它不动顶部（不调 switchCurrency）。
const currentCurrency = ref(userStore.currentCurrency);

// 校正：优先顶部币种，其次列表第一个。currencyOptions 异步到位后，
// 若当前选中的不在列表里，自动回落。
watch(currencyOptions, (list) => {
  if (!list || !list.length) return;
  if (list.some(o => o.value === currentCurrency.value)) return;
  const top = userStore.currentCurrency;
  currentCurrency.value = list.some(o => o.value === top) ? top : list[0].value;
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

// 切币种：①同步给父级（驱动档位/下注币种）②拉一次余额——余额挂在共享的
// userStore.balance 上，刷新后顶部余额也会跟着更新；但顶部选中的币种不受影响。
watch(currentCurrency, async (newVal) => {
  emit('update:currency', newVal);
  try {
    await userStore.fetchBalance();
  } catch (e) {
    console.error('fetch balance failed', e);
  }
});

// 挂载即把「默认币种（顶部）」同步给父级，保证初始档位/余额和顶部一致。
onMounted(() => {
  emit('update:currency', currentCurrency.value);
});
</script>

<style scoped>
.currency-wrapper {
  font-size: 12px;
}

/* 宽度足够放下币种全称(人民币/泰达币/USDT 等),不被 flex 容器挤窄 */
.currency-select {
  width: 130px;
  flex: none;
}

.currency-balance {
  color: red;
}
</style>