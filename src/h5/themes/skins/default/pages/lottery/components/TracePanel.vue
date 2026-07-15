<template>
  <van-popup
    :show="show"
    position="bottom"
    round
    :style="{ maxHeight: '72%' }"
    @update:show="(v) => emit('update:show', v)"
  >
    <div class="h5-trace">
      <div class="h5-trace__header">
        <span class="h5-trace__title">{{ t('h5.ssc.trace.title') }}</span>
        <van-icon name="cross" @click="emit('update:show', false)" />
      </div>

      <div class="h5-trace__intro">{{ t('h5.ssc.trace.intro') }}</div>

      <van-loading v-if="loading" class="h5-trace__loading" vertical>
        {{ t('h5.ssc.loading') }}
      </van-loading>

      <van-empty
        v-else-if="!nextIssues.length"
        :description="t('h5.ssc.trace.noIssues')"
      />

      <template v-else>
        <div class="h5-trace__controls">
          <div class="h5-trace__field">
            <span>{{ t('h5.ssc.trace.count') }}</span>
            <van-stepper v-model="traceCount" :min="0" :max="nextIssues.length" integer />
          </div>
          <div class="h5-trace__field">
            <span>{{ t('h5.ssc.trace.winStop') }}</span>
            <van-switch v-model="winStop" size="20px" />
          </div>
        </div>

        <div v-if="traceCount > 0" class="h5-trace__preview">
          <div class="h5-trace__preview-label">
            {{ t('h5.ssc.trace.previewLabel', { count: traceCount }) }}
          </div>
          <div class="h5-trace__issues">
            <span
              v-for="issue in selectedIssues"
              :key="issue.issue_no"
              class="h5-trace__issue"
            >{{ issue.issue_no }}</span>
          </div>
        </div>

        <div class="h5-trace__footer">
          <van-button
            plain
            class="h5-trace__btn"
            @click="onCancelTrace"
          >{{ t('h5.ssc.trace.cancel') }}</van-button>
          <van-button
            type="danger"
            class="h5-trace__btn"
            :disabled="traceCount < 1"
            @click="onConfirm"
          >{{ t('h5.ssc.trace.confirm') }}</van-button>
        </div>
      </template>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
// 追号面板:从 /lottery/issue 的 next_issues 拉未开奖后续期(lotteryService.fetchNextIssues),
// 用户选连续 N 期 + 是否中奖后停止;确认后把选中的期号写入共享 store 的 preIssueList,
// 下注提交时 official/creditBetSubmit 会据此带上 trace: { type:'win_stop', issue_ids }。
// 注:后端 trace 契约按 issue_no 传;每期倍数沿用注单本身的倍数(payload 无单期倍数字段)。
import { ref, computed, watch, type PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { showToast } from 'vant';
import { t } from '@shared/i18n';
import * as lotteryService from '@shared/api/lotteryService';
import type { LotteryStore } from '@lottery/base/stores/storeTypes';
import type { IssueItem } from '@shared/types';

const props = defineProps({
  show: { type: Boolean, default: false },
  store: { type: Object as PropType<LotteryStore>, required: true },
  sign: { type: String, required: true },
});
const emit = defineEmits<{ (e: 'update:show', v: boolean): void }>();

const { preIssueList } = storeToRefs(props.store) as any;

const loading = ref(false);
const nextIssues = ref<IssueItem[]>([]);
const traceCount = ref(0);
const winStop = ref(true);

const selectedIssues = computed(() => nextIssues.value.slice(0, traceCount.value));

async function loadIssues(): Promise<void> {
  if (!props.sign) return;
  loading.value = true;
  try {
    nextIssues.value = await lotteryService.fetchNextIssues(props.sign);
  } catch (e) {
    nextIssues.value = [];
  } finally {
    loading.value = false;
  }
  // 回显已有追号设置
  traceCount.value = Math.min(preIssueList.value?.length ?? 0, nextIssues.value.length);
}

watch(
  () => props.show,
  (open) => {
    if (open) loadIssues();
  },
);

function onConfirm(): void {
  if (traceCount.value < 1) return;
  preIssueList.value = selectedIssues.value.map(issue => issue.issue_no);
  showToast(t('h5.ssc.trace.set', { count: traceCount.value }));
  emit('update:show', false);
}

function onCancelTrace(): void {
  traceCount.value = 0;
  preIssueList.value = [];
  showToast(t('h5.ssc.trace.cleared'));
  emit('update:show', false);
}
</script>

<style lang="scss">
.h5-trace {
  display: flex;
  flex-direction: column;
  max-height: 72vh;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid var(--van-border-color, #ebedf0);
  }

  &__intro {
    padding: 10px 16px 0;
    font-size: 12px;
    color: var(--van-gray-6, #969799);
    line-height: 1.5;
  }

  &__loading {
    padding: 40px 0;
  }

  &__controls {
    padding: 12px 16px;
  }

  &__field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 14px;
    color: var(--van-text-color, #323233);
  }

  &__preview {
    padding: 0 16px 12px;
  }

  &__preview-label {
    margin-bottom: 8px;
    font-size: 13px;
    color: var(--van-gray-7, #646566);
  }

  &__issues {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-height: 160px;
    overflow-y: auto;
  }

  &__issue {
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 12px;
    background: var(--van-gray-1, #f7f8fa);
    color: var(--van-gray-7, #646566);
    border: 1px solid var(--van-border-color, #ebedf0);
  }

  &__footer {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    border-top: 1px solid var(--van-border-color, #ebedf0);
  }

  &__btn {
    flex: 1;
  }
}
</style>
