<template>
  <div class="bet-cart">
    <div class="bet-cart-header">
      <div class="bet-cart-header-left">
        <p>购彩篮</p>
        <div class="summary">
          共{{ officialBetList.length }}组 总金额：
          <span class="text-error font-medium">
            {{ commonStore.getCurrencyInfo(currency).symbol }}{{ totalAmount }}
          </span>
        </div>
      </div>
      <div>
        <el-button type="primary" v-if="officialMethodCurrent?.random_bet" @click="addRandomBet" class="ml-auto">
          <i class="icon-sd-random" style="margin-right: 3px; font-size: 14px;"></i>
          机选1注
        </el-button>
        <el-button type="primary" @click="clearBetListSmooth">
          <i class="icon-sd-bin" style="margin-right: 3px; font-size: 14px;"></i>
          一键清空
        </el-button>
        <el-button type="danger" @click="emit('do:submitBet')">
          提交订单
        </el-button>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div class="bet-cart__body" v-if="officialBetList.length" key="betTable">
        <el-table :data="officialBetList" border class="bet-cart__table">
          <el-table-column label="玩法" prop="methodTitle" width="130"></el-table-column>
          <el-table-column label="内容">
            <template #default="{ row }">
              <template v-if="row.codesDisplay.length > 35">
                <el-tooltip effect="light" :content="row.codesDisplay" placement="top">
                  <span>{{ strSub(row.codesDisplay, 35) }}...</span>
                </el-tooltip>
              </template>
              <template v-else>
                {{ row.codesDisplay }}
              </template>
            </template>
          </el-table-column>
          <el-table-column label="注数" prop="count" width="70"></el-table-column>
          <el-table-column label="模式" width="100">
            <template #default="{ row }">
              <el-select size="small" v-model="row.price" @change="updateBetAmount(row)">
                <el-option
                    v-for="option in commonStore.unitOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="倍数" width="120">
            <template #default="{ row }">
              <el-input-number
                  v-model="row.times"
                  :min="1"
                  :max="9999"
                  @change="updateBetAmount(row)"
                  size="small"
                  style="width: 90px"
              />
            </template>
          </el-table-column>
          <el-table-column label="货币" prop="currency" width="100">
            <template #default="{ row }">
              {{ commonStore.getCurrencyInfo(row.currency).title }}
            </template>
          </el-table-column>
          <el-table-column label="金额" width="120">
            <template #default="{ row }">
              {{ row.cost }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="60">
            <template #default="{ row }">
              <span class="icon-sd icon-sd-bin" @click="removeBet(row)"></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else key="empty" class="empty-bet-list">
        <div><span class="icon-sd icon-sd-cart_empty" style="font-size: 60px"></span> </div>
        <div>暂无选号</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCommonStore } from '@/stores/commonStore.js';
import { formatPrize, strSub } from '@/utils/common.ts';
import { storeToRefs } from "pinia";

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const {
  currency,
  officialBetList,
  officialMethodCurrent,
} = storeToRefs(props.store);

const { addRandomBet } = props.store;
const emit = defineEmits(['do:submitBet']);

const commonStore = useCommonStore();
const totalAmount = computed(() =>
    formatPrize(officialBetList.value.reduce((sum, bet) => sum + (Number(bet.cost) || 0), 0))
);

const updateBetAmount = (row) => {
  row.cost = formatPrize(row.count, row.price, row.times);
};

const removeBet = (bet) => {
  officialBetList.value = officialBetList.value.filter(item => item !== bet);
};

const clearBetListSmooth = () => {
  const container = document.querySelector('.bet-cart__body');
  if (container) {
    container.classList.add('fade-out');
    setTimeout(() => {
      officialBetList.value = [];
      container.classList.remove('fade-out');
    }, 300);
  } else {
    officialBetList.value = [];
  }
};
</script>

<style scoped>
.bet-cart {
  border: 1px solid rgba(201, 202, 228, 0.57);
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
  width: 100%;
}
.bet-cart-header {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  justify-content: space-between;
}
.bet-cart-header .bet-cart-header-left {
  display: flex;
  align-items: center;
}
.summary {
  margin-left: 10px;
  padding: 6px 12px;
  background: #ececec;
  border-radius: 4px;
  font-size: 14px;
}
.text-error {
  color: red;
  font-weight: bold;
}
.bet-cart__body {
  padding: 10px;
  transition: all 0.3s ease;
}
.empty-bet-list {
  padding: 80px;
  font-size: 14px;
  text-align: center;
  color: #999;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-out {
  opacity: 0;
  height: 0;
  overflow: hidden;
}
.bet-cart__table {
  width: 100%;
  min-height: 100px;
}
</style>
