export const numbers = [
    { "value": 0, "title": "0" },
    { "value": 1, "title": "1" },
    { "value": 2, "title": "2" },
    { "value": 3, "title": "3" },
    { "value": 4, "title": "4" },
    { "value": 5, "title": "5" },
    { "value": 6, "title": "6" },
    { "value": 7, "title": "7" },
    { "value": 8, "title": "8" },
    { "value": 9, "title": "9" }
];

export const bs = [
    { "value": 0, "title": "lottery.ssc.credit.code.da" },
    { "value": 1, "title": "lottery.ssc.credit.code.xiao" }
];

// 形态(大小单双质合)合并盘:value 用后端下注码(b/s/o/e/z/h),一格一码独立成注。
export const form = [
    { "value": "b", "title": "lottery.ssc.credit.code.da" },
    { "value": "s", "title": "lottery.ssc.credit.code.xiao" },
    { "value": "o", "title": "lottery.ssc.credit.code.dan" },
    { "value": "e", "title": "lottery.ssc.credit.code.shuang" },
    { "value": "z", "title": "lottery.ssc.credit.code.zhi" },
    { "value": "h", "title": "lottery.ssc.credit.code.he" }
];

// 龙虎:后端下注码 d=龙 / t=虎 / h=和
export const longhu = [
    { "value": "d", "title": "lottery.ssc.credit.code.long" },
    { "value": "t", "title": "lottery.ssc.credit.code.hu" },
    { "value": "h", "title": "lottery.ssc.credit.code.tie" }
];

// 扎金花牌型:后端下注码 1-5
export const zjhForm = [
    { "value": "1", "title": "lottery.ssc.credit.code.baozi" },
    { "value": "2", "title": "lottery.ssc.credit.code.shunzi" },
    { "value": "3", "title": "lottery.ssc.credit.code.duizi" },
    { "value": "4", "title": "lottery.ssc.credit.code.zaliu" },
    { "value": "5", "title": "lottery.ssc.credit.code.banshun" }
];

// 梭哈牌型:后端下注码 1-7(四条/葫芦/顺子/三条/两对/一对/单牌)
export const suohaForm = [
    { "value": "1", "title": "lottery.ssc.credit.code.sitiao" },
    { "value": "2", "title": "lottery.ssc.credit.code.hulu" },
    { "value": "3", "title": "lottery.ssc.credit.code.shunzi" },
    { "value": "4", "title": "lottery.ssc.credit.code.santiao" },
    { "value": "5", "title": "lottery.ssc.credit.code.liangdui" },
    { "value": "6", "title": "lottery.ssc.credit.code.yidui" },
    { "value": "7", "title": "lottery.ssc.credit.code.danpai" }
];

// 跨度:0-9(下注码=跨度值,字符串)
export const spanCells = Array.from({ length: 10 }, (_, i) => ({ value: String(i), title: String(i) }));

// 位置和数:0..maxSum 的数字盘(下注码=和值,字符串)。Er=18 / San=27 / Wu=45。
export const sumCells = (maxSum: number) =>
    Array.from({ length: maxSum + 1 }, (_, i) => ({ value: String(i), title: String(i) }));

// 总和大小(总和 大/小/单/双 + 大单/小单/大双/小双)
export const zongHeCells = [
    { "value": "b", "title": "lottery.ssc.credit.code.da" },
    { "value": "s", "title": "lottery.ssc.credit.code.xiao" },
    { "value": "o", "title": "lottery.ssc.credit.code.dan" },
    { "value": "e", "title": "lottery.ssc.credit.code.shuang" },
    { "value": "bo", "title": "lottery.ssc.credit.code.dadan" },
    { "value": "so", "title": "lottery.ssc.credit.code.xiaodan" },
    { "value": "be", "title": "lottery.ssc.credit.code.dashuang" },
    { "value": "se", "title": "lottery.ssc.credit.code.xiaoshuang" }
];

// 斗牛:牛牛/牛一~牛九/没牛/牛大小单双质合(下注码见后端)
export const douNiuCells = [
    { "value": "n", "title": "lottery.ssc.credit.code.niuniu" },
    { "value": "1", "title": "lottery.ssc.credit.code.niu1" },
    { "value": "2", "title": "lottery.ssc.credit.code.niu2" },
    { "value": "3", "title": "lottery.ssc.credit.code.niu3" },
    { "value": "4", "title": "lottery.ssc.credit.code.niu4" },
    { "value": "5", "title": "lottery.ssc.credit.code.niu5" },
    { "value": "6", "title": "lottery.ssc.credit.code.niu6" },
    { "value": "7", "title": "lottery.ssc.credit.code.niu7" },
    { "value": "8", "title": "lottery.ssc.credit.code.niu8" },
    { "value": "9", "title": "lottery.ssc.credit.code.niu9" },
    { "value": "0", "title": "lottery.ssc.credit.code.meiniu" },
    { "value": "b", "title": "lottery.ssc.credit.code.niuda" },
    { "value": "s", "title": "lottery.ssc.credit.code.niuxiao" },
    { "value": "o", "title": "lottery.ssc.credit.code.niudan" },
    { "value": "e", "title": "lottery.ssc.credit.code.niushuang" },
    { "value": "z", "title": "lottery.ssc.credit.code.niuzhi" },
    { "value": "h", "title": "lottery.ssc.credit.code.niuhe" }
];

export const oe = [
    { "value": 0, "title": "lottery.ssc.credit.code.dan" },
    { "value": 1, "title": "lottery.ssc.credit.code.shuang" }
];

export const ps = [
    { "value": 0, "title": "lottery.ssc.credit.code.zhi" },
    { "value": 1, "title": "lottery.ssc.credit.code.he" }
];

export const lh = [
    { "value": 0, "title": "lottery.ssc.credit.code.long" },
    { "value": 1, "title": "lottery.ssc.credit.code.hu" },
    { "value": 2, "title": "lottery.ssc.credit.code.tie" }
];

export const zjh = [
    { "value": 0, "title": "lottery.ssc.credit.code.baozi" },
    { "value": 1, "title": "lottery.ssc.credit.code.shunzi" },
    { "value": 2, "title": "lottery.ssc.credit.code.duizi" },
    { "value": 3, "title": "lottery.ssc.credit.code.zaliu" },
    { "value": 4, "title": "lottery.ssc.credit.code.banshun" }
];
