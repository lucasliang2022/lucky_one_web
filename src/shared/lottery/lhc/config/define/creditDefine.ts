import {
    teNumbers, zodiac12, sebo, banbo, banbanbo, temaXt, dxds4, teXiaoXt, touwei,
    qisebo, heDxds, weiBs, pingWei, zongXiao,
} from './creditCodeDefine';
import { MethodDefineItem, MethodDefineList, MethodDesc, MethodLevel } from "@shared/types";

/**
 * lhc 信用盘玩法定义:key = 完整后端 method_sign(和信用/官方一套逻辑,零转换)。
 * 本轮先迁「特码族」(11 个玩法),用通用 Form/Ball 盘面 + 后端下注码;
 * 复用 ssc 的 DefaultGroup(lhc Credit.vue 已 import 它)。生肖/波色的富视觉后续再叠加。
 * 标题/赔率来自后端 struct;desc 用 i18n key 前端翻译。
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

const K = 'lottery.lhc.credit.desc';
const desc = (contentKeys: string[], egKey: string, titleKey = ''): MethodDesc => ({
    title: titleKey,
    content: contentKeys.map((k) => ({ title: '', content: k })),
    example: egKey,
});
const one: MethodLevel[] = [{ prize: 0, title: '', codes: [] }];

const creditDefine: MethodDefineList = {};

// 特码号码(01-49)
creditDefine['credit_TeMa_HaoMa_HaoMa'] = {
    ...B('Ball', teNumbers, one, 7),
    desc: desc([`${K}.haoma.r1`], `${K}.haoma.eg`, `${K}.haoma.title`),
};
// 合肖(12 生肖)
creditDefine['credit_TeMa_HeXiao_HeXiao'] = {
    ...B('Form', zodiac12, one, 6),
    desc: desc([`${K}.hexiao.r1`], `${K}.hexiao.eg`, `${K}.hexiao.title`),
};
// 特肖(12 生肖)
creditDefine['credit_TeMa_TeXiaoTouWeiShu_TeXiao'] = {
    ...B('Form', zodiac12, one, 6),
    desc: desc([`${K}.texiao.r1`], `${K}.texiao.eg`, `${K}.texiao.title`),
};
// 波色(红/蓝/绿)—— lv1 蓝绿、lv2 红
creditDefine['credit_TeMa_SeBoBanBo_SeBo'] = {
    ...B('Form', sebo, [
        { prize: 0, title: '蓝/绿波', codes: ['b', 'g'] },
        { prize: 0, title: '红波', codes: ['r'] },
    ], 3),
    desc: desc([`${K}.sebo.r1`], `${K}.sebo.eg`, `${K}.sebo.title`),
};
// 半波(色×大小单双,12)
creditDefine['credit_TeMa_SeBoBanBo_BanBo'] = {
    ...B('Form', banbo, [
        { prize: 0, title: '', codes: ['rb', 'bs', 'gs', 'ge'] },
        { prize: 0, title: '', codes: ['ro', 'bo', 'be', 'gb', 'go'] },
        { prize: 0, title: '', codes: ['re', 'bb'] },
        { prize: 0, title: '', codes: ['rs'] },
    ], 4),
    desc: desc([`${K}.banbo.r1`], `${K}.banbo.eg`, `${K}.banbo.title`),
};
// 半半波(色×大小×单双,12)
creditDefine['credit_TeMa_SeBoBanBo_BanBanBo'] = {
    ...B('Form', banbanbo, [
        { prize: 0, title: '', codes: ['rbo', 'bso', 'gse'] },
        { prize: 0, title: '', codes: ['rbe', 'bbe', 'bse', 'gbo', 'gbe', 'gso'] },
        { prize: 0, title: '', codes: ['rso', 'rse', 'bbo'] },
    ], 4),
    desc: desc([`${K}.banbanbo.r1`], `${K}.banbanbo.eg`, `${K}.banbanbo.title`),
};
// 特码形态(大小单双 + 组合)—— lv1 组合、lv2 单一
creditDefine['credit_TeMa_ShuangMian_TeMaXingTai'] = {
    ...B('Form', temaXt, [
        { prize: 0, title: '组合', codes: ['bo', 'so', 'be', 'se'] },
        { prize: 0, title: '单一', codes: ['b', 's', 'o', 'e'] },
    ], 4),
    desc: desc([`${K}.temaxt.r1`], `${K}.temaxt.eg`, `${K}.temaxt.title`),
};
// 特合形态(合数大小单双)
creditDefine['credit_TeMa_ShuangMian_TeHeXingTai'] = {
    ...B('Form', dxds4, one, 4),
    desc: desc([`${K}.hexingtai.r1`], `${K}.hexingtai.eg`, `${K}.hexingtai.title`),
};
// 特尾形态(尾数大小单双)
creditDefine['credit_TeMa_ShuangMian_TeWeiXingTai'] = {
    ...B('Form', dxds4, one, 4),
    desc: desc([`${K}.weixingtai.r1`], `${K}.weixingtai.eg`, `${K}.weixingtai.title`),
};
// 特肖形态(天地前后家野肖)
creditDefine['credit_TeMa_ShuangMian_TeXiaoXingTai'] = {
    ...B('Form', teXiaoXt, one, 6),
    desc: desc([`${K}.xiaoxingtai.r1`], `${K}.xiaoxingtai.eg`, `${K}.xiaoxingtai.title`),
};
// 头尾数(头0-4 + 尾0-9)
creditDefine['credit_TeMa_TeXiaoTouWeiShu_TouWeiShu'] = {
    ...B('Form', touwei, [
        { prize: 0, title: '尾0', codes: ['w0'] },
        { prize: 0, title: '尾1-9', codes: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9'] },
        { prize: 0, title: '头0', codes: ['t0'] },
        { prize: 0, title: '头1-4', codes: ['t1', 't2', 't3', 't4'] },
    ], 5),
    desc: desc([`${K}.touwei.r1`], `${K}.touwei.eg`, `${K}.touwei.title`),
};

/* ================= 正码族 ================= */
// 号码盘(01-49):任选一 + 正码一~六特
creditDefine['credit_ZhengMa_RenXuanYi_RenXuanYi'] = {
    ...B('Ball', teNumbers, one, 7),
    desc: desc([`${K}.rxy.r1`], `${K}.rxy.eg`, `${K}.rxy.title`),
};
for (const leaf of ['ZhengYiTe', 'ZhengErTe', 'ZhengSanTe', 'ZhengSiTe', 'ZhengWuTe', 'ZhengLiuTe']) {
    creditDefine[`credit_ZhengMaTe_${leaf}_${leaf}`] = {
        ...B('Ball', teNumbers, one, 7),
        desc: desc([`${K}.zmte.r1`], `${K}.zmte.eg`, `${K}.zmte.title`),
    };
}
// 七色波(红/蓝/绿/和)—— lv1 和、lv2 绿蓝、lv3 红
creditDefine['credit_ZhengMa_ZhengXiaoQiSeBo_QiSeBo'] = {
    ...B('Form', qisebo, [
        { prize: 0, title: '和', codes: ['h'] },
        { prize: 0, title: '绿/蓝', codes: ['b', 'g'] },
        { prize: 0, title: '红', codes: ['r'] },
    ], 4),
    desc: desc([`${K}.qisebo.r1`], `${K}.qisebo.eg`, `${K}.qisebo.title`),
};
// 正肖(12 生肖)
creditDefine['credit_ZhengMa_ZhengXiaoQiSeBo_ZhengXiao'] = {
    ...B('Form', zodiac12, one, 6),
    desc: desc([`${K}.zhengxiao.r1`], `${K}.zhengxiao.eg`, `${K}.zhengxiao.title`),
};
// 正码一~六:大小单双 / 合大小单双 / 尾大小 / 波色
const ZM_POS = ['ZmYi', 'ZmEr', 'ZmSan', 'ZmSi', 'ZmWu', 'ZmLiu'];
for (const p of ZM_POS) {
    creditDefine[`credit_ZhengMa_${p}_${p}StatCode`] = {
        ...B('Form', dxds4, [{ prize: 0, title: '', codes: ['b', 's', 'o', 'e'] }], 4),
        desc: desc([`${K}.statcode.r1`], `${K}.statcode.eg`, `${K}.statcode.title`),
    };
    creditDefine[`credit_ZhengMa_${p}_${p}StatSum`] = {
        ...B('Form', heDxds, [{ prize: 0, title: '', codes: ['hb', 'hs', 'ho', 'he'] }], 4),
        desc: desc([`${K}.statsum.r1`], `${K}.statsum.eg`, `${K}.statsum.title`),
    };
    creditDefine[`credit_ZhengMa_${p}_${p}StatTail`] = {
        ...B('Form', weiBs, [{ prize: 0, title: '', codes: ['wb', 'ws'] }], 2),
        desc: desc([`${K}.stattail.r1`], `${K}.stattail.eg`, `${K}.stattail.title`),
    };
    creditDefine[`credit_ZhengMa_${p}_${p}StatWave`] = {
        ...B('Form', sebo, [
            { prize: 0, title: '绿/蓝', codes: ['b', 'g'] },
            { prize: 0, title: '红', codes: ['r'] },
        ], 3),
        desc: desc([`${K}.statwave.r1`], `${K}.statwave.eg`, `${K}.statwave.title`),
    };
}

/* ================= 一总平 + 综合 ================= */
// 平特尾数:0-9 尾(lv1 尾0、lv2 尾1-9)
creditDefine['credit_YiZongPing_PingTeWeiShu_PingTeWeiShu'] = {
    ...B('Form', pingWei, [
        { prize: 0, title: '尾0', codes: ['0'] },
        { prize: 0, title: '尾1-9', codes: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
    ], 5),
    desc: desc([`${K}.pingwei.r1`], `${K}.pingwei.eg`, `${K}.pingwei.title`),
};
// 一肖(12 生肖)
creditDefine['credit_YiZongPing_YiXiao_YiXiao'] = {
    ...B('Form', zodiac12, one, 6),
    desc: desc([`${K}.yixiao.r1`], `${K}.yixiao.eg`, `${K}.yixiao.title`),
};
// 总肖(二肖~七肖,各自档位)
creditDefine['credit_YiZongPing_ZongXiao_ZongXiao'] = {
    ...B('Form', zongXiao, [
        { prize: 0, title: '二肖', codes: ['1'] }, { prize: 0, title: '三肖', codes: ['2'] },
        { prize: 0, title: '四肖', codes: ['3'] }, { prize: 0, title: '五肖', codes: ['4'] },
        { prize: 0, title: '六肖', codes: ['5'] }, { prize: 0, title: '七肖', codes: ['6'] },
    ], 6),
    desc: desc([`${K}.zongxiao.r1`], `${K}.zongxiao.eg`, `${K}.zongxiao.title`),
};
// 综合(总和大小单双)
creditDefine['credit_ZongHe_ZongHe_ZongHe'] = {
    ...B('Form', dxds4, one, 4),
    desc: desc([`${K}.zonghe.r1`], `${K}.zonghe.eg`, `${K}.zonghe.title`),
};

/* ================= 连码:组合玩法(样板:二/三/四全中) ================= */
// 选 N 个号码,注数 = C(N, 组合大小);统一金额。layout.type='Combo' → Combo 组件。
const quanZhong = (k: number): MethodDefineItem => ({
    ...B('Combo', teNumbers, one, 7),
    combo: { groupSize: k, minSelected: k },
    desc: desc([`${K}.quanzhong.r1`], `${K}.quanzhong.eg`, `${K}.quanzhong.title`),
});
creditDefine['credit_LianMa_ErQuanZhong_ErQuanZhong'] = quanZhong(2);
creditDefine['credit_LianMa_SanQuanZhong_SanQuanZhong'] = quanZhong(3);
creditDefine['credit_LianMa_SiQuanZhong_SiQuanZhong'] = quanZhong(4);

export default creditDefine;
