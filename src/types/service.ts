export interface ReqBetHistory {
    lottery_id: string;
    issue_no?: string;
}

export interface RespBetHistoryItem {
    UserId: string;
    Username: string;
    currency: string;
    project_id: string;
    task_id: string;
    lottery_id: string;
}

export interface RespBetHistory {
    total: number;
    list: RespBetHistoryItem[];
}