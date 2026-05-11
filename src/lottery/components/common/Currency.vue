<template>
  <div class="currency-wrapper">
    <div class="flex items-center mt-3 gap-x-2.5">
      <div class="w-[140px]">
        <el-radio-group v-model="currentCurrency" size="default">
          <el-radio-button
              v-for="(item, index) in commonStore.currencyOptions"
              :key="index"
              :value="item.value">
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <p class="text-txt-secondary text-xs">
        余额：<span class="currency-balance">{{ commonStore.getCurrencyInfo(currentCurrency).symbol }}{{ balance }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '@/stores/userStore.ts';
import { useCommonStore } from '@/stores/commonStore';

const commonStore = useCommonStore();
const emit = defineEmits(['update:currency']);

const currentCurrency = ref(commonStore.currencyOptions[0].value);
const userStore = useUserStore();

const balance = computed(() => {
  switch (currentCurrency.value) {
    case 'cny':
      return userStore.balance.main.cny;
    case 'usdt':
      return userStore.balance.main.usdt;
    default:
      return 0;
  }
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
