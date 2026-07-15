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

const props = defineProps({
  price: {
    type: Number,
    default: 1,
  },
  // 每彩种×币种的档位(后端 config.unit_modes,[{value,label}]);由父组件从 store 传入。
  options: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['update:price']);

// 用每彩种下发的档位;为空兜底仅「元」(value=1),别崩。
const unitOptions = computed(() =>
  (props.options && props.options.length) ? props.options : [{ label: '元', value: 1 }],
);

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
    /* 整块不固定宽度:宽度 = 档位数 × 单档宽,随档位数量自适应 */
    display: inline-flex;
    height: 35px;
    border: 1px solid rgba(201, 202, 228, .57);
    border-radius: 4px;
    background: #fff;
    overflow: hidden;

    span {
      position: relative;
      display: inline-block;
      /* 每档位等宽,与档位数量无关(不再 flex:1 被整块宽度均摊) */
      flex: none;
      width: 60px;
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