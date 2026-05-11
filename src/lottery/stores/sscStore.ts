import { defineStore } from 'pinia';
import { useLotteryBase } from "@lottery/stores/base/lotteryBase";

export const useSscStore = defineStore('ssc', () => {
    const base = useLotteryBase();
    return {
        ...base,
    };
});