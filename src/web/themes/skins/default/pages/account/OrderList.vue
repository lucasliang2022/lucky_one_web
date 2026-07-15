<template>
  <div class="order-record-container">
    <!-- 第一部分：标题区域 -->
    <div class="page-header">
      <div class="header-row">
        <div class="header-title">
          <div class="header-icon"></div>
          <div class="header-text">投注记录</div>
        </div>
        <div class="header-balance">
          <div class="balance-item">
            <span class="balance-label">RMB 余额:</span>
            <span class="balance-value">¥0.00</span>
          </div>
          <div class="balance-item">
            <span class="balance-label">USDT 余额:</span>
            <span class="balance-value">₮0.00</span>
          </div>
        </div>
      </div>
      <!-- 下划线，细一些 -->
      <div class="header-underline"></div>
    </div>

    <!-- 第二部分：统计与查询区域 -->
    <div class="stats-filter-area">
      <!-- 左侧：统计区域 -->
      <div class="stats-area">
        <div class="stats-title">
          近
          <el-select
              v-model="selectedRange"
              class="range-select-inline"
              placeholder=""
              size="small"
              popper-class="range-select-popper"
          >
            <el-option label="7" :value="7"></el-option>
            <el-option label="14" :value="14"></el-option>
            <el-option label="30" :value="30"></el-option>
          </el-select>
          日总计
        </div>
        <div class="stats-detail">
          <div class="detail-item">
            <span class="detail-label">RMB 下注:</span>
            <span class="detail-value">¥0.00</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">USDT 下注:</span>
            <span class="detail-value">₮0.00</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">投注笔数:</span>
            <span class="detail-value">0</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">未结单量:</span>
            <span class="detail-value">0</span>
          </div>
        </div>
      </div>
      <!-- 右侧：筛选区域 -->
      <div class="filter-area">
        <div class="filter-item">
          <label class="filter-label">币种</label>
          <el-select v-model="selectedCurrency" class="filter-select" placeholder="选择币种">
            <el-option label="RMB" value="rmb"></el-option>
            <el-option label="USDT" value="usdt"></el-option>
          </el-select>
        </div>
        <div class="filter-item">
          <label class="filter-label">游戏</label>
          <el-select v-model="selectedGame" class="filter-select" placeholder="选择游戏">
            <el-option label="全部游戏" value="all"></el-option>
            <el-option label="时时彩" value="ssc"></el-option>
            <el-option label="六合彩" value="lhc"></el-option>
          </el-select>
        </div>
        <div class="filter-item">
          <label class="filter-label">日期</label>
          <el-date-picker
              v-model="selectedDate"
              type="daterange"
              class="filter-date"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <div class="filter-item">
          <label class="filter-label">状态</label>
          <el-select v-model="selectedStatus" class="filter-select" placeholder="选择状态">
            <el-option label="全部" value="all"></el-option>
            <el-option label="赢" value="win"></el-option>
            <el-option label="输" value="lose"></el-option>
            <el-option label="未结" value="pending"></el-option>
            <el-option label="取消" value="cancel"></el-option>
            <el-option label="和局" value="draw"></el-option>
            <el-option label="官方未开" value="official"></el-option>
          </el-select>
        </div>
        <el-button type="primary" @click="fetchBetRecords" class="filter-btn">搜索</el-button>
      </div>
    </div>

    <!-- 第三部分：结果表格区域 -->
    <div class="table-area">
      <div class="table-wrapper">
        <el-table :data="betRecords" border stripe class="order-table">
          <el-table-column prop="status" label="状态" width="80" align="center"></el-table-column>
          <el-table-column prop="method_define.name" label="游戏名称" width="155"></el-table-column>
          <el-table-column label="投注内容" width="155">
            <template #default="scope">
              <el-tooltip
                  v-if="scope.row.bet_code && scope.row.bet_code.length > 15"
                  effect="dark"
                  placement="top"
                  :content="scope.row.bet_code"
              >
                <span>{{ scope.row.bet_code.slice(0,15) + '...' }}</span>
              </el-tooltip>
              <span v-else>{{ scope.row.bet_code }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bet_times" label="投注时间" width="155"></el-table-column>
          <el-table-column prop="issue_no" label="期数" width="155"></el-table-column>
          <el-table-column prop="bet_cost" label="注额" width="105" align="right"></el-table-column>
          <el-table-column label="输赢" width="70" align="right">
            <template #default="scope">
              <span v-if="scope.row.decide_is_win === 1" class="win-text">是</span>
              <span v-else-if="scope.row.decide_is_win === 0" class="lose-text">否</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="text" size="small" @click="cancelRecord(scope.row)">撤单</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="empty-tip" v-if="betRecords.length === 0">
          <p>没有相关记录喔～</p>
        </div>
      </div>
      <div class="pagination-area">
        <el-pagination
            background
            layout="prev, pager, next, jumper, total"
            :total="totalRecords"
            v-model:currentPage="currentPage"
            :page-size="pageSize"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import api from '@shared/api/index.ts';

const betRecords = ref([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 筛选条件
const selectedCurrency = ref('rmb');
const selectedGame = ref('all');
const selectedDate = ref([]);
const selectedStatus = ref('all');
// 近N日统计下拉，初始为7天
const selectedRange = ref(7);

const fetchBetRecords = async () => {
  try {
    const params = {
      type: 'history',
      currency: selectedCurrency.value,
      lottery_sign: selectedGame.value,
      status: selectedStatus.value,
      range: selectedRange.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    };
    if (selectedDate.value && selectedDate.value.length === 2) {
      params.startDate = selectedDate.value[0];
      params.endDate = selectedDate.value[1];
    }
    const response = await api.post('/lottery/orderList', { ...params });
    betRecords.value = response.data.items || [];
    totalRecords.value = response.data.total || 0;
  } catch (error) {
    ElMessage.error('获取投注记录失败');
    console.error(error);
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchBetRecords();
};

const cancelRecord = async (record) => {
  const data = await api.post(`/lottery/betCancel`, { order_id: record.id });
  ElMessage.success(data.msg);
  await fetchBetRecords();
};

onMounted(() => {
  fetchBetRecords();
});
</script>

<style scoped>
/* 整体容器 */
.order-record-container {
  padding: 30px 60px;
  background-color: #ffffff;
  overflow-x: hidden;
}

/* 第一部分：标题区域 */
.page-header {
  margin-bottom: 25px;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title {
  display: flex;
  align-items: center;
}
.header-icon {
  width: 8px;
  height: 8px;
  background-color: #007bff;
  margin-right: 8px;
  border-radius: 2px;
}
.header-text {
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin: 0;
}
.header-underline {
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin-top: 5px;
}
.stats-filter-area {

  margin-bottom: 25px;
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 15px;

}
.stats-area {
  margin-bottom: 12px;
  padding-bottom: 12px;
  min-width: 360px;
  border-bottom: 1px #EEEEEE solid;
}
.stats-title {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.range-select-inline {
  margin: 0 4px;
  vertical-align: middle;
  width: 50px;
}
::v-deep(.range-select-inline .el-select__wrapper) {
  padding: 1px 4px;
  line-height: 18px !important;
  min-height: 18px !important;
}
.range-select-popper {
  font-size: 12px;
}
.stats-detail {
  display: flex;
  gap: 10px;
}
.detail-item {
  background: #ffffff;
  border-radius: 6px;
  padding: 8px;
  min-width: 140px;
  text-align: center;
}
.detail-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 3px;
}
.detail-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.filter-area {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  margin-top: 5px;
}
.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.filter-label {
  font-size: 14px;
  color: #666;
}
.filter-select,
.filter-date {
  width: 120px;
}
.filter-btn {
  margin-left: auto;
}
.table-area {
  background-color: #ffffff;
  border-radius: 8px;
}
.table-wrapper {
  margin-bottom: 20px;
}
.order-table {
  width: 100%;
}
.empty-tip {
  text-align: center;
  padding: 20px;
  color: #999;
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
}
.pagination-area {
  display: flex;
  justify-content: flex-end;
}
.win-text {
  color: #28a745;
  font-weight: bold;
}
.lose-text {
  color: #dc3545;
  font-weight: bold;
}
.header-balance,
.header-summary {
  display: flex;
  gap: 20px;
  align-items: center;
}
.balance-info {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.balance-label {
  color: #666;
  margin-right: 5px;
}
.balance-value {
  color: #007bff;
  font-weight: bold;
}
</style>
