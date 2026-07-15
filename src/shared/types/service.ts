export interface ReqBetHistory {
    lottery_sign: string;
    issue_no?: string;
    page?: number;
    page_size?: number;
}

export interface RespBetHistoryItem {
    id: number;
    mode: string;
    method_sign: string;
    method_define: { name: string };
    issue_no: string;
    bet_code: string;
    bet_code_display: string;
    bet_cost: number;
    bet_count: number;
    bet_times: number;
    bet_unit: number;
    /** 0 待开奖 / 1-4 已开奖(judged/prize/rebate/stat) / 9 已撤单 */
    status: number;
    /** 1 中奖 0 未中奖(仅开奖后有意义) */
    decide_is_win: number;
    decide_prize_amount: number;
    cancel_time: number;
    bet_time: number;
}

export interface RespBetHistory {
    total: number;
    list: RespBetHistoryItem[];
}
