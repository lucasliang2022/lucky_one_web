<template>
  <div class="order-record-container">
    <!-- 标题 -->
    <div class="page-header">
      <div class="header-row">
        <div class="header-title">
          <div class="header-icon"></div>
          <div class="header-text">{{ tr('title') }}</div>
        </div>
        <div class="filter-area">
          <div class="filter-item">
            <label class="filter-label">{{ tr('filter.time') }}</label>
            <el-select v-model="filterRange" class="filter-select" size="small" @change="reload">
              <el-option :label="tr('time.today')" value="today" />
              <el-option :label="tr('time.week')" value="week" />
              <el-option :label="tr('time.month')" value="month" />
              <el-option :label="tr('time.year')" value="year" />
            </el-select>
          </div>
          <div class="filter-item">
            <label class="filter-label">{{ tr('filter.game') }}</label>
            <el-select v-model="filterGame" class="filter-select" size="small">
              <el-option :label="tr('allGames')" value="all" />
              <el-option v-for="g in gameOptions" :key="g.value" :label="g.label" :value="g.value" />
            </el-select>
          </div>
          <div class="filter-item">
            <label class="filter-label">{{ tr('filter.currency') }}</label>
            <el-select v-model="filterCurrency" class="filter-select" size="small">
              <el-option :label="tr('all')" value="all" />
              <el-option v-for="c in currencyOptions" :key="c" :label="currencyLabel(c)" :value="c" />
            </el-select>
          </div>
          <div class="filter-item">
            <label class="filter-label">{{ tr('filter.status') }}</label>
            <el-select v-model="filterStatus" class="filter-select" size="small">
              <el-option :label="tr('all')" value="all" />
              <el-option :label="tr('status.pending')" value="pending" />
              <el-option :label="tr('status.win')" value="win" />
              <el-option :label="tr('status.lose')" value="lose" />
              <el-option :label="tr('status.cancel')" value="cancel" />
            </el-select>
          </div>
          <el-button type="primary" :loading="loading" @click="reload" class="filter-btn" size="small">{{ tr('refresh') }}</el-button>
        </div>
      </div>
      <div class="header-underline"></div>
    </div>

    <!-- 表格:每格两个数据,字体小一号 -->
    <div class="table-area">
      <el-table :data="filteredRecords" v-loading="loading" border stripe size="small"
                class="order-table" :empty-text="tr('empty')">
        <el-table-column :label="tr('col.gameType')" width="96" align="center">
          <template #default="{ row }">
            <div class="cell2">
              <div class="c-main">{{ gameLabel(row.lottery_sign) }}</div>
              <div class="c-sub">{{ row.lottery_name || '-' }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="tr('col.modeMethod')" min-width="120">
          <template #default="{ row }">
            <div class="cell2">
              <div class="c-main">{{ row.mode === 'credit' ? tr('mode.credit') : tr('mode.official') }}</div>
              <div class="c-sub">{{ row.method_define && row.method_define.name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="tr('col.issueOpen')" min-width="130">
          <template #default="{ row }">
            <div class="cell2">
              <div class="c-main">{{ row.issue_no }}</div>
              <div class="c-sub">{{ row.open_code || '-' }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="tr('col.contentTime')" min-width="170">
          <template #default="{ row }">
            <div class="cell2">
              <el-tooltip v-if="betText(row).length > 16" effect="dark" placement="top" :content="betText(row)">
                <div class="c-main ellipsis">{{ betText(row) }}</div>
              </el-tooltip>
              <div v-else class="c-main">{{ betText(row) }}</div>
              <div class="c-sub">{{ formatTime(row.bet_time) }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="tr('col.currencyAmount')" width="100" align="right">
          <template #default="{ row }">
            <div class="cell2">
              <div class="c-main">{{ currencyLabel(row.currency) }}</div>
              <div class="c-sub">{{ formatMoney(row.bet_cost) }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="tr('col.statusPrize')" width="96" align="center">
          <template #default="{ row }">
            <div class="cell2">
              <div :class="['c-main', statusInfo(row).cls]">{{ statusInfo(row).text }}</div>
              <div class="c-sub" :class="{ 'win-text': isWin(row) }">
                {{ isWin(row) ? '+' + formatMoney(row.decide_prize_amount) : '-' }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="tr('col.action')" width="100" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="showDetail(row)">{{ tr('detail') }}</el-button>
            <el-button v-if="canCancel(row)" link type="danger" size="small" @click="cancelRow(row)">{{ tr('cancel') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 底部:左下角本页统计 + 右侧分页 -->
    <div class="footer-area">
      <div class="stats-area">
        <span class="stats-title">{{ tr('stats.title') }}</span>
        <span class="stat"><span class="stat-label">{{ tr('stats.count') }}</span>{{ filteredRecords.length }}</span>
        <span class="stat"><span class="stat-label">{{ tr('stats.amount') }}</span>{{ pageBetCost }}</span>
        <span class="stat"><span class="stat-label">{{ tr('stats.prize') }}</span>{{ pagePrize }}</span>
        <span class="stat"><span class="stat-label">{{ tr('stats.pending') }}</span>{{ pagePending }}</span>
      </div>
      <el-pagination
          background
          small
          layout="prev, pager, next, jumper, total"
          :total="totalRecords"
          v-model:current-page="currentPage"
          :page-size="pageSize"
          @current-change="fetchRecords"
      />
    </div>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" :title="tr('dialog.title')" width="620px">
      <el-descriptions v-if="detailRow" :column="2" border size="small">
        <el-descriptions-item :label="tr('label.game')">{{ gameLabel(detailRow.lottery_sign) }}</el-descriptions-item>
        <el-descriptions-item :label="tr('label.mode')">{{ detailRow.mode === 'credit' ? tr('mode.creditFull') : tr('mode.officialFull') }}</el-descriptions-item>
        <el-descriptions-item :label="tr('label.method')">{{ detailRow.method_define && detailRow.method_define.name }}</el-descriptions-item>
        <el-descriptions-item :label="tr('label.issue')">{{ detailRow.issue_no }}</el-descriptions-item>
        <el-descriptions-item :label="tr('dialog.open')">{{ detailRow.open_code || '-' }}</el-descriptions-item>
        <el-descriptions-item :label="tr('filter.currency')">{{ currencyLabel(detailRow.currency) }}</el-descriptions-item>
        <el-descriptions-item :label="tr('dialog.count')">{{ detailRow.bet_count }}</el-descriptions-item>
        <el-descriptions-item :label="tr('dialog.unit')">{{ formatMoney(detailRow.bet_unit) }}</el-descriptions-item>
        <el-descriptions-item :label="tr('stats.amount')">{{ formatMoney(detailRow.bet_cost) }}</el-descriptions-item>
        <el-descriptions-item :label="tr('stats.prize')">
          <span :class="{ 'win-text': isWin(detailRow) }">{{ isWin(detailRow) ? formatMoney(detailRow.decide_prize_amount) : '-' }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="tr('filter.status')">
          <span :class="statusInfo(detailRow).cls">{{ statusInfo(detailRow).text }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="tr('dialog.time')">{{ formatTime(detailRow.bet_time) }}</el-descriptions-item>
        <el-descriptions-item :label="tr('dialog.content')" :span="2">{{ betText(detailRow) }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { fetchBetRecords, cancelBetOrder } from '@shared/api/lotteryService';
import { useCommonStore } from '@shared/stores/commonStore';

const { t } = useI18n();
const tr = (k) => t(`pages.account.record.${k}`);
const commonStore = useCommonStore();

const records = ref([]);
const totalRecords = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const loading = ref(false);

const filterRange = ref('month');
const filterGame = ref('all');
const filterCurrency = ref('all');
const filterStatus = ref('all');

const detailVisible = ref(false);
const detailRow = ref(null);
const showDetail = (row) => { detailRow.value = row; detailVisible.value = true; };

// 彩种前缀 → i18n key
const GAME_KEYS = ['ssc', 'pk10', 'lhc', 'ks', 'hash', 'sd', 'kl8'];
const gameType = (sign) => {
  const s = String(sign || '');
  return GAME_KEYS.find((t) => s.startsWith(t)) || '';
};
const gameLabel = (sign) => { const gt = gameType(sign); return gt ? tr(`game.${gt}`) : (sign || '-'); };

const currencyLabel = (code) => {
  const c = commonStore.getCurrency(code);
  return c?.label || c?.alias || String(code || '').toUpperCase();
};

const gameOptions = computed(() => {
  const types = [...new Set(records.value.map((r) => gameType(r.lottery_sign)).filter(Boolean))];
  return types.map((t) => ({ value: t, label: tr(`game.${t}`) }));
});
const currencyOptions = computed(() => [...new Set(records.value.map((r) => r.currency).filter(Boolean))]);

const formatMoney = (v) => Number(v || 0).toFixed(2);
const formatTime = (ts) => {
  if (!ts) return '-';
  const d = new Date(Number(ts) * 1000);
  const p = (n) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};
const betText = (row) => row.bet_code_display || row.bet_code || '';

const isCancelled = (o) => o.status === 9 || o.cancel_time > 0;
const isDrawn = (o) => !isCancelled(o) && o.status >= 1;
const isWin = (o) => isDrawn(o) && o.decide_is_win === 1;
const statusInfo = (o) => {
  if (isCancelled(o)) return { text: tr('status.cancel'), cls: 'st-cancel' };
  if (o.status === 0) return { text: tr('status.pending'), cls: 'st-pending' };
  return o.decide_is_win === 1 ? { text: tr('status.win'), cls: 'st-win' } : { text: tr('status.lose'), cls: 'st-lose' };
};

const filteredRecords = computed(() =>
  records.value.filter((r) => {
    if (filterGame.value !== 'all' && gameType(r.lottery_sign) !== filterGame.value) return false;
    if (filterCurrency.value !== 'all' && r.currency !== filterCurrency.value) return false;
    if (filterStatus.value !== 'all') {
      const st = isCancelled(r) ? 'cancel' : r.status === 0 ? 'pending' : r.decide_is_win === 1 ? 'win' : 'lose';
      if (st !== filterStatus.value) return false;
    }
    return true;
  }),
);

const pageBetCost = computed(() => formatMoney(filteredRecords.value.reduce((s, r) => s + Number(r.bet_cost || 0), 0)));
const pagePrize = computed(() => formatMoney(filteredRecords.value.reduce((s, r) => s + (isWin(r) ? Number(r.decide_prize_amount || 0) : 0), 0)));
const pagePending = computed(() => filteredRecords.value.filter((r) => r.status === 0 && !isCancelled(r)).length);

const fetchRecords = async () => {
  loading.value = true;
  try {
    const { list, total } = await fetchBetRecords({ range: filterRange.value, page: currentPage.value, page_size: pageSize.value });
    records.value = list || [];
    totalRecords.value = total || 0;
  } catch (e) {
    ElMessage.error(tr('fetchFail'));
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const reload = () => { currentPage.value = 1; fetchRecords(); };

// 撤单:仅未开奖、未撤销的注单可撤。
const canCancel = (o) => o.status === 0 && !isCancelled(o);
const cancelRow = async (row) => {
  try {
    await ElMessageBox.confirm(tr('cancelConfirm'), tr('cancel'), {
      type: 'warning', confirmButtonText: tr('cancel'),
    });
  } catch {
    return;
  }
  try {
    await cancelBetOrder(row.id);
    ElMessage.success(tr('cancelOk'));
    fetchRecords();
  } catch (e) {
    ElMessage.error(e?.message || tr('cancelFail'));
  }
};

onMounted(() => { fetchRecords(); });
</script>

<style scoped>
.order-record-container { padding: 30px 60px; background-color: #ffffff; overflow-x: hidden; }
.page-header { margin-bottom: 18px; }
.header-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.header-title { display: flex; align-items: center; }
.header-icon { width: 4px; height: 20px; background-color: var(--el-color-primary); border-radius: 2px; margin-right: 10px; }
.header-text { font-size: 20px; font-weight: 600; color: #1a1a1a; }
.header-underline { height: 1px; background-color: #eee; margin-top: 15px; }

.filter-area { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.filter-item { display: flex; align-items: center; gap: 6px; }
.filter-label { color: #666; font-size: 13px; white-space: nowrap; }
.filter-select { width: 110px; }

.order-table { font-size: 12px; }
.cell2 { display: flex; flex-direction: column; line-height: 1.5; }
.cell2 .c-main { font-size: 12px; color: #1a1a1a; }
.cell2 .c-sub { font-size: 11px; color: #909399; }
.cell2 .ellipsis { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* 状态 / 派彩 颜色区分:已中奖·派彩=绿,未中奖=灰,待开奖=蓝,已撤单=橙。
   表格里 .cell2 .c-main / .c-sub 设了默认色,特异性更高,这里用 .cell2 .c-main.st-* 覆盖;
   详情弹窗里状态是裸 span,再补一份低特异性规则。 */
.st-win { color: #21a366; font-weight: 600; }
.st-lose { color: #909399; font-weight: 600; }
.st-pending { color: #409eff; font-weight: 600; }
.st-cancel { color: #e6a23c; font-weight: 600; }
.win-text { color: #21a366; font-weight: 600; }
.cell2 .c-main.st-win { color: #21a366; }
.cell2 .c-main.st-lose { color: #909399; }
.cell2 .c-main.st-pending { color: #409eff; }
.cell2 .c-main.st-cancel { color: #e6a23c; }
.cell2 .c-sub.win-text { color: #21a366; }

.footer-area { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; flex-wrap: wrap; gap: 10px; }
.stats-area { display: flex; align-items: center; gap: 16px; font-size: 12px; color: #1a1a1a; }
.stats-title { font-weight: 600; color: #333; }
.stat { color: #1a1a1a; }
.stat-label { color: #909399; margin-right: 4px; }
</style>
