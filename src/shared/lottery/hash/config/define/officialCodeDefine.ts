// 哈希官方盘格子:value = 后端下注码,title = 号码字符串或 i18n key。
const KO = 'lottery.hash.official.code';
const N = (v: string | number) => ({ value: String(v), title: String(v) });
const L = (v: string, k: string) => ({ value: v, title: `${KO}.${k}` });

export const num10 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(N);
export const oe = [L('o', 'dan'), L('e', 'shuang')];        // 单/双
export const bs = [L('b', 'da'), L('s', 'xiao')];           // 大/小
export const lh = [L('d', 'long'), L('t', 'hu'), L('h', 'he')]; // 龙/虎/和
export const hz5 = [L('xs', 'jixiao'), L('s', 'xiao'), L('m', 'zhong'), L('b', 'da'), L('xb', 'jida')]; // 极小/小/中/大/极大
export const baozi = [L('1', 'baozi')];
export const shunzi = [L('1', 'shunzi')];
