<template>
  <div class="trend-container">
    <div class="sub-tab"><span class="sub-tab-item active">{{ lt('trend.posTrend') }}</span></div>

    <div class="trend-toolbar">
      <div class="range-tabs">
        <span
            v-for="r in ranges" :key="r.v"
            :class="['range-btn', { active: range === r.v }]"
            @click="range = r.v"
        >{{ lt('trend.range.' + r.v) }}</span>
      </div>
      <el-button type="primary" size="small" @click="refresh">{{ lt('common.refresh') }}</el-button>
    </div>

    <div class="trend-controls">
      <div class="ball-tabs">
        <template v-for="(name, i) in ballNames" :key="i">
          <span :class="['ball-tab', { active: ballIndex === i }]" @click="ballIndex = i">{{ name }}</span>
          <span v-if="i < ballNames.length - 1" class="ball-sep">|</span>
        </template>
      </div>
      <div class="trend-checks">
        <el-checkbox v-model="showLine" :label="lt('trend.line')" />
        <el-checkbox v-model="showOmission" :label="lt('trend.omission')" />
      </div>
    </div>

    <div class="trend-table-wrap" :style="{ width: totalWidth + 'px' }">
      <svg v-if="showLine" class="trend-line" :width="totalWidth" :height="svgHeight">
        <polyline :points="linePoints" fill="none" stroke="#333" stroke-width="2" />
      </svg>

      <table class="trend-table">
        <colgroup>
          <col :style="{ width: timeW + 'px' }" />
          <col :style="{ width: issueW + 'px' }" />
          <col v-for="c in values" :key="'c' + c" :style="{ width: digitW + 'px' }" />
          <template v-for="g in attrGroups" :key="'cg' + g.key">
            <col v-for="col in g.cols" :key="g.key + col" :style="{ width: attrW + 'px' }" />
          </template>
        </colgroup>
        <thead>
        <tr class="th-1">
          <th :rowspan="2" class="th-stat">{{ lt('trend.statType') }}</th>
          <th :rowspan="2" class="th-issue"></th>
          <th :colspan="values.length" class="th-group">{{ ballNames[ballIndex] }} {{ lt('trend.suffix') }}</th>
          <th v-for="g in attrGroups" :key="g.key" :colspan="g.cols.length" class="th-group">{{ lt(g.labelKey) }}</th>
        </tr>
        <tr class="th-2">
          <th v-for="c in values" :key="'h' + c" class="th-digit">{{ c }}</th>
          <template v-for="g in attrGroups" :key="'gc' + g.key">
            <th v-for="col in g.cols" :key="g.key + col" class="th-attr">{{ lt(g.labelKeys[col]) }}</th>
          </template>
        </tr>
        </thead>
        <tbody>
        <tr class="tr-total">
          <td class="td-total-label" :colspan="2">{{ lt('trend.total') }}</td>
          <td v-for="c in values" :key="'t' + c" class="td-total">{{ valueTotals[c] || 0 }}</td>
          <template v-for="g in attrGroups" :key="'gt' + g.key">
            <td v-for="col in g.cols" :key="g.key + col" class="td-total">{{ g.totals[col] }}</td>
          </template>
        </tr>
        <tr v-for="(row, ri) in rows" :key="row.issue_no" :style="{ height: rowH + 'px' }">
          <td class="td-time">{{ row.timeText }}</td>
          <td class="td-issue">{{ row.issue_no }}</td>
          <td
              v-for="(c, ci) in values" :key="'d' + c"
              class="td-cell"
              :class="{ 'is-drawn': posMatrix[ri][ci].drawn }"
          >
            <span v-if="posMatrix[ri][ci].drawn" class="ball-dot" :style="{ width: dotSize + 'px', height: dotSize + 'px' }">{{ c }}</span>
            <span v-else-if="showOmission" class="omit">{{ posMatrix[ri][ci].omission }}</span>
          </td>
          <template v-for="g in attrGroups" :key="'ga' + g.key + ri">
            <td
                v-for="col in g.cols" :key="g.key + col"
                class="td-cell td-attr"
                :class="[g.matrix[ri][col].drawn ? 'attr-' + col : '']"
            >
              <span v-if="g.matrix[ri][col].drawn" class="attr-label">{{ lt(g.labelKeys[col]) }}</span>
              <span v-else-if="showOmission" class="omit">{{ g.matrix[ri][col].omission }}</span>
            </td>
          </template>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!rows.length" class="trend-empty">{{ lt('common.empty') }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { ElButton, ElCheckbox } from 'element-plus';
import { useI18n } from 'vue-i18n';

const props = withDefaults(defineProps<{
  store: any;
  ballNames: string[];          // 位置/球 名称
  values: number[];             // 号码列(如 0-9 / 1-10 / 1-6 / 1-49)
  bigMin: number;               // 大小阈值:>= bigMin 为「大」
}>(), {});

const { t } = useI18n();
const lt = (k: string) => t(`pages.lottery.${k}`);
const { issueHistory } = storeToRefs(props.store);
const { fetchIssueHistory } = props.store;

const ballNames = computed(() => props.ballNames);
const values = computed(() => props.values);

const ranges = [
  { v: 'i30', label: '近30期' },
  { v: 'today', label: '今日数据' },
  { v: 'd2', label: '近2天' },
  { v: 'd5', label: '近5天' },
];
const range = ref('d5');
const ballIndex = ref(0);
const showLine = ref(true);
const showOmission = ref(true);

// 尺寸(方格偏小);列多时(如 lhc 49 列)再收窄
const timeW = 130;
const issueW = 95;
const digitW = computed(() => (values.value.length > 15 ? 26 : 34));
const attrW = 32;
const dotSize = computed(() => (values.value.length > 15 ? 16 : 20));
const rowH = 28;
const headerH = 56; // 2 × 28
const totalsH = 28;

const attrGroups0 = [
  { key: 'hb', labelKey: 'trend.swing', cols: ['down', 'same', 'up'], labelKeys: { down: 'trend.swingBack', same: 'trend.swingSame', up: 'trend.swingFwd' } as Record<string, string> },
  { key: 'oe', labelKey: 'common.oddEven', cols: ['odd', 'even'], labelKeys: { odd: 'common.odd', even: 'common.even' } as Record<string, string> },
  { key: 'bs', labelKey: 'common.bigSmall', cols: ['big', 'small'], labelKeys: { big: 'common.big', small: 'common.small' } as Record<string, string> },
];
const attrColCount = attrGroups0.reduce((s, g) => s + g.cols.length, 0);
const totalWidth = computed(() => timeW + issueW + digitW.value * values.value.length + attrColCount * attrW);

const fmtTime = (ts: number): string => {
  if (!ts) return '-';
  const d = new Date(ts * 1000);
  const p = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};
const isSameDay = (ts: number) => {
  const d = new Date(ts * 1000); const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
};

const parseRows = () =>
  (issueHistory.value || [])
    .map((it: any) => {
      const ts = Number(it.time || it.lottery_time || it.bet_time || it.sale_end_time || 0);
      const digits = String(it.open_code || it.code || '')
        .split(',').map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => !Number.isNaN(n));
      return { issue_no: String(it.issue_no ?? ''), ts, digits, timeText: fmtTime(ts) };
    })
    .filter((r: any) => r.digits.length >= ballNames.value.length);

const rows = computed(() => {
  const all = parseRows();
  const nowTs = Math.floor(Date.now() / 1000);
  if (range.value === 'i30') return all.slice(0, 30);
  if (range.value === 'today') return all.filter((r: any) => isSameDay(r.ts));
  if (range.value === 'd2') return all.filter((r: any) => r.ts >= nowTs - 2 * 86400);
  return all.filter((r: any) => r.ts >= nowTs - 5 * 86400);
});

// oldest→newest 累计遗漏
const buildMatrix = (cols: (number | string)[], valueOf: (row: any, i: number) => number | string) => {
  const rws = rows.value;
  const out: any[] = rws.map(() => ({}));
  const miss: Record<string, number> = {};
  cols.forEach((c) => (miss[String(c)] = 0));
  for (let i = rws.length - 1; i >= 0; i--) {
    const v = String(valueOf(rws[i], i));
    for (const c of cols) {
      const key = String(c);
      if (key === v) { out[i][key] = { drawn: true, omission: 0 }; miss[key] = 0; }
      else { miss[key] += 1; out[i][key] = { drawn: false, omission: miss[key] }; }
    }
  }
  return out;
};

// 号码走势(按 values 索引存,便于折线定位)
const posMatrix = computed(() => {
  const m = buildMatrix(values.value, (row) => row.digits[ballIndex.value]);
  return m.map((rowMap: any) => values.value.map((c) => rowMap[String(c)]));
});

const dirOf = (row: any, i: number): string => {
  const prev = rows.value[i + 1];
  if (!prev) return 'same';
  const a = row.digits[ballIndex.value]; const b = prev.digits[ballIndex.value];
  return a > b ? 'up' : a < b ? 'down' : 'same';
};
const oeOf = (row: any) => (row.digits[ballIndex.value] % 2 === 1 ? 'odd' : 'even');
const bsOf = (row: any) => (row.digits[ballIndex.value] >= props.bigMin ? 'big' : 'small');

const attrGroups = computed(() =>
  attrGroups0.map((g) => {
    const valueOf =
      g.key === 'hb' ? (r: any, i: number) => dirOf(r, i) : g.key === 'oe' ? (r: any) => oeOf(r) : (r: any) => bsOf(r);
    const matrix = buildMatrix(g.cols, valueOf);
    const totals: Record<string, number> = {};
    g.cols.forEach((c) => (totals[c] = 0));
    rows.value.forEach((r: any, i: number) => { totals[String(valueOf(r, i))] += 1; });
    return { ...g, matrix, totals };
  }),
);

const valueTotals = computed(() => {
  const t: Record<number, number> = {};
  values.value.forEach((c) => (t[c] = 0));
  rows.value.forEach((r: any) => { const d = r.digits[ballIndex.value]; if (t[d] != null) t[d] += 1; });
  return t;
});

const svgHeight = computed(() => headerH + totalsH + rows.value.length * rowH);
const linePoints = computed(() => {
  const baseY = headerH + totalsH;
  const baseX = timeW + issueW;
  return rows.value
    .map((r: any, i: number) => {
      const d = r.digits[ballIndex.value];
      const ci = values.value.indexOf(d);
      if (ci < 0) return '';
      const x = baseX + ci * digitW.value + digitW.value / 2;
      const y = baseY + i * rowH + rowH / 2;
      return `${x},${y}`;
    })
    .filter(Boolean)
    .join(' ');
});

const refresh = () => fetchIssueHistory?.();
onMounted(() => { if (!issueHistory.value?.length) fetchIssueHistory?.(); });
</script>

<style lang="scss" scoped>
.trend-container { padding: 10px 14px; font-size: 13px; color: #1a1a1a; }

.sub-tab { border-bottom: 1px solid #eee; margin-bottom: 12px; }
.sub-tab-item { display: inline-block; padding: 8px 4px; color: var(--el-color-primary); font-weight: 600; border-bottom: 2px solid var(--el-color-primary); }

.trend-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.range-tabs { display: flex; gap: 10px; }
.range-btn { padding: 5px 14px; border-radius: 16px; cursor: pointer; color: #333; }
.range-btn.active { background: var(--el-color-primary); color: #fff; }

.trend-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.ball-tabs { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.ball-tab { cursor: pointer; color: #333; }
.ball-tab.active { color: var(--el-color-primary); font-weight: 600; }
.ball-sep { color: #ddd; }
.trend-checks { display: flex; gap: 16px; }

.trend-table-wrap { position: relative; overflow-x: auto; max-width: 100%; }
.trend-line { position: absolute; top: 0; left: 0; pointer-events: none; z-index: 2; }

.trend-table { border-collapse: collapse; table-layout: fixed; font-size: 12px; }
/* 所有格子内容上下左右居中 */
.trend-table th, .trend-table td {
  border: 1px solid #e6ebf2; text-align: center; vertical-align: middle;
  box-sizing: border-box; height: 28px; padding: 0;
}
.trend-table thead th { background: #f5f7fa; color: #333; font-weight: 500; }
.th-digit, .th-attr { color: #666; }

.tr-total .td-total-label { text-align: center; color: #333; background: #fafafa; }
.td-total { color: var(--el-color-primary); font-weight: 600; }

.td-time, .td-issue { color: #333; }
.td-cell { color: #9db3d6; position: relative; }
.td-cell .omit { color: #c8d3e6; font-size: 11px; }

.ball-dot {
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%; background: var(--el-color-primary); color: #fff; font-weight: 600; position: relative; z-index: 3; font-size: 11px; line-height: 1;
}

.attr-label { font-weight: 600; }
.td-attr.attr-down, .td-attr.attr-same, .td-attr.attr-up { background: #f0a020; color: #fff; }
.td-attr.attr-odd, .td-attr.attr-even { background: #67c23a; color: #fff; }
.td-attr.attr-big, .td-attr.attr-small { background: #6aa5e0; color: #fff; }

.trend-empty { text-align: center; color: #999; padding: 40px 0; }
</style>
