<template>
  <div class="roadmap">
    <!-- 球位 tab -->
    <div class="rm-balls">
      <template v-for="(name, i) in tabs" :key="i">
        <span :class="['rm-ball', { active: ballTab === i }]" @click="selectBall(i)">{{ name }}</span>
        <span v-if="i < tabs.length - 1" class="rm-sep">|</span>
      </template>
    </div>

    <!-- 属性 + 统计 + 刷新 -->
    <div class="rm-toolbar">
      <div class="rm-attrs">
        <template v-for="(a, i) in curAttrs" :key="a.key">
          <span :class="['rm-attr', { active: attr === a.key }]" @click="attr = a.key">{{ a.label }}</span>
          <span v-if="i < curAttrs.length - 1" class="rm-sep">|</span>
        </template>
      </div>
      <div class="rm-right">
        <span class="rm-stat">{{ lt('roadmap.todayTotal') }}</span>
        <span v-for="s in stats" :key="s.k" class="rm-stat-item" :class="s.k">{{ s.label }} <b>{{ s.count }}</b></span>
        <el-button type="primary" size="small" @click="refresh">{{ lt('common.refresh') }}</el-button>
      </div>
    </div>

    <!-- 大路 -->
    <div class="rm-block">
      <div class="rm-title">{{ lt('roadmap.road.big') }}</div>
      <div class="rm-grid">
        <div class="rm-col" v-for="(col, ci) in cols2d(bigRoad)" :key="ci">
          <div class="rm-cell" v-for="(cell, ri) in col" :key="ri">
            <template v-if="cell">
              <span class="dot hollow" :class="cell.color"></span>
              <span v-if="cell.tie" class="tie"></span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 三条下路 -->
    <div class="rm-derived">
      <div class="rm-block third">
        <div class="rm-title">{{ lt('roadmap.road.eye') }}</div>
        <div class="rm-grid">
          <div class="rm-col" v-for="(col, ci) in cols2d(bigEye)" :key="ci">
            <div class="rm-cell" v-for="(cell, ri) in col" :key="ri">
              <span v-if="cell" class="dot hollow sm" :class="cell.color"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="rm-block third">
        <div class="rm-title">{{ lt('roadmap.road.small') }}</div>
        <div class="rm-grid">
          <div class="rm-col" v-for="(col, ci) in cols2d(smallRoad)" :key="ci">
            <div class="rm-cell" v-for="(cell, ri) in col" :key="ri">
              <span v-if="cell" class="dot solid sm" :class="cell.color"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="rm-block third">
        <div class="rm-title">{{ lt('roadmap.road.cockroach') }}</div>
        <div class="rm-grid">
          <div class="rm-col" v-for="(col, ci) in cols2d(cockroach)" :key="ci">
            <div class="rm-cell" v-for="(cell, ri) in col" :key="ri">
              <span v-if="cell" class="slash" :class="cell.color"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 珠盘路 -->
    <div class="rm-block">
      <div class="rm-title">{{ lt('roadmap.road.bead') }}</div>
      <div class="rm-grid">
        <div class="rm-col" v-for="(col, ci) in cols2d(bead)" :key="ci">
          <div class="rm-cell" v-for="(cell, ri) in col" :key="ri">
            <span v-if="cell" class="dot solid big" :class="cell.color"></span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!outcomes.length" class="rm-empty">{{ lt('common.empty') }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { ElButton } from 'element-plus';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const lt = (k: string) => t(`pages.lottery.${k}`);

const props = defineProps<{
  store: any;
  ballNames: string[];
  bigMin: number;        // 单球大小阈值
  sumBigMin?: number;    // 提供则出现「总和」tab(总和大小阈值)
}>();

const { issueHistory } = storeToRefs(props.store);
const { fetchIssueHistory } = props.store;

const SUM = -1;
const tabs = computed(() => [...props.ballNames, ...(props.sumBigMin != null ? [lt('common.sum')] : [])]);
const ballTab = ref(0);           // index into tabs
const attr = ref<'lhh' | 'bs' | 'oe'>('lhh');

const isSum = computed(() => props.sumBigMin != null && ballTab.value === props.ballNames.length);
const attrsBall = computed(() => [
  { key: 'lhh', label: lt('roadmap.attr.lhh') },
  { key: 'bs', label: lt('common.bigSmall') },
  { key: 'oe', label: lt('common.oddEven') },
]);
const attrsSum = computed(() => [
  { key: 'bs', label: lt('common.bigSmall') },
  { key: 'oe', label: lt('common.oddEven') },
]);
const curAttrs = computed(() => (isSum.value ? attrsSum.value : attrsBall.value));
const selectBall = (i: number) => {
  ballTab.value = i;
  if (isSum.value && attr.value === 'lhh') attr.value = 'bs';
};

const MAX_ROW = 6;
const cellSize = 20;

// 历史 → 时间顺序(oldest first)数字序列
const chrono = computed(() =>
  (issueHistory.value || [])
    .map((it: any) => String(it.open_code || it.code || '').split(',').map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => !Number.isNaN(n)))
    .filter((d: number[]) => d.length >= props.ballNames.length)
    .reverse(),
);

// 每期结果 R/B/G(和,只在龙虎和)
const outcomes = computed<string[]>(() => {
  const seq: string[] = [];
  let prev: number | null = null;
  for (const digits of chrono.value) {
    const val = isSum.value ? digits.reduce((a, b) => a + b, 0) : digits[ballTab.value];
    if (attr.value === 'lhh') {
      if (prev === null) { prev = val; continue; }
      seq.push(val > prev ? 'R' : val < prev ? 'B' : 'G');
      prev = val;
    } else if (attr.value === 'bs') {
      const th = isSum.value ? (props.sumBigMin as number) : props.bigMin;
      seq.push(val >= th ? 'R' : 'B');
    } else {
      seq.push(val % 2 === 1 ? 'R' : 'B');
    }
  }
  return seq;
});

const stats = computed(() => {
  const c = { R: 0, B: 0, G: 0 } as Record<string, number>;
  outcomes.value.forEach((o) => (c[o] = (c[o] || 0) + 1));
  if (attr.value === 'lhh') return [{ k: 'R', label: lt('common.dragon'), count: c.R }, { k: 'B', label: lt('common.tiger'), count: c.B }, { k: 'G', label: lt('common.tie'), count: c.G }];
  if (attr.value === 'bs') return [{ k: 'R', label: lt('common.big'), count: c.R }, { k: 'B', label: lt('common.small'), count: c.B }];
  return [{ k: 'R', label: lt('common.odd'), count: c.R }, { k: 'B', label: lt('common.even'), count: c.B }];
});

const colorOf = (o: string) => (o === 'R' ? 'red' : o === 'B' ? 'blue' : 'green');

// 连续同结果的「列」;和(绿)作为独立结果参与成列(与参考图一致),下三路再把绿列剔除。
const streaks = computed(() => {
  const cols: { result: string; cells: { tie: number }[] }[] = [];
  for (const o of outcomes.value) {
    const last = cols[cols.length - 1];
    if (last && last.result === o) last.cells.push({ tie: 0 });
    else cols.push({ result: o, cells: [{ tie: 0 }] });
  }
  return cols;
});

// 大路布局(下行,满 6 转右尾)
const bigRoad = computed(() => {
  const cells: any[] = [];
  let baseCol = 0;
  for (const st of streaks.value) {
    let maxColUsed = baseCol;
    st.cells.forEach((cell, j) => {
      let col: number; let row: number;
      if (j < MAX_ROW) { col = baseCol; row = j; }
      else { col = baseCol + (j - (MAX_ROW - 1)); row = MAX_ROW - 1; }
      maxColUsed = Math.max(maxColUsed, col);
      cells.push({ k: `${col}_${row}_${cells.length}`, col, row, color: colorOf(st.result), tie: cell.tie });
    });
    baseCol = maxColUsed + 1;
  }
  return { cells, cols: Math.max(1, baseCol) };
});

// 下三路推导:offset n=1(大眼)/2(小)/3(甲由)。产出 R/B 序列。
const deriveSeq = (n: number): string[] => {
  const cols = streaks.value.filter((c) => c.result !== 'G'); // 下路只看红蓝列
  const len = (c: number) => (cols[c] ? cols[c].cells.length : 0);
  const seq: string[] = [];
  for (let c = 0; c < cols.length; c++) {
    for (let r = 0; r < cols[c].cells.length; r++) {
      if (r === 0) {
        if (c - 1 - n < 0) continue;
        seq.push(len(c - 1) === len(c - 1 - n) ? 'R' : 'B');
      } else {
        if (c - n < 0) continue;
        seq.push(len(c - n) >= r + 1 ? 'R' : 'B');
      }
    }
  }
  return seq;
};

// 把 R/B 序列铺成「大路式」小网格
const layoutBinary = (seq: string[]) => {
  const st: { result: string; cnt: number }[] = [];
  for (const o of seq) {
    const last = st[st.length - 1];
    if (last && last.result === o) last.cnt += 1;
    else st.push({ result: o, cnt: 1 });
  }
  const cells: any[] = [];
  let baseCol = 0;
  for (const s of st) {
    let maxCol = baseCol;
    for (let j = 0; j < s.cnt; j++) {
      let col: number; let row: number;
      if (j < MAX_ROW) { col = baseCol; row = j; }
      else { col = baseCol + (j - (MAX_ROW - 1)); row = MAX_ROW - 1; }
      maxCol = Math.max(maxCol, col);
      cells.push({ k: `${col}_${row}_${cells.length}`, col, row, color: s.result === 'R' ? 'red' : 'blue' });
    }
    baseCol = maxCol + 1;
  }
  return { cells, cols: Math.max(1, baseCol) };
};

const bigEye = computed(() => layoutBinary(deriveSeq(1)));
const smallRoad = computed(() => layoutBinary(deriveSeq(2)));
const cockroach = computed(() => layoutBinary(deriveSeq(3)));

// 珠盘路:列优先填,每列 6 行
const bead = computed(() => {
  const cells: any[] = [];
  outcomes.value.forEach((o, i) => {
    const col = Math.floor(i / MAX_ROW); const row = i % MAX_ROW;
    cells.push({ k: `${col}_${row}`, col, row, color: colorOf(o) });
  });
  return { cells, cols: Math.max(1, Math.ceil(outcomes.value.length / MAX_ROW)) };
});

// 转成「列 → 6 行」二维网格,便于渲染成实心方格(空位也占格),保证正方形。
const cols2d = (road: { cells: any[]; cols: number }) => {
  const grid: any[][] = Array.from({ length: Math.max(road.cols, 1) }, () => Array(MAX_ROW).fill(null));
  for (const c of road.cells) {
    if (c.col >= 0 && c.col < grid.length && c.row >= 0 && c.row < MAX_ROW) grid[c.col][c.row] = c;
  }
  return grid;
};

const refresh = () => fetchIssueHistory?.();
onMounted(() => { if (!issueHistory.value?.length) fetchIssueHistory?.(); });
</script>

<style lang="scss" scoped>
.roadmap { padding: 10px 14px; font-size: 13px; }

.rm-balls { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #eee; margin-bottom: 10px; }
.rm-ball { cursor: pointer; color: #333; }
.rm-ball.active { color: var(--el-color-primary); font-weight: 600; }
.rm-sep { color: #ddd; }

.rm-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.rm-attrs { display: flex; align-items: center; gap: 8px; }
.rm-attr { cursor: pointer; color: #333; }
.rm-attr.active { color: var(--el-color-primary); font-weight: 600; }
.rm-right { display: flex; align-items: center; gap: 12px; }
.rm-stat { color: #999; }
.rm-stat-item { color: #333; b { font-weight: 700; } }
.rm-stat-item.R b { color: #d9001b; }
.rm-stat-item.B b { color: #1e6fd9; }
.rm-stat-item.G b { color: #2ba471; }

/* 每个区域宽度 = 恰好容纳所有列(fit-content),边框正好包住全部方格;超出面板才滚动(隐藏滚动条)。 */
.rm-block {
  border: 1px solid #e6ebf2; margin-bottom: 10px; background: #fff;
  width: fit-content; max-width: 100%;
  overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none;
}
.rm-block::-webkit-scrollbar { display: none; height: 0; }
.rm-title { text-align: center; background: #f5f7fa; color: #333; padding: 4px 0; font-weight: 500; border-bottom: 1px solid #e6ebf2; }
.rm-grid { display: flex; width: max-content; }
.rm-col { display: flex; flex-direction: column; flex: 0 0 auto; }
/* 三条下路各按自身列数取宽,整行放不下时整行滚动(隐藏滚动条)。 */
.rm-derived { display: flex; gap: 10px; max-width: 100%; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
.rm-derived::-webkit-scrollbar { display: none; height: 0; }
.rm-block.third { flex: 0 0 auto; }

/* 20×20 正方形格子(边框描出网格) */
.rm-cell {
  width: 20px; height: 20px; box-sizing: border-box;
  border-right: 1px solid #eef1f5; border-bottom: 1px solid #eef1f5;
  display: flex; align-items: center; justify-content: center; position: relative;
}
.dot { border-radius: 50%; box-sizing: border-box; }
.dot.solid { background: currentColor; }
.dot.hollow { border: 2px solid currentColor; background: transparent; }
.dot.big { width: 14px; height: 14px; }
.dot:not(.big):not(.sm) { width: 14px; height: 14px; }
.dot.sm { width: 11px; height: 11px; border-width: 1.5px; }
.red { color: #d9001b; }
.blue { color: #1e6fd9; }
.green { color: #2ba471; }
.slash { width: 14px; height: 2px; background: currentColor; transform: rotate(-45deg); }
.tie { position: absolute; width: 12px; height: 1.5px; background: #2ba471; transform: rotate(-45deg); }

.rm-empty { text-align: center; color: #999; padding: 40px 0; }
</style>
