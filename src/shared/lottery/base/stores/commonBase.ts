import { computed, ref, shallowRef, watch, ComputedRef } from 'vue';
import { CommonBase, MethodServerList, IssueItem, IssueCodeArr, ReqBetHistory, RespBetHistoryItem, UnitPriceConfig} from "@shared/types";
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

    // 单价(每注下多少钱):可自由输入,clamp 到 [unitMin, unitMax]。默认 1。
    const price = ref<number>(1);
    // 单价配置:后端 config 下发「按币种的 map」(currency → {min,max,options});兜底默认区间+六快捷。
    const DEFAULT_UNIT_CFG: UnitPriceConfig = { min: 1, max: 100000, options: [1, 2, 5, 10, 50, 100] };
    const unitConfigByCurrency = ref<Record<string, UnitPriceConfig>>({});
    // 倍数已下线,恒为 1(成本/派彩公式仍乘 times,值恒 1 不影响)。
    const times = ref<number>(1);
    const currency = ref<string>('cny');
    // 当前币种的单价配置;缺省回落默认。
    const unitConfigCurrent = computed<UnitPriceConfig>(() => {
        const key = (currency.value || '').toLowerCase();
        return unitConfigByCurrency.value[key] ?? DEFAULT_UNIT_CFG;
    });
    const unitMin = computed<number>(() => unitConfigCurrent.value.min);
    const unitMax = computed<number>(() => unitConfigCurrent.value.max);
    const unitOptions = computed<number[]>(() => unitConfigCurrent.value.options);
    const amount = ref<number>(1);
    // 当前单价 clamp 到 [min,max];越界回落到 min。
    const clampPrice = (): void => {
        const { min, max } = unitConfigCurrent.value;
        if (!(price.value >= min && price.value <= max)) {
            price.value = min;
        }
    };
    // 切币种后:按新币种区间校正单价。
    watch(currency, clampPrice);
    const preIssueList = ref<any[]>([]);
    const displayPrize = ref<any[]>([]);
    // 进入/切换彩种时,配置与玩法结构拉取完成前为 true,页面据此显示 loading。
    const loading = ref<boolean>(true);
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

    // 无缝滚期:封盘瞬间直接切到预取的下一期(零网络延迟);随后 fetchIssueCurrent 后台刷新。
    // 返回是否切换成功(下一期存在且封盘时间在未来)。
    const rollToNextIssue = (): boolean => {
        const nx = issueNext.value;
        if (nx?.sale_end_time && nx.sale_end_time * 1000 > Date.now()
            && nx.issue_no && nx.issue_no !== issueCurrent.value?.issue_no) {
            issueCurrent.value = nx;
            issueNext.value = {} as IssueItem; // 已消费,待后台刷新补上下一期
            return true;
        }
        return false;
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
            const { current, next } = await lotteryService.fetchIssueCurrentAndNext(sign.value);
            // 防回退:封盘瞬间已本地滚到下一期时,服务端可能还没滚 —— 不要用旧的当前期把它盖回去。
            const cur = issueCurrent.value;
            if (current?.sale_end_time
                ? (!cur?.sale_end_time || current.sale_end_time >= cur.sale_end_time)
                : !cur?.sale_end_time) {
                issueCurrent.value = current || ({} as IssueItem);
            }
            issueNext.value = next || ({} as IssueItem);
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
            // 单价 config 驱动:后端下发「按币种的 map」{min,max,options};clamp 校正当前单价。
            unitConfigByCurrency.value = data.unit_modes ?? {};
            clampPrice();
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
        unitMin,
        unitMax,
        unitOptions,
        times,
        currency,
        amount,
        preIssueList,
        displayPrize,
        selectedPositions,
        loading,
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
        rollToNextIssue,
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