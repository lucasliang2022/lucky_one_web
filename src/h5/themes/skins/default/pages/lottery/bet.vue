<template>
  <div class="page-h5-lottery-bet">
    <van-nav-bar
      left-arrow
      @click-left="onBack"
    >
      <template #title>
        <span class="bet-header-title" @click="showSwitcher = true">
          {{ headerTitle }}
          <van-icon name="arrow-down" class="bet-header-title__caret" />
        </span>
      </template>
    </van-nav-bar>

    <!-- 彩种切换弹层:分类 + 彩种全部列出,高亮当前;点击切换 → 路由跳转触发 bet.vue 重载 -->
    <van-popup
      v-model:show="showSwitcher"
      position="top"
      :style="{ top: '46px', height: 'calc(100% - 96px)', maxHeight: 'none' }"
    >
      <LotterySwitcher
        :current-sign="sign"
        @pick="onSwitchLottery"
        @close="showSwitcher = false"
      />
    </van-popup>

    <!-- 加载态:彩种配置 / 期号尚未就绪 -->
    <van-loading v-if="isLoading" class="page-h5-lottery-bet__loading" vertical>
      {{ t('h5.ssc.loading') }}
    </van-loading>

    <!-- 无效彩种 / 玩法未加载 -->
    <van-empty
      v-else-if="!hasOfficialStructure && !hasCreditStructure"
      :description="t('h5.ssc.invalidSign')"
    />

    <template v-else>
      <!-- 顶层 tab(靠左):官方彩 / 信用彩 / 近期开奖 / 投注历史。
           official/credit 保留投注 UI 并走 store.onModeChange;draws/history 显示对应面板。 -->
      <van-tabs v-model:active="topTab" class="bet-top-tabs" shrink @change="onTopTabChange">
        <van-tab name="official" :title="t('h5.ssc.tab.official')" />
        <van-tab name="credit" :title="t('h5.ssc.tab.credit')" />
        <van-tab name="draws" :title="t('h5.ssc.tab.draws')" />
        <van-tab name="history" :title="t('h5.ssc.tab.history')" />
      </van-tabs>

      <!-- ============ 近期开奖 ============ -->
      <DrawHistory v-if="topTab === 'draws'" :store="store" />

      <!-- ============ 投注历史 ============ -->
      <BetHistory v-else-if="topTab === 'history'" :store="store" />

      <!-- ============ 官方彩 / 信用彩 投注 UI ============ -->
      <template v-else>
      <!-- 期号 + 倒计时 -->
      <div class="bet-issue">
        <div class="bet-issue__left">
          <div class="bet-issue__label">{{ t('h5.ssc.issue.current') }}</div>
          <div class="bet-issue__no">{{ t('h5.ssc.issue.no', { no: issueCurrent.issue_no || '--' }) }}</div>
        </div>
        <div class="bet-issue__right">
          <van-tag :type="isClosed ? 'danger' : 'success'" plain>
            {{ isClosed ? t('h5.ssc.issue.closed') : t('h5.ssc.issue.selling') }}
          </van-tag>
          <div class="bet-issue__countdown">
            <span class="bet-issue__countdown-label">{{ t('h5.ssc.issue.countdown') }}</span>
            <van-count-down
              :key="issueCurrent.issue_no"
              :time="countdownMs"
              class="bet-issue__timer"
            />
          </div>
        </div>
      </div>

      <!-- ============ 官方彩 ============ -->
      <template v-if="activeMode === 'official'">
        <van-tabs v-model:active="officialCategory" shrink sticky>
          <van-tab
            v-for="(category, catKey) in officialMethodStructure"
            :key="catKey"
            :name="catKey"
            :title="t(category.title)"
          />
        </van-tabs>

        <div v-if="officialCategoryObj" class="bet-methods">
          <div
            v-for="(group, groupKey) in officialCategoryObj.groups"
            :key="groupKey"
            class="bet-methods__group"
          >
            <span class="bet-methods__group-title">{{ t(group.title) }}</span>
            <div class="bet-methods__list">
              <span
                v-for="method in group.methods"
                :key="method.sign"
                class="bet-methods__item"
                :class="{ 'is-active': officialMethodCurrent?.sign === method.sign }"
                @click="onOfficialMethodClick(method)"
              >
                {{ resolveMethodTitle(method, t, te) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 选号盘按 layout 类型分发:单式录入(ZxDs/ZuDs)暂不支持,其余走共享球盘 -->
        <van-empty v-if="isInputMethod" :description="t('h5.ssc.unsupported')" />
        <BallGrid v-else-if="officialMethodCurrent && officialMethodCurrent.layout" :logic="officialLogicInst" />

        <div class="bet-options">
          <div class="bet-options__item">
            <span>{{ t('h5.ssc.bar.price') }}</span>
            <div class="bet-price">
              <van-stepper v-model="price" :min="unitMin" :max="unitMax" integer />
              <div class="chips">
                <span
                  v-for="(opt, idx) in unitOptions"
                  :key="opt"
                  class="chip"
                  :class="{ active: price === opt }"
                  :style="{ '--chip-color': chipColor(idx) }"
                  @click="price = opt"
                >{{ opt }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ============ 信用盘 ============ -->
      <template v-else>
        <van-tabs v-model:active="creditCategory" shrink sticky>
          <van-tab
            v-for="(category, catKey) in creditMethodStructure"
            :key="catKey"
            :name="catKey"
            :title="t(category.title)"
          />
        </van-tabs>

        <div v-if="creditCategoryObj" class="bet-methods">
          <div class="bet-methods__group">
            <div class="bet-methods__list">
              <span
                v-for="(group, groupKey) in creditCategoryObj.groups"
                :key="groupKey"
                class="bet-methods__item"
                :class="{ 'is-active': creditGroupCurrent?.sign === group.sign }"
                @click="onCreditGroupClick(group)"
              >
                {{ t(group.title) }}
              </span>
            </div>
          </div>
        </div>

        <CreditBoard :store="store" />

        <div class="bet-options">
          <div class="bet-options__item">
            <span>{{ t('h5.ssc.bar.price') }}</span>
            <div class="bet-price">
              <van-stepper v-model="amount" :min="unitMin" :max="unitMax" integer />
              <div class="chips">
                <span
                  v-for="(opt, idx) in unitOptions"
                  :key="opt"
                  class="chip"
                  :class="{ active: amount === opt }"
                  :style="{ '--chip-color': chipColor(idx) }"
                  @click="amount = opt"
                >{{ opt }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 工具条:冷热遗漏(仅官方彩)/ 追号 -->
      <div class="bet-tools">
        <span
          v-if="activeMode === 'official'"
          class="bet-tools__item"
          :class="{ 'is-on': showColdHot || showOmission }"
          @click="showChm = true"
        >
          <van-icon name="chart-trending-o" />
          {{ t('h5.ssc.chm.entry') }}
        </span>
        <span
          class="bet-tools__item"
          :class="{ 'is-on': traceCount > 0 }"
          @click="showTrace = true"
        >
          <van-icon name="clock-o" />
          {{ traceCount > 0 ? t('h5.ssc.trace.entryOn', { count: traceCount }) : t('h5.ssc.trace.entry') }}
        </span>
      </div>

      <!-- 底部栏:当前选号信息 + 加入购物车 + 购物车入口 -->
      <div class="bet-submit">
        <div class="bet-submit__cart" @click="showCart = true">
          <van-badge :content="cartCount || ''" :show-zero="false">
            <van-icon name="cart-o" class="bet-submit__cart-icon" />
          </van-badge>
        </div>
        <div class="bet-submit__info">
          <span class="bet-submit__count">{{ t('h5.ssc.bar.count', { count: currentCount }) }}</span>
          <span class="bet-submit__amount">{{ formatPrize(currentCost) }}</span>
        </div>
        <van-button
          type="danger"
          class="bet-submit__btn"
          :disabled="currentCount < 1 || isClosed"
          @click="onAddToCart"
        >
          {{ t('h5.ssc.cart.add') }}
        </van-button>
      </div>

      <!-- 注单预览 / 购物车 -->
      <BetCart
        v-model:show="showCart"
        :store="store"
        :mode="activeMode"
        :submitting="submitting"
        @submit="onCartSubmit"
      />
      <!-- 冷热遗漏 -->
      <ChmPanel
        v-model:show="showChm"
        :store="store"
        :logic="officialLogicInst"
      />
      <!-- 追号 -->
      <TracePanel
        v-model:show="showTrace"
        :store="store"
        :sign="sign"
      />
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
// 时时彩(SSC)移动端投注:官方彩(全选号族玩法)+ 信用盘。
// 复用共享 store(useSscStore=useLotteryBase);选号盘按 layout 分发到 BallGrid / CreditBoard,
// 二者内部经共享 officialLogic / creditBase 写回 store,不在页面拼 bet_code。
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { showToast, showNotify, showLoadingToast } from 'vant';
import { t } from '@shared/i18n';
import i18n from '@shared/i18n';
import { useSscStore } from '@shared/lottery/ssc/store';
import { useIssueRollover } from '@lottery/base/composables/useIssueRollover';
import { resolveMethodTitle } from '@lottery/base/utils/common';
import { formatPrize } from '@shared/utils/common';
import { useUserStore } from '@shared/stores/userStore';
import { useCommonStore } from '@shared/stores/commonStore';
import { officialLogic } from '@lottery/base/logic/officialLogic';
import { resolveOfficialChmFn } from '@lottery/ssc/logic/chm';
import type { MethodDefineItem, IssueItem, MethodRowNumber } from '@shared/types';
import BallGrid from './components/BallGrid.vue';
import CreditBoard from './components/CreditBoard.vue';
import BetCart from './components/BetCart.vue';
import ChmPanel from './components/ChmPanel.vue';
import TracePanel from './components/TracePanel.vue';
import DrawHistory from './components/DrawHistory.vue';
import BetHistory from './components/BetHistory.vue';
import LotterySwitcher from './components/LotterySwitcher.vue';

// vue-i18n 的 te(判断 key 是否存在),resolveMethodTitle 需要
const te = (key: string): boolean => i18n.global.te(key);

const route = useRoute();
const router = useRouter();
const sign = computed(() => String(route.params.sign ?? ''));

const store = useSscStore();
const commonStore = useCommonStore();
const {
  issueCurrent,
  mode,
  // official
  officialMethodStructure,
  officialCategoryCurrent,
  officialMethodCurrent,
  officialBetCount,
  officialBetCost,
  // credit
  creditMethodStructure,
  creditCategoryCurrent,
  creditGroupCurrent,
  creditBetCount,
  creditBetCost,
  // shared
  price,
  unitMin,
  unitMax,
  unitOptions,
  amount,
  // 冷热遗漏 / 追号 / 购物车相关
  showColdHot,
  showOmission,
  officialBetList,
  creditBetList,
  preIssueList,
} = storeToRefs(store);

const { isLoggedIn } = storeToRefs(useUserStore());

// 单价快捷筹码边缘配色:按下标循环,保证每颗筹码边缘颜色不同。
const CHIP_PALETTE = ['#e74c3c', '#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#16a085', '#f1c40f', '#34495e'];
const chipColor = (idx: number): string => CHIP_PALETTE[idx % CHIP_PALETTE.length];


// 共享官方彩选号引擎:整页只创建一个实例(选号盘 BallGrid 与冷热遗漏面板 ChmPanel 共用同一份 rows),
// calculateChmFn 按当前玩法 layout.type 从共享 chm 模块动态解析(和值/跨度等无冷热的玩法返回 false)。
const officialLogicInst = officialLogic(store, {
  calculateChmFn: (issue: IssueItem, ball: MethodRowNumber, positions: number[]): boolean => {
    const fn = resolveOfficialChmFn(officialMethodCurrent.value?.layout?.type);
    return fn ? fn(issue, ball, positions) : false;
  },
});

// —— 面板可见性 & 购物车/追号派生状态 ——
const showCart = ref(false);
const showChm = ref(false);
const showTrace = ref(false);
const submitting = ref(false);

const cartCount = computed(() =>
  mode.value === 'credit' ? creditBetList.value.length : officialBetList.value.length,
);
const traceCount = computed(() => preIssueList.value?.length ?? 0);

const isLoading = ref(true);
const hasOfficialStructure = computed(() => Object.keys(officialMethodStructure.value || {}).length > 0);
const hasCreditStructure = computed(() => Object.keys(creditMethodStructure.value || {}).length > 0);

// 顶部标题:遍历共享 commonStore 所有分类,找 sign 匹配当前彩种的 LotteryListItem 取其 title(彩种译名);
// 未加载 / 无此彩种时回落显示 sign,避免空白。
const headerTitle = computed<string>(() => {
  const current = sign.value;
  if (!current) return '';
  for (const category of commonStore.getAllLotteryCategories()) {
    const hit = commonStore.getLotteriesByCategory(category).find((it) => it.sign === current);
    if (hit) return hit.title;
  }
  return current;
});

// 彩种切换弹层
const showSwitcher = ref(false);

// 点某彩种:跳到该彩种所属分类 + sign 的投注路由,并关闭弹层。
// 路由 sign 变化 → 现有 watch(sign) 触发 store.onLotteryChange 重新初始化该彩种。
function onSwitchLottery(category: string, targetSign: string): void {
  showSwitcher.value = false;
  if (targetSign === sign.value) return;
  router.push(`/lottery/${category}/${targetSign}`);
}

// 模式:v-model 读 store.mode;切换时走 store.onModeChange(official 初始化分类/信用盘懒初始化)。
const activeMode = computed<string>({
  get: () => mode.value,
  set: () => { /* 通过 onModeChange 显式驱动,避免与 store 双写 */ },
});

function onModeChange(m: string): void {
  store.onModeChange(m);
}

// 顶层 tab(4 值):official / credit / draws / history。
// official、credit 保留投注 UI 并驱动 store 模式;draws、history 仅切换展示面板。
const topTab = ref<string>('official');

function onTopTabChange(tab: string): void {
  if (tab === 'official' || tab === 'credit') {
    onModeChange(tab);
  }
}

// —— 官方彩分类 / 玩法 ——
const officialCategory = computed<string>({
  get: () => officialCategoryCurrent.value,
  set: (v: string) => store.setCategoryOfficialCurrent(v),
});
const officialCategoryObj = computed(() => officialMethodStructure.value?.[officialCategoryCurrent.value]);

const INPUT_LAYOUT_TYPES = ['ZxDs', 'ZuDs', 'RxZxDs', 'RxZuDs'];
const isInputMethod = computed(() => INPUT_LAYOUT_TYPES.includes(officialMethodCurrent.value?.layout?.type ?? ''));

function onOfficialMethodClick(method: MethodDefineItem): void {
  store.setMethodOfficialCurrent(method);
}

// —— 信用盘分类 / 分组 ——
const creditCategory = computed<string>({
  get: () => creditCategoryCurrent.value,
  set: (v: string) => store.setCategoryCreditCurrent(v),
});
const creditCategoryObj = computed(() => creditMethodStructure.value?.[creditCategoryCurrent.value]);

function onCreditGroupClick(group: any): void {
  store.setGroupCreditCurrent(group);
}

// —— 底部栏:按模式取对应注数 / 金额 ——
const currentCount = computed(() => (mode.value === 'credit' ? creditBetCount.value : officialBetCount.value));
const currentCost = computed(() => (mode.value === 'credit' ? creditBetCost.value : officialBetCost.value));

// 封盘 / 自动滚期:共享 composable(倒计时毫秒 + 封盘判定 + 滚期)。
const { countdownMs, isClosed } = useIssueRollover(store);

function onBack(): void {
  router.back();
}

// 加入购物车:build → add(进 store 的待提交注单列表),然后清空当前选号,不立即提交。
function onAddToCart(): void {
  if (currentCount.value < 1) {
    showToast(t('h5.ssc.tip.selectFirst'));
    return;
  }
  if (mode.value === 'credit') {
    const items = store.creditBetItemBuild();
    store.creditBetAdd(items);
  } else {
    const item = store.officialBetItemBuild();
    store.officialBetAdd(item);
  }
  store.clearSelectedBalls();
  showToast(t('h5.ssc.cart.added'));
}

// 购物车提交:走 store 的 official/creditBetSubmit(读取整份注单列表下注,成功后 store 内部清空列表)。
async function onCartSubmit(): Promise<void> {
  if (!isLoggedIn.value) {
    showToast(t('h5.ssc.notLoggedIn'));
    return;
  }
  if (cartCount.value < 1) {
    showToast(t('h5.ssc.tip.selectFirst'));
    return;
  }
  if (isClosed.value) {
    showToast(t('h5.ssc.issue.closed'));
    return;
  }
  submitting.value = true;
  const loading = showLoadingToast({ message: t('h5.ssc.loading'), forbidClick: true, duration: 0 });
  try {
    if (mode.value === 'credit') {
      await store.creditBetSubmit();
    } else {
      await store.officialBetSubmit();
    }
    loading.close();
    // 成功提示由 store 的 submit 经 notify 统一发出;下注后清掉追号设置,避免下一单误追。
    preIssueList.value = [];
    showCart.value = false;
  } catch (e) {
    loading.close();
    showNotify({ type: 'danger', message: t('h5.ssc.tip.failed') });
  } finally {
    submitting.value = false;
  }
}

// 初始化:以 sign 触发 onLotteryChange(拉配置/期号/玩法结构,默认官方彩首类首玩法)。
watch(
  sign,
  async (newSign) => {
    if (!newSign) return;
    isLoading.value = true;
    try {
      await store.onLotteryChange(newSign);
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (!sign.value) isLoading.value = false;
});
</script>

<style lang="scss">
.page-h5-lottery-bet {
  min-height: 100%;
  padding-bottom: 64px;
  background: var(--van-background, #f7f8fa);

  &__loading {
    padding: 48px 0;
  }
}

.bet-header-title {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 60vw;
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;

  &__caret {
    font-size: 14px;
    color: var(--van-gray-6, #969799);
  }
}

.bet-issue {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #fff;

  &__label {
    font-size: 12px;
    color: var(--van-gray-6, #969799);
  }

  &__no {
    margin-top: 4px;
    font-size: 15px;
    font-weight: 600;
    color: var(--van-text-color, #323233);
  }

  &__right {
    text-align: right;
  }

  &__countdown {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 6px;
  }

  &__countdown-label {
    font-size: 12px;
    color: var(--van-gray-6, #969799);
  }

  &__timer {
    font-size: 14px;
    font-weight: 600;
    color: #ee0a24;
  }
}

.bet-top-tabs {
  margin-top: 4px;
  // shrink 让 tab 收缩靠左(不再等分铺满)
}

.bet-methods {
  padding: 8px 12px;
  background: #fff;

  &__group {
    display: flex;
    align-items: flex-start;
    padding: 6px 0;
  }

  &__group-title {
    flex: 0 0 auto;
    margin-right: 8px;
    padding-top: 4px;
    font-size: 13px;
    color: var(--van-gray-6, #969799);
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__item {
    padding: 4px 12px;
    font-size: 13px;
    border-radius: 14px;
    background: var(--van-gray-1, #f7f8fa);
    color: var(--van-text-color, #323233);

    &.is-active {
      background: #ee0a24;
      color: #fff;
    }
  }
}

.bet-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-top: 10px;
  padding: 12px 14px;
  background: #fff;

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--van-text-color, #323233);
  }
}

/* 单价:步进器(自由输入,clamp 到 [min,max])+ 快捷档位 */
.bet-price {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

/* 单价快捷档位:筹码样式(圆形 + 不同颜色边缘) */
.chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--chip-color);
  background: #fff;
  /* 虚线边 + 内白环 = 筹码质感 */
  border: 2px dashed var(--chip-color);
  box-shadow: inset 0 0 0 3px #fff, 0 1px 2px rgba(0, 0, 0, .12);

  &.active {
    background: var(--chip-color);
    color: #fff;
    box-shadow: inset 0 0 0 3px rgba(255, 255, 255, .55), 0 2px 5px rgba(0, 0, 0, .22);
  }
}

.bet-tools {
  display: flex;
  gap: 10px;
  margin: 10px 12px;

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 14px;
    font-size: 13px;
    border-radius: 16px;
    background: #fff;
    color: var(--van-gray-7, #646566);
    border: 1px solid var(--van-border-color, #ebedf0);

    &.is-on {
      color: #ee0a24;
      border-color: #ee0a24;
    }
  }
}

.bet-submit {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 12px;
  background: #fff;
  box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.06);

  &__cart {
    display: flex;
    align-items: center;
    padding: 0 4px;
  }

  &__cart-icon {
    font-size: 26px;
    color: var(--van-gray-7, #646566);
  }

  &__info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  &__count {
    font-size: 12px;
    color: var(--van-gray-6, #969799);
  }

  &__amount {
    font-size: 16px;
    font-weight: 700;
    color: #ee0a24;
  }

  &__btn {
    width: 130px;
  }
}
</style>
