import { computed, ref, ComputedRef } from 'vue';
import { formatPrize } from '@shared/utils/common';
import { notify } from '@shared/notify';
import { useUserStore } from '@shared/stores/userStore';
import * as lotteryService from "@shared/api/lotteryService";
import i18n from '@shared/i18n';
import { resolveMethodTitle } from '@lottery/base/utils/common';
import {
    CartItem,
    OrderIssueInfo,
    MethodDefineItem,
    OfficialBase,
    OmsGroup,
    OmsList,
    OrderData,
    OrderProject
} from '@shared/types';
import type { RespLotteryBet } from '@shared/api/lotteryService';
import { CommonBase } from '@lottery/base/types/store';

export function useOfficialBase(common: CommonBase): OfficialBase {
    const officialBetCount = ref<number>(0);
    const officialSelectedBalls = ref<any[]>([]);
    const officialBetList = ref<any[]>([]);
    const officialBetCost: ComputedRef<number> = computed(() => officialBetCount.value * common.times.value * common.price.value);
    const officialTotalAmount: ComputedRef<number> = computed(() => officialBetList.value.reduce((sum: number, bet: any) => sum + bet.cost, 0));

    const officialMethodStructure = ref<OmsList>({});
    const officialCategoryCurrent = ref<string>('');
    const officialGroupCurrent = ref<OmsGroup>({} as OmsGroup);
    const officialMethodCurrent = ref<MethodDefineItem>({} as MethodDefineItem);

    const setCategoryOfficialCurrent = (categoryKey: string): void => {
        officialCategoryCurrent.value = categoryKey;
        officialGroupCurrent.value = {} as OmsGroup;
        officialMethodCurrent.value = {} as MethodDefineItem;
        const currentCategoryData = officialMethodStructure.value?.[categoryKey];
        if (!currentCategoryData) {
            return;
        }

        let firstGroupToSet: OmsGroup | null = null;
        let firstMethodToSet: MethodDefineItem | null = null;

        if (currentCategoryData.groups && typeof currentCategoryData.groups === 'object') {
            const groupKeys = Object.keys(currentCategoryData.groups);
            if (groupKeys.length > 0) {
                const firstGroupKey = groupKeys[0];
                firstGroupToSet = currentCategoryData.groups[firstGroupKey];

                if (firstGroupToSet && firstGroupToSet.methods && typeof firstGroupToSet.methods === 'object') {
                    const methodKeys = Object.keys(firstGroupToSet.methods);

                    if (methodKeys.length > 0) {
                        const firstMethodKey = methodKeys[0];
                        firstMethodToSet = firstGroupToSet.methods[firstMethodKey];
                    }
                }
            }
        } else if (currentCategoryData.methods && typeof currentCategoryData.methods === 'object') {
            const methodKeys = Object.keys(currentCategoryData.methods);
            if (methodKeys.length > 0) {
                const firstMethodKey = methodKeys[0];
                firstMethodToSet = currentCategoryData.methods[firstMethodKey];
                firstGroupToSet = null;
            }
        }

        // 无分组时 firstGroupToSet 为 null;ref 用 {} 空哨兵(与初始值一致,消费方均以 ?./?.sign 判存在)
        officialGroupCurrent.value = firstGroupToSet ?? ({} as OmsGroup);

        if (firstMethodToSet) {
            setMethodOfficialCurrent(firstMethodToSet);
        } else {
            officialMethodCurrent.value = {} as MethodDefineItem;
        }
    };

    const setGroupOfficialCurrent = (val: any): void => {
        officialGroupCurrent.value = val;
    };

    const setMethodOfficialCurrent = (method: any): void => {
        officialMethodCurrent.value = method;
        common.showColdHot.value = false;
        common.showOmission.value = false;
        common.isDescShow.value = false;
        common.selectedRange.value = 100;
        common.displayPrize.value = [];
    };

    const officialBetAdd = (bet: any): void => {
        officialBetList.value.unshift(bet);
    };

    const officialBetItemBuild = (): CartItem => {
        const { codes, codesDisplay } = formatSelectedBalls(officialSelectedBalls.value);
        return {
            methodTitle: resolveMethodTitle(officialMethodCurrent.value, i18n.global.t, i18n.global.te),
            methodSign: officialMethodCurrent.value.sign ?? '',
            methodSdkSign: officialMethodCurrent.value.sdk_sign ?? '',
            codes: codes,
            codesDisplay: codesDisplay,
            price: common.price.value,
            times: common.times.value,
            cost: officialBetCost.value,
            count: officialBetCount.value,
            currency: common.currency.value,
            mode: 'official',
            confirmed: true
        }
    };

    const officialBetSubmit = async (): Promise<void> => {
        // 统一契约:官方盘也用 projects(与信用盘一致)
        // 映射:sdk_sign→method_sign, codes→code, price→unit(bet_unit), num→count(bet_count)
        const projects = officialBetList.value.map((item: any) => ({
            method_sign: item.methodSdkSign,
            code: item.codes,
            code_display: item.codesDisplay,
            times: item.times || 1,
            // 每注钱的档位:1=元 / 0.1=角 / 0.01=分 / 0.001=厘;官方盘取玩法 price(即单价档位)
            unit: item.price,
            count: item.count,
            mode: common.mode.value,
        }));

        // 追号:与信用盘一致,读 common.preIssueList(追号面板写入的后续期号);为空则不追号。
        const traceIssues = common.preIssueList.value || [];
        const betData = {
            lottery_sign: common.sign.value,
            issue_no: common.issueCurrent.value.issue_no,
            currency: common.currency.value,
            projects: projects,
            trace: traceIssues.length > 0 ? { type: 'win_stop', issue_ids: traceIssues } : null,
        };

        const data: RespLotteryBet = await lotteryService.postLotteryBet(betData);
        if (data) {
            notify.success("投注成功");
            officialBetList.value = [];

            await useUserStore().fetchBalance();
            await common.fetchOrderList({lottery_sign: common.sign.value});
        }
    };

    const addRandomBet = (): void => {
        if (!common.methodLayoutRef.value || typeof common.methodLayoutRef.value.randomOneBet !== "function") {
            console.error("methodLayoutRef.randomOneBet 方法不存在");
            return;
        }

        const randomBetData = common.methodLayoutRef.value.randomOneBet();
        if (!randomBetData) {
            console.error("获取随机投注数据失败");
            return;
        }

        const { codes, codesDisplay } = formatSelectedBalls(randomBetData);
        const newBet = {
            methodTitle: resolveMethodTitle(officialMethodCurrent.value, i18n.global.t, i18n.global.te),
            methodSign: officialMethodCurrent.value.sign,
            methodSdkSign: officialMethodCurrent.value.sdk_sign ?? '',
            codes: codes,
            codesDisplay: codesDisplay,
            price: common.price.value,
            times: common.times.value,
            currency: common.currency.value,
            count: 1,
            cost: formatPrize(common.times.value * common.price.value),
            mode: 'official'
        };

        officialBetAdd(newBet);
        console.log("随机投注成功:", newBet);
    };

    const formatSelectedBalls = (randomBetData: Array<Array<{ value: string; title: string }>>):{ codes: string; codesDisplay: string } => {
        const rowSeparator = officialMethodCurrent.value.layout.row_separator ?? ',';
        // 默认拼接(unit=''),与多数官方玩法(如 ssc BaseSscOfficial)一致;需要分隔符的玩法在 define 里显式声明
        const unitSeparator = officialMethodCurrent.value.layout.unit_separator ?? '';
        // 兼容两种结构:嵌套 [[ball,...],...](按位置分组,ssc/pk10)照用;
        // 扁平 [ball,...](lhc composable,单行多选、各自独立成注)→ 每球单独一组,用 row 分隔拼成 "07,08"。
        const rows: Array<Array<{ value: string; title: string }>> =
            Array.isArray(randomBetData?.[0])
                ? (randomBetData as any)
                : ((randomBetData as any) ?? []).map((b: any) => [b]);
        // 拼码后 trim 去首尾空格(空格分隔的玩法如和值/牛牛的防御;单数字无害)
        const codes = rows
            .map(group => group.map(ball => ball.value).join(unitSeparator))
            .join(rowSeparator[0])
            .trim();

        // 展示码:与机器码分离 —— 用可读分隔符(位置内逗号、位置间 " | "),取球的 title
        // (标签类玩法显示 龙/虎/大/小 等;数字类玩法 title==value)。
        const codesDisplay = rows
            .map(group => group.map(ball => i18n.global.t(ball.title)).join(','))
            .join(' | ');

        return {codes, codesDisplay};
    };

    return {
        officialBetCount,
        officialSelectedBalls,
        officialBetList,
        officialBetCost,
        officialTotalAmount,
        officialMethodStructure,
        officialCategoryCurrent,
        officialGroupCurrent,
        officialMethodCurrent,
        setCategoryOfficialCurrent,
        setGroupOfficialCurrent,
        setMethodOfficialCurrent,
        officialBetAdd,
        officialBetItemBuild,
        officialBetSubmit,
        addRandomBet
    };
}