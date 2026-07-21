import { defineStore } from 'pinia';
import {useLotteryBase} from "@lottery/base/stores/lotteryBase";

export const useHashStore = defineStore('hash', () => {
    const base = useLotteryBase();
    return {
        ...base,
    };
});
