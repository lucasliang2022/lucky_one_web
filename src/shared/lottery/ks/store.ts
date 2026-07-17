import { defineStore } from 'pinia';
import {useLotteryBase} from "@lottery/base/stores/lotteryBase";

export const useKsStore = defineStore('ks', () => {
    const base = useLotteryBase();
    return {
        ...base,
    };
});
