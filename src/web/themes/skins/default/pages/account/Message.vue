<template>
  <div class="msg-page">
    <div class="msg-header">
      <h3 class="msg-title">{{ t('components.nav.message') }}</h3>
      <el-button
          size="small"
          :disabled="!hasUnread || loading"
          @click="onMarkAll"
      >
        全部已读
      </el-button>
    </div>

    <div v-loading="loading" class="msg-list">
      <el-empty v-if="!loading && !items.length" description="暂无站内信" />

      <div
          v-for="m in items"
          :key="m.id"
          class="msg-item"
          :class="{ 'is-unread': !m.is_read }"
      >
        <span class="msg-dot" :class="{ hidden: !!m.is_read }" />
        <div class="msg-body" @click="onOpen(m)">
          <div class="msg-line">
            <span class="msg-item-title">{{ m.title }}</span>
            <el-tag size="small" effect="plain" class="msg-cat">{{ m.category_title }}</el-tag>
            <span class="msg-time">{{ m.publish_at }}</span>
          </div>
          <div class="msg-content">{{ m.content }}</div>
        </div>
        <el-popconfirm
            :title="'确定删除这条站内信?'"
            confirm-button-text="删除"
            cancel-button-text="取消"
            @confirm="onDelete(m)"
        >
          <template #reference>
            <span class="msg-del" title="删除" @click.stop>×</span>
          </template>
        </el-popconfirm>
      </div>
    </div>

    <div v-if="total > pageSize" class="msg-pager">
      <el-pagination
          layout="prev, pager, next, total"
          :total="total"
          :page-size="pageSize"
          :current-page="page"
          @current-change="onPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@shared/stores/userStore';
import * as messageService from '@shared/api/messageService';
import type { SystemMsgItem } from '@shared/api/messageService';

const { t } = useI18n();
const userStore = useUserStore();

const items    = ref<SystemMsgItem[]>([]);
const total    = ref(0);
const page     = ref(1);
const pageSize = ref(10);
const loading  = ref(false);

const hasUnread = computed(() => items.value.some((m) => !m.is_read));

async function load(): Promise<void> {
  loading.value = true;
  try {
    const res = await messageService.fetchMessages(page.value, pageSize.value);
    items.value = res.items ?? [];
    total.value = res.total ?? 0;
  } finally {
    loading.value = false;
  }
}

// 点开未读 → 标记已读,并同步顶部未读徽标
async function onOpen(m: SystemMsgItem): Promise<void> {
  if (m.is_read) return;
  try {
    await messageService.markMsgRead(m.id);
    m.is_read = 1;
    userStore.fetchUnreadMsgCount();
  } catch { /* 忽略 */ }
}

// 删除(按用户软删):从列表移除 + 同步顶部未读 + 本页删空回上页
async function onDelete(m: SystemMsgItem): Promise<void> {
  try {
    await messageService.deleteMsg(m.id);
    items.value = items.value.filter((x) => x.id !== m.id);
    total.value = Math.max(0, total.value - 1);
    userStore.fetchUnreadMsgCount();
    if (!items.value.length && page.value > 1) { page.value -= 1; }
    if (!items.value.length) load();
  } catch { /* 忽略 */ }
}

async function onMarkAll(): Promise<void> {
  try {
    await messageService.markAllMsgRead();
    items.value.forEach((m) => (m.is_read = 1));
    userStore.fetchUnreadMsgCount();
  } catch { /* 忽略 */ }
}

function onPage(p: number): void {
  page.value = p;
  load();
}

onMounted(load);
</script>

<style lang="scss" scoped>
.msg-page {
  padding: 20px 24px;
}

.msg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .msg-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--sd-color-txt-primary, #2c3e50);
  }
}

.msg-list {
  min-height: 200px;
}

.msg-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 12px;
  border-bottom: 1px solid var(--color-border, #eee);
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: var(--color-gray-4, #f7f7f7); }

  .msg-dot {
    flex: 0 0 8px;
    width: 8px;
    height: 8px;
    margin-top: 6px;
    border-radius: 50%;
    background: #e4393c;

    &.hidden { visibility: hidden; }
  }

  .msg-body { flex: 1; min-width: 0; cursor: pointer; }

  .msg-del {
    flex: 0 0 auto;
    align-self: center;
    margin-left: 12px;
    width: 22px;
    height: 22px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    color: #bbb;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.15s;

    &:hover { color: #fff; background: #e4393c; }
  }

  .msg-line {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .msg-item-title {
    font-size: 14px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .msg-cat { flex: 0 0 auto; }

  .msg-time {
    margin-left: auto;
    flex: 0 0 auto;
    font-size: 12px;
    color: var(--sd-color-txt-tertiary, #999);
  }

  .msg-content {
    margin-top: 6px;
    font-size: 13px;
    color: var(--sd-color-txt-secondary, #666);
    line-height: 1.5;
  }

  /* 未读:标题加粗加深 */
  &.is-unread .msg-item-title {
    font-weight: 700;
    color: #1a1a1a;
  }
}

.msg-pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
