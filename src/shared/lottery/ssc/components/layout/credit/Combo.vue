<template>
  <div class="combo-board">
    <div class="combo-cells">
      <div
          v-for="(cell, idx) in cells"
          :key="idx"
          class="ball-item combo-cell"
          :class="{ selected: cell.selected, ['segmentation-' + seg]: true }"
          @click="toggle(cell)"
      >
        <span class="ball-title">{{ t(cell.title) }}</span>
      </div>
    </div>
    <div class="combo-footer">
      <div class="combo-input">
        <span>每注金额</span>
        <el-input
            v-model="amount"
            size="small"
            type="text"
            class="ball-input"
            @input="update"
            @click.stop="selectInputValue($event)"
        />
      </div>
      <div class="combo-stat">
        已选 <b>{{ selectedCount }}</b> 个（至少 {{ minSelected }}），共 <b>{{ betCount }}</b> 注
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { resolveMethodTitle } from '@lottery/base/utils/common';

const { t, te } = useI18n();
const props = defineProps({
  methodCurrent: { type: Object, required: true },
  store: { type: Object, required: true },
});

const { creditSelectedBalls, creditBetCount, reset } = storeToRefs(props.store);

const groupSize = computed(() => props.methodCurrent.combo?.groupSize ?? 2);
const minSelected = computed(() => props.methodCurrent.combo?.minSelected ?? groupSize.value);
const seg = computed(() => props.methodCurrent.segmentation ?? 6);
const firstPrize = computed(() => props.methodCurrent.levels?.[0]?.prize ?? 0);

const buildCells = (m) => (m.layout?.rows?.[0]?.number ?? []).map((c) => ({ value: c.value, title: c.title, selected: false }));
const cells = ref(buildCells(props.methodCurrent));
const amount = ref('');

const selectedCount = computed(() => cells.value.filter((c) => c.selected).length);

// 组合数 C(n,k)
const comb = (n, k) => {
  if (k > n || k < 0) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
};
const betCount = computed(() => (selectedCount.value >= minSelected.value ? comb(selectedCount.value, groupSize.value) : 0));

function selectInputValue(e) { if (e.target.value) e.target.select(); }

function toggle(cell) { cell.selected = !cell.selected; update(); }

function update() {
  const raw = String(amount.value).replace(/[^0-9]/g, '');
  const amt = parseInt(raw) || 0;
  amount.value = raw;
  const sign = props.methodCurrent.sign;
  const selected = cells.value.filter((c) => c.selected);
  const valid = selected.length >= minSelected.value && amt > 0;
  creditSelectedBalls.value[sign] = valid
      ? selected.map((c) => ({
        methodSign: sign,
        methodTitle: resolveMethodTitle(props.methodCurrent, t, te),
        value: c.value,
        title: c.title,
        prize: firstPrize.value,
        combo: { groupSize: groupSize.value },
        amount: amt,
      }))
      : [];
  creditBetCount.value = valid ? betCount.value : 0;
}

// 切换玩法 / 重置时清空
watch(() => props.methodCurrent, (m) => { cells.value = buildCells(m); amount.value = ''; });
watch(() => reset.value, (v) => { if (v) { cells.value = buildCells(props.methodCurrent); amount.value = ''; } });
</script>

<style lang="scss" scoped>
.combo-board { padding: 10px; }
.combo-cells { display: flex; flex-wrap: wrap; gap: 8px; }
.combo-cell {
  box-sizing: border-box;
  display: flex; align-items: center; justify-content: center;
  height: 34px; border: 1px solid #dee3e8; border-radius: 4px; cursor: pointer;
  background: #fff; color: #333; user-select: none;
  &.selected { background: #409eff; color: #fff; border-color: #409eff; }
}
.combo-footer {
  display: flex; align-items: center; gap: 16px; margin-top: 12px;
  .combo-input { display: flex; align-items: center; gap: 6px; .ball-input { width: 90px; } }
  .combo-stat { font-size: 13px; color: #666; b { color: #ff8989; } }
}
</style>
