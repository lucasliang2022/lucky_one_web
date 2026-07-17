import {
    numbers, form, longhu, zjhForm, suohaForm,
    spanCells, sumCells, zongHeCells, douNiuCells,
} from "@shared/lottery/ssc/config/define/creditCodeDefine";
import { MethodDefineItem, MethodDefineList, MethodDesc, MethodLevel } from "@shared/types";


const B = (
    layoutType: string,
    number: Array<{ value: unknown; title: string }>,
    position: number[],
    levels: MethodLevel[],
    segmentation?: number,
): Omit<MethodDefineItem, 'desc'> => ({
    title: '',
    lr_status: true,
    yl_status: true,
    layout: {
        type: layoutType,
        rows: [{ number, position, ...(layoutType === 'Ball' ? { shape: 'circle' } : {}) }],
    },
    levels,
    // 每行显示几个号码块:可配置;默认数字盘(Ball)一行 5 个,其它按格数(封顶 6)。
    segmentation: segmentation ?? (layoutType === 'Ball' ? 5 : Math.min(number.length, 6)),
});

// desc:传 i18n content key 列表 + example key(可选 title key)。
const desc = (contentKeys: string[], exampleKey: string, titleKey = ''): MethodDesc => ({
    title: titleKey,
    content: contentKeys.map((k) => ({ title: '', content: k })),
    example: exampleKey,
});

const K = 'lottery.ssc.credit.desc';  // i18n 前缀

const sscCreditDefine: MethodDefineList = {};

/* ================= 单号:形态 + 号码 ================= */
const BALL: Record<string, number> = { DiYiQiu: 1, DiErQiu: 2, DiSanQiu: 3, DiSiQiu: 4, DiWuQiu: 5 };
for (const [leaf, pos] of Object.entries(BALL)) {
    sscCreditDefine[`credit_DanHao_${leaf}_BsOePs`] = {
        ...B('Form', form, [pos], [{ prize: 0, title: '', codes: [] }]),
        desc: desc([`${K}.form.r1`, `${K}.form.r2`, `${K}.form.r3`], `${K}.form.eg`, `${K}.form.title`),
    };
    sscCreditDefine[`credit_DanHao_${leaf}_Number`] = {
        ...B('Ball', numbers, [pos], [{ prize: 0, title: '', codes: [] }]),
        desc: desc([`${K}.number.r1`], `${K}.number.eg`, `${K}.number.title`),
    };
}

/* ================= 龙虎(10 个位置对) ================= */
const LH: Record<string, number[]> = {
    LhWq: [1, 2], LhWb: [1, 3], LhWs: [1, 4], LhWg: [1, 5],
    LhQb: [2, 3], LhQs: [2, 4], LhQg: [2, 5],
    LhBs: [3, 4], LhBg: [3, 5], LhSg: [4, 5],
};
for (const [leaf, position] of Object.entries(LH)) {
    sscCreditDefine[`credit_LongHu_LongHu_${leaf}`] = {
        ...B('Form', longhu, position, [
            { prize: 0, title: '和', codes: ['h'] },
            { prize: 0, title: '龙虎', codes: ['d', 't'] },
        ]),
        desc: desc([`${K}.longhu.r1`], `${K}.longhu.eg`, `${K}.longhu.title`),
    };
}

/* ================= 扎金花(前/中/后三) ================= */
const ZJH_LEVELS: MethodLevel[] = [
    { prize: 0, title: '豹子', codes: ['1'] },
    { prize: 0, title: '顺子', codes: ['2'] },
    { prize: 0, title: '对子', codes: ['3'] },
    { prize: 0, title: '杂六', codes: ['4'] },
    { prize: 0, title: '半顺', codes: ['5'] },
];
const ZJH: Record<string, number[]> = { ZjhQs: [1, 2, 3], ZjhZs: [2, 3, 4], ZjhHs: [3, 4, 5] };
for (const [leaf, position] of Object.entries(ZJH)) {
    sscCreditDefine[`credit_Zjh_Zjh_${leaf}`] = {
        ...B('Form', zjhForm, position, ZJH_LEVELS),
        desc: desc(
            [`${K}.zjh.baozi`, `${K}.zjh.shunzi`, `${K}.zjh.duizi`, `${K}.zjh.zaliu`, `${K}.zjh.banshun`],
            `${K}.zjh.eg`, `${K}.zjh.title`,
        ),
    };
}

/* ================= 梭哈 ================= */
sscCreditDefine['credit_SuoHa_SuoHa_SuoHa'] = {
    ...B('Form', suohaForm, [1, 2, 3, 4, 5], [
        { prize: 0, title: '四条', codes: ['1'] },
        { prize: 0, title: '葫芦', codes: ['2'] },
        { prize: 0, title: '顺子', codes: ['3'] },
        { prize: 0, title: '三条', codes: ['4'] },
        { prize: 0, title: '两对', codes: ['5'] },
        { prize: 0, title: '一对', codes: ['6'] },
        { prize: 0, title: '单牌', codes: ['7'] },
    ]),
    desc: desc([`${K}.suoha.r1`], `${K}.suoha.eg`, `${K}.suoha.title`),
};

/* ================= 单码:一~五中 ================= */
for (const leaf of ['YiZhongYi', 'YiZhongEr', 'YiZhongSan', 'YiZhongSi', 'YiZhongWu']) {
    sscCreditDefine[`credit_DanMa_DanMa_${leaf}`] = {
        ...B('Ball', numbers, [], [{ prize: 0, title: '', codes: [] }]),
        desc: desc([`${K}.danma.r1`], `${K}.danma.eg`, `${K}.danma.title`),
    };
}

/* ================= 跨度 ================= */
const KD_LEVELS: MethodLevel[] = Array.from({ length: 10 }, (_, i) => ({ prize: 0, title: `${i}`, codes: [String(i)] }));
const KD: Record<string, number[]> = {
    'ErXing_QianErKd': [1, 2], 'ErXing_HouErKd': [4, 5],
    'SanXing_QianSanKd': [1, 2, 3], 'SanXing_ZhongSanKd': [2, 3, 4], 'SanXing_HouSanKd': [3, 4, 5],
};
for (const [seg, position] of Object.entries(KD)) {
    sscCreditDefine[`credit_KuaDu_${seg}`] = {
        ...B('Form', spanCells, position, KD_LEVELS),
        desc: desc([`${K}.kuadu.r1`], `${K}.kuadu.eg`, `${K}.kuadu.title`),
    };
}

/* ================= 和数:总和 + 位置和 ================= */
sscCreditDefine['credit_HeShuo_ZongHe_ZongHe'] = {
    ...B('Form', zongHeCells, [1, 2, 3, 4, 5], [
        { prize: 0, title: '大/小/单/双', codes: ['b', 's', 'o', 'e'] },
        { prize: 0, title: '大双/小单', codes: ['be', 'so'] },
        { prize: 0, title: '大单/小双', codes: ['bo', 'se'] },
    ]),
    desc: desc([`${K}.zonghe.r1`], `${K}.zonghe.eg`, `${K}.zonghe.title`),
};
sscCreditDefine['credit_HeShuo_ZongHe_ZongHeWei'] = {
    ...B('Form', form, [1, 2, 3, 4, 5], [{ prize: 0, title: '', codes: [] }]),
    desc: desc([`${K}.zonghewei.r1`], `${K}.zonghewei.eg`, `${K}.zonghewei.title`),
};

// 位置和:对称和值配对生成档位
const sumLevels = (maxSum: number): MethodLevel[] => {
    const out: MethodLevel[] = [];
    for (let k = 0; k <= Math.floor(maxSum / 2); k++) {
        const codes = k === maxSum - k ? [String(k)] : [String(k), String(maxSum - k)];
        out.push({ prize: 0, title: codes.join('/'), codes });
    }
    return out;
};
const HS: Array<[string, number, number[]]> = [
    ['ErXing_QianErHs', 18, [1, 2]], ['ErXing_HouErHs', 18, [4, 5]],
    ['SanXing_QianSanHs', 27, [1, 2, 3]], ['SanXing_ZhongSanHs', 27, [2, 3, 4]], ['SanXing_HouSanHs', 27, [3, 4, 5]],
    ['WuXing_WuXingHs', 45, [1, 2, 3, 4, 5]],
];
for (const [seg, maxSum, position] of HS) {
    sscCreditDefine[`credit_HeShuo_${seg}`] = {
        ...B('Form', sumCells(maxSum), position, sumLevels(maxSum)),
        desc: desc([`${K}.sum.r1`], `${K}.sum.eg`, `${K}.sum.title`),
    };
}

/* ================= 斗牛 ================= */
sscCreditDefine['credit_DouNiu_DouNiu_DouNiu'] = {
    ...B('Form', douNiuCells, [1, 2, 3, 4, 5], [
        { prize: 0, title: '牛1/3/5/7/9', codes: ['1', '3', '5', '7', '9'] },
        { prize: 0, title: '牛牛', codes: ['n'] },
        { prize: 0, title: '牛2/4/6/8', codes: ['2', '4', '6', '8'] },
        { prize: 0, title: '牛单', codes: ['o'] },
        { prize: 0, title: '牛质', codes: ['z'] },
        { prize: 0, title: '牛小', codes: ['s'] },
        { prize: 0, title: '牛大', codes: ['b'] },
        { prize: 0, title: '牛合', codes: ['h'] },
        { prize: 0, title: '牛双', codes: ['e'] },
        { prize: 0, title: '没牛', codes: ['0'] },
    ]),
    desc: desc([`${K}.douniu.r1`], `${K}.douniu.eg`, `${K}.douniu.title`),
};

export default sscCreditDefine;
