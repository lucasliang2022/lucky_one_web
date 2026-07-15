<template>
  <div class="h5-draws">
    <van-loading v-if="loading" class="h5-draws__loading" vertical>
      {{ t('h5.ssc.draws.loading') }}
    </van-loading>

    <van-empty
      v-else-if="!rows.length"
      :description="t('h5.ssc.draws.empty')"
    />

    <template v-else>
      <div class="h5-draws__head">
        <span class="h5-draws__col h5-draws__col--issue">{{ t('h5.ssc.draws.issue') }}</span>
        <span class="h5-draws__col h5-draws__col--code">{{ t('h5.ssc.draws.code') }}</span>
      </div>
      <div
        v-for="row in rows"
        :key="row.issue_no"
        class="h5-draws__row"
      >
        <span class="h5-draws__col h5-draws__col--issue">{{ row.issue_no }}</span>
        <span class="h5-draws__col h5-draws__col--code">
          <span
            v-for="(ball, idx) in row.balls"
            :key="idx"
            class="h5-draws__ball"
          >{{ ball }}</span>
        </span>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
// 近期开奖:进入 tab 时经共享 store.fetchIssueHistory() 拉取,渲染 common.issueHistory。
// 号码解析参照 web 端 History.vue:open_code 为逗号分隔字符串,split(',') 拆成球。
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { t } from '@shared/i18n';
import type { IssueItem } from '@shared/types';

const props = defineProps<{ store: any }>();

const { issueHistory } = storeToRefs(props.store) as any;

const loading = ref(false);

const rows = computed(() =>
  (issueHistory.value as IssueItem[]).map((issue) => ({
    issue_no: issue.issue_no,
    balls:
      typeof issue.open_code === 'string'
        ? issue.open_code.split(',').map((n) => n.trim()).filter((n) => n !== '')
        : [],
  })),
);

onMounted(async () => {
  loading.value = true;
  try {
    await props.store.fetchIssueHistory();
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss">
.h5-draws {
  padding: 8px 0;
  background: #fff;

  &__loading {
    padding: 48px 0;
  }

  &__head,
  &__row {
    display: flex;
    align-items: center;
    padding: 10px 12px;
  }

  &__head {
    font-size: 12px;
    color: var(--van-gray-6, #969799);
    background: var(--van-gray-1, #f7f8fa);
  }

  &__row {
    border-bottom: 1px solid var(--van-border-color, #ebedf0);
  }

  &__col {
    &--issue {
      flex: 0 0 auto;
      width: 120px;
      font-size: 13px;
      color: var(--van-text-color, #323233);
    }

    &--code {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
  }

  &__ball {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 0 4px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 50%;
    color: #fff;
    background: #ee0a24;
  }
}
</style>
