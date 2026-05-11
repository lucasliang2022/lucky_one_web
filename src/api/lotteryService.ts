import api from "@/api/index";
import {IssueItem, MethodServerList, ReqBetHistory, RespBetHistory} from "@/types";

interface RespLotteryConfig {
    type: string;
    sign: string;
    name: string;
    avatar: string;
    remark: string;
    pre_bet_count: number;
    methods: MethodServerList;
}

export const getLotteryConfig = async (sign: string): Promise<RespLotteryConfig> => {
    try {
        const {data} = await api.get<RespLotteryConfig>("/lottery/config", {params: { lottery_id: sign }});
        return data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch lottery config');
    }
};

export const fetchIssueCurrent = async (sign: string): Promise<IssueItem> => {
    try {
        const {data} = await api.get<IssueItem, any>("/lottery/issueCurrent", {params: {lottery_id: sign}});
        return data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch Issue Current');
    }
};

export const fetchIssueLast = async (sign: string): Promise<IssueItem> => {
    try {
        const { data } = await api.get<IssueItem, any>("/lottery/issueLast", {params: { lottery_id: sign }});
        return data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch Issue Last');
    }
};

export const fetchIssueHistory = async (sign: string): Promise<IssueItem[]> => {
    try {
        const {data} = await api.get<IssueItem[], any>("/lottery/issueHistory", {params: { lottery_id: sign }});
        return data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch Issue History');
    }
};

export interface RespLotteryBet {
    balance: number;
    total_bet_amount: number;
    total_bet_count: number;
}

export const postLotteryBet = async (postData: object): Promise<RespLotteryBet> => {
    try {
        const { data } = await api.post<any>("/lottery/bet", postData);
        return data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch Issue History');
    }
};


export const fetchOrderList = async (postData: ReqBetHistory): Promise<RespBetHistory> => {
    try {
        const { data } = await api.get("/lottery/bet/history", {
            params: postData
        });
        return data;
    } catch (error: any) {
        throw error;
    }
};