import {ComputedRef, Ref, ShallowRef} from "vue";
import {
    CmsGroup,
    CmsList,
    MethodDefineItem,
    MethodLevel,
    MethodServerList,
    OmsGroup,
    OmsList,
    ReqBetHistory,
    RespBetHistoryItem,
    IssueCodeArr, IssueItem
} from "@shared/types";

export interface CommonBase {
    type: Ref<string>;
    mode: Ref<string>;
    name: Ref<string>;
    sign: Ref<string>;
    remark: Ref<string>;
    avatar: Ref<string>;
    preBetCount: Ref<number>;
    reset: Ref<boolean>;
    // 单价(每注下多少钱):可自由输入,clamp 到 [unitMin, unitMax];unitOptions 为快捷档位。
    price: Ref<number>;
    unitMin: ComputedRef<number>;
    unitMax: ComputedRef<number>;
    unitOptions: ComputedRef<number[]>;
    // 倍数已下线,恒为 1(保留以兼容成本/派彩公式)。
    times: Ref<number>;
    currency: Ref<string>;
    amount: Ref<number>;
    preIssueList: Ref<any[]>;
    loading: Ref<boolean>;
    displayPrize: Ref<MethodLevel[]>;
    selectedPositions: Ref<any[]>;
    methodServerList: Ref<MethodServerList>;
    // 后端下发的玩法结构树(分类→分组→玩法,标题已翻译);官方盘 initMethodStructure 优先消费。
    methodStructureServer: Ref<{ official: any[]; credit: any[] }>;
    issueCurrent: ShallowRef<IssueItem>;
    issueNext: ShallowRef<IssueItem>;
    issueLast: Ref<IssueItem>;
    issueHistory: ShallowRef<IssueItem[]>;
    issueLastCodeArr: ComputedRef<IssueCodeArr[]>;
    orderList: Ref<RespBetHistoryItem[]>;
    orderTotal: Ref<number>;
    orderListLoading: Ref<boolean>;
    orderListError: Ref<string>;
    methodLayoutRef: Ref<any>;
    showColdHot: Ref<boolean>;
    showOmission: Ref<boolean>;
    selectedRange: Ref<number>;
    isDescShow: Ref<boolean>;
    setSignCurrent: (val: string) => void;
    handleLotteryInit: () => void;
    setModeCurrent: (val: string) => void;
    setPrice: (newUnit: number) => void;
    setTimes: (newTimes: number) => void;
    setAmount: (newAmount: number) => void;
    setCurrency: (newCurrency: string) => void;
    setDisplayPrize: (levels: MethodLevel[]) => void;
    setIssueCurrent: (issue: IssueItem) => void;
    setIssueLast: (issue: IssueItem) => void;
    rollToNextIssue: () => boolean;
    setIssueHistory: (history: IssueItem[]) => void;
    fetchIssueCurrent: (initBetHistory: boolean) => void;
    fetchIssueLast: () => Promise<void>;
    fetchIssueHistory: () => Promise<void>;
    fetchLotteryConfig: () => Promise<void>;
    fetchOrderList: (data: ReqBetHistory) => Promise<void>;
    setMethodLayoutRef: (val: any) => void;
    toggleColdHot: () => void;
    toggleOmission: () => void;
    toggleDesc: () => void;
    setSelectedRange: (val: number) => void;
    callOmission: (status: boolean) => void;
    callColdAndHot: (issueCount: number, status: boolean) => void;
}

export interface CreditBase {
    creditBetCount: Ref<number>;
    creditSelectedBalls: Ref<Record<string, any[]>>;
    creditBetList: Ref<any[]>;
    creditBetCost: ComputedRef<number>;
    creditTotalAmount: ComputedRef<number>;
    creditDisplayMethodDesc: Ref<any[]>;
    creditMethodStructure: Ref<CmsList>;
    creditCategoryCurrent: Ref<string>;
    creditGroupCurrent: Ref<CmsGroup>;
    creditMethodCurrent: Ref<MethodDefineItem>;
    setCategoryCreditCurrent: (category: string) => void;
    setGroupCreditCurrent: (group: CmsGroup) => void;
    setMethodCreditCurrent: (val: MethodDefineItem | null) => void;
    creditBetAdd: (bet: any[]) => void;
    creditBetItemBuild: () => any[];
    creditBetSubmit: () => Promise<void>;
}

export interface OfficialBase {
    officialBetCount: Ref<number>;
    officialSelectedBalls: Ref<any[]>;
    officialBetList: Ref<any[]>;
    officialBetCost: ComputedRef<number>;
    officialTotalAmount: ComputedRef<number>;
    officialMethodStructure: Ref<OmsList>;
    officialCategoryCurrent: Ref<string>;
    officialGroupCurrent: Ref<OmsGroup | null>;
    officialMethodCurrent: Ref<MethodDefineItem | null>;
    setCategoryOfficialCurrent: (category: string) => void;
    setGroupOfficialCurrent: (val: OmsGroup | null) => void;
    setMethodOfficialCurrent: (method: MethodDefineItem | null) => void;
    officialBetAdd: (bet: any) => void;
    officialBetItemBuild: () => any;
    officialBetSubmit: () => Promise<void>;
    addRandomBet: () => void;
}

export interface LotteryBase extends CommonBase, CreditBase, OfficialBase {
    onStoreReset: () => void;
    onLotteryChange: (newSign: string) => Promise<void>;
    onModeChange: (mode: string) => Promise<void>;
    clearSelectedBalls: () => void;
    updateDisplayPrize: () => void;
}