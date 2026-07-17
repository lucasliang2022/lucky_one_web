// pk10 信用盘盘面 cell:value = 后端下注码,title = i18n key(前端翻译)。
const K = 'lottery.pk10.credit.code';

// 两面 8 码:大/小/单/双/质/合/龙/虎
export const lm8 = [
    { value: 'b', title: `${K}.da` },
    { value: 's', title: `${K}.xiao` },
    { value: 'o', title: `${K}.dan` },
    { value: 'e', title: `${K}.shuang` },
    { value: 'z', title: `${K}.zhi` },
    { value: 'h', title: `${K}.he` },
    { value: 'd', title: `${K}.long` },
    { value: 't', title: `${K}.hu` },
];

// 两面 6 码(无龙虎):大/小/单/双/质/合
export const lm6 = lm8.slice(0, 6).map((c) => ({ ...c }));

// 冠亚和两面:大/小/单/双(赔率按 大双 / 小单 分档)
export const gyhLm = [
    { value: 'b', title: `${K}.da` },
    { value: 's', title: `${K}.xiao` },
    { value: 'o', title: `${K}.dan` },
    { value: 'e', title: `${K}.shuang` },
];

// 车号 1-10(标签就是号码,无需 i18n)
export const carNo = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), title: String(i + 1) }));

// 冠亚和值 3-19(标签即数字)
export const gyhSum = Array.from({ length: 17 }, (_, i) => ({ value: String(i + 3), title: String(i + 3) }));

// 斗牛:牛牛 / 牛一~牛九 / 无牛
export const dnCells = [
    { value: 'n', title: `${K}.niuniu` },
    ...Array.from({ length: 9 }, (_, i) => ({ value: String(i + 1), title: `${K}.niu${i + 1}` })),
    { value: '0', title: `${K}.wuniu` },
];
