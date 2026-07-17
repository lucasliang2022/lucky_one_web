<template>
  <div class="method-menu">
    <el-tabs v-if="officialCategoryCurrent" v-model="officialCategoryCurrent" class="method-category" @tab-click="handleCategoryChange">
      <el-tab-pane
          v-for="(category, cSign) in officialMethodStructure"
          :key="cSign"
          :label="resolveStructTitle(category.title, t, te)"
          :name="cSign"
          class="category-menu-item"
      >
        <ul class="method-group">
          <li
              v-for="(group, groupKey) in category.groups"
              :key="groupKey"
              class="method-group-item"
          >
            <!-- 分类下只有一个组时不显示组名(直接列玩法);多组才显示组标题。 -->
            <span class="group-title" v-if="Object.keys(category.groups).length > 1">{{ resolveStructTitle(group.title, t, te) }}:</span>
            <div class="group-method-wrapper">
              <div
                  class="group-method-item"
                  v-for="method in group.methods"
                  :key="method.sign"
                  :class="{ active: officialMethodCurrent.sign === method.sign }"
                  @click="handleMethodClick(method)"
              >
                {{ resolveMethodTitle(method, t, te) }}
              </div>
            </div>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="method-display">
    <div class="display-info">
      <OfficialMethodDesc :store="store"/>
    </div>
    <div class="display-ball">
      <keep-alive>
        <transition name="fade">
          <component
              ref="methodLayoutRefLocal"
              :is="activeComponent"
              :key="activeComponent"
              :store="store"
          />
        </transition>
      </keep-alive>
    </div>
    <div class="display-options">
      <Currency v-model:currency="currency"/>
      <div class="method-middle-right">
        <Unit v-model:price="price" :options="unitModes"/>
        <Times v-model:times="times"/>
      </div>
    </div>
    <div class="display-buttons">
      <div class="tips">
        <template v-if="officialBetCount > 0">
          {{t("pages.lottery.methodShow.tips1")}} <span class="tip-count">{{ officialBetCount }}</span> {{t("pages.lottery.methodShow.tips2")}}，{{t("pages.lottery.methodShow.tips3")}}
          <span class="tip-amount">{{ formatPrize(officialBetCost) }}</span> {{t("pages.lottery.methodShow.tips4")}}，
          {{t("pages.lottery.methodShow.tips5")}}：<span class="tip-balance">0.0000</span>
        </template>
        <template v-else>
          <i class="icon-sd-info1" style="margin-right: 3px;font-size: 12px;"></i>
          <span v-html="officialMethodCurrent?.layout?.tips"></span>
        </template>
      </div>
      <div class="btn">
        <el-button :disabled="isDisabled" @click="handleToCart">
          <i class="icon-sd-cart_empty" style="margin-right: 3px;font-size: 14px"></i>{{t("pages.lottery.button.addToCart")}}
        </el-button>
        <el-button>{{t("pages.lottery.button.trace")}}</el-button>
        <el-button type="danger" :disabled="isDisabled" @click="handleFastBet">
          {{t("pages.lottery.button.submit")}}
        </el-button>
      </div>
    </div>
  </div>
  <div>
    <OfficialBetCart
        :store="store"
        @do:submitBet="handleCartSubmit"
    />
  </div>
  <OfficialBetConfirmDialog
      ref="betConfirmDialog"
      :dialog-bet-list="dialogBetList"
      :store="store"
      @update:officialBetList="handleBetListUpdate"
      @close="onBetDialogClose"
  />
</template>

<script setup>
import {computed, ref, watch, defineAsyncComponent, onMounted, nextTick} from "vue";
import {storeToRefs} from 'pinia';
import Unit from "@lottery/base/components/Unit.vue";
import Times from "@lottery/base/components/Times.vue";
import Currency from "@lottery/base/components/Currency.vue";
import Loading from "@lottery/base/components/Loading.vue";
import OfficialBetCart from "@lottery/base/components/official/OfficialBetCart.vue";
import OfficialMethodDesc from "@lottery/base/components/official/OfficialMethodDesc.vue";
import OfficialBetConfirmDialog from "@lottery/base/components/official/OfficialBetConfirmDialog.vue";
import { notify } from '@shared/notify';
import {useI18n} from 'vue-i18n';
import {formatPrize} from "@shared/utils/common.ts";
import { resolveMethodTitle, resolveStructTitle } from "@lottery/base/utils/common";
const {t, te} = useI18n();

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const store = props.store;
const {
  currency,
  price,
  unitModes,
  times,
  officialCategoryCurrent,
  officialMethodStructure,
  officialMethodCurrent,
  officialBetCount,
  officialBetCost,
  officialBetList,
  officialSelectedBalls
} = storeToRefs(store);

const {
  setCategoryOfficialCurrent,
  setMethodOfficialCurrent,
  officialBetItemBuild,
  officialBetAdd,
  clearSelectedBalls,
  fetchIssueHistory,
  setMethodLayoutRef,
} = store;

const issueCurrent = ref([]);
const methodLayoutRefLocal = ref(null);
const betConfirmDialog = ref(null);
const dialogBetList = ref([]);

const activeComponent = computed(() => {
  const methodConfig = officialMethodCurrent.value;
  if (!methodConfig || !methodConfig.layout || !methodConfig.layout.type) {
    console.warn("sorry, method not exists");
    return null;
  }
  return defineAsyncComponent({
    loader: () => import(`@shared/lottery/ssc/components/layout/official/${methodConfig.layout.type}.vue`),
    loadingComponent: Loading,
    timeout: 5000,
  });
});

const isDisabled = computed(() => officialSelectedBalls.value.length === 0 || officialBetCount.value === 0);

const handleCategoryChange = (category) => {
  setCategoryOfficialCurrent(category.paneName);
}

const handleToCart = () => {
  if (officialBetCount.value === 0) return;
  const methodData = officialBetItemBuild(officialMethodCurrent.value);
  officialBetAdd(methodData);
  clearSelectedBalls();
};

const handleFastBet = () => {
  if (officialBetCount.value < 1) {
    notify.warning('请至少选择1注');
    return;
  }
  const betItem = officialBetItemBuild();
  dialogBetList.value = [betItem];
  betConfirmDialog.value.open();
  clearSelectedBalls();
};

const handleCartSubmit = () => {
  if (officialBetList.value.length === 0) {
    notify.warning('请先加入投注项');
    return;
  }
  dialogBetList.value = [...officialBetList.value];
  betConfirmDialog.value.open();
};

const handleBetListUpdate = (remainingBets) => {
  if (officialBetCount.value > 0) {
    clearSelectedBalls();
  } else {
    officialBetList.value = remainingBets;
  }
};

const onBetDialogClose = () => {
  console.log('投注弹窗关闭');
};

const handleMethodClick = (method) => {
  setMethodOfficialCurrent(method);
};

const callByUpdateIssueCurrent = (newIssueCurrent) => {
  issueCurrent.value = newIssueCurrent;
  setTimeout(() => fetchIssueHistory(), 10);
};

defineExpose({callByUpdateIssueCurrent});

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
  @use '@/assets/scss/lottery/official.scss';
</style>