import { lm8, lm6, gyhLm, carNo, gyhSum, dnCells } from './creditCodeDefine';
import { MethodDefineItem, MethodDefineList, MethodDesc, MethodLevel } from "@shared/types";

/**
 * pk10 信用盘玩法定义:每个玩法单独定义,key = 完整后端 method_sign。
 * 前端只定义「怎么展示」(盘面 + 档位 codes + desc);标题/赔率由后端 struct 提供。
 * desc 用 i18n key,前端翻译(缺失语言回落 en)。
 */
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

const K = 'lottery.pk10.credit.desc';
const desc = (contentKeys: string[], egKey: string, titleKey = ''): MethodDesc => ({
    title: titleKey,
    content: contentKeys.map((k) => ({ title: '', content: k })),
    example: egKey,
});
const oneLevel: MethodLevel[] = [{ prize: 0, title: '', codes: [] }];

const d: MethodDefineList = {};

// 名次中文 → 位置
const RANK: Record<string, number> = { Yi: 1, Er: 2, San: 3, Si: 4, Wu: 5, Liu: 6, Qi: 7, Ba: 8, Jiu: 9, Shi: 10 };

/* ===== 第一~第十名:车号盘(定位) ===== */
for (const [leaf, pos] of Object.entries(RANK)) {
    d[`credit_OneToTen_Di${leaf}`] = {
        ...B('Ball', carNo, [pos], oneLevel),
        desc: desc([`${K}.carno.r1`], `${K}.carno.eg`, `${K}.carno.title`),
    };
}

/* ===== 趣味:车号盘 ===== */
d['credit_QuWei_ChiGj'] = { ...B('Ball', carNo, [1], oneLevel), desc: desc([`${K}.quwei.r1`], `${K}.quwei.eg`, `${K}.quwei.title`) };
d['credit_QuWei_ChiSanJia'] = { ...B('Ball', carNo, [1, 2, 3], oneLevel), desc: desc([`${K}.quwei.r1`], `${K}.quwei.eg`, `${K}.quwei.title`) };
d['credit_QuWei_TouSanJia'] = { ...B('Ball', carNo, [1, 2, 3], oneLevel), desc: desc([`${K}.quwei.r1`], `${K}.quwei.eg`, `${K}.quwei.title`) };

/* ===== 两面盘:冠军~第五(含龙虎,8 码)/ 第六~第十(无龙虎,6 码) ===== */
const LM8: Record<string, number[]> = { LmYi: [1, 10], LmEr: [2, 9], LmSan: [3, 8], LmSi: [4, 7], LmWu: [5, 6] };
const LM6: Record<string, number[]> = { LmLiu: [6], LmQi: [7], LmBa: [8], LmJiu: [9], LmShi: [10] };
for (const [leaf, position] of Object.entries(LM8)) {
    d[`credit_Lmp_${leaf}`] = {
        ...B('Form', lm8, position, oneLevel),
        desc: desc([`${K}.lm.r1`, `${K}.lm.r2`], `${K}.lm.eg`, `${K}.lm.title`),
    };
}
for (const [leaf, position] of Object.entries(LM6)) {
    d[`credit_Lmp_${leaf}`] = {
        ...B('Form', lm6, position, oneLevel),
        desc: desc([`${K}.lm.r1`], `${K}.lm.eg`, `${K}.lm.title`),
    };
}

/* ===== 冠亚和两面(大双/小单 分档) ===== */
const GYH_LM_LEVELS: MethodLevel[] = [
    { prize: 0, title: '大/双', codes: ['b', 'e'] },
    { prize: 0, title: '小/单', codes: ['s', 'o'] },
];
d['credit_Lmp_LmGyh'] = { ...B('Form', gyhLm, [1, 2], GYH_LM_LEVELS), desc: desc([`${K}.gyhlm.r1`], `${K}.gyhlm.eg`, `${K}.gyhlm.title`) };
d['credit_Gyh_GyhLm'] = { ...B('Form', gyhLm, [1, 2], GYH_LM_LEVELS), desc: desc([`${K}.gyhlm.r1`], `${K}.gyhlm.eg`, `${K}.gyhlm.title`) };

/* ===== 冠亚和值(3-19,按赔率对称配对分档) ===== */
d['credit_Gyh_Gyh'] = {
    ...B('Form', gyhSum, [1, 2], [
        { prize: 0, title: '3/4/18/19', codes: ['3', '4', '18', '19'] },
        { prize: 0, title: '5/6/16/17', codes: ['5', '6', '16', '17'] },
        { prize: 0, title: '7/8/14/15', codes: ['7', '8', '14', '15'] },
        { prize: 0, title: '9/10/12/13', codes: ['9', '10', '12', '13'] },
        { prize: 0, title: '11', codes: ['11'] },
    ]),
    desc: desc([`${K}.gyh.r1`], `${K}.gyh.eg`, `${K}.gyh.title`),
};

/* ===== 斗牛 ===== */
d['credit_Dn_Dn'] = {
    ...B('Form', dnCells, [1, 2, 3, 4, 5], [
        { prize: 0, title: '牛牛', codes: ['n'] },
        { prize: 0, title: '牛2/4/6/8', codes: ['2', '4', '6', '8'] },
        { prize: 0, title: '牛1/3/5/7/9', codes: ['1', '3', '5', '7', '9'] },
        { prize: 0, title: '无牛', codes: ['0'] },
    ]),
    desc: desc([`${K}.dn.r1`], `${K}.dn.eg`, `${K}.dn.title`),
};

const creditDefine: MethodDefineList = d;
export default creditDefine;
