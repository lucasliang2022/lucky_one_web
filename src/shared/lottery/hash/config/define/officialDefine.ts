import { num10, oe, bs, lh, hz5, baozi, shunzi } from './officialCodeDefine';
import { MethodDefineItem, MethodDefineList, MethodLevel, MethodRow } from "@shared/types";

/**
 * 哈希官方盘玩法定义:key = 完整后端 method_sign。
 * 统一「格子盘」(layout.type='Grid',复用 ks 的 Grid + base officialLogic):
 *  - 哈希原生玩法(定位胆/两面/综合/龙虎/趣味):单行点选,每格独立成注,码用 '&' 拼接(BaseHashCode);
 *  - 五星直选:5 行各选 1 个数字,码 '&' 拼接,注数=1;
 *  - 前二/前三直选(复用 ssc BaseZhi 逻辑):2/3 行数字复式,行内数字直接相连、位间 ',' 分隔,注数=行间乘积。
 * 每格赔率按 levels[].codes 匹配后端分档赔率。
 */
type Cell = { value: unknown; title: string };
const KO = 'lottery.hash.official.code';
const desc = (): any => ({ title: '', content: [], example: '' });

// 单行格子盘:每格独立成注,'&' 拼接(哈希原生 two_side/position 玩法)。
const G1 = (number: Cell[], levels: MethodLevel[]): Omit<MethodDefineItem, 'desc'> => ({
    title: '', lr_status: true, yl_status: true,
    layout: {
        type: 'Grid',
        rows: [{ number, title: '', min_selected: 1, max_selected: number.length, shape: 'rectangle', position: [] }],
        unit_separator: '&', row_separator: '&', code_total_count: { min: 1, max: 200 }, tips: '',
    },
    levels,
});

// 多行数字盘(前二/前三复式):位间分隔符 sep,行内相连;注数=行间乘积。
const Gpos = (rowCount: number, sep: string, levels: MethodLevel[]): Omit<MethodDefineItem, 'desc'> => ({
    title: '', lr_status: true, yl_status: true,
    layout: {
        type: 'Grid',
        rows: Array.from({ length: rowCount }, (_, i): MethodRow => ({
            number: num10, title: `${KO}.pos${i + 1}`, min_selected: 1, max_selected: 10, shape: 'rectangle', position: [],
        })),
        unit_separator: '', row_separator: sep, tips: '',
    },
    levels,
    calc: { type: 'zx' },
});

const one: MethodLevel[] = [{ prize: 0, title: '', codes: [] }];
const allLv = (cells: Cell[]): MethodLevel[] => [{ prize: 0, title: '', codes: cells.map((c) => String(c.value)) }];
const lv = (...groups: string[][]): MethodLevel[] => groups.map((codes) => ({ prize: 0, title: '', codes }));

const officialDefine: MethodDefineList = {};

/* ===== 定位胆:第 1~5 球号码(0-9) ===== */
for (let i = 1; i <= 5; i++) {
    officialDefine[`official_Ball${i}Num`] = { ...G1(num10, allLv(num10)), desc: desc() };
}
/* ===== 两面:5 位 × 大小单双质合,每位一行(格子 value = "{位序}{形态}") ===== */
const FORMS: [string, string][] = [
    ['b', 'da'], ['s', 'xiao'], ['o', 'dan'], ['e', 'shuang'], ['z', 'zhi'], ['h', 'hecom'],
];
const POS = ['wan', 'qian', 'bai', 'shi', 'ge']; // 万/千/百/十/个位
const lmCodes: string[] = [];
const lmRows: MethodRow[] = POS.map((pk, p) => ({
    title: `${KO}.${pk}`,
    number: FORMS.map(([f, k]) => { const v = `${p}${f}`; lmCodes.push(v); return { value: v, title: `${KO}.${k}` }; }),
    min_selected: 0, max_selected: 6, shape: 'rectangle', position: [],
}));
officialDefine['official_LiangMian'] = {
    title: '', lr_status: true, yl_status: true,
    layout: {
        type: 'LiangMian',
        rows: lmRows,
        unit_separator: '&', row_separator: '&',
        code_total_count: { min: 1, max: 30 }, tips: '',
    },
    levels: [{ prize: 0, title: '', codes: lmCodes }],
    desc: desc(),
};
/* ===== 综合:总和 大小 / 单双 / 和值(极小·小·中·大·极大) ===== */
officialDefine['official_TotalDx'] = { ...G1(bs, allLv(bs)), desc: desc() };
officialDefine['official_TotalDs'] = { ...G1(oe, allLv(oe)), desc: desc() };
officialDefine['official_TotalHz'] = { ...G1(hz5, lv(['xs'], ['s'], ['m'], ['b'], ['xb'])), desc: desc() };
/* ===== 龙虎:龙 / 虎 / 和 ===== */
officialDefine['official_LongHu'] = { ...G1(lh, lv(['d'], ['t'], ['h'])), desc: desc() };
/* ===== 趣味:豹子 / 顺子 / 五星直选 ===== */
officialDefine['official_BaoZi'] = { ...G1(baozi, allLv(baozi)), desc: desc() };
officialDefine['official_ShunZi'] = { ...G1(shunzi, allLv(shunzi)), desc: desc() };
officialDefine['official_WuXingZx'] = {
    ...(() => {
        const d = Gpos(5, '&', one);
        (d.layout.rows as MethodRow[]).forEach((r) => { r.max_selected = 1; }); // 五星直选每位仅 1 码
        return d;
    })(),
    desc: desc(),
};

/* ===== 前二 / 前三直选(复用 ssc BaseZhi 判奖,位间 ',' 分隔) ===== */
officialDefine['official_Qe_QeZx_QeZx'] = { ...Gpos(2, ',', one), desc: desc() };
officialDefine['official_Qs_QsZx_QsZx'] = { ...Gpos(3, ',', one), desc: desc() };

export default officialDefine;
