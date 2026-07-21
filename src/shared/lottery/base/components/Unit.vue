<template>
  <div class="unit-wrapper">
    <label class="unit-label">每注：</label>

    <!-- 单价输入框 + 币种单位后缀 -->
    <div class="unit-field">
      <input
          type="number"
          class="unit-input"
          v-model="inputVal"
          :placeholder="String(min)"
          @change="commit"
          @keyup.enter="commit"
      />
      <span class="unit-cur">{{ symbol }}</span>
    </div>

    <!-- 快捷档位:筹码样式(圆形 + 不同颜色边缘) -->
    <div class="chips">
      <span
          v-for="(opt, idx) in options"
          :key="idx"
          class="chip"
          :class="{ active: Number(price) === opt }"
          :style="{ '--chip-color': chipColor(idx) }"
          @click="pick(opt)"
      >
        {{ opt }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useCommonStore } from '@shared/stores/commonStore';

const props = defineProps({
  // 单价:每注下多少钱(倍数已下线)。
  price: { type: Number, default: 1 },
  // 自由输入区间(后端下发),越界自动 clamp。
  min: { type: Number, default: 1 },
  max: { type: Number, default: 100000 },
  // 快捷档位(后端下发,默认 1/2/5/10/50/100)。
  options: { type: Array, default: () => [1, 2, 5, 10, 50, 100] },
  // 当前下注币种(用于展示单位符号)。
  currency: { type: String, default: 'cny' },
});
const emit = defineEmits(['update:price']);

const commonStore = useCommonStore();
// 币种单位符号(¥ / U 等);拿不到回落 ¥。
const symbol = computed(() => commonStore.getCurrencyInfo?.(props.currency)?.symbol || '¥');

// 筹码边缘配色:按档位下标循环取,保证每颗筹码边缘颜色不同。
const CHIP_PALETTE = ['#e74c3c', '#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#16a085', '#f1c40f', '#34495e'];
const chipColor = (idx) => CHIP_PALETTE[idx % CHIP_PALETTE.length];

const inputVal = ref(props.price);
watch(() => props.price, (v) => { inputVal.value = v; });

// 归一 + clamp 到 [min,max];非数字回落 min。
function clamp(v) {
  let n = Number(v);
  if (!Number.isFinite(n)) n = props.min;
  if (n < props.min) n = props.min;
  if (n > props.max) n = props.max;
  return n;
}

function apply(v) {
  const n = clamp(v);
  inputVal.value = n;
  emit('update:price', n);
}

const commit = () => apply(inputVal.value);
const pick = (v) => apply(v);
</script>

<style lang="scss" scoped>
.unit-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 34px;
}

.unit-label {
  font-size: 13px;
  color: #535d76;
}

/* 输入框 + 单位后缀 */
.unit-field {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 8px;
  border: 1px solid rgba(201, 202, 228, .57);
  border-radius: 4px;
  background: #fff;
}

.unit-input {
  width: 56px;
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #3d4864;
  /* 去掉 number 输入框的上下箭头 */
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.unit-cur {
  margin-left: 4px;
  padding-left: 6px;
  border-left: 1px solid #e6e8f0;
  font-size: 13px;
  color: #909399;
}

/* 筹码快捷档位 */
.chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
  background: #fff;
  color: var(--chip-color);
  /* 虚线边 + 内白环 = 筹码质感 */
  border: 2px dashed var(--chip-color);
  box-shadow: inset 0 0 0 3px #fff, 0 1px 2px rgba(0, 0, 0, .12);
  transition: transform .12s, box-shadow .12s;
}

.chip:hover {
  transform: translateY(-1px);
}

.chip.active {
  background: var(--chip-color);
  color: #fff;
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, .55), 0 2px 5px rgba(0, 0, 0, .22);
}
</style>
