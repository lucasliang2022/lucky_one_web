import api from "@shared/api/index";
import { IssueItem, MethodServerList, ReqBetHistory, RespBetHistory, UnitPriceConfig } from "@shared/types";

/* =========================================================
 *  后端原始响应类型（仅本文件内部用）
 * ========================================================= */
interface RawLottery {
    type: string;
    sign: string;
    name: string;
    avatar?: string;
    remark?: string;
    pre_bet_count?: number;

    [k: string]: any;
}

interface RawLotteryConfigData {
    lottery: RawLottery;
    methods: {
        official?: Array<{ sign: string; levels: any; [k: string]: any }>;
        credit?: Array<{ sign: string; levels: any; [k: string]: any }>;
    };
    // 后端下发的「玩法结构树」:分类→分组→玩法,标题已翻译,赔率/档位内联(见 ServerStructure)。
    structure?: { official?: ServerStructCategory[]; credit?: ServerStructCategory[] };
    // 单注钱档位改为「按币种的 map」:{ "<currency>": [{value,label}], ... }
    unit_modes?: Record<string, Array<{ value: number | string; label?: string }>>;
    current_issue?: RawIssue | null;
    last_issue?: RawIssue | null;
}

interface RawIssue {
    lottery_sign?: string;
    lottery_id?: string;
    issue_no?: string | number;
    code?: string | null;
    open_code?: string | null;
    sale_start_time?: number | string | null;
    sale_end_time?: number | string | null;
    lock_time?: number | string | null;
    status?: number | null;

    [k: string]: any;
}

interface RawIssueCurrentData {
    current_issue: RawIssue | null;
    next_issues?: RawIssue[];
}

interface RawHistoryData {
    items: RawIssue[];
    pagination?: { page: number; page_size: number; total: number };
}

/* =========================================================
 *  前端对外类型
 * ========================================================= */
/** 后端结构树里的单个玩法节点(赔率内联;leaf 用于匹配前端 define)。仅官方盘下发。 */
export interface ServerStructMethod {
    sign: string;   // 后端复合唯一 sign(mode_dir1_dir2_leaf),下注即用它
    leaf: string;   // 末段类名,匹配本地 define(layout/calc)
    title: string;  // 已翻译标题
    name?: string;
    odds?: any;
    levels?: Record<string, number | string> | any;   // 每档赔率(bind)
    sort?: number;
    [k: string]: any;
}
export interface ServerStructGroup {
    sign: string;
    title: string;
    methods: ServerStructMethod[];
}
export interface ServerStructCategory {
    sign: string;
    title: string;
    groups: ServerStructGroup[];
}
export interface ServerStructure {
    official: ServerStructCategory[];
    credit: ServerStructCategory[];
}

export interface RespLotteryConfig {
    type: string;
    sign: string;
    name: string;
    avatar: string;
    remark: string;
    pre_bet_count: number;
    methods: MethodServerList;
    // 后端玩法结构树(标题已翻译);前端优先用它渲染,缺失时回落旧硬编码结构。
    structure: ServerStructure;
    // 按币种的单价配置 map:键为币种(小写,与 currency 值一致),值为 {min,max,options}。
    unit_modes: Record<string, UnitPriceConfig>;
}

export interface RespLotteryBet {
    balance: number;
    total_bet_amount: number;
    total_bet_count: number;
}

/* =========================================================
 *  响应体归一化（后端字段 → 前端字段）
 * ========================================================= */
const toNum = (v: unknown): number | undefined => {
    if (v === null || v === undefined || v === '') return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
};

const normalizeIssue = (raw: RawIssue | null | undefined): IssueItem => {
    if (!raw || typeof raw !== 'object') return {} as IssueItem;
    const openCode = (raw.open_code ?? raw.code ?? '') as string;
    return {
        lottery_id: String(raw.lottery_id ?? raw.lottery_sign ?? ''),
        issue_no: String(raw.issue_no ?? ''),
        open_code: openCode,
        // 镜像到 code:pk10/lhc/部分 ssc 组件的冷热/遗漏逻辑读 issue.code,归一化后原本丢了该字段(冷热统计一直失效)
        code: openCode,
        sale_start_time: toNum(raw.sale_start_time),
        sale_end_time: toNum(raw.sale_end_time),
        lock_time: toNum(raw.lock_time),
        // 开奖/投注时间(走势图、历史列表用):历史接口给 lottery_time(=input_time),兜底其它时间字段。
        time: toNum(raw.time ?? raw.lottery_time ?? raw.input_time ?? raw.decide_done_time ?? raw.bet_time),
        status: raw.status ?? undefined,
    } as IssueItem;
};

/**
 * 后端 methods 是 [{sign, levels, ...}, ...]，
 * 但 lotteryBase._updateMethodPrize 是以 sign 当 key 查找的，
 * 所以这里转成 Record<sign, item>。
 * 类型 cast 保持 MethodServerList 不变（运行时是对象，TS 类型放宽到 any 再 cast）。
 */
const normalizeMethods = (raw: RawLotteryConfigData['methods'] | undefined): MethodServerList => {
    const toMap = (arr: Array<{ sign: string;[k: string]: any }> | undefined) => {
        const out: Record<string, any> = {};
        (Array.isArray(arr) ? arr : []).forEach((item) => {
            const key = item?.sign;
            if (key) out[String(key)] = item;
        });
        return out;
    };
    return {
        official: toMap(raw?.official) as any,
        credit: toMap(raw?.credit) as any,
    } as MethodServerList;
};

// 后端 config.unit_modes(按币种 map)→ 前端单价配置 {min,max,options}。
// 键统一小写(和 currency 值一致);逐币种校正:min>0、max>=min、options 过滤非法(NaN/<=0)。
const normalizeUnitModes = (
    raw: RawLotteryConfigData['unit_modes'] | undefined,
): Record<string, UnitPriceConfig> => {
    const out: Record<string, UnitPriceConfig> = {};
    if (!raw || typeof raw !== 'object') return out;
    Object.entries(raw).forEach(([currency, cfg]) => {
        const key = String(currency).toLowerCase();
        const c = (cfg ?? {}) as Partial<UnitPriceConfig>;
        let min = Number(c.min);
        let max = Number(c.max);
        if (!Number.isFinite(min) || min <= 0) min = 1;
        if (!Number.isFinite(max) || max < min) max = Math.max(min, 100000);
        const options = (Array.isArray(c.options) ? c.options : [])
            .map((v) => Number(v))
            .filter((v) => Number.isFinite(v) && v > 0);
        out[key] = { min, max, options: options.length > 0 ? options : [1, 2, 5, 10, 50, 100] };
    });
    return out;
};

/* =========================================================
 *  接口
 *
 *  说明：api.get / api.post 已经在 src/api/index.ts 里
 *  把 {code,msg,data} 拆掉、返回里层 data 了，
 *  所以这里**绝对不能**再 `const {data} = await api.get(...)`，
 *  而是直接拿到 T。
 * ========================================================= */

export const getLotteryConfig = async (sign: string): Promise<RespLotteryConfig> => {
    try {
        const data = await api.get<RawLotteryConfigData>(`/lottery/${sign}/config`);
        const lottery: RawLottery = (data?.lottery ?? {}) as RawLottery;
        return {
            type: lottery.type ?? '',
            sign: lottery.sign ?? sign,
            name: lottery.name ?? '',
            avatar: lottery.avatar ?? '',
            remark: lottery.remark ?? '',
            pre_bet_count: Number(lottery.pre_bet_count ?? 0),
            methods: normalizeMethods(data?.methods),
            structure: {
                official: Array.isArray(data?.structure?.official) ? data!.structure!.official! : [],
                credit: Array.isArray(data?.structure?.credit) ? data!.structure!.credit! : [],
            },
            unit_modes: normalizeUnitModes(data?.unit_modes),
        };
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch lottery config');
    }
};

export const fetchIssueCurrent = async (sign: string): Promise<IssueItem> => {
    try {
        // GET /lottery/{sign}/issue/current → { current_issue, next_issues }
        const data = await api.get<RawIssueCurrentData>(`/lottery/${sign}/issue/current`);
        return normalizeIssue(data?.current_issue);
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch Issue Current');
    }
};

/**
 * 当前期 + 下一期一次拉齐(同一接口返回体已带 next_issues)。
 * 用于「无缝滚期」:封盘瞬间先本地切到预取的下一期,再后台刷新,避免等网络的空档。
 */
export const fetchIssueCurrentAndNext = async (
    sign: string,
): Promise<{ current: IssueItem; next: IssueItem }> => {
    try {
        const data = await api.get<RawIssueCurrentData>(`/lottery/${sign}/issue/current`);
        return {
            current: normalizeIssue(data?.current_issue),
            next: normalizeIssue(Array.isArray(data?.next_issues) ? data!.next_issues[0] : null),
        };
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch Issue Current');
    }
};

/**
 * 追号用:同一 /lottery/issue 接口返回体里带 next_issues(未开奖的后续期),
 * 归一化后返回给追号面板选择。fetchIssueCurrent 只取 current_issue,故这里单独取 next_issues。
 */
export const fetchNextIssues = async (sign: string): Promise<IssueItem[]> => {
    try {
        const data = await api.get<RawIssueCurrentData>(`/lottery/${sign}/issue/current`);
        const items: RawIssue[] = Array.isArray(data?.next_issues) ? data!.next_issues : [];
        return items.map(normalizeIssue);
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch next issues');
    }
};

export const fetchIssueLast = async (sign: string): Promise<IssueItem> => {
    try {
        const data = await api.get<RawIssue>(`/lottery/${sign}/issue/last`);
        return normalizeIssue(data);
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch Issue Last');
    }
};

export const fetchIssueHistory = async (sign: string): Promise<IssueItem[]> => {
    try {
        // GET /lottery/{sign}/issue/history → { items, pagination };走势图需要较多期,取 60 期。
        const data = await api.get<RawHistoryData>(`/lottery/${sign}/issue/history`, { params: { page_size: 60 } });
        const items: RawIssue[] = Array.isArray(data?.items) ? data!.items : [];
        return items.map(normalizeIssue);
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch Issue History');
    }
};

/** 下注 POST /lottery/{sign}/bet。 */
export const postLotteryBet = async (postData: object): Promise<RespLotteryBet> => {
    try {
        // lottery_sign 走路由参数 /lottery/{sign}/bet;body 仍带全量投注数据。
        const sign = (postData as { lottery_sign?: string }).lottery_sign ?? '';
        return await api.post<RespLotteryBet>(`/lottery/${sign}/bet`, postData);
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to post lottery bet');
    }
};

/** 投注记录 GET /lottery/{sign}/order/list(兼容 {total,list} 或 {items,pagination} 两种返回)。 */
export const fetchOrderList = async (postData: ReqBetHistory): Promise<RespBetHistory> => {
    try {
        // lottery_sign 走路由参数;issue_no/page/page_size 仍走 query。
        const p = postData as { lottery_sign?: string; lottery_id?: string };
        const sign = p.lottery_sign ?? p.lottery_id ?? '';
        const data = await api.get<RespBetHistory | { items: any[]; pagination?: any }>(
            `/lottery/${sign}/order/list`,
            { params: postData },
        );
        // 兼容两种返回形态：{total,list} 或 {items,pagination}
        const anyData = data as any;
        if (anyData && Array.isArray(anyData.list)) {
            return { total: Number(anyData.total ?? anyData.list.length), list: anyData.list };
        }
        if (anyData && Array.isArray(anyData.items)) {
            return {
                total: Number(anyData.pagination?.total ?? anyData.items.length),
                list: anyData.items,
            };
        }
        return { total: 0, list: [] };
    } catch (error: any) {
        throw error;
    }
};

/**
 * 彩票记录(跨彩种,用户维度):GET /lottery/order/list。
 * lottery_sign 可选(不传 = 全部游戏);后端按用户 + 近一个月返回,分页。
 */
export const fetchBetRecords = async (params: {
    lottery_sign?: string;
    range?: 'today' | 'week' | 'month' | 'year';
    page?: number;
    page_size?: number;
}): Promise<RespBetHistory> => {
    const data = await api.get<RespBetHistory | { items: any[]; pagination?: any }>(
        `/lottery/order/list`,
        { params },
    );
    const anyData = data as any;
    if (anyData && Array.isArray(anyData.list)) {
        return { total: Number(anyData.total ?? anyData.list.length), list: anyData.list };
    }
    if (anyData && Array.isArray(anyData.items)) {
        return { total: Number(anyData.pagination?.total ?? anyData.items.length), list: anyData.items };
    }
    return { total: 0, list: [] };
};

/** 撤单 POST /lottery/order/cancel(仅未开奖、未封盘的本人订单可撤;成功退还投注额)。 */
export const cancelBetOrder = async (orderId: number | string): Promise<{ id: number; status: number; refund: number }> => {
    return await api.post(`/lottery/order/cancel`, { order_id: orderId });
};