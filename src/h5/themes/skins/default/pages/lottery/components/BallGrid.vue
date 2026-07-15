<template>
  <!--
    官方彩「选号盘」移动布局:覆盖所有基于 RowRender 的选号族玩法
    (直选复式 ZxFs / 直选组合 Zh / 组选 ZuFsOneRow·ZuFsTwoRow·Zu3 / 定位胆 Dwd /
     和值 Sum·SumTail·Span / 龙虎 Lh / 大小单双 BsoeZx·BsoeHz / 不定位 Bdw / 趣味 Qw / 牛牛 Nn / 梭哈 Sh / 扎金花 Zjh)。
    选号一律经共享 officialLogic 的 toggleBall / handleQuick 写回 store,不在此拼 bet_code。
  -->
  <div class="h5-ball-grid">
    <div
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      class="h5-ball-grid__row"
    >
      <div class="h5-ball-grid__head">
        <span class="h5-ball-grid__label">{{ rowLabel(row) }}</span>
        <div v-if="row.buttons" class="h5-ball-grid__quick">
          <span
            v-for="q in quickTypes"
            :key="q"
            class="h5-ball-grid__quick-btn"
            @click="handleQuick(rowIndex, q)"
          >{{ t('h5.ssc.quick.' + q) }}</span>
        </div>
      </div>
      <div class="h5-ball-grid__balls" :class="{ 'is-wide': isWide(row) }">
        <span
          v-for="ball in (row.number || [])"
          :key="String(ball.value)"
          class="h5-ball-grid__ball"
          :class="{ 'is-selected': ball.selected, 'is-animating': ball.animating }"
          @click="toggleBall(rowIndex, ball)"
        >
          <span class="h5-ball-grid__ball-title">{{ ballLabel(ball) }}</span>
          <span
            v-if="ball.prize !== undefined && ball.prize !== null"
            class="h5-ball-grid__ball-prize"
          >{{ ball.prize }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType, Ref } from 'vue';
import { t } from '@shared/i18n';
import i18n from '@shared/i18n';
import type { MethodRow, MethodRowNumber } from '@shared/types';

// 共享选号引擎实例由父页面(bet.vue)统一创建并下发,保证选号盘与冷热遗漏面板共用同一份 rows
// (若各自 new 一个 officialLogic 实例,会重复写回 store 的 officialBetCount/officialSelectedBalls,互相清零)。
interface OfficialLogic {
  rows: Ref<MethodRow[]>;
  toggleBall: (rowIndex: number, ball: MethodRowNumber) => void;
  handleQuick: (rowIndex: number, type: string) => void;
}

const props = defineProps({
  logic: {
    type: Object as PropType<OfficialLogic>,
    required: true,
  },
});

const te = (key: string): boolean => i18n.global.te(key);

const { rows, toggleBall, handleQuick } = props.logic;

const quickTypes = ['all', 'big', 'small', 'odd', 'even', 'clear'] as const;

// 球面文案:title 是 i18n key(龙/虎/大/小 等标签盘)则翻译,否则原样(数字盘)。
function ballLabel(ball: MethodRowNumber): string {
  const title = ball.title;
  if (title === undefined || title === null || title === '') return String(ball.value ?? '');
  const s = String(title);
  return te(s) ? t(s) : s;
}

// 行标题:优先 row.title(二重号/单号/三重号…),否则单一位置显示位名(万位…个位),多位置无位名。
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

// 含文字标签(龙/虎/大小)的行用更宽的格子,纯数字盘用紧凑圆形格。
function isWide(row: MethodRow): boolean {
  return (row.number ?? []).some(b => b.title != null && b.title !== '' && isNaN(Number(b.title)));
}
</script>

<style lang="scss">
.h5-ball-grid {
  padding: 4px 12px 12px;
  background: #fff;

  &__row {
    padding: 10px 0;
    border-bottom: 1px solid var(--van-border-color, #ebedf0);

    &:last-child {
      border-bottom: none;
    }
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    min-height: 20px;
  }

  &__label {
    font-size: 14px;
    font-weight: 600;
    color: var(--van-text-color, #323233);
  }

  &__quick {
    display: flex;
    gap: 6px;
  }

  &__quick-btn {
    padding: 2px 8px;
    font-size: 12px;
    border-radius: 10px;
    border: 1px solid var(--van-border-color, #ebedf0);
    color: var(--van-gray-7, #646566);
  }

  &__balls {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;

    &.is-wide {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__ball {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    padding: 4px 2px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    background: var(--van-gray-1, #f7f8fa);
    color: var(--van-text-color, #323233);
    border: 1px solid var(--van-border-color, #ebedf0);
    transition: transform 0.1s ease;

    &.is-selected {
      background: #1989fa;
      color: #fff;
      border-color: #1989fa;
    }

    &.is-animating {
      transform: scale(1.12);
    }
  }

  &__ball-title {
    line-height: 1.2;
  }

  &__ball-prize {
    margin-top: 2px;
    font-size: 10px;
    font-weight: 400;
    opacity: 0.7;
  }
}
</style>
