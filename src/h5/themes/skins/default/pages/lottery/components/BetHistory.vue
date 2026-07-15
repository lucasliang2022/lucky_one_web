<template>
  <div class="h5-bet-history">
    <!-- 未登录 -->
    <van-empty
      v-if="!isLoggedIn"
      :description="t('h5.ssc.history.notLoggedIn')"
    />

    <!-- 加载态 -->
    <van-loading v-else-if="orderListLoading" class="h5-bet-history__loading" vertical>
      {{ t('h5.ssc.history.loading') }}
    </van-loading>

    <!-- 错误态 -->
    <div v-else-if="orderListError" class="h5-bet-history__error">
      {{ orderListError || t('h5.ssc.history.error') }}
    </div>

    <!-- 空态 -->
    <van-empty
      v-else-if="!rows.length"
      :description="t('h5.ssc.history.empty')"
    />

    <!-- 列表 -->
    <div v-else class="h5-bet-history__list">
      <div
        v-for="row in rows"
        :key="row.key"
        class="h5-bet-history__item"
      >
        <div class="h5-bet-history__row h5-bet-history__row--top">
          <span class="h5-bet-history__method">
            <van-tag :type="row.mode === 'credit' ? 'warning' : 'primary'" plain>
              {{ row.mode === 'credit' ? t('h5.ssc.history.modeCredit') : t('h5.ssc.history.modeOfficial') }}
            </van-tag>
            {{ row.method }}
          </span>
          <span
            class="h5-bet-history__status"
            :class="{ 'is-cancelled': row.cancelled }"
          >{{ row.status }}</span>
        </div>

        <div class="h5-bet-history__code">
          <span class="h5-bet-history__label">{{ t('h5.ssc.history.code') }}</span>
          <span class="h5-bet-history__code-val">{{ row.code }}</span>
        </div>

        <div class="h5-bet-history__row h5-bet-history__meta">
          <span>{{ t('h5.ssc.history.count') }}: {{ row.count }}</span>
          <span>{{ t('h5.ssc.history.amount') }}: {{ row.amount }}</span>
          <span
            v-if="row.prize !== ''"
            class="h5-bet-history__prize"
          >{{ t('h5.ssc.history.prize') }}: {{ row.prize }}</span>
        </div>

        <div v-if="row.time" class="h5-bet-history__time">
          {{ t('h5.ssc.history.time') }}: {{ row.time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 投注历史:进入 tab 时经共享 store.fetchOrderList({ lottery_id: common.sign }) 拉取,
// 渲染 common.orderList(RespBetHistoryItem[])。字段以后端原始返回为准,故按松散对象读取。
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { t } from '@shared/i18n';
import { formatPrize } from '@shared/utils/common';
import { useUserStore } from '@shared/stores/userStore';

const props = defineProps<{ store: any }>();

const {
  orderList,
  orderListLoading,
  orderListError,
  sign,
} = storeToRefs(props.store) as any;

const { isLoggedIn } = storeToRefs(useUserStore());

type OrderRaw = Record<string, any>;

const formatTime = (v: unknown): string => {
  if (v === undefined || v === null || v === '' || v === 0) return '';
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isNaN(n) && n > 0) {
    // 秒级时间戳兼容:小于 1e12 视为秒
    const ms = n < 1e12 ? n * 1000 : n;
    const d = new Date(ms);
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString().slice(0, 19).replace('T', ' ');
    }
  }
  return String(v);
};

const rows = computed(() =>
  (orderList.value as OrderRaw[]).map((o, idx) => {
    const cancelled = Number(o.cancel_time ?? 0) > 0;
    const prizeRaw = o.prize_amount ?? o.win_amount ?? o.bonus ?? o.prize ?? o.reward;
    const timeRaw = o.bet_time ?? o.created_at ?? o.create_time ?? o.add_time ?? o.time;
    return {
      key: o.id ?? o.order_id ?? `${o.issue_no ?? ''}-${idx}`,
      mode: o.mode ?? '',
      method: o.method_define?.name ?? o.method_name ?? o.method ?? '--',
      code: o.bet_code_display ?? o.bet_code ?? o.code ?? '--',
      count: o.bet_count ?? o.count ?? 0,
      amount: o.bet_cost !== undefined ? formatPrize(Number(o.bet_cost)) : (o.amount ?? 0),
      prize:
        prizeRaw === undefined || prizeRaw === null || prizeRaw === ''
          ? ''
          : formatPrize(Number(prizeRaw)),
      cancelled,
      status: cancelled
        ? t('h5.ssc.history.statusCancelled')
        : (o.status_text ?? t('h5.ssc.history.statusNormal')),
      time: formatTime(timeRaw),
    };
  }),
);

onMounted(() => {
  if (!isLoggedIn.value) return;
  props.store.fetchOrderList({ lottery_sign: sign.value });
});
</script>

<style lang="scss">
.h5-bet-history {
  padding: 8px 0;

  &__loading {
    padding: 48px 0;
  }

  &__error {
    padding: 24px 16px;
    text-align: center;
    color: #ee0a24;
  }

  &__list {
    padding: 0 12px;
  }

  &__item {
    margin-top: 10px;
    padding: 12px;
    border-radius: 10px;
    background: #fff;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__method {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: var(--van-text-color, #323233);
  }

  &__status {
    font-size: 12px;
    color: var(--van-gray-6, #969799);

    &.is-cancelled {
      color: #ee0a24;
    }
  }

  &__code {
    display: flex;
    gap: 6px;
    margin-top: 8px;
    font-size: 13px;
  }

  &__label {
    flex: 0 0 auto;
    color: var(--van-gray-6, #969799);
  }

  &__code-val {
    flex: 1;
    color: var(--van-text-color, #323233);
    word-break: break-all;
  }

  &__meta {
    margin-top: 8px;
    font-size: 12px;
    color: var(--van-gray-7, #646566);
    gap: 12px;
    justify-content: flex-start;
  }

  &__prize {
    color: #ee0a24;
  }

  &__time {
    margin-top: 6px;
    font-size: 12px;
    color: var(--van-gray-6, #969799);
  }
}
</style>
