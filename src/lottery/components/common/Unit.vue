<template>
  <div class="unit-wrapper">
    <div class="unit-title">每注：</div>
    <div class="unit-selector">
      <span
          v-for="(opt, idx) in unitOptions"
          :key="idx"
          :class="{ active: price === opt.value }"
          @click="onSelectUnit(opt.value)"
      >
        {{ opt.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useCommonStore } from '@/stores/commonStore.js';

const props = defineProps({
  price: {
    type: Number,
    default: 1,
  },
});
const emit = defineEmits(['update:price']);

const commonStore = useCommonStore();
// 防御性兜底：commonStore.unitOptions 在 SystemConfig 未加载时也会返回默认值，
// 这里再加一层 ?? [] 防止极端情况 store 还没注入。
const unitOptions = computed(() => commonStore.unitOptions ?? []);

// 选项变化时如果当前 price 不在选项里，回落到第一个
const ensureValidPrice = () => {
  const opts = unitOptions.value;
  if (!opts || !opts.length) return;
  if (!opts.some(opt => opt.value === props.price)) {
    emit('update:price', opts[0].value);
  }
};

onMounted(ensureValidPrice);
watch(unitOptions, ensureValidPrice);

function onSelectUnit(val) {
  emit('update:price', val);
}
</script>

<style lang="scss" scoped>
.unit-wrapper {
  display: flex;
  align-items: center;
  min-height: 40px;

  .unit-title {
    font-size: 13px;
    color: #535d76;
    margin-right: 1px;
  }

  .unit-selector {
    display: flex;
    width: 260px;
    min-width: 160px;
    height: 35px;
    border: 1px solid rgba(201, 202, 228, .57);
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
      vertical-align: top;
      cursor: pointer;
      white-space: nowrap;
      line-height: 35px;

      &:after {
        position: absolute;
        right: -1px;
        top: 8px;
        content: "";
        display: inline-block;
        width: 1px;
        height: 17px;
        background-color: #d4d5e7;
      }

      &.active {
        background: #1c9eff;
        color: #fff;
      }
    }
  }
}
</style>