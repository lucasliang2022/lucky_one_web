<template>
  <!-- 多币种：hover 展开下拉 -->
  <el-tooltip
      v-if="hasMultipleCurrencies"
      effect="light"
      placement="bottom-end"
      popper-class="nav-balance-popper"
      :show-arrow="false"
      :hide-after="200"
  >
    <span class="balance-trigger">
      <span class="cur-label">{{ currentCurrencyLabel }}</span>
      <span class="balance-value">{{ currentBalanceFormatted }}</span>
      <el-icon class="arrow"><ArrowDown /></el-icon>
      <span class="fresh-icon" :class="{ rotating: refreshing }" @click.stop="onRefresh">
        <span class="sd-icon icon-sd-fresh"></span>
      </span>
    </span>

    <template #content>
      <div class="balance-panel">
        <div
            v-for="cur in commonStore.currencies"
            :key="cur.code"
            class="balance-row"
            :class="{ 'is-current': cur.code === userStore.currentCurrency }"
            @click="onSelectCurrency(cur.code)"
        >
          <div class="row-main">
            <span class="row-code">{{ codeOf(cur.code) }}</span>
            <span class="row-name">{{ cur.label }}</span>
          </div>
          <div class="row-amount">
            <span class="amount-symbol">{{ cur.symbol }}</span>
            <span class="amount-number">{{ formatBalance(cur.code) }}</span>
          </div>
          <el-button
              size="small"
              text
              type="primary"
              class="row-recharge"
              @click.stop="onRecharge(cur.code)"
          >
            {{ t('components.nav.recharge') }}
          </el-button>
        </div>

        <div v-if="!commonStore.currencies.length" class="empty">
          {{ t('components.nav.noCurrencies') }}
        </div>
      </div>
    </template>
  </el-tooltip>

  <!-- 单币种：只显示余额，无下拉 -->
  <span v-else class="balance-trigger no-dropdown">
    <span class="cur-label">{{ currentCurrencyLabel }}</span>
    <span class="balance-value">{{ currentBalanceFormatted }}</span>
    <span class="fresh-icon" :class="{ rotating: refreshing }" @click.stop="onRefresh">
      <span class="sd-icon icon-sd-fresh"></span>
    </span>
  </span>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElTooltip, ElIcon, ElButton } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { useCommonStore } from '@/stores/commonStore';
import { useUserStore } from '@/stores/userStore';

const { t } = useI18n();
const commonStore = useCommonStore();
const userStore = useUserStore();

const refreshing = ref(false);

const hasMultipleCurrencies = computed(() => commonStore.currencies.length >= 2);

/** 顶部 trigger 用本地化标签（人民币 / Chinese Yuan / หยวนจีน...） */
const currentCurrencyLabel = computed(() => {
  const cur = commonStore.getCurrency(userStore.currentCurrency);
  return cur?.label || codeOf(userStore.currentCurrency);
});

/** 下拉里每行用大写代码（RMB / USDT / PHP），更紧凑 */
const codeOf = (code: string): string => {
  const aliases: Record<string, string> = { cny: 'RMB' };
  return aliases[code] ?? (code || '').toUpperCase();
};

const currentBalanceFormatted = computed(() => formatBalance(userStore.currentCurrency));

/** 余额数字（按币种 decimal_places 截断，不带符号） */
const formatBalance = (currencyCode: string): string => {
  const wallet = userStore.balance[currencyCode];
  const cur = commonStore.getCurrency(currencyCode);
  const decimals = cur?.decimal_places ?? 2;
  const num = wallet ? parseFloat(wallet.amount) : 0;

  try {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch {
    return num.toFixed(decimals);
  }
};

const onSelectCurrency = async (code: string) => {
  if (code === userStore.currentCurrency) return;
  try {
    await userStore.switchCurrency(code);
  } catch (e) {
    console.error('switch currency failed', e);
  }
};

const onRefresh = async () => {
  if (refreshing.value) return;
  refreshing.value = true;
  try {
    await userStore.fetchBalance();
  } finally {
    refreshing.value = false;
  }
};

const onRecharge = (currency: string) => {
  console.log('recharge', currency);
  // TODO: 跳充值页 / 打开充值弹窗
};
</script>

<style lang="scss" scoped>
.balance-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  min-width: 160px;          /* ★ 防 CLS，预留宽度 */
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  padding: 0 8px;
  border-radius: 4px;
  transition: background-color 0.15s;

  &:hover:not(.no-dropdown) { background-color: rgba(50, 107, 199, 0.06); }
  &.no-dropdown { cursor: default; }
}

.cur-label {
  color: #666;
  font-size: 13px;
  font-weight: 500;
}

.balance-value {
  color: #e4393c;
  font-weight: 600;
  font-size: 14px;
  font-family: 'DINAlternate', -apple-system, monospace;
  min-width: 70px;
  display: inline-block;
  text-align: left;
}

.arrow {
  font-size: 12px;
  color: #999;
  transition: transform 0.2s;
}

.fresh-icon {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-left: 2px;

  .sd-icon { font-size: 14px; color: #488ded; }
  &.rotating .sd-icon { animation: spin 0.8s linear infinite; }
}

@keyframes spin {
  from { transform: rotate(0); }
  to   { transform: rotate(360deg); }
}
</style>

<style lang="scss">
/* popper 全局样式 */
.nav-balance-popper {
  --el-popper-bg-color: #fff;

  padding: 6px !important;
  width: max-content;
  min-width: 320px;
  max-width: 480px;
  font-size: 13px;
  border-radius: 8px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;

  .balance-panel {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* —— 每一行 —— */
  .balance-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 14px;
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    transition: background-color 0.15s;

    /* 左侧色条：默认透明，当前币种激活 */
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      bottom: 8px;
      width: 3px;
      border-radius: 2px;
      background-color: transparent;
      transition: background-color 0.15s;
    }

    &:hover { background-color: #f5f7fa; }

    &.is-current {
      background-color: #f0f7ff;
      &::before { background-color: #326BC7; }

      .row-code   { color: #326BC7; }
      .row-amount .amount-number { color: #326BC7; }
    }
  }

  /* —— 主信息：code + name —— */
  .row-main {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;

    .row-code {
      font-weight: 700;
      color: #333;
      font-size: 14px;
      letter-spacing: 0.3px;
    }
    .row-name {
      color: #999;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  /* —— 余额 —— */
  .row-amount {
    display: flex;
    align-items: baseline;
    gap: 2px;
    font-family: 'DINAlternate', -apple-system, monospace;
    color: #333;
    font-weight: 600;
    text-align: right;
    white-space: nowrap;

    .amount-symbol { font-size: 12px; color: #999; }
    .amount-number { font-size: 14px; transition: color 0.15s; }
  }

  /* —— 充值按钮 —— */
  .row-recharge {
    padding: 0 6px;
    font-size: 12px;
    opacity: 0.6;
    transition: opacity 0.15s;
  }
  .balance-row:hover .row-recharge { opacity: 1; }

  /* —— 空状态 —— */
  .empty {
    padding: 20px;
    text-align: center;
    color: #999;
  }
}
</style>