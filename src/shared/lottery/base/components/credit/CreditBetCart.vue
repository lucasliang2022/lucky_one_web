<template>
  <div class="bet-cart">
    <div class="bet-cart-header">
      <div class="bet-cart-header-left">
        <p>购彩篮</p>
        <div class="summary">
          共{{ creditBetList.length }}组 总金额：
          <span class="text-error font-medium">
            {{ commonStore.getCurrencyInfo(currency)?.symbol ?? '' }}{{ totalAmount }}
          </span>
        </div>
      </div>
      <div>
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
      <div class="bet-cart__body" v-if="creditBetList.length" key="betTable">
        <el-table :data="creditBetList" border class="bet-cart__table">
          <el-table-column label="玩法" prop="methodTitle" width="190"></el-table-column>
          <el-table-column label="内容">
            <template #default="{ row }">
              {{ getBallText(row.balls) }}
            </template>
          </el-table-column>
          <el-table-column label="注数" width="120">
            <template #default="{ row }">
              1
            </template>
          </el-table-column>
          <el-table-column label="货币" prop="currency" width="120">
            <template #default="{ row }">
              {{ commonStore.getCurrencyInfo(row.currency)?.label ?? row.currency }}
            </template>
          </el-table-column>
          <el-table-column label="投注金额(元)" width="180">
            <template #default="{ row }">
              <el-input
                  size="small"
                  type="text"
                  v-model="row.amount"
                  @input="updateBetAmount(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="可赢金额(元)" width="120">
            <template #default="{ row }">
              {{ formatPrize(row.prize * row.amount) }}
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
        <div><span class="icon-sd icon-sd-cart_empty" style="font-size: 60px"></span></div>
        <div>暂无选号</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '@shared/stores/commonStore.js';
import { formatPrize } from '@shared/utils/common.ts';
import { storeToRefs } from "pinia";

const { t } = useI18n();

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const {
  currency,
  creditBetList,
} = storeToRefs(props.store);

const emit = defineEmits(['do:submitBet']);
const commonStore = useCommonStore();

const totalAmount = computed(() =>
    formatPrize(creditBetList.value.reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0))
);

const updateBetAmount = (row) => {
  const value = row.amount.trim().replace(/[^0-9]/g, '');
  row.amount = value ? value : '0';
};

const removeBet = (bet) => {
  creditBetList.value = creditBetList.value.filter(item => item !== bet);
};

const clearBetListSmooth = () => {
  const container = document.querySelector('.bet-cart__body');
  if (container) {
    container.classList.add('fade-out');
    setTimeout(() => {
      creditBetList.value = [];
      container.classList.remove('fade-out');
    }, 300);
  } else {
    creditBetList.value = [];
  }
};

const getBallText = balls => balls?.map(ball => t(ball.title)).join(', ') || '无数据';
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