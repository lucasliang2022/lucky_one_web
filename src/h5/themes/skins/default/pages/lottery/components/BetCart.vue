<template>
  <van-popup
    :show="show"
    position="bottom"
    round
    :style="{ maxHeight: '70%' }"
    @update:show="(v) => emit('update:show', v)"
  >
    <div class="h5-cart">
      <div class="h5-cart__header">
        <span class="h5-cart__title">
          {{ t('h5.ssc.cart.title') }}
          <span v-if="items.length" class="h5-cart__count">({{ items.length }})</span>
        </span>
        <span
          v-if="items.length"
          class="h5-cart__clear"
          @click="onClear"
        >{{ t('h5.ssc.cart.clear') }}</span>
      </div>

      <van-empty
        v-if="!items.length"
        :description="t('h5.ssc.cart.empty')"
      />

      <template v-else>
        <div class="h5-cart__body">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="h5-cart__item"
          >
            <div class="h5-cart__item-main">
              <div class="h5-cart__item-title">{{ itemTitle(item) }}</div>
              <div class="h5-cart__item-code">{{ itemContent(item) }}</div>
              <div class="h5-cart__item-meta">
                <span>{{ t('h5.ssc.cart.countLabel', { count: item.count ?? 1 }) }}</span>
                <span v-if="mode !== 'credit' && item.times">
                  {{ t('h5.ssc.cart.timesLabel', { times: item.times }) }}
                </span>
              </div>
            </div>
            <div class="h5-cart__item-right">
              <div class="h5-cart__item-amount">{{ formatPrize(itemAmount(item)) }}</div>
              <van-icon name="delete-o" class="h5-cart__item-del" @click="onRemove(index)" />
            </div>
          </div>
        </div>

        <div class="h5-cart__footer">
          <div class="h5-cart__total">
            <span>{{ t('h5.ssc.cart.total') }}</span>
            <span class="h5-cart__total-amount">{{ formatPrize(total) }}</span>
          </div>
          <van-button
            type="danger"
            class="h5-cart__submit"
            :loading="submitting"
            @click="emit('submit')"
          >{{ t('h5.ssc.cart.submit') }}</van-button>
        </div>
      </template>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
// 注单预览 / 购物车:官方彩读 officialBetList、信用盘读 creditBetList(均为共享 store 的待提交注单列表)。
// 删除单条 / 清空直接改写 store 里的列表 ref;提交交给父页面走 store 的 official/creditBetSubmit。
import { computed, type PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { t } from '@shared/i18n';
import i18n from '@shared/i18n';
import { formatPrize } from '@shared/utils/common';
import type { LotteryStore } from '@lottery/base/stores/storeTypes';

const props = defineProps({
  show: { type: Boolean, default: false },
  store: { type: Object as PropType<LotteryStore>, required: true },
  mode: { type: String, default: 'official' },
  submitting: { type: Boolean, default: false },
});
const emit = defineEmits<{ (e: 'update:show', v: boolean): void; (e: 'submit'): void }>();

const te = (key: string): boolean => i18n.global.te(key);

const {
  officialBetList,
  creditBetList,
  officialTotalAmount,
  creditTotalAmount,
} = storeToRefs(props.store) as any;

const items = computed<any[]>(() =>
  props.mode === 'credit' ? creditBetList.value : officialBetList.value,
);
const total = computed<number>(() =>
  props.mode === 'credit' ? creditTotalAmount.value : officialTotalAmount.value,
);

function tr(s: unknown): string {
  const str = String(s ?? '');
  return te(str) ? t(str) : str;
}

function itemTitle(item: any): string {
  return tr(item.methodTitle);
}

function itemContent(item: any): string {
  if (props.mode === 'credit') {
    const balls = Array.isArray(item.balls) ? item.balls : [];
    return balls.map((b: any) => tr(b.title) || String(b.value)).join(', ');
  }
  return item.codesDisplay || item.codes || '';
}

function itemAmount(item: any): number {
  if (props.mode === 'credit') return Number(item.amount) || 0;
  return Number(item.cost) || 0;
}

function onRemove(index: number): void {
  if (props.mode === 'credit') {
    creditBetList.value.splice(index, 1);
  } else {
    officialBetList.value.splice(index, 1);
  }
}

function onClear(): void {
  if (props.mode === 'credit') {
    creditBetList.value = [];
  } else {
    officialBetList.value = [];
  }
}
</script>

<style lang="scss">
.h5-cart {
  display: flex;
  flex-direction: column;
  max-height: 70vh;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid var(--van-border-color, #ebedf0);
  }

  &__count {
    font-size: 13px;
    color: var(--van-gray-6, #969799);
    font-weight: 400;
  }

  &__clear {
    font-size: 13px;
    font-weight: 400;
    color: #ee0a24;
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 4px 0;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--van-border-color, #ebedf0);
  }

  &__item-main {
    flex: 1;
    min-width: 0;
  }

  &__item-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--van-text-color, #323233);
  }

  &__item-code {
    margin-top: 4px;
    font-size: 13px;
    color: var(--van-gray-7, #646566);
    word-break: break-all;
  }

  &__item-meta {
    display: flex;
    gap: 12px;
    margin-top: 4px;
    font-size: 12px;
    color: var(--van-gray-6, #969799);
  }

  &__item-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }

  &__item-amount {
    font-size: 15px;
    font-weight: 700;
    color: #ee0a24;
  }

  &__item-del {
    font-size: 20px;
    color: var(--van-gray-6, #969799);
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid var(--van-border-color, #ebedf0);
  }

  &__total {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 13px;
    color: var(--van-gray-7, #646566);
  }

  &__total-amount {
    font-size: 18px;
    font-weight: 700;
    color: #ee0a24;
  }

  &__submit {
    width: 140px;
  }
}
</style>
