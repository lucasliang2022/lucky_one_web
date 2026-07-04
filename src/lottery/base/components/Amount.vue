<template>
  <div class="unit-wrapper">
    <div class="unit-title">每注：</div>
    <div class="unit-selector">
      <span
          v-for="(opt, idx) in amountOptions"
          :key="idx"
          :class="{ active: amount === opt.value }"
          @click="onSelectAmount(opt.value)"
      >
        {{ opt.label }}
      </span>
      <input
          class="custom-input"
          type="text"
          v-model="customAmount"
          @input="onCustomAmountInput"
          @blur="onCustomAmountBlur"
          placeholder="自定义"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCommonStore } from '@/stores/commonStore.js';
import { storeToRefs } from "pinia";

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const commonStore = useCommonStore();
const { amount } = storeToRefs(props.store);
const amountOptions = computed(() => commonStore.amountOptions);
const customAmount = ref('');

const onSelectAmount = (value) => {
  amount.value = value;
  customAmount.value = '';
};

const onCustomAmountInput = (event) => {
  const value = event.target.value.trim().replace(/[^0-9]/g, '');
  customAmount.value = value;
  if (value) {
    amount.value = parseInt(value, 10);
  }
};

const onCustomAmountBlur = () => {
  if (!customAmount.value) {
    amount.value = amountOptions.value[0].value;
  }
};

onMounted(() => {
  if (!amount.value) {
    amount.value = amountOptions.value[0].value;
  }
});
</script>

<style lang="scss" scoped>
.unit-wrapper {
  display: flex;
  align-items: center;
  min-height: 40px;
  .unit-title {
    font-size: 13px;
    color: #535d76;
    margin-right: 5px;
  }
  .unit-selector {
    display: flex;
    width: 360px; /* 增加宽度以容纳输入框 */
    min-width: 260px;
    height: 35px;
    border: 1px solid rgba(201, 202, 228, 0.57);
    border-radius: 4px;
    background: #fff;
    overflow: hidden;
    span {
      position: relative;
      display: inline-block;
      flex: 1;
      font-size: 12px;
      color: #535d76;
      text-align: center;
      cursor: pointer;
      white-space: nowrap;
      line-height: 35px;
      &:after {
        position: absolute;
        right: -1px;
        top: 8px;
        content: '';
        display: inline-block;
        width: 1px;
        height: 17px;
        background-color: #d4d5e7;
      }
      &.active {
        background: #1c9eff;
        color: #fff;
      }
      &:last-child:after {
        display: none; /* 最后一个选项不显示分隔线 */
      }
    }
    .custom-input {
      width: 80px; /* 输入框宽度 */
      padding: 0 5px;
      border: none;
      border-left: 1px solid #d4d5e7;
      font-size: 12px;
      text-align: center;
      outline: none;
      background: #fff;
      color: #535d76;
    }
    .custom-input:focus {
      background: #f0faff;
      color: #1c9eff;
    }
  }
}
</style>
