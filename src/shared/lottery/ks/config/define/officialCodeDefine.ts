// 快三官方盘格子:value = 后端下注码,title = 号码字符串或 i18n key。
// 号码组合(112/135…)直接用字符串;大小单双复用信用码表;通选(777)用 official code key。

const KC = 'lottery.ks.credit.code';    // 复用:大/小/单/双
const KO = 'lottery.ks.official.code';  // 通选 / 二同 / 单
const N = (v: string | number) => ({ value: String(v), title: String(v) });
const L = (v: string, k: string) => ({ value: v, title: k });
const TX = { value: '777', title: `${KO}.tongxuan` }; // 通选

export const num6 = ['1', '2', '3', '4', '5', '6'].map(N);
export const hz16 = Array.from({ length: 16 }, (_, i) => N(i + 3)); // 3..18
export const dxds4 = [L('b', `${KC}.da`), L('s', `${KC}.xiao`), L('o', `${KC}.dan`), L('e', `${KC}.shuang`)];

// 二不同号(15 对)/ 二同号(6)/ 二同号单选三码(30)/ 三不同号(20)
export const ebtPairs = ['12', '13', '14', '15', '16', '23', '24', '25', '26', '34', '35', '36', '45', '46', '56'].map(N);
export const ethPairs = ['11', '22', '33', '44', '55', '66'].map(N);
export const ethTriples = ['112', '113', '114', '115', '116', '221', '223', '224', '225', '226',
    '331', '332', '334', '335', '336', '441', '442', '443', '445', '446',
    '551', '552', '553', '554', '556', '661', '662', '663', '664', '665'].map(N);
export const sbtTriples = ['123', '124', '125', '126', '134', '135', '136', '145', '146', '156',
    '234', '235', '236', '245', '246', '256', '345', '346', '356', '456'].map(N);

// 单选 + 通选(777):三同号 / 杂六 / 半顺 / 三连号
export const sthCells = [...['111', '222', '333', '444', '555', '666'].map(N), TX];
export const zlCells = [...['135', '136', '146', '246'].map(N), TX];
export const bsCells = [...['124', '125', '126', '134', '145', '156', '235', '236', '246', '256', '346', '356'].map(N), TX];
export const slhCells = [...['123', '234', '345', '456'].map(N), TX];
