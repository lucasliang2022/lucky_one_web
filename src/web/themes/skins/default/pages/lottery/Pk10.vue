<template>
  <div class="lottery-page lottery-pk10">
    <div class="lottery-container">
      <div class="game-container" ref="gameContainer" v-loading="lotteryStore.loading" element-loading-text="加载中...">
        <div ref="issueWrapper" class="issue-wrapper">
          <Issue
              :store="lotteryStore"
              :class="{ 'fixed-top': isIssueFixed }"
              :style="fixedStyle"
          />
          <div v-show="isIssueFixed" class="issue-placeholder" :style="{ height: issueHeight + 'px' }"></div>
        </div>
        <div class="menu-container">
          <el-tabs v-model="menuCurrent" class="main-menu" type="border-card" @tab-click="handleMenuChange">
            <el-tab-pane :label="t('pages.lottery.navTop.credit')" name="credit" />
            <el-tab-pane :label="t('pages.lottery.navTop.official')" name="official" />
            <el-tab-pane :label="t('pages.lottery.navTop.history')" name="history" />
            <el-tab-pane :label="t('pages.lottery.navTop.roadmap')" name="roadmap" />
          </el-tabs>
        </div>
        <div class="method-container">
          <Official v-if="menuCurrent === 'official'" ref="methodRef" :store="lotteryStore" />
          <Credit v-if="menuCurrent === 'credit'" ref="methodRef" :store="lotteryStore" />
          <History v-if="menuCurrent === 'history'" :store="lotteryStore" />
          <Roadmap v-if="menuCurrent === 'roadmap'" :store="lotteryStore" :ball-names="RM_BALLS" :big-min="RM_BIG" :sum-big-min="55" />
        </div>
        <div class="order-container">
          <el-tabs v-model="orderMenuCurrent" class="order-menu">
            <el-tab-pane :label="t('pages.lottery.navBottom.orderHistory')" name="orderHistory">
              <OrderList :store="lotteryStore" />
            </el-tab-pane>
            <el-tab-pane :label="t('pages.lottery.navBottom.taskPlan')" name="tracePlan" />
          </el-tabs>
        </div>
      </div>
      <div class="chat-container">
        chat
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, shallowRef, onMounted, onBeforeUnmount, ComputedRef, Ref, ShallowRef } from "vue";
import { useRoute, RouteLocationNormalizedLoaded } from "vue-router";
import { usePk10Store } from "@shared/lottery/pk10/store";
import Issue from "@shared/lottery/pk10/components/Issue.vue";
import Official from "@shared/lottery/pk10/components/Official.vue";
import Credit from "@shared/lottery/pk10/components/Credit.vue";
import History from "@shared/lottery/pk10/components/History.vue";
import Roadmap from "@shared/lottery/base/components/Roadmap.vue";
const RM_BALLS = ['冠军','亚军','第三名','第四名','第五名','第六名','第七名','第八名','第九名','第十名'];
const RM_BIG = 6;
import OrderList from "@shared/lottery/base/components/OrderList.vue";
import Footer from "@web/common/Footer.vue";
import { ElTabs, ElTabPane } from "element-plus";
import { useI18n } from "vue-i18n";

const route: RouteLocationNormalizedLoaded = useRoute();
const { t } = useI18n();
const lotterySign = computed<string>(() => {
  const signParam = route.params.sign;
  if (Array.isArray(signParam)) {
    return signParam[0] ?? '';
  }
  return signParam ?? '';
});
const lotteryStore = usePk10Store();

const { onLotteryChange, onModeChange } = lotteryStore;

const methodRef: ShallowRef<any> = shallowRef(null);
const menuCurrent: Ref<'official' | 'credit' | 'history' | 'roadmap'> = ref('official');
const orderMenuCurrent: Ref<'orderHistory' | 'tracePlan'> = ref('orderHistory');
const issueWrapper: Ref<HTMLElement | null> = ref(null);
const gameContainer: Ref<HTMLElement | null> = ref(null);
const isIssueFixed: Ref<boolean> = ref(false);
const issueHeight: Ref<number> = ref(0);
const fixedWidth: Ref<number> = ref(0);
const fixedLeft: Ref<number> = ref(0);

const fixedStyle: ComputedRef<{ width: string; left: string }> = computed(() => ({
  width: `${fixedWidth.value}px`,
  left: `${fixedLeft.value}px`,
}));

const handleMenuChange = (tab: { paneName: string }) => {
  if (tab.paneName === 'credit' || tab.paneName === 'official') {
    onModeChange(tab.paneName);
  }
  menuCurrent.value = tab.paneName as 'official' | 'credit' | 'history' | 'roadmap';
};

const handleScroll = (): void => {
  if (!issueWrapper.value || !gameContainer.value) return;

  const issueHalfHeight = issueHeight.value / 2;
  const issueRect = issueWrapper.value.getBoundingClientRect();

  fixedWidth.value = gameContainer.value.offsetWidth;
  fixedLeft.value = issueRect.left + window.scrollX;

  isIssueFixed.value = window.scrollY >= issueHalfHeight;
};

watch(
    lotterySign,
    async (newLotterySign: string) => {
      await onLotteryChange(newLotterySign);
    },
    { immediate: true }
);

onMounted(() => {
  if (issueWrapper.value && gameContainer.value) {
    issueHeight.value = issueWrapper.value.offsetHeight;
    fixedWidth.value = gameContainer.value.offsetWidth;
    fixedLeft.value = issueWrapper.value.getBoundingClientRect().left + window.scrollX;
  }
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleScroll);
});
</script>

<style scoped lang="scss">
.lottery-page {
  min-width: var(--width-small-container);
  max-width: var(--width-container);
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
}

.issue-wrapper {
  position: relative;
}

.fixed-top {
  position: fixed;
  top: 95px;
  padding-left: 0.625rem;
  padding-right: 0.625rem;
  z-index: 1000;
  background-color: rgb(255 255 255);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.issue-placeholder {
  width: 100%;
}
</style>