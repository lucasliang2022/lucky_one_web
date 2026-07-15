<template>
  <van-popup
    :show="show"
    position="bottom"
    round
    :style="{ maxHeight: '72%' }"
    @update:show="(v) => emit('update:show', v)"
  >
    <div class="h5-chm">
      <div class="h5-chm__header">
        <span class="h5-chm__title">{{ t('h5.ssc.chm.title') }}</span>
        <van-icon name="cross" @click="emit('update:show', false)" />
      </div>

      <!-- 该玩法不支持冷热/遗漏 -->
      <van-empty
        v-if="!isSupported"
        :description="t('h5.ssc.chm.unsupported')"
      />
      <!-- 尚无开奖历史 -->
      <van-empty
        v-else-if="!hasHistory"
        :description="t('h5.ssc.chm.noHistory')"
      />

      <template v-else>
        <!-- 控制区:冷热 / 遗漏 开关 + 期数窗口 -->
        <div class="h5-chm__controls">
          <div class="h5-chm__switches">
            <span
              class="h5-chm__chip"
              :class="{ 'is-active': showColdHot }"
              @click="toggleColdHot"
            >{{ t('h5.ssc.chm.hotCold') }}</span>
            <span
              class="h5-chm__chip"
              :class="{ 'is-active': showOmission }"
              @click="toggleOmission"
            >{{ t('h5.ssc.chm.omission') }}</span>
          </div>
          <div v-if="showColdHot" class="h5-chm__ranges">
            <span
              v-for="r in ranges"
              :key="r"
              class="h5-chm__range"
              :class="{ 'is-active': selectedRange === r }"
              @click="setSelectedRange(r)"
            >{{ r }}</span>
          </div>
        </div>

        <div class="h5-chm__legend">
          <span class="h5-chm__legend-item"><i class="dot hot"></i>{{ t('h5.ssc.chm.legendHot') }}</span>
          <span class="h5-chm__legend-item"><i class="dot cold"></i>{{ t('h5.ssc.chm.legendCold') }}</span>
          <span class="h5-chm__legend-item"><i class="dot miss"></i>{{ t('h5.ssc.chm.legendMiss') }}</span>
        </div>

        <!-- 各位置(行)号码的 冷热 / 遗漏 -->
        <div class="h5-chm__body">
          <div
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            class="h5-chm__row"
          >
            <div class="h5-chm__row-label">{{ rowLabel(row) }}</div>
            <div class="h5-chm__balls">
              <div
                v-for="ball in (row.number || [])"
                :key="String(ball.value)"
                class="h5-chm__ball"
              >
                <span class="h5-chm__ball-value">{{ ballLabel(ball) }}</span>
                <span
                  v-if="showColdHot"
                  class="h5-chm__ball-hot"
                  :class="getHotColdClass(ball.hot_cold ?? null, rowIndex)"
                >{{ ball.hot_cold ?? '-' }}</span>
                <span
                  v-if="showOmission"
                  class="h5-chm__ball-miss"
                  :class="getOmissionClass(ball.omission ?? null, rowIndex)"
                >{{ ball.omission ?? '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
// 官方彩「冷热遗漏」面板:数据全部来自共享 officialLogic 实例算出的 rows[].number[].hot_cold / .omission
// (由 bet.vue 统一创建的 logic 实例,calculateChmFn 按玩法 layout.type 从 @lottery/ssc/logic/chm 取)。
// 面板只负责触发 store.showColdHot / showOmission / selectedRange 与展示,不自己算冷热遗漏。
import { computed, watch, type PropType, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { t } from '@shared/i18n';
import i18n from '@shared/i18n';
import type { LotteryStore } from '@lottery/base/stores/storeTypes';
import type { MethodRow, MethodRowNumber } from '@shared/types';

interface OfficialLogic {
  rows: Ref<MethodRow[]>;
  getHotColdClass: (count: number | null, rowIndex: number) => string;
  getOmissionClass: (omission: number | null, rowIndex: number) => string;
}

const props = defineProps({
  show: { type: Boolean, default: false },
  store: { type: Object as PropType<LotteryStore>, required: true },
  logic: { type: Object as PropType<OfficialLogic>, required: true },
});
const emit = defineEmits<{ (e: 'update:show', v: boolean): void }>();

const te = (key: string): boolean => i18n.global.te(key);

const { rows, getHotColdClass, getOmissionClass } = props.logic;
const {
  officialMethodCurrent,
  issueHistory,
  showColdHot,
  showOmission,
  selectedRange,
} = storeToRefs(props.store);

const ranges = [20, 50, 100] as const;

const isSupported = computed(
  () => officialMethodCurrent.value?.lr_status === true && officialMethodCurrent.value?.yl_status === true,
);
const hasHistory = computed(() => (issueHistory.value?.length ?? 0) > 0);

function toggleColdHot(): void {
  showColdHot.value = !showColdHot.value;
}
function toggleOmission(): void {
  showOmission.value = !showOmission.value;
}
function setSelectedRange(r: number): void {
  selectedRange.value = r;
}

// 打开面板时,若该玩法支持则默认开启冷热+遗漏;关闭时复位,避免残留计算影响其它面板。
watch(
  () => props.show,
  (open) => {
    if (open && isSupported.value && hasHistory.value) {
      showColdHot.value = true;
      showOmission.value = true;
    } else if (!open) {
      showColdHot.value = false;
      showOmission.value = false;
    }
  },
);

function ballLabel(ball: MethodRowNumber): string {
  const title = ball.title;
  if (title === undefined || title === null || title === '') return String(ball.value ?? '');
  const s = String(title);
  return te(s) ? t(s) : s;
}

function rowLabel(row: MethodRow): string {
  if (row.title) {
    const s = String(row.title);
    return te(s) ? t(s) : s;
  }
  const pos = row.position;
  if (Array.isArray(pos) && pos.length === 1) {
    const key = 'h5.ssc.pos.' + pos[0];
    if (te(key)) return t(key);
  }
  return t('h5.ssc.selectLabel');
}
</script>

<style lang="scss">
.h5-chm {
  display: flex;
  flex-direction: column;
  max-height: 72vh;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid var(--van-border-color, #ebedf0);
  }

  &__controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 16px;
  }

  &__switches,
  &__ranges {
    display: flex;
    gap: 8px;
  }

  &__chip,
  &__range {
    padding: 4px 14px;
    font-size: 13px;
    border-radius: 14px;
    background: var(--van-gray-1, #f7f8fa);
    color: var(--van-gray-7, #646566);
    border: 1px solid var(--van-border-color, #ebedf0);

    &.is-active {
      background: #1989fa;
      color: #fff;
      border-color: #1989fa;
    }
  }

  &__legend {
    display: flex;
    gap: 14px;
    padding: 0 16px 8px;
    font-size: 11px;
    color: var(--van-gray-6, #969799);

    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 4px;
      vertical-align: middle;

      &.hot { background: #ee0a24; }
      &.cold { background: #1989fa; }
      &.miss { background: #ff976a; }
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px 20px;
  }

  &__row {
    padding: 10px 0;
    border-bottom: 1px solid var(--van-border-color, #ebedf0);

    &:last-child { border-bottom: none; }
  }

  &__row-label {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--van-text-color, #323233);
  }

  &__balls {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }

  &__ball {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 2px;
    border-radius: 8px;
    background: var(--van-gray-1, #f7f8fa);
    border: 1px solid var(--van-border-color, #ebedf0);
  }

  &__ball-value {
    font-size: 15px;
    font-weight: 600;
    color: var(--van-text-color, #323233);
  }

  &__ball-hot {
    margin-top: 2px;
    font-size: 12px;
    color: var(--van-gray-7, #646566);

    &.hot { color: #ee0a24; font-weight: 700; }
    &.cold { color: #1989fa; font-weight: 700; }
  }

  &__ball-miss {
    margin-top: 1px;
    font-size: 11px;
    color: var(--van-gray-6, #969799);

    &.max-omission { color: #ff6034; font-weight: 700; }
  }
}
</style>
