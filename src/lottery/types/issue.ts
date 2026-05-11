import { SelectedUnit } from "@/types";
import { MethodDefineItem, MethodRow, MethodRowNumber } from "@lottery/types/method";

export interface IssueItem {
    lottery_id: string;
    issue_no: string;
    sale_start_time?: number;
    sale_end_time?: number;
    lock_time?: number;
    open_code?: string;
    status?: number;
}

export interface IssueCodeArr {
    number: string;
}

export interface Options {
    calculateChmFn?: (issue: IssueItem, ballsData: MethodRowNumber[], positions: number[]) => Record<string | number, number>;
    randomOneBetFn?: (rowsData: MethodRow[], currentMethod: MethodDefineItem) => SelectedUnit[][];
    calculateCountFn?: (tickets: SelectedUnit[][], currentMethod: MethodDefineItem) => number;
}