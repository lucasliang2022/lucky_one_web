import { computed, ref, ComputedRef } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import { AxiosError } from 'axios';
import {CmsGroup, CmsList, MethodDefineItem, CommonBase, CreditBase} from "@/types";
import * as lotteryService from "@/api/lotteryService";
import type { RespLotteryBet } from "@/api/lotteryService";

export function useCreditBase(common: CommonBase): CreditBase {
    const creditBetCount = ref<number>(0);
    const creditSelectedBalls = ref<Record<string, any[]>>({});
    const creditBetList = ref<any[]>([]);

    const creditBetCost: ComputedRef<number> = computed(() =>
        Object.values(creditSelectedBalls.value).flat().reduce((sum, ball) => sum + (ball.amount || 0), 0)
    );

    const creditTotalAmount: ComputedRef<number> = computed(() =>
        creditBetList.value.reduce((sum, bet) => sum + (Number(bet.amount) || 0), 0)
    );

    const creditMethodStructure = ref<CmsList>({});
    const creditCategoryCurrent = ref<string>('');
    const creditGroupCurrent = ref<CmsGroup>({} as CmsGroup);
    const creditMethodCurrent = ref<MethodDefineItem >({} as MethodDefineItem);
    const creditDisplayMethodDesc = ref<any[]>([]);

    const setCategoryCreditCurrent = (category: string): void => {
        creditCategoryCurrent.value = category;
        const currentCategory = creditMethodStructure.value[creditCategoryCurrent.value];
        const firstGroupKey = Object.keys(currentCategory.groups)[0];
        if (firstGroupKey && currentCategory.groups[firstGroupKey].layout.length > 0) {
            setGroupCreditCurrent(currentCategory.groups[firstGroupKey]);
        }
    };

    const setGroupCreditCurrent = (group: CmsGroup): void => {
        if (creditGroupCurrent.value.sign !== group.sign) {
            const firstMethodTarget = group.layout[0]?.methods
                ? Object.values(group.layout[0].methods)[0].target
                : null;
            creditGroupCurrent.value = group;
            if (firstMethodTarget && group.methods[firstMethodTarget]) {
                setMethodCreditCurrent(group.methods[firstMethodTarget]);
            }
        }
    };

    const setMethodCreditCurrent = (val: any): void => {
        creditSelectedBalls.value = {};
        common.showColdHot.value = false;
        common.showOmission.value = false;
        common.isDescShow.value = false;
        common.selectedRange.value = 100;
        common.displayPrize.value = [];
    };

    const creditBetAdd = (bet: any[]): void => {
        bet.forEach(item => creditBetList.value.unshift(item));
    };

    const creditBetItemBuild = (): any[] => {
        const betItems: any[] = [];
        for (const [layoutType, balls] of Object.entries(creditSelectedBalls.value)) {
            balls.forEach((ball: any) => {
                betItems.push({
                    methodTitle: ball.methodTitle,
                    methodSign: ball.methodSign,
                    balls: [{ value: ball.value, title: ball.title }],
                    unit: 1,
                    times: 1,
                    amount: ball.amount,
                    prize: ball.prize,
                    count: 1,
                    currency: common.currency.value,
                    mode: 'credit',
                    confirmed: true
                });
            });
        }
        console.log('当前所选', betItems);
        return betItems;
    };

    const creditBetSubmit = async (): Promise<void> => {
        const codeSet = creditBetList.value.map((item: any) => ({
            method_sign: item.methodSign,
            code: item.balls.map((ball: any) => ball.value).join(','),
            times: item.amount || 1,
            unit: 1,
            mode: common.mode.value,
            count: item.count,
        }));
        const traceIssues = common.preIssueList.value || [];
        const betData = {
            lottery_sign: common.sign.value,
            issue_no: common.issueCurrent.value.issue_no,
            currency: common.currency.value,
            code_set: codeSet,
            trace: traceIssues.length > 0 ? { type: 'win_stop', issue_ids: traceIssues } : null
        };

        try {
            const data: RespLotteryBet = await lotteryService.postLotteryBet(betData);
            if (data) {
                ElMessage({ message: "投注成功", type: 'success' });
                creditBetList.value = [];
            }
            await useUserStore().fetchBalance();
            await common.fetchOrderList({ lottery_id: common.sign.value });
        } catch (error) {
            const err = error as AxiosError;
            console.error("投注异常：", err.message);
            await ElMessageBox.alert(err.message || '投注异常，请稍后重试', '错误', { confirmButtonText: '确定' });
        }
    };

    return {
        creditBetCount,
        creditSelectedBalls,
        creditBetList,
        creditBetCost,
        creditTotalAmount,
        creditDisplayMethodDesc,
        creditMethodStructure,
        creditCategoryCurrent,
        creditGroupCurrent,
        creditMethodCurrent,
        setCategoryCreditCurrent,
        setGroupCreditCurrent,
        setMethodCreditCurrent,
        creditBetAdd,
        creditBetItemBuild,
        creditBetSubmit,
    };
}