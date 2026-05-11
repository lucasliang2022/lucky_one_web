<template>
  <div class="order-list-wrapper">
    <div v-if="orderListError" class="order-error">{{ orderListError }}</div>
    <div v-if="orderListLoading" class="order-loading">加载中...</div>
    <table v-if="!orderListLoading && orderList.length" class="order-table">
      <thead class="order-table-header">
      <tr class="order-table-header-row">
        <th class="order-table-header-cell">模式</th>
        <th class="order-table-header-cell">玩法</th>
        <th class="order-table-header-cell">投注内容</th>
        <th class="order-table-header-cell">金额</th>
        <th class="order-table-header-cell">注数</th>
        <th class="order-table-header-cell">倍数</th>
        <th class="order-table-header-cell">单位</th>
        <th class="order-table-header-cell" style="text-align: center">操作</th>
      </tr>
      </thead>
      <tbody class="order-table-body">
      <tr v-for="order in orderList" :key="order.id" class="order-table-row">
        <td class="order-table-cell">{{ order.mode === 'official' ? '官方' : '信用' }}</td>
        <td class="order-table-cell">{{ order.method_define.name }}</td>
        <td class="order-table-cell">
          <div class="code-wrapper">
            <el-tooltip
                v-if="displayCodes[order.id].length > 35"
                popper-class="order-code-tooltip"
                effect="dark"
                :content="displayCodes[order.id]"
                placement="top"
            >
              <span class="order-code">{{ truncateCode(displayCodes[order.id]) }}</span>
            </el-tooltip>
            <span v-else class="order-code">{{ displayCodes[order.id] }}</span>
          </div>
        </td>
        <td class="order-table-cell">{{ currencySymbol }}{{ order.bet_cost }}</td>
        <td class="order-table-cell">{{ order.bet_count }}</td>
        <td class="order-table-cell">{{ order.bet_times }}</td>
        <td class="order-table-cell">{{ getUnitLabel(order.bet_unit) }}</td>
        <td class="order-table-cell" style="text-align: center; vertical-align: middle;">
          <el-button
              v-if="order.cancel_time <= 0"
              size="small"
              class="order-cancel-button"
              @click="cancelOrder(order)"
          >
            撤单
          </el-button>
          <span v-else class="order-cancelled">已撤单</span>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="!orderListLoading && orderList.length === 0" class="order-no-data">暂无订单</div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { ElButton, ElMessage, ElTooltip } from 'element-plus';
import api from "@/api/index.ts";
import { storeToRefs } from "pinia";
import { useCommonStore } from '@/stores/commonStore.js';
import { useUserStore } from '@/stores/userStore.ts';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const commonStore = useCommonStore();
const userStore = useUserStore();

const {
  orderListError,
  orderListLoading,
  orderList,
} = storeToRefs(props.store);
const { fetchOrderList } = props.store;
const { unitOptions, currencyOptions } = storeToRefs(commonStore);

const getUnitLabel = (unitValue) => {
  const unit = unitOptions.value.find(opt => opt.value === unitValue);
  return unit ? unit.label : unitValue;
};

const currencySymbol = computed(() => {
  return currencyOptions.value[0]?.symbol || '¥';
});

const displayCodes = computed(() => {
  const codes = {};
  orderList.value.forEach(order => {
    codes[order.id] = order.bet_code_display || order.bet_code || '';
  });
  return codes;
});

const truncateCode = (code) => {
  return code.length > 35 ? `${code.substring(0, 32)}...` : code;
};

const cancelOrder = async (order) => {
  const data = await api.post(`/lottery/betCancel`, { order_id: order.id });
  ElMessage.success(data.msg);
  fetchOrderList();
  await userStore.fetchBalance();
};

</script>

<style lang="scss" scoped>
.order-list-wrapper {
  padding: 10px 0;
  font-family: sans-serif;
}

.order-error {
  color: red;
  margin-bottom: 10px;
}

.order-loading {
  margin-bottom: 16px;
  color: #666;
}

.order-no-data {
  margin-top: 16px;
  text-align: center;
  color: #999;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  font-size: 14px;
}

.order-table-header {
  background-color: #f5f7fa;
}

.order-table-header-cell,
.order-table-cell {
  padding: 8px;
  border: 1px solid #ebeef5;
  text-align: left;
}

.order-table-header-cell {
  font-weight: bold;
}

.order-table-row:nth-child(odd) {
  background-color: #fff;
}

.order-table-row:nth-child(even) {
  background-color: #f9f9f9;
}

.code-wrapper {
  position: relative;
  display: inline-block;
}

.order-code {
  display: block;
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.order-cancel-button {
  padding: 4px 8px;
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.order-cancel-button:hover {
  background-color: #ff7875;
}

.order-cancelled {
  color: #999;
  font-size: 14px;
}

.order-code-tooltip.is-dark {
  background-color: #1c9eff;
  border: 1px solid #1c9eff;
  z-index: 2000;
}

.order-code-tooltip.is-dark > .el-popper__arrow::before {
  background-color: #1c9eff;
  border: 1px solid #1c9eff;
}
</style>