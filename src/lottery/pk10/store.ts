import { defineStore } from 'pinia';
import {useLotteryBase} from "@lottery/base/stores/lotteryBase";

export const usePk10Store = defineStore('pk10', () => {
    const base = useLotteryBase();
    return {
        ...base,
    };
});