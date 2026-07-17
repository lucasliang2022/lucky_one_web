import {
    num6, hz16, dxds4, ebtPairs, ethPairs, ethTriples, sbtTriples,
    sthCells, zlCells, bsCells, slhCells,
} from './officialCodeDefine';
import { MethodDefineItem, MethodDefineList, MethodDesc, MethodLevel, MethodCalc } from "@shared/types";

/**
 * 快三官方盘玩法定义:key = 完整后端 method_sign(和信用盘一致,零转换)。
 * 统一「格子盘」布局(layout.type='Grid'),点选累加下注:
 *  - 注数 calc.type:length(选中格数,默认)/ combination(C(n,base) 复选)/ zx(行间乘积 二同号复选);
 *  - 每格赔率:按 levels[].codes 匹配后端下发的分档赔率;
 *  - 码:每格独立成注,unit_separator=',' 拼接;二同号复选双行用 row_separator='|' 分行。
 */
const K = 'lottery.ks.official.desc';
const desc = (name: string): MethodDesc => ({
    title: `${K}.${name}.title`,
    content: [{ title: '', content: `${K}.${name}.r1` }],
    example: `${K}.${name}.eg`,
});

type Cell = { value: unknown; title: string };
interface GOpts { min?: number; calc?: MethodCalc; }

// 单行格子盘
const G = (number: Cell[], levels: MethodLevel[], opts: GOpts = {}): Omit<MethodDefineItem, 'desc'> => ({
    title: '', lr_status: true, yl_status: true,
    layout: {
        type: 'Grid',
        rows: [{ number, title: '', min_selected: opts.min ?? 1, max_selected: number.length, shape: 'rectangle', position: [] }],
        unit_separator: ',',
        row_separator: ',',
        code_total_count: { min: opts.min ?? 1, max: 200 },
        tips: '',
    },
    levels,
    ...(opts.calc ? { calc: opts.calc } : {}),
});

// 双行格子盘(二同号复选:行1=二同 11..66,行2=单号 1..6,注数=行间乘积)
const G2 = (n1: Cell[], t1: string, n2: Cell[], t2: string, levels: MethodLevel[]): Omit<MethodDefineItem, 'desc'> => ({
    title: '', lr_status: true, yl_status: true,
    layout: {
        type: 'Grid',
        rows: [
            { number: n1, title: t1, min_selected: 1, max_selected: n1.length, shape: 'rectangle', position: [] },
            { number: n2, title: t2, min_selected: 1, max_selected: n2.length, shape: 'rectangle', position: [] },
        ],
        unit_separator: ',',
        row_separator: '|',
        tips: '',
    },
    levels,
    calc: { type: 'zx' },
});

// 单档赔率覆盖全部格子(每格都显示赔率);多档按 codes 分组。
const allLv = (cells: Cell[]): MethodLevel[] => [{ prize: 0, title: '', codes: cells.map((c) => String(c.value)) }];
const lv = (...groups: string[][]): MethodLevel[] => groups.map((codes) => ({ prize: 0, title: '', codes }));

const KO = 'lottery.ks.official.code';
const officialDefine: MethodDefineList = {};

/* ===== 单选累加号码盘 ===== */
officialDefine['official_CaiYgh_CaiYgh_CaiYgh'] = { ...G(num6, allLv(num6)), desc: desc('caiygh') };
officialDefine['official_Hz_Hz_Hz'] = {
    ...G(hz16, lv(['3', '18'], ['4', '17'], ['5', '16'], ['6', '15'], ['7', '14'], ['8', '13'], ['9', '12'], ['10', '11'])),
    desc: desc('hz'),
};
officialDefine['official_DxDs_DxDs_HzDxDs'] = { ...G(dxds4, allLv(dxds4)), desc: desc('dxds') };
officialDefine['official_Ebth_Ebt_EbtDx'] = { ...G(ebtPairs, allLv(ebtPairs)), desc: desc('ebtdx') };
officialDefine['official_Eth_EthFx_EthFx'] = { ...G(ethPairs, allLv(ethPairs)), desc: desc('ethfx') };
officialDefine['official_Eth_EthDx_EthDxDs'] = { ...G(ethTriples, allLv(ethTriples)), desc: desc('ethdxds') };
officialDefine['official_Sbth_Sbth_SbtDx'] = { ...G(sbtTriples, allLv(sbtTriples)), desc: desc('sbtdx') };

/* ===== 单选 + 通选(777) ===== */
officialDefine['official_Sth_Sth_Sth'] = {
    ...G(sthCells, lv(['111', '222', '333', '444', '555', '666'], ['777'])), desc: desc('sth'),
};
officialDefine['official_Sbth_Zl_ZaLiu'] = {
    ...G(zlCells, lv(['135', '136', '146', '246'], ['777'])), desc: desc('zl'),
};
officialDefine['official_Sbth_Bs_BanShun'] = {
    ...G(bsCells, lv(['124', '125', '126', '134', '145', '156', '235', '236', '246', '256', '346', '356'], ['777'])),
    desc: desc('bs'),
};
officialDefine['official_Sbth_Slh_Slh'] = {
    ...G(slhCells, lv(['123', '234', '345', '456'], ['777'])), desc: desc('slh'),
};

/* ===== 多选胆码(1-6 选 N,组合数) ===== */
officialDefine['official_Ebth_Ebt_EbtFx'] = {
    ...G(num6, allLv(num6), { min: 2, calc: { type: 'combination', base: 2 } }), desc: desc('ebtfx'),
};
officialDefine['official_Sbth_Sbth_SbtFx'] = {
    ...G(num6, allLv(num6), { min: 3, calc: { type: 'combination', base: 3 } }), desc: desc('sbtfx'),
};

/* ===== 二同号复选(双行:二同 × 单号) ===== */
officialDefine['official_Eth_EthDx_EthDxFs'] = {
    ...G2(ethPairs, `${KO}.pair`, num6, `${KO}.single`, allLv(ethPairs)), desc: desc('ethdxfs'),
};

export default officialDefine;
