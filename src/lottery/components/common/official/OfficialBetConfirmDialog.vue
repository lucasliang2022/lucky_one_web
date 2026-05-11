<template>
  <el-dialog
      v-model="visible"
      :title="t('pages.lottery.bet.dialog.label.title')"
      width="910px"
      center
      :close-on-click-modal="false"
      class="bet-confirm-dialog"
      @close="onClose"
  >
    <div class="dialog-body">
      <issue-info :store="store" />
      <div class="bet-header">
        <div class="bet-game-name">{{ name || '秒速时时彩' }}</div>
        <el-checkbox v-model="selectAll" @change="toggleSelectAll" :label="t('pages.lottery.bet.dialog.label.chooseAll')" />
      </div>
      <el-table
          :data="dialogBetList"
          border
          class="bet-table"
          header-row-class-name="header-row"
          max-height="400"
      >
        <el-table-column prop="methodTitle" :label="t('pages.lottery.bet.dialog.label.method')" width="120" />
        <el-table-column prop="code" :label="t('pages.lottery.bet.dialog.label.content')">
          <template #default="scope">
            <template v-if="scope.row.codesDisplay.length > 35">
              <el-tooltip effect="light" :content="scope.row.codesDisplay" placement="top">
                <span>{{ strSub(scope.row.codesDisplay, 35) }}...</span>
              </el-tooltip>
            </template>
            <template v-else>
              {{ scope.row.codesDisplay }}
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="t('pages.lottery.bet.dialog.label.count')" width="80">
          <template #default="scope">
            {{ scope.row.count }}
          </template>
        </el-table-column>
        <el-table-column :label="t('pages.lottery.bet.dialog.label.times')" width="80">
          <template #default="scope">
            {{ scope.row.times }}
          </template>
        </el-table-column>
        <el-table-column :label="t('pages.lottery.bet.dialog.label.cost')" width="150">
          <template #default="scope">
            ¥{{ formatAmount(scope.row.cost) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('pages.lottery.bet.dialog.label.confirm')" width="100">
          <template #default="scope">
            <el-checkbox v-model="scope.row.confirmed" :label="t('pages.lottery.bet.dialog.label.confirm')" />
          </template>
        </el-table-column>
      </el-table>
      <div class="bet-summary">
        <span>{{t('pages.lottery.bet.dialog.tips.total_1')}}</span>
        <span class="highlight">{{ selectedCount }}</span>
        <span>{{t('pages.lottery.bet.dialog.tips.total_2')}} {{t('pages.lottery.bet.dialog.tips.total_3')}}:</span>
        <span class="highlight bold">¥{{ formatAmount(totalBetAmount) }}</span>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">{{t('pages.lottery.bet.dialog.button.cancel')}}</el-button>
        <el-button type="primary" :disabled="!isBetting" @click="handleConfirm">
          {{t('pages.lottery.bet.dialog.button.confirm')}}
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
import { strSub } from "@/utils/common.js";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
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

const { name, officialBetList: storeBetList } = storeToRefs(props.store);
const { officialBetSubmit } = props.store;

const visible = ref(false);
const isBetting = ref(true);
const selectAll = ref(true);

const dialogBetList = ref([]);

const selectedCount = computed(() => {
  return dialogBetList.value.filter(bet => bet.confirmed).length;
});

const totalBetAmount = computed(() => {
  return dialogBetList.value.filter(bet => bet.confirmed).reduce((sum, bet) => sum + (Number(bet.cost) || 0), 0);
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

const handleConfirm = async () => {
    const confirmedBets = dialogBetList.value.filter(bet => bet.confirmed);
    if (confirmedBets.length === 0) {
      ElMessage.warning('请至少确认一项投注');
      return;
    }
    storeBetList.value = confirmedBets;
    await officialBetSubmit();
    dialogBetList.value = []
    emit('update:betList', dialogBetList.value.filter(bet => !bet.confirmed));
    visible.value = false;
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
      .bet-game-name {
        font-size: 14px;
        color: #333;
      }
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