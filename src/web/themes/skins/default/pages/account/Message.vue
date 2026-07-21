<template>
  <div class="msg-page">
    <div class="msg-header">
      <h3 class="msg-title">{{ t('components.nav.message') }}</h3>
      <div class="msg-actions">
        <el-button size="small" :disabled="!items.length || loading" @click="onMarkAll">全部已读</el-button>
        <el-button
            size="small"
            :type="manageMode ? 'primary' : 'default'"
            @click="toggleManage"
        >
          {{ manageMode ? '完成' : '编辑' }}
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeCat" class="msg-tabs" @tab-change="onCat">
      <el-tab-pane name="all">
        <template #label>
          <span class="tab-label">全部<el-badge v-if="totalUnread" :value="totalUnread" :max="99" class="tab-badge" /></span>
        </template>
      </el-tab-pane>
      <el-tab-pane v-for="c in MSG_CATEGORIES" :key="c.value" :name="String(c.value)">
        <template #label>
          <span class="tab-label">{{ c.label }}<el-badge v-if="unreadBy[c.value]" :value="unreadBy[c.value]" :max="99" class="tab-badge" /></span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 编辑模式:批量操作栏 -->
    <div v-if="manageMode" class="msg-toolbar">
      <el-checkbox :model-value="allChecked" :indeterminate="someChecked" @change="onToggleAll">全选</el-checkbox>
      <span v-if="selectedIds.length" class="msg-toolbar-count">已选 {{ selectedIds.length }}</span>
      <span class="msg-toolbar-spacer" />
      <el-button size="small" :disabled="!selectedIds.length" @click="onMarkSelected">标记已读</el-button>
      <el-button size="small" type="danger" plain :disabled="!selectedIds.length" @click="onDeleteSelected">删除</el-button>
    </div>

    <div v-loading="loading" class="msg-list">
      <el-empty v-if="!loading && !items.length" description="暂无站内信" />

      <div
          v-for="m in items"
          :key="m.id"
          class="msg-item"
          :class="{ 'is-unread': !m.is_read, 'is-checked': manageMode && !!selected[m.id] }"
          @click="onRow(m)"
      >
        <el-checkbox
            v-if="manageMode"
            :model-value="!!selected[m.id]"
            class="msg-check"
        />
        <div class="msg-body">
          <div class="msg-line">
            <span class="msg-item-title">{{ m.title }}</span>
            <el-tag size="small" effect="plain" class="msg-cat">{{ m.category_title }}</el-tag>
            <span class="msg-time">{{ m.publish_at }}</span>
            <span class="msg-dot" :class="{ hidden: !!m.is_read }" />
          </div>
          <div class="msg-content">{{ preview(m.content) }}</div>
        </div>
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

    <!-- 详情弹窗(内容为富文本) -->
    <el-dialog
        v-model="detailVisible"
        :title="detail?.title || '站内信'"
        width="600px"
        class="msg-detail-dialog"
    >
      <div v-if="detail" class="msg-detail-meta">
        <el-tag size="small" effect="plain">{{ detail.category_title }}</el-tag>
        <span class="msg-detail-time">{{ detail.publish_at }}</span>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="detail" class="msg-detail-content" v-html="detail.content" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@shared/stores/userStore';
import * as messageService from '@shared/api/messageService';
import { MSG_CATEGORIES } from '@shared/api/messageService';
import type { SystemMsgItem } from '@shared/api/messageService';

const { t } = useI18n();
const userStore = useUserStore();

const items    = ref<SystemMsgItem[]>([]);
const total    = ref(0);
const page     = ref(1);
const pageSize = ref(10);
const loading  = ref(false);
const activeCat = ref<string>('all');           // 'all' | '1'..'4'(通知/优惠/充提/私信)

// 未读徽标:总数 + 各分类
const totalUnread = ref(0);
const unreadBy    = reactive<Record<number, number>>({});

// 编辑(批量)模式
const manageMode = ref(false);
const selected   = reactive<Record<number, boolean>>({});

// 详情弹窗
const detailVisible = ref(false);
const detail        = ref<SystemMsgItem | null>(null);

const selectedIds = computed(() => items.value.filter((m) => selected[m.id]).map((m) => m.id));
const allChecked  = computed(() => items.value.length > 0 && selectedIds.value.length === items.value.length);
const someChecked = computed(() => selectedIds.value.length > 0 && !allChecked.value);

// 列表预览:富文本去标签 + 截断
function preview(html: string): string {
  const text = (html || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  return text.length > 80 ? `${text.slice(0, 80)}…` : text;
}

function clearSelection(): void {
  Object.keys(selected).forEach((k) => delete selected[Number(k)]);
}

async function load(): Promise<void> {
  loading.value = true;
  try {
    const category = activeCat.value === 'all' ? undefined : Number(activeCat.value);
    const res = await messageService.fetchMessages(page.value, pageSize.value, category);
    items.value = res.items ?? [];
    total.value = res.total ?? 0;
    clearSelection();
  } finally {
    loading.value = false;
  }
}

// 拉取未读徽标(总数 + 各分类),并同步顶部导航红点
async function loadUnread(): Promise<void> {
  try {
    const res = await messageService.fetchUnreadCount();
    totalUnread.value = res.unread ?? 0;
    Object.keys(unreadBy).forEach((k) => delete unreadBy[Number(k)]);
    Object.entries(res.by_category ?? {}).forEach(([k, v]) => { unreadBy[Number(k)] = Number(v); });
  } catch { /* 忽略 */ }
}

// 行点击:编辑模式 → 勾选/取消;否则 → 打开详情
function onRow(m: SystemMsgItem): void {
  if (manageMode.value) {
    selected[m.id] = !selected[m.id];
    return;
  }
  openDetail(m);
}

async function openDetail(m: SystemMsgItem): Promise<void> {
  detail.value = m;
  detailVisible.value = true;
  if (!m.is_read) {
    try {
      await messageService.markMsgRead(m.id);
      m.is_read = 1;
      afterReadChange();
    } catch { /* 忽略 */ }
  }
}

function toggleManage(): void {
  manageMode.value = !manageMode.value;
  if (!manageMode.value) clearSelection();
}

function onToggleAll(v: boolean): void {
  items.value.forEach((m) => { selected[m.id] = v; });
}

async function onMarkSelected(): Promise<void> {
  const ids = selectedIds.value;
  if (!ids.length) return;
  try {
    await messageService.markMsgReadBatch(ids);
    items.value.forEach((m) => { if (ids.includes(m.id)) m.is_read = 1; });
    clearSelection();
    afterReadChange();
  } catch { /* 忽略 */ }
}

async function onDeleteSelected(): Promise<void> {
  const ids = selectedIds.value;
  if (!ids.length) return;
  try {
    await messageService.deleteMsgBatch(ids);
    items.value = items.value.filter((m) => !ids.includes(m.id));
    total.value = Math.max(0, total.value - ids.length);
    clearSelection();
    afterReadChange();
    if (!items.value.length && page.value > 1) page.value -= 1;
    if (!items.value.length) load();
  } catch { /* 忽略 */ }
}

async function onMarkAll(): Promise<void> {
  try {
    await messageService.markAllMsgRead();
    items.value.forEach((m) => (m.is_read = 1));
    afterReadChange();
  } catch { /* 忽略 */ }
}

// 已读/删除变动后:刷新未读徽标 + 顶部导航
function afterReadChange(): void {
  loadUnread();
  userStore.fetchUnreadMsgCount?.();
}

function onCat(): void {
  page.value = 1;
  clearSelection();
  load();
}

function onPage(p: number): void {
  page.value = p;
  clearSelection();
  load();
}

onMounted(() => { load(); loadUnread(); });
</script>

<style lang="scss" scoped>
.msg-page {
  padding: 20px 24px;
}

.msg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .msg-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--sd-color-txt-primary, #2c3e50);
  }

  .msg-actions {
    display: flex;
    gap: 8px;
  }
}

.msg-tabs {
  margin-bottom: 4px;

  .tab-label {
    display: inline-flex;
    align-items: center;
  }

  .tab-badge {
    margin-left: 6px;
    :deep(.el-badge__content) {
      border: none;
    }
  }
}

.msg-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  margin-bottom: 6px;
  background: var(--color-gray-4, #f7f7f7);
  border-radius: 6px;

  .msg-toolbar-count {
    font-size: 12px;
    color: var(--sd-color-txt-tertiary, #999);
  }

  .msg-toolbar-spacer {
    flex: 1;
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
  &.is-checked { background: var(--color-primary-light-9, #ecf5ff); }

  .msg-check {
    flex: 0 0 auto;
    align-self: center;
    pointer-events: none; // 由整行点击控制勾选,复选框仅作展示
  }

  .msg-body { flex: 1; min-width: 0; }

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

  // 未读红点:移到右侧
  .msg-dot {
    flex: 0 0 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e4393c;

    &.hidden { visibility: hidden; }
  }

  .msg-content {
    margin-top: 6px;
    font-size: 13px;
    color: var(--sd-color-txt-secondary, #666);
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

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

.msg-detail-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  .msg-detail-time {
    font-size: 12px;
    color: var(--sd-color-txt-tertiary, #999);
  }
}

.msg-detail-content {
  font-size: 14px;
  line-height: 1.7;
  color: var(--sd-color-txt-primary, #333);
  word-break: break-word;

  :deep(img) { max-width: 100%; height: auto; }
  :deep(a) { color: var(--color-primary, #409eff); }
}
</style>
