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
        <th class="order-table-header-cell">状态</th>
        <th class="order-table-header-cell">中奖金额</th>
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
        <td class="order-table-cell">
          <span class="order-status" :class="statusClass(order)">{{ statusLabel(order) }}</span>
        </td>
        <td class="order-table-cell">
          <span v-if="isWin(order)" class="order-prize">{{ currencySymbol }}{{ order.decide_prize_amount }}</span>
          <span v-else class="order-prize-none">-</span>
        </td>
        <td class="order-table-cell" style="text-align: center; vertical-align: middle;">
          <!-- 待开奖:可撤单 -->
          <el-button
              v-if="canCancel(order)"
              size="small"
              class="order-cancel-button"
              @click="cancelOrder(order)"
          >
            撤单
          </el-button>
          <!-- 已撤单 -->
          <span v-else-if="isCancelled(order)" class="order-cancelled">已撤单</span>
          <!-- 已开奖:撤单按钮置灰(不可点) -->
          <el-button
              v-else
              size="small"
              disabled
              class="order-cancel-button is-disabled"
          >
            撤单
          </el-button>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="!orderListLoading && orderList.length === 0" class="order-no-data">暂无订单</div>

    <div v-if="orderTotal > pageSize" class="order-pagination">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="orderTotal"
          :page-size="pageSize"
          :current-page="page"
          @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch, ref } from 'vue';
import { ElButton, ElTooltip, ElPagination } from 'element-plus';
import { notify } from '@shared/notify';
import api from "@shared/api/index.ts";
import { storeToRefs } from "pinia";
import { useCommonStore } from '@shared/stores/commonStore.js';
import { useUserStore } from '@shared/stores/userStore.ts';

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
  orderTotal,
  sign,
  currency,
  issueLast,
} = storeToRefs(props.store);
const { fetchOrderList } = props.store;

// 分页(本组件自持):最近 1 月订单,每页 20 条。
const page = ref(1);
const pageSize = 20;

const loadOrders = () => fetchOrderList({ lottery_sign: sign.value, page: page.value, page_size: pageSize });

const onPageChange = (p) => {
  page.value = p;
  loadOrders();
};

// 切彩种时回到第一页并重新拉取。
watch(sign, () => { page.value = 1; loadOrders(); });
onMounted(loadOrders);

// 开奖后延迟 2s 刷新当前页:issueLast(上一期已开奖)issue_no 变化即视为「刚开奖」,
// 等 2s 让后端判奖+派奖落库,订单的状态/中奖金额才拿到最新值。
let drawRefreshTimer = null;
watch(() => issueLast.value?.issue_no, (newNo, oldNo) => {
  // 跳过挂载/切彩种的初次赋值(oldNo 为空);仅在真正换到新一期时触发。
  if (!newNo || !oldNo || newNo === oldNo) return;
  if (drawRefreshTimer) clearTimeout(drawRefreshTimer);
  drawRefreshTimer = setTimeout(loadOrders, 2000);
});
onUnmounted(() => { if (drawRefreshTimer) clearTimeout(drawRefreshTimer); });

// 单注钱档位 float → 中文标签(元/角/分/厘)。
const UNIT_LABELS = { '1': '元', '0.1': '角', '0.01': '分', '0.001': '厘' };
const getUnitLabel = (unitValue) => UNIT_LABELS[String(unitValue)] ?? unitValue;

const currencySymbol = computed(() => commonStore.getCurrency?.(currency.value)?.symbol || '¥');

const displayCodes = computed(() => {
  const codes = {};
  orderList.value.forEach(order => {
    codes[order.id] = order.bet_code_display || order.bet_code || '';
  });
  return codes;
});

const truncateCode = (code) => (code.length > 35 ? `${code.substring(0, 32)}...` : code);

// —— 状态判定:0 待开奖 / 1-4 已开奖(中奖/未中奖) / 9 已撤单 ——
const isCancelled = (o) => o.status === 9 || o.cancel_time > 0;
const canCancel   = (o) => o.status === 0 && o.cancel_time <= 0;   // 未开奖才可撤
const isDrawn     = (o) => !isCancelled(o) && o.status >= 1;       // 已开奖(判奖/派奖/返水/统计)
const isWin       = (o) => isDrawn(o) && o.decide_is_win === 1;

const statusLabel = (o) => {
  if (isCancelled(o)) return '已撤单';
  if (o.status === 0) return '待开奖';
  return o.decide_is_win === 1 ? '已中奖' : '未中奖';
};

const statusClass = (o) => {
  if (isCancelled(o)) return 'is-cancelled';
  if (o.status === 0) return 'is-pending';
  return o.decide_is_win === 1 ? 'is-win' : 'is-lose';
};

const cancelOrder = async (order) => {
  const data = await api.post(`/lottery/betCancel`, { order_id: order.id });
  notify.success(data.msg);
  loadOrders();
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

/* —— 状态 —— */
.order-status {
  font-size: 13px;
  &.is-pending   { color: #909399; }
  &.is-win       { color: #e4393c; font-weight: 600; }
  &.is-lose      { color: #67c23a; }
  &.is-cancelled { color: #999; }
}

.order-prize { color: #e4393c; font-weight: 600; }
.order-prize-none { color: #999; }

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

/* 已开奖:置灰不可点 */
.order-cancel-button.is-disabled,
.order-cancel-button.is-disabled:hover {
  background-color: #d9d9d9;
  color: #fff;
  cursor: not-allowed;
}

.order-cancelled {
  color: #999;
  font-size: 14px;
}

.order-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
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
