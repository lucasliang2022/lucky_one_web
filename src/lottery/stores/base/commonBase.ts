import { computed, ref, shallowRef, ComputedRef } from 'vue';
import { CommonBase, MethodServerList, IssueItem, IssueCodeArr, ReqBetHistory, RespBetHistoryItem} from "@/types";
import * as lotteryService from "@/api/lotteryService";

export function useCommonBase(): CommonBase {
    const type = ref<string>('ssc');
    const mode = ref<string>('official');
    const name = ref<string>('');
    const sign = ref<string>('');
    const remark = ref<string>('');
    const avatar = ref<string>('');
    const preBetCount = ref<number>(50);
    const reset = ref<boolean>(false);

    const price = ref<number>(1);
    const times = ref<number>(1);
    const currency = ref<string>('cny');
    const amount = ref<number>(1);
    const preIssueList = ref<any[]>([]);
    const displayPrize = ref<any[]>([]);
    const selectedPositions = ref<any[]>([]);

    const methodServerList = ref<MethodServerList>(<MethodServerList>{
        official: {},
        credit: {},
    });

    const issueCurrent = shallowRef<IssueItem>(<IssueItem>{});
    const issueNext = shallowRef<IssueItem>(<IssueItem>{});
    const issueLast = ref<IssueItem>(<IssueItem>{});
    const issueHistory = shallowRef<IssueItem[]>([]);
    const issueLastCodeArr: ComputedRef<IssueCodeArr[]> = computed(() => {
        if (!issueLast.value.open_code) return [];
        return issueLast.value.open_code.split(",").map(num => ({ number: num.trim() }));
    });

    const orderList = ref<RespBetHistoryItem[]>([]);
    const orderTotal = ref<number>(0);
    const orderListLoading = ref<boolean>(true);
    const orderListError = ref<string>('');

    const methodLayoutRef = ref<any>(null);
    const showColdHot = ref<boolean>(false);
    const showOmission = ref<boolean>(false);
    const selectedRange = ref<number>(100);
    const isDescShow = ref<boolean>(false);

    const setSignCurrent = (val: string): void => {
        if (sign.value !== val) {
            handleLotteryInit();
        }
        sign.value = val;
    };

    const handleLotteryInit = (): void => {
        issueLast.value = {} as IssueItem;
        issueCurrent.value = {} as IssueItem;
        issueNext.value = {} as IssueItem;
        issueHistory.value = [];
    };

    const setModeCurrent = (val: string): void => {
        mode.value = val;
    };

    const setPrice = (newPrice: number): void => {
        price.value = newPrice;
    };

    const setTimes = (newTimes: number): void => {
        times.value = newTimes;
    };

    const setAmount = (newAmount: number): void => {
        amount.value = newAmount;
    };

    const setCurrency = (newCurrency: string): void => {
        currency.value = newCurrency;
    };

    const setDisplayPrize = (levels: any[]): void => {
        displayPrize.value = levels;
    };

    const setIssueCurrent = (issue: IssueItem): void => {
        issueCurrent.value = issue;
    };

    const setIssueLast = (issue: IssueItem): void => {
        issueLast.value = issue;
    };

    const setIssueHistory = (history: IssueItem[]): void => {
        issueHistory.value = history;
    };

    const setMethodLayoutRef = (val: any): void => {
        if (methodLayoutRef.value !== val) methodLayoutRef.value = val;
    };

    const toggleColdHot = (): void => {
        showColdHot.value = !showColdHot.value;
    };

    const toggleOmission = (): void => {
        showOmission.value = !showOmission.value;
    };

    const toggleDesc = (): void => {
        isDescShow.value = !isDescShow.value;
    };

    const setSelectedRange = (val: number): void => {
        selectedRange.value = val;
    };

    const callOmission = (status: boolean): void => {
        methodLayoutRef.value?.calculateOmission?.(status);
    };

    const callColdAndHot = (issueCount: number, status: boolean): void => {
        methodLayoutRef.value?.calculateHotCold?.(issueCount, status);
    };

    const fetchIssueCurrent = async (initBetHistory: boolean): Promise<void> => {
        try {
            const issue = await lotteryService.fetchIssueCurrent(sign.value);
            issueCurrent.value = issue || {};
            if (initBetHistory) {
                await fetchOrderList({ issue_no: issueCurrent.value.issue_no, lottery_id: sign.value });
            }
        } catch (error) {
            throw error
        }
    };

    const fetchIssueLast = async (): Promise<void> => {
        try {
            const issue = await lotteryService.fetchIssueLast(sign.value);
            const issueLastNew = {
                lottery_id: issue.lottery_id || issueLast.value.lottery_id,
                issue_no: issue.issue_no || issueLast.value.issue_no,
                open_code: issue.open_code || issueLast.value.open_code,
            }
            setIssueLast(issueLastNew);

            if (issue.open_code && issue.open_code.length > 0) {
                await fetchIssueHistory();
            }
        } catch (error) {
            throw error
        }
    };

    const fetchIssueHistory = async (): Promise<void> => {
        try {
            const data = await lotteryService.fetchIssueHistory(sign.value);
            issueHistory.value = data as IssueItem[] || [];
        } catch (error) {
            throw error
        }
    };

    const fetchLotteryConfig = async (): Promise<void> => {
        try {
            const data = await lotteryService.getLotteryConfig(sign.value);
            type.value = data.type || type.value;
            name.value = data.name || name.value;
            sign.value = data.sign || sign.value;
            remark.value = data.remark || remark.value;
            preBetCount.value = data.pre_bet_count || preBetCount.value;
            methodServerList.value = data.methods || methodServerList.value;
        } catch (error) {
            throw error
        }
    };

    const fetchOrderList = async (data: ReqBetHistory): Promise<void> => {
        orderListLoading.value = true;
        orderListError.value = '';
        try {
            const { total, list } = await lotteryService.fetchOrderList(data);
            orderList.value = list;
            orderTotal.value = total
        } catch (err) {
            const error = err as Error;
            orderListError.value = error.message || '获取订单失败';
            console.error('获取订单失败:', err);
        } finally {
            orderListLoading.value = false;
        }
    };

    return {
        type,
        mode,
        name,
        sign,
        remark,
        avatar,
        preBetCount,
        reset,
        price,
        times,
        currency,
        amount,
        preIssueList,
        displayPrize,
        selectedPositions,
        methodServerList,
        issueCurrent,
        issueNext,
        issueLast,
        issueHistory,
        issueLastCodeArr,
        orderList,
        orderTotal,
        orderListLoading,
        orderListError,
        methodLayoutRef,
        showColdHot,
        showOmission,
        isDescShow,
        selectedRange,
        setSignCurrent,
        handleLotteryInit,
        setModeCurrent,
        setPrice,
        setTimes,
        setAmount,
        setCurrency,
        setDisplayPrize,
        setIssueCurrent,
        setIssueLast,
        setIssueHistory,
        fetchIssueCurrent,
        fetchIssueLast,
        fetchIssueHistory,
        fetchLotteryConfig,
        fetchOrderList,
        setMethodLayoutRef,
        toggleColdHot,
        toggleOmission,
        toggleDesc,
        setSelectedRange,
        callOmission,
        callColdAndHot
    };
}