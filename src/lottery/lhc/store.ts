import { defineStore } from 'pinia';
import { ref } from 'vue';
import { zodiacIndexToNames, getLunarYear, getZodiacNumberByYear } from "@lottery/base/utils/zodiac";
import {useLotteryBase} from "@lottery/base/stores/lotteryBase";

export const useLhcStore = defineStore('lhc', () => {
    const base = useLotteryBase();

    const isZodiacInitialized = ref<boolean>(false);
    const zodiacNames = ref<Record<number, string>>({});
    const zodiacMap = ref<Record<number, { title: string; numbers: string[]; isFirst: boolean }>>({});
    const zodiacFirst = ref<number>(0);
    const numberToZodiac = ref<Record<string, { title: string; no: number; isFirst: boolean }>>({});

    const initZodiac = (): void => {
        const currentYear = getLunarYear();
        const zodiacNumbers = getZodiacNumberByYear(currentYear);
        zodiacMap.value = { ...zodiacNumbers };
        zodiacNames.value = { ...zodiacIndexToNames };
        numberToZodiac.value = {};
        Object.entries(zodiacMap.value).forEach(([zodiacIndex, data]) => {
            data.numbers.forEach((num: string) => {
                numberToZodiac.value[num] = {
                    title: data.title,
                    no: parseInt(zodiacIndex, 10),
                    isFirst: data.isFirst
                };
            });
            if (data.isFirst) {
                zodiacFirst.value = parseInt(zodiacIndex, 10);
            }
        });
        isZodiacInitialized.value = true;
    };

    const getZodiacName = (number: string | number): string => {
        if (!isZodiacInitialized.value) {
            initZodiac();
        }
        const numStr = String(number).padStart(2, "0");
        return numberToZodiac.value[numStr]?.title || "?";
    };

    initZodiac();

    return {
        ...base,
        zodiacFirst,
        zodiacMap,
        zodiacNames,
        isZodiacInitialized,
        numberToZodiac,
        getZodiacName,
    };
});