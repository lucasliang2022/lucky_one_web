import { computed, ref, ComputedRef } from 'vue';
import { formatPrize } from '@/utils/common';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import * as lotteryService from "@/api/lotteryService";
import {
    CartItem,
    OrderIssueInfo,
    MethodDefineItem,
    OfficialBase,
    OmsGroup,
    OmsList,
    OrderData,
    OrderProject,
    RespLotteryBet
} from '@/types';
import { CommonBase } from '@lottery/types/store';

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

        officialGroupCurrent.value = firstGroupToSet;

        if (firstMethodToSet) {
            setMethodOfficialCurrent(firstMethodToSet);
        } else {
            officialMethodCurrent.value = null;
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
            methodTitle: officialMethodCurrent.value.title,
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
        // projects
        const projects: OrderProject[] = officialBetList.value.map((item: any) => ({
            method_id: item.methodSdkSign,
            codes: item.codes,
            times: item.times || 1,
            price: item.price,
            num: item.count,

        }));

        // issue
        const IssueNo = common.issueCurrent.value.issue_no;
        const issueData: OrderIssueInfo = IssueNo ? {[IssueNo]: 1} : {};

        // bet data
        const betData: OrderData = {
            lottery_id: common.sign.value,
            currency: common.currency.value,
            projects: projects,
            mode: common.mode.value,
            issues: issueData
        };

        const data: RespLotteryBet = await lotteryService.postLotteryBet(betData);
        if (data) {
            ElMessage({ message: "投注成功", type: 'success' });
            officialBetList.value = [];

            await useUserStore().fetchBalance();
            await lotteryService.fetchOrderList({lottery_id: common.sign.value});
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
            methodTitle: officialMethodCurrent.value.title,
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
        const unitSeparator = officialMethodCurrent.value.layout.unit_separator ?? "&";
        const codes = randomBetData
            .map(group => group.map(ball => ball.value).join(unitSeparator))
            .join(rowSeparator[0]);

        const codesDisplay = randomBetData
            .map(group => group.map(ball => ball.title).join(unitSeparator))
            .join(rowSeparator[0]);

        console.log(codesDisplay);

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