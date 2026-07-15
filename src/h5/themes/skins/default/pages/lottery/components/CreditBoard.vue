<template>
  <!--
    信用盘「选号盘」移动布局:一次覆盖全部信用盘 layout(Ball/Bs/Oe/Ps/SumBs/SumOe/Lh/Zjh)——
    它们本质都是「一组带赔率的标签球 + 金额」。点击球即按当前金额选中,写回共享 store 的
    creditSelectedBalls / creditBetCount(逻辑对齐 web ItemDefault.vue,含 opposition 互斥),
    下注仍走 creditBase 的 build/add/submit。
  -->
  <div class="h5-credit-board">
    <van-empty v-if="methods.length === 0" :description="t('h5.ssc.credit.empty')" />
    <div
      v-for="m in methods"
      :key="m.sign"
      class="h5-credit-board__method"
    >
      <div class="h5-credit-board__title">{{ m.title }}</div>
      <div class="h5-credit-board__balls">
        <span
          v-for="ball in m.balls"
          :key="String(ball.value)"
          class="h5-credit-board__ball"
          :class="{ 'is-selected': isSelected(m.sign, ball.value) }"
          @click="toggle(m, ball)"
        >
          <span class="h5-credit-board__ball-name">{{ ballTitle(ball) }}</span>
          <span v-if="isNumberPrize(ball.prize)" class="h5-credit-board__ball-prize">
            {{ ball.prize }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { t } from '@shared/i18n';
import i18n from '@shared/i18n';

const props = defineProps({
  store: {
    type: Object,
    required: true,
  },
});

const store = props.store as any;
const {
  creditGroupCurrent,
  creditSelectedBalls,
  creditBetCount,
  amount,
} = storeToRefs(store) as any;

const te = (key: string): boolean => i18n.global.te(key);

interface CreditBall {
  value: any;
  title: string;
  prize: number | string;
}
interface CreditMethodView {
  sign: string;
  title: string;
  opposition: string[];
  balls: CreditBall[];
}

function methodTitleOf(method: any): string {
  const sign = method?.title_sign;
  if (sign && te(sign)) {
    const v = t(sign);
    if (v && v !== sign) return v;
  }
  return method?.title ?? '';
}

function prizeForBall(method: any, value: any): number | string {
  const levels = method?.levels ?? [];
  if (!levels.length) return 0;
  const level = levels.find((l: any) =>
    !Array.isArray(l.codes) || l.codes.length === 0 || l.codes.includes(value),
  );
  return level?.prize ?? 0;
}

// 从 creditGroupCurrent.layout 展平出每个玩法的球盘(与 web DefaultGroup 一致的数据来源)。
const methods = computed<CreditMethodView[]>(() => {
  const group = creditGroupCurrent.value as any;
  if (!group || !Array.isArray(group.layout) || !group.methods) return [];
  const result: CreditMethodView[] = [];
  for (const layoutRow of group.layout) {
    const rowMethods = layoutRow?.methods || {};
    for (const key of Object.keys(rowMethods)) {
      const cfg = rowMethods[key];
      const method = group.methods[cfg.target ?? key];
      const numberList = method?.layout?.rows?.[0]?.number;
      if (!method || !Array.isArray(numberList)) continue;
      result.push({
        sign: method.sign ?? cfg.target ?? key,
        title: methodTitleOf(method),
        opposition: (method.layout?.opposition ?? []).flat().map((v: any) => String(v)),
        balls: numberList.map((item: any) => ({
          value: item.value,
          title: item.title,
          prize: prizeForBall(method, item.value),
        })),
      });
    }
  }
  return result;
});

function ballTitle(ball: CreditBall): string {
  const title = ball.title;
  if (title === undefined || title === null || title === '') return String(ball.value ?? '');
  const s = String(title);
  return te(s) ? t(s) : s;
}

function isNumberPrize(prize: number | string): boolean {
  return typeof prize === 'number' && !isNaN(prize);
}

function isSelected(sign: string, value: any): boolean {
  const list = creditSelectedBalls.value[sign];
  return Array.isArray(list) && list.some((x: any) => String(x.value) === String(value));
}

function recomputeCount(): void {
  creditBetCount.value = Object.values(creditSelectedBalls.value).reduce(
    (total: number, arr: any) => total + (Array.isArray(arr) ? arr.length : 0),
    0,
  );
}

// 选号写回:与 web ItemDefault.updateCreditSelectedBalls 对齐(含 opposition 互斥、金额取当前 amount)。
function toggle(m: CreditMethodView, ball: CreditBall): void {
  const sign = m.sign;
  const current = Array.isArray(creditSelectedBalls.value[sign])
    ? [...creditSelectedBalls.value[sign]]
    : [];
  const existingIndex = current.findIndex((x: any) => String(x.value) === String(ball.value));

  let next: any[];
  if (existingIndex !== -1) {
    // 再次点击取消
    next = current.filter((_: any, i: number) => i !== existingIndex);
  } else {
    // opposition:同玩法内互斥项(如 大/小、单/双)只保留最新一个
    let base = current;
    if (m.opposition.length > 0 && m.opposition.includes(String(ball.value))) {
      base = current.filter(
        (x: any) => !m.opposition.includes(String(x.value)) || String(x.value) === String(ball.value),
      );
    }
    next = [
      ...base,
      {
        methodTitle: m.title,
        methodSign: sign,
        value: ball.value,
        title: ball.title,
        prize: ball.prize,
        amount: Number(amount.value) || 1,
      },
    ];
  }

  creditSelectedBalls.value = { ...creditSelectedBalls.value, [sign]: next };
  recomputeCount();
}
</script>

<style lang="scss">
.h5-credit-board {
  padding: 4px 12px 12px;
  background: #fff;

  &__method {
    padding: 10px 0;
    border-bottom: 1px solid var(--van-border-color, #ebedf0);

    &:last-child {
      border-bottom: none;
    }
  }

  &__title {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--van-text-color, #323233);
  }

  &__balls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  &__ball {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 4px 2px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    background: var(--van-gray-1, #f7f8fa);
    color: var(--van-text-color, #323233);
    border: 1px solid var(--van-border-color, #ebedf0);
    transition: transform 0.1s ease;

    &.is-selected {
      background: #ee0a24;
      color: #fff;
      border-color: #ee0a24;
    }
  }

  &__ball-prize {
    margin-top: 2px;
    font-size: 10px;
    font-weight: 400;
    opacity: 0.75;
  }
}
</style>
