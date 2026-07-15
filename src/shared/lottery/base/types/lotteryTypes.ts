
// ------------------------- layout define -------------------------
export interface Ball {
    title: string;
    value: string | number;
    selected: boolean;
    animating: boolean;
    hotCount: number | null;
    omission: number | null;
    colorClass?: string;
    prize?: string | number;
    row?: number;
    zodiac?: number[];
    numbers?: { number: number; color: string }[];
}