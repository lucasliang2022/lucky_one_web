<template>
  <el-dialog
      v-model="visible"
      title="确认注单"
      width="910px"
      center
      :close-on-click-modal="false"
      class="bet-confirm-dialog"
      @close="onClose"
  >
    <div class="dialog-body">
      <issue-info :store="store" />
      <div class="bet-header">
        <div class="bet-summary">
          <span>共</span>
          <span class="highlight">{{ selectedCount }}</span>
          <span>组 总金额:</span>
          <span class="highlight bold">¥{{ formatAmount(totalBetAmount) }}</span>
        </div>
        <el-checkbox v-model="selectAll" @change="toggleSelectAll" label="全选" />
      </div>
      <el-table
          :data="dialogBetList"
          border
          class="bet-table"
          header-row-class-name="header-row"
          max-height="400"
      >
        <el-table-column prop="methodTitle" label="玩法" />
        <el-table-column prop="code" label="内容">
          <template #default="scope">
            {{ getBallText(scope.row.balls) }}
          </template>
        </el-table-column>
        <el-table-column label="注数" width="100">
          <template #default="scope">
            {{ scope.row.count }}
          </template>
        </el-table-column>
        <el-table-column label="倍数" width="100">
          <template #default="scope">
            {{ scope.row.times }}
          </template>
        </el-table-column>
        <el-table-column label="金额" width="150">
          <template #default="scope">
            ¥{{ formatAmount(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column label="确认" width="100">
          <template #default="scope">
            <el-checkbox v-model="scope.row.confirmed" label="确认" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button :disabled="submitting" @click="visible = false">取消</el-button>
        <el-button type="primary" :disabled="!isBetting" :loading="submitting" @click="handleConfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { notify } from '@shared/notify';
import { storeToRefs } from 'pinia';
import IssueInfo from '../DialogIssueInfo.vue';
import { useUserStore } from '@shared/stores/userStore';

const { t } = useI18n();
const userStore = useUserStore();

const props = defineProps({
  dialogBetList: {
    type: Array,
    required: true,
    default: () => []
  },
  store: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['update:betList', 'close']);

const { issueCurrent, name, currency, creditBetList: storeBetList } = storeToRefs(props.store);
const { creditBetSubmit } = props.store;

const visible = ref(false);
const isBetting = ref(true);
const selectAll = ref(true);
const submitting = ref(false);

const dialogBetList = ref([]);

const selectedCount = computed(() => {
  return dialogBetList.value.filter(bet => bet.confirmed).length;
});

const totalBetAmount = computed(() => {
  return dialogBetList.value.filter(bet => bet.confirmed).reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);
});

const formatAmount = (value) => {
  return Number(value || 0).toFixed(2);
};

// 内容列:与 CreditBetCart 一致地防御 —— balls 缺失时不炸,回落「无数据」。
const getBallText = (balls) => balls?.map(ball => t(ball.title)).join(',') || '无数据';

const setDefaultConfirmed = () => {
  dialogBetList.value = props.dialogBetList.map(bet => ({ ...bet, confirmed: true }));
  selectAll.value = true;
};

const toggleSelectAll = (value) => {
  dialogBetList.value.forEach(bet => {
    bet.confirmed = value;
  });
};

watch(() => issueCurrent.value, (newVal) => {
  if (newVal && newVal.sale_end_time) {
    const now = Math.floor(Date.now() / 1000);
    const remaining = Math.max(0, newVal.sale_end_time - now);
    isBetting.value = remaining > 0;
  } else {
    isBetting.value = false;
  }
}, { immediate: true });

const handleConfirm = async () => {
  if (!isBetting.value) {
    notify.warning('当前销售时间已结束，无法投注');
    return;
  }
  const confirmedBets = dialogBetList.value.filter(bet => bet.confirmed);
  if (confirmedBets.length === 0) {
    notify.warning('请至少确认一项投注');
    return;
  }
  if (submitting.value) return;
  // 提交订单:先进 loading(按钮转圈 + 禁用),请求结束再解除。
  submitting.value = true;
  try {
    storeBetList.value = confirmedBets;
    await creditBetSubmit();
    emit('update:betList', dialogBetList.value.filter(bet => !bet.confirmed));
    visible.value = false;
  } catch (error) {
    console.error('确认投注失败:', error);
  } finally {
    submitting.value = false;
  }
};

const onClose = () => {
  emit('close');
};

// 本币种可用余额(数字)。
const availableBalance = () => {
  const wallet = userStore.balance?.[currency.value];
  return wallet ? (Number(wallet.amount) || 0) : 0;
};

// 本次待提交注单总额(打开即默认全选,按全部注单算)。
const pendingTotal = () => props.dialogBetList.reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0);

// 余额校验:够 → 放行;不够 → 先拉一次最新余额;仍不够 → 直接提示,不开注单确认。
const ensureBalance = async () => {
  const total = pendingTotal();
  if (availableBalance() >= total) return true;
  try {
    await userStore.fetchBalance();
  } catch (e) {
    console.error('fetch balance failed', e);
  }
  if (availableBalance() >= total) return true;
  notify.warning('余额不足');
  return false;
};

const open = async () => {
  // 余额不足则直接提示并中止,不显示注单确认弹窗。
  if (!(await ensureBalance())) return;
  visible.value = true;
  setDefaultConfirmed();
};

watch(() => props.dialogBetList, (newVal) => {
  dialogBetList.value = newVal.map(bet => ({ ...bet, confirmed: true }));
}, { immediate: true, deep: true });

onMounted(() => {
  if (visible.value) {
    setDefaultConfirmed();
  }
});

defineExpose({ open });
</script>

<style lang="scss" scoped>
.bet-confirm-dialog {
  .el-dialog {
    max-height: 80vh;
    overflow-y: auto;
  }
  .dialog-header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    padding: 5px 20px;
    border-bottom: 1px solid #eeeeee;
    .close-icon {
      width: 16px;
      height: 16px;
      cursor: pointer;
      color: #999;
      &:hover {
        color: #333;
      }
    }
  }
  .dialog-body {
    padding: 20px 20px 3px 20px;
    .bet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      .el-checkbox {
        margin-right: 10px;
      }
    }
    .bet-table {
      width: 100%;
      margin-bottom: 15px;
    }
    .bet-summary {
      font-size: 14px;
      text-align: right;
      .highlight {
        color: #e02020;
        margin: 0 5px;
        &.bold {
          font-weight: 700;
        }
      }
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 10px 20px;
    border-top: 1px solid #e6e6e6;
  }
}
:deep(.el-table__cell) {
  padding: 2px 0;
  line-height: 20px;
  font-size: 12px;
}
</style>