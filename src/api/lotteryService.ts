import api from "@/api/index";
import { IssueItem, MethodServerList, ReqBetHistory, RespBetHistory } from "@/types";

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
export interface RespLotteryConfig {
    type: string;
    sign: string;
    name: string;
    avatar: string;
    remark: string;
    pre_bet_count: number;
    methods: MethodServerList;
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
    return {
        lottery_id: String(raw.lottery_id ?? raw.lottery_sign ?? ''),
        issue_no: String(raw.issue_no ?? ''),
        open_code: (raw.open_code ?? raw.code ?? '') as string,
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
        const data = await api.get<RawLotteryConfigData>(
            '/lottery/config',
            { params: { lottery_id: sign } },
        );
        const lottery: RawLottery = (data?.lottery ?? {}) as RawLottery;
        return {
            type: lottery.type ?? '',
            sign: lottery.sign ?? sign,
            name: lottery.name ?? '',
            avatar: lottery.avatar ?? '',
            remark: lottery.remark ?? '',
            pre_bet_count: Number(lottery.pre_bet_count ?? 0),
            methods: normalizeMethods(data?.methods),
        };
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch lottery config');
    }
};

export const fetchIssueCurrent = async (sign: string): Promise<IssueItem> => {
    try {
        // 后端路由：/lottery/issue（不是 /lottery/issueCurrent）
        // 返回 { current_issue, next_issues }
        const data = await api.get<RawIssueCurrentData>(
            '/lottery/issue',
            { params: { lottery_id: sign } },
        );
        return normalizeIssue(data?.current_issue);
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch Issue Current');
    }
};

export const fetchIssueLast = async (sign: string): Promise<IssueItem> => {
    try {
        const data = await api.get<RawIssue>(
            '/lottery/issueLast',
            { params: { lottery_id: sign } },
        );
        return normalizeIssue(data);
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch Issue Last');
    }
};

export const fetchIssueHistory = async (sign: string): Promise<IssueItem[]> => {
    try {
        // 后端路由：/lottery/history（不是 /lottery/issueHistory）
        // 返回 { items, pagination }
        const data = await api.get<RawHistoryData>(
            '/lottery/history',
            { params: { lottery_id: sign } },
        );
        const items: RawIssue[] = Array.isArray(data?.items) ? data!.items : [];
        return items.map(normalizeIssue);
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to fetch Issue History');
    }
};

/**
 * 注意：后端目前还没实现 /lottery/bet，调用会 404。
 * 等后端补好之前，这个函数本身不会再因为 {data} 解构而崩，
 * 仅会把后端的错误信息抛出来。
 */
export const postLotteryBet = async (postData: object): Promise<RespLotteryBet> => {
    try {
        return await api.post<RespLotteryBet>('/lottery/bet', postData);
    } catch (error: any) {
        throw new Error(error?.message || 'Failed to post lottery bet');
    }
};

/**
 * 同样，/lottery/bet/history 后端还没实现，
 * 这里至少保证不会因为 {data} 解构出 undefined。
 */
export const fetchOrderList = async (postData: ReqBetHistory): Promise<RespBetHistory> => {
    try {
        const data = await api.get<RespBetHistory | { items: any[]; pagination?: any }>(
            '/lottery/bet/history',
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