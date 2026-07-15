import type { IssueItem } from '@lottery/base/types/issue';

export type BallKey = string | number;

/**
 * issue → 本期命中的 key 列表(该期满足哪些统计项)。
 * 返回 null/undefined/[] 表示本期跳过(无效开奖等)。
 * 这是唯一因彩种/玩法而异的部分,各调用点自行提供。
 */
export type MatchFn = (issue: IssueItem) => BallKey[] | null | undefined;

/**
 * 热/冷计数:最近 issueCount 期内,统计每个 key 被命中的次数。
 * keys 决定要跟踪的统计项;matchFn 决定每期命中哪些 key。
 */
export function computeHotCold(
    history: IssueItem[],
    issueCount: number,
    keys: BallKey[],
    matchFn: MatchFn,
): Record<BallKey, number> {
    const hotCold: Record<BallKey, number> = {};
    keys.forEach(k => { hotCold[k] = 0; });

    history.slice(0, issueCount).forEach(issue => {
        const hit = matchFn(issue);
        if (!hit) return;
        hit.forEach(k => { if (k in hotCold) hotCold[k] += 1; });
    });

    return hotCold;
}

/**
 * 遗漏:每个 key 距最近一次命中过了多少期(0 = 最近一期)。
 * notFound 为「至今未命中」的初始哨兵;收尾时仍为 notFound 的 key 填成 finalize。
 * 多数玩法:notFound=-1、finalize=history.length(默认)。
 * 波色等固定表:notFound=finalize=100(初始与收尾同值)。
 * 通过这两个参数完全复刻各调用点的原有语义。
 */
export function computeOmission(
    history: IssueItem[],
    keys: BallKey[],
    matchFn: MatchFn,
    opts: { notFound?: number; finalize?: number } = {},
): Record<BallKey, number> {
    const notFound = opts.notFound ?? -1;
    const omission: Record<BallKey, number> = {};
    keys.forEach(k => { omission[k] = notFound; });

    for (let i = 0; i < history.length; i++) {
        const hit = matchFn(history[i]);
        if (hit) hit.forEach(k => { if (omission[k] === notFound) omission[k] = i; });
        if (!Object.values(omission).includes(notFound)) break;
    }

    const finalize = opts.finalize ?? history.length;
    for (const k in omission) if (omission[k] === notFound) omission[k] = finalize;

    return omission;
}
