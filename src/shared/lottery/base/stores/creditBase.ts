import { computed, ref, ComputedRef } from 'vue';
import { ElMessageBox } from 'element-plus';
import { notify } from '@shared/notify';
import { useUserStore } from '@shared/stores/userStore';
import { AxiosError } from 'axios';
import {CmsGroup, CmsList, MethodDefineItem, CommonBase, CreditBase} from "@shared/types";
import * as lotteryService from "@shared/api/lotteryService";
import type { RespLotteryBet } from "@shared/api/lotteryService";
import i18n from '@shared/i18n';

export function useCreditBase(common: CommonBase): CreditBase {
    const creditBetCount = ref<number>(0);
    const creditSelectedBalls = ref<Record<string, any[]>>({});
    const creditBetList = ref<any[]>([]);

    // 组合数 C(n,k):连码/连肖连尾等「组合玩法」的注数。
    const combinations = (n: number, k: number): number => {
        if (k > n || k < 0) return 0;
        if (k === 0 || k === n) return 1;
        k = Math.min(k, n - k);
        let r = 1;
        for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
        return Math.round(r);
    };

    const creditBetCost: ComputedRef<number> = computed(() => {
        let total = 0;
        for (const balls of Object.values(creditSelectedBalls.value)) {
            if (!balls.length) continue;
            const first = balls[0];
            if (first.combo) {
                // 组合玩法:一个统一金额 × 组合数(C(选中数, 组合大小))。
                total += (first.amount || 0) * combinations(balls.length, first.combo.groupSize);
            } else {
                total += balls.reduce((sum, b) => sum + (b.amount || 0), 0);
            }
        }
        return total;
    });

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
        const currentCategory = creditMethodStructure.value[category];
        if (!currentCategory || !currentCategory.groups) return;
        const firstGroupKey = Object.keys(currentCategory.groups)[0];
        if (firstGroupKey) {
            setGroupCreditCurrent(currentCategory.groups[firstGroupKey]);
        }
    };

    const setGroupCreditCurrent = (group: CmsGroup): void => {
        if (creditGroupCurrent.value.sign !== group.sign) {
            creditGroupCurrent.value = group;
            // updateCreditMethod 已把新旧两种结构都合并进 group.methods,首个玩法直接取它。
            const firstMethod = group.methods ? Object.values(group.methods)[0] : undefined;
            if (firstMethod) {
                setMethodCreditCurrent(firstMethod);
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
        for (const balls of Object.values(creditSelectedBalls.value)) {
            if (!balls.length) continue;
            const first = balls[0];
            if (first.combo) {
                // 组合玩法:所有选中码合成「一注多组合」——code=全部选中,count=C(n,k),金额统一。
                const cnt = combinations(balls.length, first.combo.groupSize);
                if (cnt <= 0) continue;
                betItems.push({
                    methodTitle: first.methodTitle,
                    methodSign: first.methodSign,
                    balls: balls.map((b: any) => ({ value: b.value, title: b.title })),
                    unit: 1,
                    times: 1,
                    amount: first.amount,
                    prize: first.prize,
                    count: cnt,
                    currency: common.currency.value,
                    mode: 'credit',
                    confirmed: true
                });
            } else {
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
        }
        return betItems;
    };

    const creditBetSubmit = async (): Promise<void> => {
        const projects = creditBetList.value.map((item: any) => ({
            method_sign: item.methodSign,
            code: item.balls.map((ball: any) => ball.value).join(','),
            // 展示码:与 code 结构对齐,取 title(标签类玩法显示 龙/虎/大/小 等)
            code_display: item.balls.map((ball: any) => i18n.global.t(ball.title)).join(','),
            // 信用盘:每注金额直接作为单价(unit),count 为注数/组合数;倍数已下线恒 1。
            // 与官方盘统一为 cost = unit × count(官方盘 unit=单价,信用盘 unit=每注金额)。
            unit: item.amount || 1,
            times: 1,
            mode: common.mode.value,
            count: item.count,
        }));
        const traceIssues = common.preIssueList.value || [];
        const betData = {
            lottery_sign: common.sign.value,
            issue_no: common.issueCurrent.value.issue_no,
            currency: common.currency.value,
            projects: projects,
            trace: traceIssues.length > 0 ? { type: 'win_stop', issue_ids: traceIssues } : null
        };

        try {
            const data: RespLotteryBet = await lotteryService.postLotteryBet(betData);
            if (data) {
                notify.success("投注成功");
                creditBetList.value = [];
            }
            await useUserStore().fetchBalance();
            await common.fetchOrderList({ lottery_sign: common.sign.value });
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