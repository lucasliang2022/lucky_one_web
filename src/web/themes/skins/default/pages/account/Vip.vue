<template>
  <div class="vip-page" v-loading="loading">
    <div class="vip-header">
      <h3 class="vip-title">{{ t('pages.account.menu.vip') }}</h3>
    </div>

    <!-- 当前等级卡 -->
    <div class="vip-current">
      <div class="vip-badge">
        <span class="icon-sd icon-sd-vip8" />
        <span class="vip-badge-text">VIP{{ curLevel }}</span>
      </div>
      <div class="vip-current-info">
        <div class="vip-current-lv">当前等级:VIP{{ curLevel }}</div>
        <div class="vip-current-sub" v-if="info?.next_level != null">
          升级 VIP{{ info.next_level }} 需累计有效流水 <b>{{ money(info.next_upgrade_turnover) }}</b>
        </div>
        <div class="vip-current-sub" v-else>已是最高等级 🎉</div>
      </div>
    </div>

    <!-- 等级进度条(含 VIP0 基础级) -->
    <div v-if="levels.length" class="vip-track">
      <div
          v-for="lv in trackLevels"
          :key="lv"
          class="vip-node"
          :class="{ active: lv === curLevel, passed: lv < curLevel }"
      >
        <span class="vip-node-dot" />
        <span class="vip-node-label">VIP{{ lv }}</span>
      </div>
    </div>

    <!-- 当前等级尊享 -->
    <div v-if="curConfig" class="vip-perk-card">
      <div class="vip-detail-title">VIP{{ curLevel }} 尊享</div>
      <div class="vip-perks">
        <div v-for="p in curPerks" :key="p.label" class="perk">
          <div class="perk-val">{{ p.val }}</div>
          <div class="perk-label">{{ p.label }}</div>
        </div>
      </div>
    </div>

    <!-- VIP 返水比例 -->
    <div v-if="levels.length" class="vip-detail-card">
      <div class="vip-detail-title">VIP 返水比例(%)</div>
      <div class="vip-table-scroll">
        <table class="vip-table rebate">
          <thead>
          <tr>
            <th class="sticky-col">类别</th>
            <th v-for="l in levels" :key="l.level" :class="{ cur: l.level === curLevel }">VIP{{ l.level }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="cat in REBATE_CATS" :key="cat.key">
            <td class="sticky-col">{{ cat.label }}</td>
            <td v-for="l in levels" :key="l.level" :class="{ cur: l.level === curLevel }">
              {{ fmtRate(l.rebate_rates?.[cat.key]) }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 等级门槛 / 礼金明细 -->
    <div class="vip-detail-card">
      <div class="vip-detail-title">等级明细</div>
      <div class="vip-table-scroll">
        <table class="vip-table">
          <thead>
          <tr>
            <th>等级</th><th>有效流水</th><th>保级流水</th>
            <th>升级礼金</th><th>生日礼金</th><th>每周红包</th><th>每日提款</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="l in levels" :key="l.level" :class="{ 'is-current': l.level === curLevel }">
            <td>
              <span class="vip-cell-lv">VIP{{ l.level }}</span>
              <span v-if="l.level === curLevel" class="vip-cell-tag">当前</span>
            </td>
            <td>{{ money(l.upgrade_turnover) }}</td>
            <td>{{ l.keep_turnover ? money(l.keep_turnover) + ' / ' + l.keep_cycle_days + '天' : '—' }}</td>
            <td>{{ dash(l.reward_amount) }}</td>
            <td>{{ dash(l.birthday_bonus) }}</td>
            <td>{{ dash(l.weekly_bonus) }}</td>
            <td>{{ l.daily_withdraw_count ? l.daily_withdraw_count + '次 / ' + money(l.daily_withdraw_limit) : '—' }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <el-empty v-if="!loading && !levels.length" description="暂无 VIP 等级配置" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchVipInfo } from '@shared/api/vipService';
import type { VipInfo, VipLevelItem } from '@shared/api/vipService';

const { t } = useI18n();

const info    = ref<VipInfo | null>(null);
const loading = ref(false);

const levels     = computed<VipLevelItem[]>(() => info.value?.levels ?? []);
const curLevel   = computed<number>(() => info.value?.current_level ?? 0);
const trackLevels = computed<number[]>(() => [0, ...levels.value.map((l) => l.level)]);
const curConfig  = computed<VipLevelItem | undefined>(() => levels.value.find((l) => l.level === curLevel.value));

const REBATE_CATS = [
  { key: 'lottery', label: '彩票' }, { key: 'sport', label: '体育' }, { key: 'esport', label: '电竞' },
  { key: 'basketball', label: '篮球' }, { key: 'live', label: '真人' },
  { key: 'card', label: '棋牌' }, { key: 'slot', label: '电子' }, { key: 'ent', label: '娱乐' },
] as const;

const curPerks = computed(() => {
  const c = curConfig.value;
  if (!c) return [];
  return [
    { label: '每日提款次数', val: c.daily_withdraw_count || 0 },
    { label: '每日提款额度', val: money(c.daily_withdraw_limit) },
    { label: '升级礼金', val: dash(c.reward_amount) },
    { label: '生日礼金', val: dash(c.birthday_bonus) },
    { label: '每周红包', val: dash(c.weekly_bonus) },
  ];
});

const money = (v: number | null | undefined): string => '¥' + Number(v ?? 0).toLocaleString('en-US');
const dash  = (v: number | null | undefined): string => (v ? money(v) : '—');
const fmtRate = (v: number | undefined): string => (v ? v.toFixed(2) + '%' : '—');

async function load(): Promise<void> {
  loading.value = true;
  try {
    info.value = await fetchVipInfo();
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<style lang="scss" scoped>
.vip-page { padding: 20px 24px; }

.vip-header {
  margin-bottom: 16px;
  .vip-title { margin: 0; font-size: 18px; font-weight: 600; color: var(--sd-color-txt-primary, #2c3e50); }
}

.vip-current {
  display: flex; align-items: center; gap: 16px;
  padding: 20px; border-radius: 10px; margin-bottom: 18px;
  background: linear-gradient(135deg, #f7f2e8 0%, #f0e6d2 100%);

  .vip-badge {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    width: 72px; height: 72px; border-radius: 12px; background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    .icon-sd { font-size: 30px; color: #c9a76a; }
    .vip-badge-text { font-size: 13px; font-weight: 700; color: #a9834b; }
  }
  .vip-current-lv { font-size: 18px; font-weight: 700; color: #6b4f2a; }
  .vip-current-sub { margin-top: 6px; font-size: 13px; color: #97835f; b { color: #c0392b; } }
}

.vip-track {
  display: flex; align-items: flex-start; gap: 4px;
  overflow-x: auto; padding: 8px 4px 14px; margin-bottom: 12px;

  .vip-node {
    flex: 1 0 auto; min-width: 52px; position: relative;
    display: flex; flex-direction: column; align-items: center; color: #bbb;
    .vip-node-dot { width: 12px; height: 12px; border-radius: 50%; background: #ddd; margin-bottom: 6px; z-index: 1; }
    .vip-node-label { font-size: 12px; }
    &::before { content: ''; position: absolute; top: 5px; left: -50%; width: 100%; height: 2px; background: #eee; }
    &:first-child::before { display: none; }
    &.passed { color: #c9a76a; .vip-node-dot { background: #c9a76a; } &::before { background: #e5cfa3; } }
    &.active {
      color: #c0392b; font-weight: 700;
      .vip-node-dot { background: #c0392b; box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.15); }
      &::before { background: #e5cfa3; }
    }
  }
}

.vip-perk-card, .vip-detail-card {
  border: 1px solid var(--color-border, #eee); border-radius: 10px;
  overflow: hidden; margin-bottom: 16px;
  .vip-detail-title { padding: 12px 16px; font-size: 14px; font-weight: 600; background: #faf7f0; color: #6b4f2a; }
}

.vip-perks {
  display: flex; flex-wrap: wrap; padding: 8px 0;
  .perk {
    flex: 1 1 20%; min-width: 120px; text-align: center; padding: 16px 8px;
    .perk-val { font-size: 20px; font-weight: 700; color: #c0392b; }
    .perk-label { margin-top: 6px; font-size: 12px; color: #909399; }
  }
}

.vip-table-scroll { overflow-x: auto; }

.vip-table {
  width: 100%; border-collapse: collapse; font-size: 13px; white-space: nowrap;
  th, td { padding: 10px 14px; text-align: left; border-top: 1px solid var(--color-border, #f0f0f0); }
  thead th { background: #fafafa; color: #909399; font-weight: 500; border-top: none; }
  tbody tr.is-current { background: #fff8f0; }

  &.rebate {
    th, td { text-align: center; }
    th:first-child, td:first-child { text-align: left; }
    th.cur, td.cur { background: #fff2ec; color: #c0392b; font-weight: 600; }
  }
  .sticky-col { position: sticky; left: 0; background: #fff; z-index: 1; }
  thead .sticky-col { background: #fafafa; }

  .vip-cell-lv { font-weight: 600; color: #333; }
  .vip-cell-tag { margin-left: 6px; padding: 1px 6px; font-size: 11px; border-radius: 8px; color: #c0392b; background: #fdecea; }
}
</style>
