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
            {{ scope.row.balls.map(ball => ball.title).join(',') }}
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
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :disabled="!isBetting" @click="handleConfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import IssueInfo from '../DialogIssueInfo.vue';

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

const { issueCurrent, name, creditBetList: storeBetList } = storeToRefs(props.store);
const { creditBetSubmit } = props.store;

const visible = ref(false);
const isBetting = ref(true);
const selectAll = ref(true);

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
    ElMessage.warning('当前销售时间已结束，无法投注');
    return;
  }
  try {
    const confirmedBets = dialogBetList.value.filter(bet => bet.confirmed);
    if (confirmedBets.length === 0) {
      ElMessage.warning('请至少确认一项投注');
      return;
    }
    storeBetList.value = confirmedBets;
    await creditBetSubmit();
    emit('update:betList', dialogBetList.value.filter(bet => !bet.confirmed));
    visible.value = false;
  } catch (error) {
    console.error('确认投注失败:', error);
  }
};

const onClose = () => {
  emit('close');
};

const open = () => {
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