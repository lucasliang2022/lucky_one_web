import {
    num6, num10, kdNum6, hz16, erTong, sanTong, yxx, sebo,
    erLian, sanLian, erBuTong, sanBuTong, hzForm, liuhou, pdForm, kdForm,
} from './creditCodeDefine';
import { MethodDefineItem, MethodDefineList, MethodDesc, MethodLevel } from "@shared/types";

/**
 * 快三信用盘玩法定义:key = 完整后端 method_sign(信用/官方同一套 sign,零转换)。
 * 通用 Form/Ball 盘面 + 后端下注码,复用 ssc 的 DefaultGroup(ks Credit.vue import 它)。
 * 标题/赔率来自后端 struct;每格赔率按 level.codes 匹配(injectServerLevels 注入 level 顺序赔率)。
 */
const B = (
    layoutType: string,
    number: Array<{ value: unknown; title: string }>,
    levels: MethodLevel[],
    segmentation?: number,
): Omit<MethodDefineItem, 'desc'> => ({
    title: '',
    lr_status: true,
    yl_status: true,
    layout: { type: layoutType, rows: [{ number, position: [], ...(layoutType === 'Ball' ? { shape: 'circle' } : {}) }] },
    levels,
    segmentation: segmentation ?? (layoutType === 'Ball' ? 7 : Math.min(number.length, 6)),
});

const K = 'lottery.ks.credit.desc';
const desc = (name: string): MethodDesc => ({
    title: `${K}.${name}.title`,
    content: [{ title: '', content: `${K}.${name}.r1` }],
    example: `${K}.${name}.eg`,
});
const one: MethodLevel[] = [{ prize: 0, title: '', codes: [] }];
// level.codes 决定每格取哪一档赔率;codes 为空 = 该档覆盖全部格子。
const lv = (...groups: string[][]): MethodLevel[] =>
    groups.map((codes) => ({ prize: 0, title: '', codes }));

const creditDefine: MethodDefineList = {};

/* ================= 猜号码(必出/不出):1-6 ================= */
creditDefine['credit_CaiHaoMa_Chm_BiChu'] = { ...B('Ball', num6, one, 6), desc: desc('bichu') };
creditDefine['credit_CaiHaoMa_Chm_BuChu'] = { ...B('Ball', num6, one, 6), desc: desc('buchu') };

/* ================= 同号 ================= */
// 二同号:11..66(短牌)/ 红码
creditDefine['credit_TongHao_Th_ErTongHao'] = {
    ...B('Form', erTong, lv(['11', '22', '33', '44', '55', '66'], ['hm']), 7),
    desc: desc('ertong'),
};
// 三同号:111..666 / 豹子
creditDefine['credit_TongHao_Th_SanTongHao'] = {
    ...B('Form', sanTong, lv(['111', '222', '333', '444', '555', '666'], ['bz']), 7),
    desc: desc('santong'),
};

/* ================= 鱼虾蟹 ================= */
creditDefine['credit_YuXiaXie_Yxx_DanSe'] = { ...B('Form', sebo, one, 3), desc: desc('danse') };
creditDefine['credit_YuXiaXie_Yxx_ShuangSe'] = { ...B('Form', sebo, one, 3), desc: desc('shuangse') };
creditDefine['credit_YuXiaXie_Yxx_SanSe'] = { ...B('Form', sebo, one, 3), desc: desc('sanse') };
creditDefine['credit_YuXiaXie_Yxx_YuXiaXie'] = { ...B('Form', yxx, one, 6), desc: desc('yuxiaxie') };

/* ================= 不同号 ================= */
// 二连号:一等(23/34/45)/ 二等(12/56)/ 三等(半顺)
creditDefine['credit_BuTongHao_Bth_ErLianHao'] = {
    ...B('Form', erLian, lv(['23', '34', '45'], ['12', '56'], ['bs']), 6),
    desc: desc('erlian'),
};
// 三不同号:20 组 / 黑码
creditDefine['credit_BuTongHao_Bth_SanBuTongHao'] = {
    ...B('Ball', sanBuTong, lv(
        ['123', '124', '125', '126', '134', '135', '136', '145', '146', '156',
            '234', '235', '236', '245', '246', '256', '345', '346', '356', '456'],
        ['hm'],
    ), 7),
    desc: desc('sanbutong'),
};
// 三连号:123..456(三连)/ 全顺
creditDefine['credit_BuTongHao_Bth_SanLianHao'] = {
    ...B('Form', sanLian, lv(['123', '234', '345', '456'], ['qs']), 5),
    desc: desc('sanlian'),
};
// 二不同号:15 对
creditDefine['credit_BuTongHao_Bth_ErBuTongHao'] = { ...B('Ball', erBuTong, one, 8), desc: desc('erbutong') };

/* ================= 和值 ================= */
// 和值两面:大小单双 / 大单·小双 / 小单·大双
creditDefine['credit_HeZhi_Hz_HzLiangMian'] = {
    ...B('Form', hzForm, lv(['b', 's', 'o', 'e'], ['bo', 'se'], ['so', 'be']), 4),
    desc: desc('hzlm'),
};
// 和值点数:3/18, 4/17, ... 10/11(8 档)
creditDefine['credit_HeZhi_Hz_HzDianShuo'] = {
    ...B('Ball', hz16, lv(['3', '18'], ['4', '17'], ['5', '16'], ['6', '15'], ['7', '14'], ['8', '13'], ['9', '12'], ['10', '11']), 8),
    desc: desc('hzds'),
};

/* ================= 溜后:猴1-6 / 天猴·地猴 / 无猴 ================= */
creditDefine['credit_LiuHou_LiuHou_LiuHou'] = {
    ...B('Form', liuhou, lv(['1', '2', '3', '4', '5', '6'], ['7', '8'], ['9']), 6),
    desc: desc('liuhou'),
};

/* ================= 排点 ================= */
creditDefine['credit_PaiDian_Pd_PdLiangMian'] = { ...B('Form', pdForm, one, 6), desc: desc('pdlm') };
// 排点点数:0/1, 2/9, 3/8, 4/7, 5/6(5 档)
creditDefine['credit_PaiDian_Pd_PdDianShuo'] = {
    ...B('Ball', num10, lv(['0', '1'], ['2', '9'], ['3', '8'], ['4', '7'], ['5', '6']), 5),
    desc: desc('pdds'),
};

/* ================= 跨度 ================= */
// 跨度两面:后端档序 小/双/大/单
creditDefine['credit_KuaDu_Kd_KdLiangMian'] = {
    ...B('Form', kdForm, lv(['s'], ['e'], ['b'], ['o']), 4),
    desc: desc('kdlm'),
};
// 跨度点数:0/1/2/3/4/5(各一档)
creditDefine['credit_KuaDu_Kd_KdDianShuo'] = {
    ...B('Ball', kdNum6, lv(['0'], ['1'], ['2'], ['3'], ['4'], ['5']), 6),
    desc: desc('kdds'),
};

export default creditDefine;
