/**
 * 解析方法标题:默认用中文 title;若配了 title_sign 且当前语言存在该翻译,则用翻译。
 * t/te 由调用方传入(组件传 useI18n 的,保证语言切换响应式;非组件处传 i18n.global)。
 */
export function resolveMethodTitle(
    m: { title?: string; title_sign?: string } | null | undefined,
    t: (key: string) => string,
    te: (key: string) => boolean,
): string {
    if (m?.title_sign && te(m.title_sign)) {
        const v = t(m.title_sign);
        // 翻译为空(脚手架占位)或原样返回 key 时,回退中文 title
        if (v && v !== m.title_sign) return v;
    }
    return m?.title ?? '';
}

export function combination(n: number, r: number): number {
    if (n < r) return 0;
    let numerator = 1, denominator = 1;
    for (let i = 0; i < r; i++) {
        numerator *= (n - i);
        denominator *= (i + 1);
    }
    return numerator / denominator;
}

export function formatPrize(amount: number, unit: number = 1, times: number = 1): number {
    return parseFloat((amount * unit * times).toFixed(2));
}

export const redWave: string[] = [
    "01", "02", "07", "08", "12", "13", "18", "19", "23", "24",
    "29", "30", "34", "35", "40", "45", "46"
];

export const blueWave: string[] = [
    "03", "04", "09", "10", "14", "15", "20", "25", "26", "31",
    "36", "37", "41", "42", "47", "48"
];

export const greenWave: string[] = [
    "05", "06", "11", "16", "17", "21", "22", "27", "28", "32",
    "33", "38", "39", "43", "44", "49"
];

export function getBallColor(number: string): "red" | "blue" | "green" | "" {
    if (redWave.includes(number)) return "red";
    if (blueWave.includes(number)) return "blue";
    if (greenWave.includes(number)) return "green";
    return "";
}

export const getSdkSignKey = (): 'momo' | 'sd' => {
    const sdkSign = import.meta.env.VITE_SDK_SIGN;
    return (sdkSign === 'momo') ? 'momo' : 'sd';
};

export function getZjhType(openNumber: number[]) {
    if (openNumber.length !== 3) {
        return null;
    }

    openNumber.sort((a: number, b: number) => a - b);

    const counts: Record<number, number> = {};
    openNumber.forEach((num: number) => {
        counts[num] = (counts[num] || 0) + 1;
    });
    const countValues = Object.values(counts);

    if (Object.keys(counts).length === 1) {
        return 0;
    }

    if (
        (openNumber[2] - openNumber[1] === 1 && openNumber[1] - openNumber[0] === 1) ||
        (openNumber.join(',') === '0,1,9') ||
        (openNumber.join(',') === '0,8,9')
    ) {
        return 1;
    }

    if (countValues.includes(2) && countValues.includes(1)) {
        return 2;
    }

    if (
        (openNumber[1] - openNumber[0] === 1 || openNumber[2] - openNumber[1] === 1) &&
        !(openNumber[2] - openNumber[0] === 2)
    ) {
        return 4;
    }

    return 3;
}

export function getNiuNiuTypes(openNumber: number[]) {
    if (openNumber.length !== 5) {
        return null;
    }

    const combinations = [];
    for (let i = 0; i < 3; i++) {
        for (let j = i + 1; j < 4; j++) {
            for (let k = j + 1; k < 5; k++) {
                combinations.push([openNumber[i], openNumber[j], openNumber[k]]);
            }
        }
    }

    let result = 0;
    for (const combo of combinations) {
        const sumCombo = combo.reduce((sum: number, num: number) => sum + num, 0);
        if (sumCombo % 10 === 0) {
            const remaining = openNumber.filter((num: number) => !combo.includes(num));
            const sumRemaining = remaining.reduce((sum: number, num: number) => sum + num, 0);
            const tailPoint = sumRemaining % 10;
            result = tailPoint === 0 ? 10 : tailPoint;
        }
    }

    const data = [result];
    if ([1,2,3,4,5].includes(result)) {
        data.push(12);
    }

    if ([6,7,8,9,10].includes(result)) {
        data.push(11);
    }

    if ([1,3,5,7,9].includes(result)) {
        data.push(13);
    }

    if ([2,4,6,8,10].includes(result)) {
        data.push(14);
    }

    if ([1,2,3,5,7].includes(result)) {
        data.push(15);
    }

    if ([4,6,8,9,10].includes(result)) {
        data.push(16);
    }

    return data;
}

export function getSuoHaType(openNumber: number[]) {
    if (openNumber.length !== 5) {
        return null;
    }

    const sortedCodes = [...openNumber].sort((a: number, b: number) => a - b);

    const counts: Record<number, number> = {};
    sortedCodes.forEach((code: number) => {
        counts[code] = (counts[code] || 0) + 1;
    });
    const countValues = Object.values(counts);

    if (countValues.includes(4)) {
        return 0;
    }

    if (countValues.includes(3) && countValues.includes(2)) {
        return 1;
    }

    if (
        sortedCodes[4] - sortedCodes[3] === 1 &&
        sortedCodes[3] - sortedCodes[2] === 1 &&
        sortedCodes[2] - sortedCodes[1] === 1 &&
        sortedCodes[1] - sortedCodes[0] === 1
    ) {
        return 2;
    }

    if (countValues.includes(3)) {
        return 3;
    }

    if (countValues.length === 3 && Math.max(...countValues) === 2) {
        return 4;
    }

    if (countValues.length === 4) {
        return 5;
    }

    return 6;
}