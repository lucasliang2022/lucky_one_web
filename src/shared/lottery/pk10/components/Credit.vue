<template>
  <div class="method-menu-display lottery-credit">
    <el-tabs v-if="creditCategoryCurrent" v-model="creditCategoryCurrent" class="method-category" @tab-click="selectCategory">
      <el-tab-pane
          v-for="(category, cSign) in creditMethodStructure"
          :key="cSign"
          :label="t(category.title)"
          :name="cSign"
          class="method-category-item"
      >
        <ul class="method-menu-item-list">
          <li>
            <div class="method-menu-item-wrapper">
              <div
                  class="method-menu-item"
                  v-for="(group, sign) in category.groups"
                  :key="sign"
                  :class="{ active: creditGroupCurrent.sign === sign }"
                  @click="selectGroup(group)"
              >
                {{ t(group.title) }}
              </div>
            </div>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="method-display">
    <div class="display-info">
      <CreditMethodDesc :store="store" />
    </div>
    <div class="display-ball">
      <keep-alive>
        <transition name="fade">
          <DefaultGroup ref="methodLayoutRef" :store="store"/>
        </transition>
      </keep-alive>
    </div>
    <div class="display-options">
      <Currency v-model:currency="currency" />
      <div class="method-middle-right">
        <Amount :store="store" />
      </div>
    </div>
    <div class="display-buttons">
      <div class="tips">
        共计<span class="tip-amount">{{ formatPrize(creditBetCost) }}</span> 元，
        余额：<span class="tip-balance">{{ balance }}</span>
      </div>
      <div class="btn">
        <el-button :disabled="isDisabled" @click="handleToCart">
          <i class="icon-sd-cart_empty" style="margin-right: 3px;font-size: 14px"></i>加入购彩栏
        </el-button>
        <el-button>追号</el-button>
        <el-button type="danger" :disabled="isDisabled" @click="handleFastBet">
          立刻投注
        </el-button>
      </div>
    </div>
  </div>
  <div>
    <CreditBetCart
        :store="store"
        @do:submitBet="handleCartSubmit"
    />
  </div>
  <CreditBetConfirmDialog
      ref="betConfirmDialog"
      :dialog-bet-list="dialogBetList"
      :store="store"
      @update:creditBetList="handleBetListUpdate"
      @close="onBetDialogClose"
  />
</template>

<script setup>
import { computed, ref, watch, onMounted, nextTick } from "vue";
import {storeToRefs} from "pinia";
import { notify } from '@shared/notify';
import {useI18n} from "vue-i18n";
import {formatPrize} from "@shared/utils/common.ts";
import {useUserStore} from '@shared/stores/userStore.ts';
import Amount from "@lottery/base/components/Amount.vue";
import Currency from "@lottery/base/components/Currency.vue";
import CreditBetConfirmDialog from "@lottery/base/components/credit/CreditBetConfirmDialog.vue";
import CreditBetCart from "@lottery/base/components/credit/CreditBetCart.vue";
import CreditMethodDesc from "@lottery/base/components/credit/CreditMethodDesc.vue";
import DefaultGroup from "@lottery/ssc/components/layout/group/DefaultGroup.vue";

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const store = props.store;
const {
  creditMethodStructure,
  creditCategoryCurrent,
  creditGroupCurrent,
  currency,
  creditBetCount,
  creditBetCost,
  creditBetList,
  creditSelectedBalls,
} = storeToRefs(store);

const {
  setCategoryCreditCurrent,
  setGroupCreditCurrent,
  creditBetItemBuild,
  creditBetAdd,
  clearSelectedBalls,
  setMethodLayoutRef,
} = store;

const { t } = useI18n();
const methodLayoutRefLocal = ref(null);
const betConfirmDialog = ref(null);
const dialogBetList = ref([]);

const userStore = useUserStore();
const balance = computed(() => {
  switch (currency.value) {
    case 'RMB':
      return userStore.balanceRmb;
    case 'USDT':
      return userStore.balanceUsdt;
    default:
      return 0;
  }
});

const isDisabled = computed(() => {
  const totalAmount = Object.values(creditSelectedBalls.value)
      .flat()
      .reduce((sum, ball) => sum + (ball.amount || 0), 0);
  return totalAmount === 0;
});

const handleToCart = () => {
  if (creditBetCost.value <= 0) return;
  const methodData = creditBetItemBuild();
  creditBetAdd(methodData);
  clearSelectedBalls();
};

const handleFastBet = () => {
  if (creditBetCount.value < 1) {
    notify.warning('请至少选择1注');
    return;
  }
  // creditBetItemBuild() 返回注单数组,直接赋值(勿再包一层,否则行=数组、无 balls 报错)。
  dialogBetList.value = creditBetItemBuild();
  betConfirmDialog.value.open();
  clearSelectedBalls();
};

const handleCartSubmit = () => {
  if (creditBetList.value.length === 0) {
    notify.warning('请先加入投注项');
    return;
  }
  dialogBetList.value = [...creditBetList.value];
  betConfirmDialog.value.open();
};

const handleBetListUpdate = (remainingBets) => {
  if (creditBetCount.value > 0) {
    clearSelectedBalls();
  } else {
    creditBetList.value = remainingBets;
  }
};

const onBetDialogClose = () => {
  console.log('投注弹窗关闭');
};

const selectGroup = (group) => {
  if (group && group.methods && Object.keys(group.methods).length > 0) {
    setGroupCreditCurrent(group);
  }
};

const selectCategory = (tab) => {
  setCategoryCreditCurrent(tab.paneName);
}

watch(() => methodLayoutRefLocal.value, (newRef) => {
  if (newRef) setMethodLayoutRef(newRef);
});

onMounted(async () => {
  await nextTick(() => {
    if (methodLayoutRefLocal.value) setMethodLayoutRef(methodLayoutRefLocal.value);
  });
});
</script>
<style lang="scss">
@use '@/assets/scss/lottery/credit.scss';
</style>