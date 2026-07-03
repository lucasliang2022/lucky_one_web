import { SelectedUnit } from "@/types";
import { MethodDefineItem, MethodRow, MethodRowNumber } from "@lottery/types/method";

export interface IssueItem {
    lottery_id: string;
    issue_no: string;
    sale_start_time?: number;
    sale_end_time?: number;
    lock_time?: number;
    open_code?: string;
    /** open_code 的别名:归一化时镜像填充,兼容各游戏组件里读 issue.code 的写法(值同 open_code) */
    code?: string;
    status?: number;
}

export interface IssueCodeArr {
    number: string;
}

export interface Options {
    calculateChmFn?: (issue: IssueItem, ball: MethodRowNumber, positions: number[]) => boolean;
    calculateHotColdFn?: (issueCount: number, history: IssueItem[], ballsData: MethodRowNumber[], positions: number[]) => Record<string | number, number>;
    calculateOmissionFn?: (history: IssueItem[], ballsData: MethodRowNumber[], positions: number[]) => Record<string | number, number>;
    randomOneBetFn?: (rowsData: MethodRow[], currentMethod: MethodDefineItem) => SelectedUnit[][];
    calculateCountFn?: (tickets: SelectedUnit[][], currentMethod: MethodDefineItem) => number;
}