import {Solar} from "lunar-javascript";

export const zodiacIndexToNames = {
    0: "鼠", 1: "牛", 2: "虎", 3: "兔", 4: "龙", 5: "蛇",
    6: "马", 7: "羊", 8: "猴", 9: "鸡", 10: "狗", 11: "猪"
};

export const yearZodiacNumbers = {
    2025: {
        0: { title: "鼠", numbers: ["06", "18", "30", "42"], isFirst: false },
        1: { title: "牛", numbers: ["05", "17", "29", "41"], isFirst: false },
        2: { title: "虎", numbers: ["04", "16", "28", "40"], isFirst: false },
        3: { title: "兔", numbers: ["03", "15", "27", "39"], isFirst: false },
        4: { title: "龙", numbers: ["02", "14", "26", "38"], isFirst: false },
        5: { title: "蛇", numbers: ["01", "13", "25", "37", "49"], isFirst: true },
        6: { title: "马", numbers: ["12", "24", "36", "48"], isFirst: false },
        7: { title: "羊", numbers: ["11", "23", "35", "47"], isFirst: false },
        8: { title: "猴", numbers: ["10", "22", "34", "46"], isFirst: false },
        9: { title: "鸡", numbers: ["09", "21", "33", "45"], isFirst: false },
        10: { title: "狗", numbers: ["08", "20", "32", "44"], isFirst: false },
        11: { title: "猪", numbers: ["07", "19", "31", "43"], isFirst: false }
    },
    2026: {
        0: { title: "鼠", numbers: ["07", "19", "31", "43"], isFirst: false },
        1: { title: "牛", numbers: ["06", "18", "30", "42"], isFirst: false },
        2: { title: "虎", numbers: ["05", "17", "29", "41"], isFirst: false },
        3: { title: "兔", numbers: ["04", "16", "28", "40"], isFirst: false },
        4: { title: "龙", numbers: ["03", "15", "27", "39"], isFirst: false },
        5: { title: "蛇", numbers: ["02", "14", "26", "38"], isFirst: false },
        6: { title: "马", numbers: ["01", "13", "25", "37", "49"], isFirst: true },
        7: { title: "羊", numbers: ["12", "24", "36", "48"], isFirst: false },
        8: { title: "猴", numbers: ["11", "23", "35", "47"], isFirst: false },
        9: { title: "鸡", numbers: ["10", "22", "34", "46"], isFirst: false },
        10: { title: "狗", numbers: ["09", "21", "33", "45"], isFirst: false },
        11: { title: "猪", numbers: ["08", "20", "32", "44"], isFirst: false }
    },
    2027: {
        0: { title: "鼠", numbers: ["08", "20", "32", "44"], isFirst: false },
        1: { title: "牛", numbers: ["07", "19", "31", "43"], isFirst: false },
        2: { title: "虎", numbers: ["06", "18", "30", "42"], isFirst: false },
        3: { title: "兔", numbers: ["05", "17", "29", "41"], isFirst: false },
        4: { title: "龙", numbers: ["04", "16", "28", "40"], isFirst: false },
        5: { title: "蛇", numbers: ["03", "15", "27", "39"], isFirst: false },
        6: { title: "马", numbers: ["02", "14", "26", "38"], isFirst: false },
        7: { title: "羊", numbers: ["01", "13", "25", "37", "49"], isFirst: true },
        8: { title: "猴", numbers: ["12", "24", "36", "48"], isFirst: false },
        9: { title: "鸡", numbers: ["11", "23", "35", "47"], isFirst: false },
        10: { title: "狗", numbers: ["10", "22", "34", "46"], isFirst: false },
        11: { title: "猪", numbers: ["09", "21", "33", "45"], isFirst: false }
    },
    2028: {
        0: { title: "鼠", numbers: ["09", "21", "33", "45"], isFirst: false },
        1: { title: "牛", numbers: ["08", "20", "32", "44"], isFirst: false },
        2: { title: "虎", numbers: ["07", "19", "31", "43"], isFirst: false },
        3: { title: "兔", numbers: ["06", "18", "30", "42"], isFirst: false },
        4: { title: "龙", numbers: ["05", "17", "29", "41"], isFirst: false },
        5: { title: "蛇", numbers: ["04", "16", "28", "40"], isFirst: false },
        6: { title: "马", numbers: ["03", "15", "27", "39"], isFirst: false },
        7: { title: "羊", numbers: ["02", "14", "26", "38"], isFirst: false },
        8: { title: "猴", numbers: ["01", "13", "25", "37", "49"], isFirst: true },
        9: { title: "鸡", numbers: ["12", "24", "36", "48"], isFirst: false },
        10: { title: "狗", numbers: ["11", "23", "35", "47"], isFirst: false },
        11: { title: "猪", numbers: ["10", "22", "34", "46"], isFirst: false }
    }
};

/**
 * get lunar year
 * @param date
 * @returns {*}
 */
export function getLunarYear(date = new Date()) {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    return lunar.getYear();
}

/**
 * get zodiac number by year
 * @param year
 * @returns {*|*[]}
 */
export function getZodiacNumberByYear(year: number) {
    return yearZodiacNumbers[year as keyof typeof yearZodiacNumbers] || [];
}