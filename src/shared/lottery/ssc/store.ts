import { defineStore } from 'pinia';
import { useLotteryBase } from "@lottery/base/stores/lotteryBase";

export const useSscStore = defineStore('ssc', () => {
    const base = useLotteryBase();
    return {
        ...base,
    };
});