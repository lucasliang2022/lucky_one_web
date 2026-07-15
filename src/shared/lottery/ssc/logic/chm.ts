import type { IssueItem, MethodRowNumber } from '@shared/types';
import { getNiuNiuTypes, getSuoHaType, getZjhType } from '@lottery/base/utils/common';

/**
 * 官方彩「冷热/遗漏」命中判定函数。
 * 签名与 officialLogic 的 calculateChmFn 完全一致:(issue, ball, positions) => boolean。
 *
 * web 端把这些函数散落在各 layout/official/*.vue 里(每个 .vue 内联一份),
 * h5 只有一个 BallGrid/ChmPanel,需要按当前玩法 layout.type 动态取对应判定,
 * 故在此把这些逻辑集中成一份共享实现(仅纯函数,不引入任何 UI 库)。
 */
export type OfficialChmFn = (issue: IssueItem, ball: MethodRowNumber, positions: number[]) => boolean;

const codeAt = (openCode: string, pos: number): string | undefined => {
    const codes = openCode.split(/[,\s]+/);
    const idx = pos - 1;
    if (idx < 0 || codes.length <= idx) return undefined;
    return codes[idx]?.trim();
};

const eq = (a: unknown, b: unknown): boolean => String(a) === String(b);

// 单位置精确匹配:Dwd / ZxFs / RxZxFs / Zu3 / RxZuFs / Zh / ZuFsOneRow
const singlePosition: OfficialChmFn = (issue, ball, positions) => {
    if (!issue?.open_code || !positions?.length) return false;
    const code = codeAt(issue.open_code, positions[0]);
    return code !== undefined && eq(code, ball.value);
};

// 多位置任一命中:RxBd / Qw / BdwMulti / BdwSingle / Bd
const multiPosition: OfficialChmFn = (issue, ball, positions) => {
    if (!issue?.open_code || !positions?.length) return false;
    return positions.some(pos => {
        const code = codeAt(issue.open_code as string, pos);
        return code !== undefined && eq(code, ball.value);
    });
};

// 牛牛形态:Nn / BsoeZx / BsoeHz
const niuNiu: OfficialChmFn = (issue, ball, positions) => {
    if (!issue?.open_code) return false;
    const codes = issue.open_code.split(/[,\s]+/).map(n => parseInt(n.trim(), 10));
    const actual = positions?.length === 5 ? positions : [1, 2, 3, 4, 5];
    const adjusted = actual.map(pos => codes[pos - 1]).filter(n => !isNaN(n));
    if (adjusted.length < 5) return false;
    const outcomes = getNiuNiuTypes(adjusted);
    return !!outcomes && outcomes.map(String).includes(String(ball.value));
};

// 龙虎:Lh(pos1>pos2 → 0 龙,pos1<pos2 → 1 虎,相等 → 2 和)
const longHu: OfficialChmFn = (issue, ball, positions) => {
    if (!issue?.open_code || !positions || positions.length < 2) return false;
    const c1 = codeAt(issue.open_code, positions[0]);
    const c2 = codeAt(issue.open_code, positions[1]);
    if (c1 === undefined || c2 === undefined) return false;
    const num1 = parseInt(c1, 10);
    const num2 = parseInt(c2, 10);
    if (isNaN(num1) || isNaN(num2)) return false;
    const outcome = num1 > num2 ? '0' : num1 < num2 ? '1' : '2';
    return eq(outcome, ball.value);
};

// 梭哈:Sh
const suoHa: OfficialChmFn = (issue, ball, positions) => {
    if (!issue?.open_code || !positions || positions.length < 5) return false;
    const codes = issue.open_code.split(/[,\s]+/).map(n => parseInt(n.trim(), 10));
    const adjusted = positions.map(pos => codes[pos - 1]).filter(n => !isNaN(n));
    if (adjusted.length < 5) return false;
    const outcome = getSuoHaType(adjusted);
    return outcome !== null && eq(outcome, ball.value);
};

// 扎金花:Zjh
const zhaJinHua: OfficialChmFn = (issue, ball, positions) => {
    if (!issue?.open_code || !positions || positions.length < 3) return false;
    const nums: number[] = [];
    for (let i = 0; i < 3; i++) {
        const code = codeAt(issue.open_code, positions[i]);
        if (code === undefined) return false;
        const num = parseInt(code, 10);
        if (isNaN(num)) return false;
        nums.push(num);
    }
    const outcome = getZjhType(nums);
    return outcome !== null && eq(outcome, ball.value);
};

const CHM_BY_LAYOUT_TYPE: Record<string, OfficialChmFn> = {
    Dwd: singlePosition,
    ZxFs: singlePosition,
    RxZxFs: singlePosition,
    Zu3: singlePosition,
    RxZuFs: singlePosition,
    Zh: singlePosition,
    ZuFsOneRow: singlePosition,
    RxBd: multiPosition,
    Qw: multiPosition,
    BdwMulti: multiPosition,
    BdwSingle: multiPosition,
    Bd: multiPosition,
    Nn: niuNiu,
    BsoeZx: niuNiu,
    BsoeHz: niuNiu,
    Lh: longHu,
    Sh: suoHa,
    Zjh: zhaJinHua,
};

/**
 * 按当前玩法 layout.type 取冷热/遗漏命中判定函数。
 * 返回 undefined 表示该玩法不提供冷热/遗漏(如 和值 Sum/跨度 Span 等,web 也未实现)。
 */
export function resolveOfficialChmFn(layoutType?: string): OfficialChmFn | undefined {
    if (!layoutType) return undefined;
    return CHM_BY_LAYOUT_TYPE[layoutType];
}
