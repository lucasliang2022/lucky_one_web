export interface CartItem {
    methodTitle: string;
    methodSign: string;
    methodSdkSign: string;
    codes: string;
    codesDisplay: string;
    price: number;
    times: number;
    cost: number;
    count: number;
    currency: string;
    mode: string;
    confirmed: boolean;
}

export interface OrderIssueInfo {
    [key: string]: number;
}

export interface OrderData {
    lottery_id: string;
    currency: string;
    projects: OrderProject[];
    issues: OrderIssueInfo;
    mode: string;
}

export interface OrderProject {
    method_id: string;
    codes: string;
    times: number
    price: number;
    num: number;
}

export interface SelectedUnit {
    value: string;
    title?: string;
}
