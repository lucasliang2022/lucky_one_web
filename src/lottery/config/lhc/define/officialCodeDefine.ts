import { blueWave, greenWave, redWave } from "@lottery/utils/common";

export const numbers = [
    { title: '01', value: 1, selected: false, animating: false, row: 1, colorClass: 'ball-red' },
    { title: '02', value: 2, selected: false, animating: false, row: 1, colorClass: 'ball-red' },
    { title: '03', value: 3, selected: false, animating: false, row: 1, colorClass: 'ball-blue' },
    { title: '04', value: 4, selected: false, animating: false, row: 1, colorClass: 'ball-blue' },
    { title: '05', value: 5, selected: false, animating: false, row: 1, colorClass: 'ball-green' },
    { title: '06', value: 6, selected: false, animating: false, row: 1, colorClass: 'ball-green' },
    { title: '07', value: 7, selected: false, animating: false, row: 1, colorClass: 'ball-red' },
    { title: '08', value: 8, selected: false, animating: false, row: 1, colorClass: 'ball-red' },
    { title: '09', value: 9, selected: false, animating: false, row: 1, colorClass: 'ball-blue' },
    { title: '10', value: 10, selected: false, animating: false, row: 1, colorClass: 'ball-blue' },
    { title: '11', value: 11, selected: false, animating: false, row: 1, colorClass: 'ball-green' },
    { title: '12', value: 12, selected: false, animating: false, row: 1, colorClass: 'ball-red' },
    { title: '13', value: 13, selected: false, animating: false, row: 2, colorClass: 'ball-red' },
    { title: '14', value: 14, selected: false, animating: false, row: 2, colorClass: 'ball-blue' },
    { title: '15', value: 15, selected: false, animating: false, row: 2, colorClass: 'ball-blue' },
    { title: '16', value: 16, selected: false, animating: false, row: 2, colorClass: 'ball-green' },
    { title: '17', value: 17, selected: false, animating: false, row: 2, colorClass: 'ball-green' },
    { title: '18', value: 18, selected: false, animating: false, row: 2, colorClass: 'ball-red' },
    { title: '19', value: 19, selected: false, animating: false, row: 2, colorClass: 'ball-red' },
    { title: '20', value: 20, selected: false, animating: false, row: 2, colorClass: 'ball-blue' },
    { title: '21', value: 21, selected: false, animating: false, row: 2, colorClass: 'ball-green' },
    { title: '22', value: 22, selected: false, animating: false, row: 2, colorClass: 'ball-green' },
    { title: '23', value: 23, selected: false, animating: false, row: 2, colorClass: 'ball-red' },
    { title: '24', value: 24, selected: false, animating: false, row: 2, colorClass: 'ball-red' },
    { title: '25', value: 25, selected: false, animating: false, row: 3, colorClass: 'ball-blue' },
    { title: '26', value: 26, selected: false, animating: false, row: 3, colorClass: 'ball-blue' },
    { title: '27', value: 27, selected: false, animating: false, row: 3, colorClass: 'ball-green' },
    { title: '28', value: 28, selected: false, animating: false, row: 3, colorClass: 'ball-green' },
    { title: '29', value: 29, selected: false, animating: false, row: 3, colorClass: 'ball-red' },
    { title: '30', value: 30, selected: false, animating: false, row: 3, colorClass: 'ball-red' },
    { title: '31', value: 31, selected: false, animating: false, row: 3, colorClass: 'ball-blue' },
    { title: '32', value: 32, selected: false, animating: false, row: 3, colorClass: 'ball-green' },
    { title: '33', value: 33, selected: false, animating: false, row: 3, colorClass: 'ball-green' },
    { title: '34', value: 34, selected: false, animating: false, row: 3, colorClass: 'ball-red' },
    { title: '35', value: 35, selected: false, animating: false, row: 3, colorClass: 'ball-red' },
    { title: '36', value: 36, selected: false, animating: false, row: 3, colorClass: 'ball-blue' },
    { title: '37', value: 37, selected: false, animating: false, row: 4, colorClass: 'ball-blue' },
    { title: '38', value: 38, selected: false, animating: false, row: 4, colorClass: 'ball-green' },
    { title: '39', value: 39, selected: false, animating: false, row: 4, colorClass: 'ball-green' },
    { title: '40', value: 40, selected: false, animating: false, row: 4, colorClass: 'ball-red' },
    { title: '41', value: 41, selected: false, animating: false, row: 4, colorClass: 'ball-blue' },
    { title: '42', value: 42, selected: false, animating: false, row: 4, colorClass: 'ball-blue' },
    { title: '43', value: 43, selected: false, animating: false, row: 4, colorClass: 'ball-green' },
    { title: '44', value: 44, selected: false, animating: false, row: 4, colorClass: 'ball-green' },
    { title: '45', value: 45, selected: false, animating: false, row: 4, colorClass: 'ball-red' },
    { title: '46', value: 46, selected: false, animating: false, row: 4, colorClass: 'ball-red' },
    { title: '47', value: 47, selected: false, animating: false, row: 4, colorClass: 'ball-blue' },
    { title: '48', value: 48, selected: false, animating: false, row: 4, colorClass: 'ball-blue' },
    { title: '49', value: 49, selected: false, animating: false, row: 5, colorClass: 'ball-green' }
];

export const headTail = [
    {title: '0头', value: 0, selected: false, animating: false, row: 1, tips: '01-09'},
    {title: '1头', value: 1, selected: false, animating: false, row: 1, tips: '11-19'},
    {title: '2头', value: 2, selected: false, animating: false, row: 1, tips: '21-29'},
    {title: '3头', value: 3, selected: false, animating: false, row: 1, tips: '31-39'},
    {title: '4头', value: 4, selected: false, animating: false, row: 1, tips: '41-49'},
    {title: '0尾', value: 5, selected: false, animating: false, row: 2, tips: '10/20/30/40'},
    {title: '1尾', value: 6, selected: false, animating: false, row: 2, tips: '11/21/31/41'},
    {title: '2尾', value: 7, selected: false, animating: false, row: 2, tips: '12/22/32/42'},
    {title: '3尾', value: 8, selected: false, animating: false, row: 2, tips: '13/23/33/43'},
    {title: '4尾', value: 9, selected: false, animating: false, row: 2, tips: '14/24/34/44'},
    {title: '5尾', value: 10, selected: false, animating: false, row: 2, tips: '15/25/35/45'},
    {title: '6尾', value: 11, selected: false, animating: false, row: 2, tips: '16/26/36/46'},
    {title: '7尾', value: 12, selected: false, animating: false, row: 2, tips: '17/27/37/47'},
    {title: '8尾', value: 13, selected: false, animating: false, row: 2, tips: '18/28/38/48'},
    {title: '9尾', value: 14, selected: false, animating: false, row: 2, tips: '19/29/39/49'},
];

export const bsoeTe = [
    {title: '大', value: 0, selected: false, animating: false, row: 1,},
    {title: '小', value: 1, selected: false, animating: false, row: 1,},
    {title: '单', value: 2, selected: false, animating: false, row: 1,},
    {title: '双', value: 3, selected: false, animating: false, row: 1,},
    {title: '大单', value: 4, selected: false, animating: false, row: 2,},
    {title: '小单', value: 5, selected: false, animating: false, row: 2,},
    {title: '大双', value: 6, selected: false, animating: false, row: 2,},
    {title: '小双', value: 7, selected: false, animating: false, row: 2,},
];

export const bsoe = [
    {title: '大', value: 0, sign: 'b', selected: false, row: 1, animating: false},
    {title: '小', value: 1, sign: 's', selected: false, row: 1, animating: false},
    {title: '单', value: 2, sign: 'o', selected: false, row: 1, animating: false},
    {title: '双', value: 3, sign: 'e', selected: false, row: 1, animating: false},
];

export const tail = [
    {title: '0尾', value: 0, selected: false, animating: false, row: 1, tips: '10/20/30/40'},
    {title: '1尾', value: 1, selected: false, animating: false, row: 1, tips: '11/21/31/41'},
    {title: '2尾', value: 2, selected: false, animating: false, row: 1, tips: '12/22/32/42'},
    {title: '3尾', value: 3, selected: false, animating: false, row: 1, tips: '13/23/33/43'},
    {title: '4尾', value: 4, selected: false, animating: false, row: 1, tips: '14/24/34/44'},
    {title: '5尾', value: 5, selected: false, animating: false, row: 1, tips: '15/25/35/45'},
    {title: '6尾', value: 6, selected: false, animating: false, row: 1, tips: '16/26/36/46'},
    {title: '7尾', value: 7, selected: false, animating: false, row: 1, tips: '17/27/37/47'},
    {title: '8尾', value: 8, selected: false, animating: false, row: 1, tips: '18/28/38/48'},
    {title: '9尾', value: 9, selected: false, animating: false, row: 1, tips: '19/29/39/49'},
];

export const waveSeven = [
    { value: 0, sign:'r', title: '红波', colorClass: 'red-wave', numbers: redWave, selected: false, animating: false },
    { value: 1, sign:'b', title: '蓝波', colorClass: 'blue-wave', numbers: blueWave, selected: false, animating: false },
    { value: 2, sign:'g', title: '绿波', colorClass: 'green-wave', numbers: greenWave, selected: false, animating: false },
    { value: 3, sign:'h', title: '和局', colorClass: 'h-wave', numbers: [], selected: false, animating: false },
];

export const wave = [
    { value: 0, title: '红波', colorClass: 'red-wave', numbers: redWave, selected: false, animating: false },
    { value: 1, title: '蓝波', colorClass: 'blue-wave', numbers: blueWave, selected: false, animating: false },
    { value: 2, title: '绿波', colorClass: 'green-wave', numbers: greenWave, selected: false, animating: false },
];

export const waveHalf = [
    { value: 0, sign: 'rb', title: '红大', colorClass: 'red-wave', numbers: ["29","30","34","35","40","45","46"], selected: false, animating: false },
    { value: 1, sign: 'rs', title: '红小', colorClass: 'red-wave', numbers: ["01","02","07","08","12","13","18","19","23","24"], selected: false, animating: false },
    { value: 2, sign: 'ro', title: '红单', colorClass: 'red-wave', numbers: ["01","07","13","19","23","29","35","45"], selected: false, animating: false },
    { value: 3, sign: 're', title: '红双', colorClass: 'red-wave', numbers: ["02","08","12","18","24","30","34","40","46"], selected: false, animating: false },
    { value: 4, sign: 'bb', title: '蓝大', colorClass: 'blue-wave', numbers: ["25","26","31","36","37","41","42","47","48"], selected: false, animating: false },
    { value: 5, sign: 'bs', title: '蓝小', colorClass: 'blue-wave', numbers: ["03","04","09","10","14","15","20"], selected: false, animating: false },
    { value: 6, sign: 'bo', title: '蓝单', colorClass: 'blue-wave', numbers: ["03","09","15","25","31","37","41","47"], selected: false, animating: false },
    { value: 7, sign: 'be', title: '蓝双', colorClass: 'blue-wave', numbers: ["04","10","14","20","26","36","42","48"], selected: false, animating: false },
    { value: 8, sign: 'gb', title: '绿大', colorClass: 'green-wave', numbers: ["27","28","32","33","38","39","43","44"], selected: false, animating: false },
    { value: 9, sign: 'gs', title: '绿小', colorClass: 'green-wave', numbers: ["05","06","11","16","17","21","22"], selected: false, animating: false },
    { value: 10, sign: 'go', title: '绿单', colorClass: 'green-wave', numbers: ["05","11","17","21","27","33","39","43"], selected: false, animating: false },
    { value: 11, sign: 'ge', title: '绿双', colorClass: 'green-wave', numbers: ["06","16","22","28","32","38","44"], selected: false, animating: false }
];

export const zodiac = [
    {title: '鼠', value: 0, selected: false, animating: false, numbers: []},
    {title: '牛', value: 1, selected: false, animating: false, numbers: []},
    {title: '虎', value: 2, selected: false, animating: false, numbers: []},
    {title: '兔', value: 3, selected: false, animating: false, numbers: []},
    {title: '龙', value: 4, selected: false, animating: false, numbers: []},
    {title: '蛇', value: 5, selected: false, animating: false, numbers: []},
    {title: '马', value: 6, selected: false, animating: false, numbers: []},
    {title: '羊', value: 7, selected: false, animating: false, numbers: []},
    {title: '猴', value: 8, selected: false, animating: false, numbers: []},
    {title: '鸡', value: 9, selected: false, animating: false, numbers: []},
    {title: '狗', value: 10, selected: false, animating: false, numbers: []},
    {title: '猪', value: 11, selected: false, animating: false, numbers: []}
];

export const zodiacStat = [
    { title: '天肖', value: 0, selected: false, animating: false, zodiac: [1, 3, 4, 6, 8, 11] },
    { title: '地肖', value: 1, selected: false, animating: false, zodiac: [0, 2, 5, 7, 9, 10] },
    { title: '前肖', value: 2, selected: false, animating: false, zodiac: [0, 1, 2, 3, 4, 5] },
    { title: '后肖', value: 3, selected: false, animating: false, zodiac: [6, 7, 8, 9, 10, 11] },
    { title: '家肖', value: 4, selected: false, animating: false, zodiac: [1, 6, 7, 9, 10, 11] },
    { title: '野肖', value: 5, selected: false, animating: false, zodiac: [0, 2, 3, 4, 5, 8] }
];

export const zodiacAll = [
    { title: '二肖', value: 0, selected: false, animating: false },
    { title: '三肖', value: 1, selected: false, animating: false },
    { title: '四肖', value: 2, selected: false, animating: false },
    { title: '五肖', value: 3, selected: false, animating: false },
    { title: '六肖', value: 4, selected: false, animating: false },
    { title: '七肖', value: 5, selected: false, animating: false }
];

export const zodiacAllBs = [
    {title: '单', value: 0, selected: false, animating: false},
    {title: '双', value: 1, selected: false, animating: false},
];