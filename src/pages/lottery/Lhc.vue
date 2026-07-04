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
            <el-tab-pane label="信用玩法" name="credit" />
            <el-tab-pane label="官方玩法" name="official" />
            <el-tab-pane label="开奖历史" name="history" />
          </el-tabs>
        </div>
        <div class="method-container">
          <Official v-if="menuCurrent === 'official'" ref="methodRef" :store="lotteryStore" />
          <Credit v-if="menuCurrent === 'credit'" ref="methodRef" :store="lotteryStore" />
          <History v-if="menuCurrent === 'history'" :store="lotteryStore" />
        </div>
        <div class="order-container">
          <el-tabs v-model="orderMenuCurrent" class="order-menu">
            <el-tab-pane label="当期订单" name="orderHistory">
              <OrderList :store="lotteryStore" />
            </el-tab-pane>
            <el-tab-pane label="追号计划" name="tracePlan" />
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
import { computed, ref, watch, shallowRef, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { useLhcStore } from "@/lottery/lhc/store";
import Issue from "@/lottery/lhc/components/Issue.vue";
import Footer from "@/components/Footer.vue";
import Official from "@/lottery/lhc/components/Official.vue";
import Credit from "@/lottery/lhc/components/Credit.vue";
import History from "@/lottery/lhc/components/History.vue";
import OrderList from "@/lottery/base/components/OrderList.vue";
import "@/assets/scss/lottery/lhc.scss";

const route = useRoute();
const lotterySign = computed(() => route.params.sign);
const lotteryStore = useLhcStore();

const {onLotteryChange, onModeChange} = lotteryStore;

const methodRef = shallowRef(null);
const menuCurrent = ref('official');
const orderMenuCurrent = ref('orderHistory');
const issueWrapper = ref(null);
const gameContainer = ref(null);
const isIssueFixed = ref(false);
const issueHeight = ref(210);
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
  if (gameContainer.value) {
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

  .lottery-container {
    position: relative;
    z-index: 100;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: space-between;
    column-gap: 0.625rem;
    overflow-y: auto;
    background-color: var(--color-gray-4);
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    flex: 1 1 auto;

    .game-container {
      margin-left: auto;
      margin-right: auto;
      display: flex;
      max-width: 80%;
      flex: 1 1 0%;
      flex-direction: column;
      overflow-x: hidden;
      -ms-overflow-style: none;
      scrollbar-width: none;

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

      .menu-container {
        border-radius: 10px 10px 0 0;
        border-width: 1px 1px 0 1px;
        border-style: solid;
        border-color: var(--color-gray-3);
        --tw-bg-opacity: 1;
        background-color: rgb(255 255 255 / var(--tw-bg-opacity));

        .main-menu {
          padding: 0 1.15rem;
        }

        .method-list {
          position: relative;
          font-size: 12px;
          font-weight: 400;
          background-color: #eff4ff;
          padding: 5px 0;
          display: flex;
          list-style: none;
          margin: 0;
          gap: 10px;

          li {
            padding: 0;
            display: flex;

            .method-item-wrapper {
              margin-left: 0 !important;
              display: flex;
              flex-wrap: wrap;
              flex: 1;

              .method-item {
                display: flex;
                align-items: center;
                justify-content: left;
                height: 30px;
                border-radius: 6px;
                margin-left: 20px;
                font-size: 13px;
                color: #666;
                cursor: pointer;
                user-select: none;
              }

              .active {
                background-blend-mode: soft-light;
                font-weight: 500;
                color: #179dff;
              }
            }
          }
        }
      }

      .order-container {
        margin-top: 10px;
        border-radius: 10px 10px 0 0;
        border-width: 1px 1px 0 1px;
        border-style: solid;
        border-color: var(--color-gray-3);
        --tw-bg-opacity: 1;
        background-color: rgb(255 255 255 / var(--tw-bg-opacity));

        .order-menu {
          padding: 0 1.15rem;
        }
      }
    }

    .chat-container {
      margin-right: 10px;
      box-sizing: border-box;
      height: 100%;
      width: 335px;
      overflow: hidden;
      border-radius: 10px;
      border-width: 1px;
      border-style: solid;
      border-color: var(--color-gray-3);
      margin-left: auto;
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 100px);
    }
  }
}

.page-header h1 {
  text-align: center;
  color: #333;
}

.period-info {
  margin-top: 20px;
}

.betting-section {
  margin-top: 20px;
}

.numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.numbers button {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 50%;
  background-color: #f9f9f9;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  transition: 0.3s;
}

.numbers button.selected {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.numbers button:hover {
  background-color: #f0f0f0;
}

.bet-details {
  margin-top: 20px;
}

.bet-amount {
  margin: 10px 0;
}

.bet-amount input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.submit-button:hover:not(:disabled) {
  background-color: #307ac5;
}
</style>