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
      <span class="cur-code">{{ currentCurrencyCode }}：</span>
      <span class="balance-value">{{ currentBalanceFormatted }}</span>
      <el-icon class="arrow"><ArrowDown /></el-icon>
      <span class="fresh-icon" :class="{ rotating: refreshing }" @click.stop="onRefresh">
        <span class="sd-icon icon-sd-fresh"></span>
      </span>
    </span>

    <template #content>
      <div class="balance-panel">
        <div class="panel-section">
          <div class="section-title">
            <span class="sd-icon icon-sd-wallet"></span>
            <span>{{ t('components.nav.platformBalance') }}</span>
          </div>

          <div
              v-for="cur in commonStore.currencies"
              :key="cur.code"
              class="balance-row"
              :class="{ 'is-current': cur.code === userStore.currentCurrency }"
              @click="onSelectCurrency(cur.code)"
          >
            <div class="row-left">
              <span class="dot"></span>
              <span class="row-code">{{ codeOf(cur.code) }}</span>
              <span class="cur-label">{{ cur.label }}</span>
              <span v-if="cur.code === userStore.currentCurrency" class="current-tag">
                {{ t('components.nav.current') }}
              </span>
            </div>
            <div class="row-right">
              <span class="row-amount">{{ formatBalance(cur.code) }}</span>
              <el-button size="small" link type="primary" @click.stop="onRecharge(cur.code)">
                {{ t('components.nav.recharge') }}
              </el-button>
            </div>
          </div>

          <div v-if="!commonStore.currencies.length" class="empty">
            {{ t('components.nav.noCurrencies') }}
          </div>
        </div>
      </div>
    </template>
  </el-tooltip>

  <!-- 单币种：只显示余额，无下拉 -->
  <span v-else class="balance-trigger no-dropdown">
    <span class="cur-code">{{ currentCurrencyCode }}：</span>
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

/** 币种代码大写显示，cny 习惯叫 RMB */
const codeOf = (code: string): string => {
  const aliases: Record<string, string> = { cny: 'RMB' };
  return aliases[code] ?? (code || '').toUpperCase();
};

const currentCurrencyCode = computed(() => codeOf(userStore.currentCurrency));

const currentBalanceFormatted = computed(() => formatBalance(userStore.currentCurrency));

/** 余额数字部分，不带币种符号（符号在 cur-code 已经显示了） */
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
  // TODO: 跳到充值页 / 打开充值弹窗
};
</script>

<style lang="scss" scoped>
.balance-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;

  &.no-dropdown { cursor: default; }
}

.cur-code {
  color: #666;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.balance-value {
  color: #e4393c;
  font-weight: 600;
  font-family: 'DINAlternate', -apple-system, monospace;
  margin-right: 4px;
}

.arrow { font-size: 12px; color: #999; margin-right: 4px; }

.fresh-icon {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  .sd-icon { font-size: 14px; color: #488ded; }
  &.rotating .sd-icon { animation: spin 0.8s linear infinite; }
}

@keyframes spin {
  from { transform: rotate(0); }
  to   { transform: rotate(360deg); }
}
</style>

<style lang="scss">

.nav-balance-popper {
  --el-popper-bg-color: #fff;
  padding: 0 !important;
  width: max-content;
  min-width: 280px;
  max-width: 500px;
  font-size: 12px;

  .balance-panel { padding: 4px 0; }
  .panel-section { padding: 8px 12px; }

  .section-title {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #666;
    font-weight: 600;
    padding: 4px 0;
    white-space: nowrap;
    .sd-icon { font-size: 14px; color: #488ded; }
  }

  .balance-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;                 /* ★ 左右两块明确间距 */
    padding: 6px 4px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.15s;
    white-space: nowrap;       /* ★ 整行不换行 */

    &:hover { background-color: #f5f7fa; }
    &.is-current { background-color: #f0f7ff; }
  }

  .row-left {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;            /* ★ 不挤压，让 right 自适应 */
  }
  .row-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    margin-left: auto;         /* 右对齐 */
  }

  .dot       { width: 4px; height: 4px; border-radius: 2px; background-color: #488ded; flex-shrink: 0; }
  .row-code  { font-weight: 600; color: #333; min-width: 38px; }
  .cur-label { color: #999; font-size: 11px; }
  .row-amount {
    font-weight: 600;
    color: #e4393c;
    text-align: right;
    font-family: 'DINAlternate', -apple-system, monospace;
    /* ★ 去掉 min-width，让数字自己撑开 */
  }

  .current-tag {
    display: inline-block;
    margin-left: 4px;
    padding: 0 4px;
    border-radius: 2px;
    font-size: 10px;
    background-color: #326BC7;
    color: #fff;
    flex-shrink: 0;
  }

  .empty {
    padding: 12px;
    text-align: center;
    color: #999;
  }
}
</style>