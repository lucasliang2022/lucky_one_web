// 快三信用盘盘面格子:value = 后端下注码,title = 号码字符串或 i18n key(前端翻译)。
// 号码类直接用数字字符串(t('3') 无 key 时回落 '3');标签类用 lottery.ks.credit.code.* key。

const KC = 'lottery.ks.credit.code';
const N = (v: string | number) => ({ value: String(v), title: String(v) });
const L = (v: string, k: string) => ({ value: v, title: `${KC}.${k}` });

// 号码 1-6 / 0-9 / 0-5 / 和值 3-18
export const num6 = ['1', '2', '3', '4', '5', '6'].map(N);
export const num10 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(N);
export const kdNum6 = ['0', '1', '2', '3', '4', '5'].map(N);
export const hz16 = Array.from({ length: 16 }, (_, i) => N(i + 3)); // 3..18

// 同号:二同号(11..66 + 红码)/ 三同号(111..666 + 豹子)
export const erTong = [...['11', '22', '33', '44', '55', '66'].map(N), L('hm', 'hongma')];
export const sanTong = [...['111', '222', '333', '444', '555', '666'].map(N), L('bz', 'baozi')];

// 鱼虾蟹:6 象(鱼虾葫芦钱蟹鸡)/ 颜色(红绿蓝)
export const yxx = [L('1', 'yu'), L('2', 'xia'), L('3', 'hulu'), L('4', 'qian'), L('5', 'xie'), L('6', 'ji')];
export const sebo = [L('r', 'hong'), L('g', 'lv'), L('b', 'lan')];

// 不同号:二连号(12..56 + 半顺)/ 三连号(123..456 + 全顺)/ 二不同(15 对)/ 三不同(20 组 + 黑码)
export const erLian = [...['12', '23', '34', '45', '56'].map(N), L('bs', 'banshun')];
export const sanLian = [...['123', '234', '345', '456'].map(N), L('qs', 'quanshun')];
export const erBuTong = ['12', '13', '14', '15', '16', '23', '24', '25', '26', '34', '35', '36', '45', '46', '56'].map(N);
export const sanBuTong = [
    ...['123', '124', '125', '126', '134', '135', '136', '145', '146', '156',
        '234', '235', '236', '245', '246', '256', '345', '346', '356', '456'].map(N),
    L('hm', 'heima'),
];

// 和值两面:大小单双 + 大单/小双/小单/大双
export const hzForm = [
    L('b', 'da'), L('s', 'xiao'), L('o', 'dan'), L('e', 'shuang'),
    L('bo', 'dadan'), L('se', 'xiaoshuang'), L('so', 'xiaodan'), L('be', 'dashuang'),
];

// 溜后:猴一..猴六 + 天猴/地猴/无猴
export const liuhou = [
    L('1', 'hou1'), L('2', 'hou2'), L('3', 'hou3'), L('4', 'hou4'), L('5', 'hou5'), L('6', 'hou6'),
    L('7', 'tianhou'), L('8', 'dihou'), L('9', 'wuhou'),
];

// 排点两面(大小单双质合)/ 跨度两面(大小单双)
export const pdForm = [L('b', 'da'), L('s', 'xiao'), L('o', 'dan'), L('e', 'shuang'), L('z', 'zhi'), L('h', 'he')];
export const kdForm = [L('b', 'da'), L('s', 'xiao'), L('o', 'dan'), L('e', 'shuang')];
