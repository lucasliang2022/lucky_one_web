import { computed, ref, shallowRef, watch, ComputedRef } from 'vue';
import { CommonBase, MethodServerList, IssueItem, IssueCodeArr, ReqBetHistory, RespBetHistoryItem, UnitMode} from "@shared/types";
import * as lotteryService from "@shared/api/lotteryService";

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
    // 单注钱档位:后端 config 下发「按币种的 map」(currency → 档位[]);兜底仅「元」。
    const unitModesByCurrency = ref<Record<string, UnitMode[]>>({});
    const times = ref<number>(1);
    const currency = ref<string>('cny');
    // 对外的档位列表:跟随当前币种从 map 里取;缺省回落「元」。
    const unitModes = computed<UnitMode[]>(() => {
        const key = (currency.value || '').toLowerCase();
        const modes = unitModesByCurrency.value[key];
        return modes && modes.length > 0 ? modes : [{ value: 1 }];
    });
    const amount = ref<number>(1);
    // 切币种后:若当前 price 不在新币种档位集里,回落到「元」(1)。
    watch(currency, () => {
        if (!unitModes.value.some((m) => m.value === price.value)) {
            price.value = 1;
        }
    });
    const preIssueList = ref<any[]>([]);
    const displayPrize = ref<any[]>([]);
    const selectedPositions = ref<any[]>([]);

    const methodServerList = ref<MethodServerList>(<MethodServerList>{
        official: {},
        credit: {},
    });

    // 后端下发的玩法结构树(分类→分组→玩法,标题已翻译);initMethodStructure 优先消费它。
    const methodStructureServer = ref<{ official: any[]; credit: any[] }>({
        official: [],
        credit: [],
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
                // 不按当前期号过滤:ssc 等每分钟滚期,过滤当前期会让刚下的注很快"消失";
                // 显示玩家近期订单(当月),下注后一直可见。
                await fetchOrderList({ lottery_sign: sign.value });
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
            methodStructureServer.value = data.structure || methodStructureServer.value;
            // 档位选择器 config 驱动:后端下发「按币种的 map」,unitModes(computed)跟随当前币种取值。
            // 切彩种后若当前 price 不在(当前币种)新档位集里,重置为元(1)。
            unitModesByCurrency.value = data.unit_modes ?? {};
            if (!unitModes.value.some((m) => m.value === price.value)) {
                price.value = 1;
            }
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
        unitModes,
        times,
        currency,
        amount,
        preIssueList,
        displayPrize,
        selectedPositions,
        methodServerList,
        methodStructureServer,
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