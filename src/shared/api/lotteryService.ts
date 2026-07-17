import api from "@shared/api/index";
import { IssueItem, MethodServerList, ReqBetHistory, RespBetHistory, UnitMode } from "@shared/types";

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
    // 按币种的档位 map:键为币种(小写,与 currency 值一致),值为该币种档位列表。
    unit_modes: Record<string, UnitMode[]>;
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

// 后端 config.unit_modes(按币种 map)→ 前端档位选择器数据。
// 遍历每个币种的数组归一化:value 转 number、过滤非法(NaN/<=0);
// 键统一小写(和 currency 值一致);空/坏 → {}。
const normalizeUnitModes = (
    raw: RawLotteryConfigData['unit_modes'] | undefined,
): Record<string, UnitMode[]> => {
    const out: Record<string, UnitMode[]> = {};
    if (!raw || typeof raw !== 'object') return out;
    Object.entries(raw).forEach(([currency, list]) => {
        const key = String(currency).toLowerCase();
        const modes: UnitMode[] = [];
        (Array.isArray(list) ? list : []).forEach((item) => {
            const value = Number(item?.value);
            if (!Number.isFinite(value) || value <= 0) return;
            modes.push({ value, label: item?.label != null ? String(item.label) : undefined });
        });
        if (modes.length > 0) out[key] = modes;
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
        // GET /lottery/{sign}/issue/history → { items, pagination }
        const data = await api.get<RawHistoryData>(`/lottery/${sign}/issue/history`);
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