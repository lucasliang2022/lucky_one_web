<template>
  <div class="lottery-page">
    <div class="lottery-container">
      <div class="game-container" ref="gameContainer">
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
          </el-tabs>
        </div>
        <div class="method-container">
          <Official v-if="menuCurrent === 'official'" ref="methodRef" :store="lotteryStore" />
          <Credit v-if="menuCurrent === 'credit'" ref="methodRef" :store="lotteryStore" />
          <History v-if="menuCurrent === 'history'" :store="lotteryStore" />
        </div>
        <div class="order-container">
          <el-tabs v-model="orderMenuCurrent" class="order-menu">
            <el-tab-pane :label="t('pages.lottery.navBottom.orderHistory')" name="orderHistory">
              <OrderList :store="lotteryStore" />
            </el-tab-pane>
            <el-tab-pane :label="t('pages.lottery.navBottom.taskPlan')" name="taskPlan" />
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

<script setup>
import { computed, ref, watch, shallowRef, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useSscStore } from "@shared/lottery/ssc/store";
import Issue from "@shared/lottery/ssc/components/Issue.vue";
import Footer from "@web/common/Footer.vue";
import Official from "@shared/lottery/ssc/components/Official.vue";
import Credit from "@shared/lottery/ssc/components/Credit.vue";
import History from "@shared/lottery/ssc/components/History.vue";
import OrderList from "@shared/lottery/base/components/OrderList.vue";
import {useI18n} from 'vue-i18n';
const {t} = useI18n();

const route = useRoute();
const lotterySign = computed(() => route.params.sign);
const lotteryStore = useSscStore();

const { onLotteryChange, onModeChange } = lotteryStore;

const methodRef = shallowRef(null);
const menuCurrent = ref('official');
const orderMenuCurrent = ref('orderHistory');
const issueWrapper = ref(null);
const gameContainer = ref(null);
const isIssueFixed = ref(false);
const issueHeight = ref(0);
const fixedWidth = ref(0);
const fixedLeft = ref(0);

const fixedStyle = computed(() => ({
  width: `${fixedWidth.value}px`,
  left: `${fixedLeft.value}px`,
}));

const handleMenuChange = (val) => {
  if (val.paneName === 'credit' || val.paneName === 'official') {
    onModeChange(val.paneName);
  }
  menuCurrent.value = val.paneName;
};

const handleScroll = () => {
  if (!issueWrapper.value || !gameContainer.value) return;

  const issueHalfHeight = issueHeight.value / 2;
  const issueRect = issueWrapper.value.getBoundingClientRect();

  fixedWidth.value = gameContainer.value.offsetWidth;
  fixedLeft.value = issueRect.left + window.scrollX;

  isIssueFixed.value = window.scrollY >= issueHalfHeight;
};

watch(
    lotterySign,
    async (newLotterySign) => {
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

<style lang="scss">
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