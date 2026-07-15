import { MethodDefineList } from "@shared/types";
import {
    numbers,headTail,bsoeTe,bsoe,tail,waveSeven,
    wave,waveHalf,zodiac,zodiacStat,zodiacAll,zodiacAllBs
} from "@shared/lottery/lhc/config/define/officialCodeDefine";

const officialDefine: MethodDefineList = {
    Tm: {
        title: '特码',
        desc: {
            title: '',
            content: [
                { title: '', content: '从49个号码中选择1个号码形成1注，所选号码与开奖的特码相同，即中奖。' }
            ],
            example: '投注方案：01；开奖特码：01，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Numbers',
            rows: [{number: numbers, min_selected: 1, max_selected: 49, position: [7]}],
            code_total_count: {min: 1, max: 49},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmHeadTail: {
        title: '特码头尾数',
        desc: {
            title: '',
            content: [
                { title: '', content: '十位为头，个位为尾，选择1个数值形成1注，与特码开奖号码的对应位置的数值相同，即中奖。' }
            ],
            example: '投注方案：头1；开奖特码：10，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'TmHeadTail',
            rows: [{number: headTail, min_selected: 1, max_selected: 15, position: [7],}],
            code_total_count: {min: 1, max: 15},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 12.2500,
                title: '尾0',
                codes: [5],
            },
            {
                prize: 9.8000,
                title: '尾1-9',
                codes: [6,7,8,9,10,11,12,13,14],
            },
            {
                prize: 5.4444,
                title: '头0',
                codes: [0],
            },
            {
                prize: 4.9000,
                title: '头1-4',
                codes: [1,2,3,4],
            },
        ]
    },
    TmZodiacHe: {
        title: '合肖',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择2个生肖组成1注。当开奖的特码在投注的生肖包含的号码范围内（特码49为和，退还本金），即中奖；' }
            ],
            example: '投注方案：龙,牛；开奖特码：在龙或牛包含的号码范围内，即中奖。'
        },
        calc: {
            type: 'combination',
            base: 2,
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'TmZodiacHe',
            rows: [{number: zodiac, min_selected: 2, max_selected: 12, position: [7],}],
            code_total_count: {min: 2, max: 12},
            tips: "至少选择<b>2</b>个生肖",
        },
        levels: [
            {
                prize: 6,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmZodiac: {
        title: '特肖',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个生肖组成1注，当开奖的特码在投注的生肖所对应的号码范围内，即中奖。' }
            ],
            example: '投注方案：龙；开奖特码：在龙包含的号码范围内，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Zodiac',
            rows: [{
                number: zodiac,
                min_selected: 1,
                max_selected: 12,
            }],
            code_total_count: {min: 1, max: 12},
            tips: "至少选择<b>1</b>个生肖",
        },
        levels: [
            {
                prize: 12.25,
                title: '非本命年生肖',
                codes: ['other'],
            },
            {
                prize: 9.8,
                title: '本命年生肖',
                codes: ['first'],
            },
        ]
    },
    TmBsoe: {
        title: '特码形态',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个形态（小：01-24，大：25-48；单：个位数1,3,5,7,9，双：个位数0,2,4,6,8）,与开奖的特码形态一致（特码49为和，退还本金），即中奖。' }
            ],
            example: '投注方案：小；开奖特码：02，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'TmBsoeMix',
            rows: [{
                number: bsoeTe,
                min_selected: 1,
                max_selected: 6,
                position: [7]
            }],
            opposition: [[0, 1], [2,3]],
            code_total_count: {min: 1, max: 12},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 4,
                title: '一等奖',
                codes: [0,1,2,3],
            },
            {
                prize: 2,
                title: '二等奖',
                codes: [4,5,6,7],
            },
        ]
    },
    TmBsoeSum: {
        title: '特合形态',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个形态（小：1-6，大：7-12，单：个位数1,3,5,7,9，双：个位数0,2,4,6,8），与开奖的特码个位与十位之和形态一致（特码49为和，退还本金），即中奖；' }
            ],
            example: '投注方案：小；开奖特码：02，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'TmSumBsoe',
            rows: [{
                number: bsoe,
                min_selected: 1,
                max_selected: 2,
                position: [7]
            }],
            opposition: [[0, 1], [2,3]],
            code_total_count: {min: 1, max: 2},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 2,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmBsoeTail: {
        title: '特尾形态',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个形态（小：0-4，大：5-9，单：1,3,5,7,9，双：0,2,4,6,8），与开奖的特码尾数形态一致（特码49为和，退还本金），即中奖。' }
            ],
            example: '投注方案：小；开奖特码：02，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'TmTailBsoe',
            rows: [{
                number: bsoe,
                min_selected: 1,
                max_selected: 2,
                position: [7]
            }],
            opposition: [[0, 1], [2,3]],
            code_total_count: {min: 1, max: 2},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 2,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmZodiacStat: {
        title: '特肖形态',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个特肖形成1注，与开奖的特码对应的生肖属性一致（特码49为和，退还本金），即中奖。' }
            ],
            example: '投注方案：天肖；开奖特码：在天肖的范围内，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'TmZodiacStat',
            rows: [{
                number: zodiacStat,
                min_selected: 1,
                max_selected: 3,
                position: [7]
            }],
            opposition: [[0, 1], [2,3],[4,5]],
            code_total_count: {min: 1, max: 3},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 2,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmWave: {
        title: '色波',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个色波形成1注，与开奖的特码的色波一致，即中奖。' }
            ],
            example: '投注方案：红波；开奖特码：01，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'TmWave',
            rows: [{
                number: wave,
                min_selected: 1,
                max_selected: 3,
                position: [7]
            }],
            code_total_count: {min: 1, max: 3},
            tips: "至少选择<b>1</b>个色波",
        },
        levels: [
            {
                prize: 3.0625,
                title: '蓝波、绿波',
                codes: [1,2],
            },
            {
                prize: 2.8823,
                title: '红波',
                codes: [0],
            },
        ]
    },
    TmWaveHalf: {
        title: '半波',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个半波形态（小：01-24，大：25-48，单：个位数1,3,5,7,9，双：个位数0,2,4,6,8）形成1注，与开奖的特码的波色和形态均相同（特码49为和，退还本金），即中奖。' }
            ],
            example: '投注方案：红单；开奖特码：19，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'TmWaveHalf',
            rows: [{
                number: waveHalf,
                min_selected: 1,
                max_selected: 12,
                position: [7]
            }],
            code_total_count: {min: 1, max: 12},
            tips: "至少选择<b>1</b>个色波形态",
        },
        levels: [
            {
                prize: 6.8571,
                title: '红大、蓝小、绿小、绿双',
                codes: [0,5,9,11],
            },
            {
                prize: 6,
                title: '红单、绿单、蓝单、蓝双、绿大',
                codes: [2,6,7,8,10],
            },
            {
                prize: 5.3333,
                title: '蓝大、红双',
                codes: [3,4],
            },
            {
                prize: 4.8,
                title: '红小',
                codes: [1],
            },
        ]
    },
    ZmRxy: {
        title: '正码任选一',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个号码形成1注，开出的正码包含投注号码，即中奖。' }
            ],
            example: '投注方案：08；开奖号码：08,*,*,*,*,*+*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Numbers',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 49,
                position: [1,2,3,4,5,6],
            }],
            code_total_count: {min: 1, max: 49},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 8.1666,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmYi: {
        title: '正一特',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个号码形成1注，开出的第一个正码与投注号码相同，即中奖。' }
            ],
            example: '投注方案：08；开奖号码：08,*,*,*,*,*,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Numbers',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 49,
                position: [1],
            }],
            code_total_count: {min: 1, max: 49},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmEr: {
        title: '正二特',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个号码组成1注，开出的第二个正码与投注号码相同，即中奖。' }
            ],
            example: '投注方案：18；开奖号码：*,18,*,*,*,*,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Numbers',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 49,
                position: [2],
            }],
            code_total_count: {min: 1, max: 49},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSan: {
        title: '正三特',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个号码组成1注，开出的第三个正码与投注号码相同，即中奖。' }
            ],
            example: '投注方案：28；开奖号码：*,*,28,*,*,*,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Numbers',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 49,
                position: [3],
                unit_separator: '',
                unit_repeat: false,
            }],
            code_total_count: {min: 1, max: 49},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSi: {
        title: '正四特',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个号码组成1注，开出的第四个正码与投注号码相同，即中奖。' }
            ],
            example: '投注方案：16；开奖号码：*,*,*,16,*,*,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Numbers',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 49,
                position: [4],
            }],
            code_total_count: {min: 1, max: 49},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmWu: {
        title: '正五特',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个号码组成1注，开出的第五个正码与投注号码相同，即中奖。' }
            ],
            example: '投注方案：38；开奖号码：*,*,*,*,38,*,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Numbers',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 49,
                position: [5],
            }],
            code_total_count: {min: 1, max: 49},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmLiu: {
        title: '正六特',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个号码组成1注，开出的第六个正码与投注号码相同，即中奖。' }
            ],
            example: '投注方案：08；开奖号码：*,*,*,*,*,08,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Numbers',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 49,
                position: [6],
            }],
            code_total_count: {min: 1, max: 49},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSiQz: {
        title: '四全中',
        desc: {
            title: '',
            content: [
                { title: '', content: '从49个号码中选择4个号码组成1注，开出的正码包含4个投注号码，即中奖。' }
            ],
            example: '投注方案：08,18,28，38；开奖号码：*,28,38,08,18,*,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 4,
        },
        layout: {
            type: 'Numbers',
            rows: [{
                number: numbers,
                min_selected: 4,
                max_selected: 49,
                position: [1,2,3,4,5,6],
            }],

            code_total_count: {min: 4, max: 49},
            tips: "从<b>49</b>个号码中选择<b>4</b>个号码，形成1注",
        },
        levels: [
            {
                prize: 14125.0666,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSanQz: {
        title: '三全中',
        desc: {
            title: '',
            content: [
                { title: '', content: '从49个号码中选择3个号码组成1注，开出的正码包含3个投注号码，即中奖。' }
            ],
            example: '投注方案：18,28,38；开奖号码：*,28,38,18,*,*+*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 3,
        },
        layout: {
            type: 'Numbers',
            rows: [{
                number: numbers,
                min_selected: 3,
                max_selected: 49,
                position: [1,2,3,4,5,6],
            }],
            code_total_count: {min: 3, max: 49},
            tips: "从<b>49</b>个号码中选择<b>3</b>个号码，形成1注",
        },
        levels: [
            {
                prize: 921.2000,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmErQz: {
        title: '二全中',
        desc: {
            title: '',
            content: [
                { title: '', content: '从49个号码中选择2个号码组成1注，开出的正码包含2个投注号码，即中奖。' }
            ],
            example: '投注方案：18,28；开奖号码：*,28,38,*,*,*,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'Numbers',
            rows: [{
                number: numbers,
                min_selected: 2,
                max_selected: 49,
                position: [1,2,3,4,5,6],
            }],
            code_total_count: {min: 2, max: 49},
            tips: "从<b>49</b>个号码中选择<b>2</b>个号码，形成1注",
        },
        levels: [
            {
                prize: 78.4000,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmZodiac: {
        title: '正肖',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择一个生肖形成1注，当开奖的任何一个正码所属生肖与所选生肖相同时，即为中奖。不论同生肖的号码出现次数，只中一次奖。' }
            ],
            example: '投注方案：牛；开奖正码：在牛包含的号码范围内，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Zodiac',
            rows: [{
                number: zodiac,
                min_selected: 1,
                max_selected: 12,
                position: [6]
            }],
            code_total_count: {min: 1, max: 12},
            tips: "至少选择<b>1</b>个生肖",
        },
        levels: [
            {
                prize: 2.396,
                title: '其它生肖',
                codes: ['other'],
            },
            {
                prize: 2.0193,
                title: '本命生肖',
                codes: ['first'],
            },
        ]
    },
    ZmYiWave: {
        title: '正码一',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择任意1个色波为1注，与正码一位置开出的正码波色相同，即中奖。' }
            ],
            example: '投注方案：正码一绿波；开奖号码：06,*,*,*,*,*,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZmWave',
            rows: [{
                number: wave,
                min_selected: 1,
                max_selected: 18,
                position: [1]
            }],
            code_total_count: {min: 1, max: 18},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 3.0625,
                title: '绿波，蓝波',
                codes: [1,2],
            },
            {
                prize: 2.8823,
                title: '红波',
                codes: [0],
            },
        ]
    },
    ZmErWave: {
        title: '正码二',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择任意1个色波为1注，与正码二位置开出的正码波色相同，即中奖。' }
            ],
            example: '投注方案：正码二绿波；开奖号码：*,06,*,*,*,*,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZmWave',
            rows: [{
                number: wave,
                min_selected: 1,
                max_selected: 18,
                position: [2]
            }],
            code_total_count: {min: 1, max: 18},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 3.0625,
                title: '绿波，蓝波',
                codes: [1,2],
            },
            {
                prize: 2.8823,
                title: '红波',
                codes: [0],
            },
        ]
    },
    ZmSanWave: {
        title: '正码三',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择任意1个色波为1注，与正码三位置开出的正码波色相同，即中奖。' }
            ],
            example: '投注方案：正码三绿波；开奖号码：*,*,06,*,*,*,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZmWave',
            rows: [{
                number: wave,
                min_selected: 1,
                max_selected: 18,
                position: [3]
            }],
            code_total_count: {min: 1, max: 18},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 3.0625,
                title: '绿波，蓝波',
                codes: [1,2],
            },
            {
                prize: 2.8823,
                title: '红波',
                codes: [0],
            },
        ]
    },
    ZmSiWave: {
        title: '正码四',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择任意1个色波为1注，与正码四位置开出的正码波色相同，即中奖。' }
            ],
            example: '投注方案：正码四绿波；开奖号码：*,*,*,06,*,*,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZmWave',
            rows: [{
                number: wave,
                min_selected: 1,
                max_selected: 18,
                position: [4]
            }],
            code_total_count: {min: 1, max: 18},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 3.0625,
                title: '绿波，蓝波',
                codes: [1,2],
            },
            {
                prize: 2.8823,
                title: '红波',
                codes: [0],
            },
        ]
    },
    ZmWuWave: {
        title: '正码五',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择任意1个色波为1注，与正码五位置开出的正码波色相同，即中奖。' }
            ],
            example: '投注方案：正码五绿波；开奖号码：*,*,*,*,06,*,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZmWave',
            rows: [{
                number: wave,
                min_selected: 1,
                max_selected: 18,
                position: [5]
            }],
            code_total_count: {min: 1, max: 18},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 3.0625,
                title: '绿波，蓝波',
                codes: [1,2],
            },
            {
                prize: 2.8823,
                title: '红波',
                codes: [0],
            },
        ]
    },
    ZmLiuWave: {
        title: '正码六',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择任意1个色波为1注，与正码六位置开出的正码波色相同，即中奖。' }
            ],
            example: '投注方案：正码六绿波；开奖号码：*,*,*,*,*,06,*，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZmWave',
            rows: [{
                number: wave,
                min_selected: 1,
                max_selected: 18,
                position: [6]
            }],
            code_total_count: {min: 1, max: 18},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 3.0625,
                title: '绿波，蓝波',
                codes: [1,2],
            },
            {
                prize: 2.8823,
                title: '红波',
                codes: [0],
            },
        ]
    },
    ZtBsoeSum: {
        title: '总和',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个形态（大：>175，小：<175，单：个位数1,3,5,7,9，双：0,2,4,6,8）,与7个号码的和值的形态相同，即中奖（当和值为175，投注和值大、小的注单退还本金）；。' }
            ],
            example: '投注方案：小；开奖号码：和值=168,即中奖'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZtBsoe',
            rows: [{
                number: bsoe,
                min_selected: 1,
                max_selected: 2,
                position: [1,2,3,4,5,6,7],
            }],
            opposition: [[0, 1], [2,3]],
            code_total_count: {min: 1, max: 2},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 2,
                title: '一等奖',
                codes: [0,1,2,3],
            },
        ]
    },
    ZtTail: {
        title: '平特尾数',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个尾数，开奖的7个号码中的尾数包含所选尾数，即中奖。且为0尾，即中0尾奖，为1-9尾，即中1-9尾奖； 不论相同尾数出现的次数，只中一次奖。' }
            ],
            example: '投注方案：8；开奖号码：含8尾，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZtTail',
            rows: [{
                number: tail,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3,4,5,6,7]
            }],
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 2.1199,
                title: '0尾',
                codes: [0],
            },
            {
                prize: 1.8053,
                title: '1-9尾',
                codes: [1,2,3,4,5,6,7,8,9],
            },
        ]
    },
    ZtZxBz: {
        title: '自选不中',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择5-11个号码，形成一注。所选的任意5-11个号码组合里的号码，选5个号码均不在当期的开奖号码里即中七等奖，选6个号码均不在当期的开奖号码里即中六等奖，以此类推，选11个号码均不在当期的开奖号码里即中一等奖。' }
            ],
            example: '投注方案：01,02,03,06,08；开奖号码：05,07,11,12,13,14+18，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        random_type: 'random',
        calc: {
            type: 'only-one',
            base: 5,
        },
        layout: {
            type: 'Numbers',
            rows: [{
                number: numbers,
                min_selected: 5,
                max_selected: 11,
                position: [1,2,3,4,5,6,7],
            }],
            code_total_count: {min: 5, max: 11},
            tips: "至少选择<b>5</b>个号码",
        },
        levels: [
            {
                prize: 6.8065,
                title: '11不中',
                codes: [],
            },
            {
                prize: 5.5848,
                title: '10不中',
                codes: [],
            },
            {
                prize: 4.6075,
                title: '9不中',
                codes: [],
            },
            {
                prize: 3.8208,
                title: '8不中',
                codes: [],
            },
            {
                prize: 3.1840,
                title: '7不中',
                codes: [],
            },
            {
                prize: 2.6657,
                title: '6不中',
                codes: [],
            },
            {
                prize: 2.2416,
                title: '5不中',
                codes: [],
            },
        ]
    },
    ZtErLw: {
        title: '二连尾',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择2个尾数组成1注，所选的2个尾数在开奖号码的尾号中都有出现，即中奖。且含0尾，即中0尾奖，若不含0尾，即中1-9尾奖。 不论相同尾数次数，只中一次奖。' }
            ],
            example: '投注方案：6,8；开奖号码：02,06,08,22,30,31,32，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'ZtTail',
            rows: [{
                number: tail,
                min_selected: 2,
                max_selected: 10,
                position: [1,2,3,4,5,6,7],
            }],
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个号码",
        },
        levels: [
            {
                prize: 4.1211,
                title: '含尾0',
                codes: [0],
            },
            {
                prize: 3.4861,
                title: '只含尾1-9',
                codes: [1,2,3,4,5,6,7,8,9],
            },
        ]
    },
    ZtSanLw: {
        title: '三连尾',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择3个尾数组成1注，所选的3个尾数在开奖号码的尾号中都有出现，即中奖。且含0尾，即中0尾奖，若不含0尾，即中1-9尾奖。 不论相同尾数次数，只中一次奖' }
            ],
            example: '投注方案：6,8,9；开奖号码：01,06,08,19,20,31,32，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 3,
        },
        layout: {
            type: 'ZtTail',
            rows: [{
                number: tail,
                min_selected: 3,
                max_selected: 10,
                position: [1,2,3,4,5,6,7],
            }],
            code_total_count: {min: 3, max: 10},
            tips: "至少选择<b>3</b>个号码",
        },
        levels: [
            {
                prize: 8.7445,
                title: '含尾0',
                codes: [0],
            },
            {
                prize: 7.3406,
                title: '只含尾1-9',
                codes: [1,2,3,4,5,6,7,8,9],
            },
        ]
    },
    ZtSiLw: {
        title: '四连尾',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择4个尾数组成1注，所选的4个尾数在开奖号码的尾号中都有出现，即中奖。且含0尾，即中0尾奖，若不含0尾，即中1-9尾奖。 不论相同尾数次数，只中一次奖' }
            ],
            example: '投注方案：1,3,6,8；开奖号码：11,16,18,23,10,11,12，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 4,
        },
        layout: {
            type: 'ZtTail',
            rows: [{
                number: tail,
                min_selected: 4,
                max_selected: 10,
                position: [1,2,3,4,5,6,7],
            }],
            code_total_count: {min: 4, max: 10},
            tips: "至少选择<b>4</b>个号码",
        },
        levels: [
            {
                prize: 20.8730,
                title: '含尾0',
                codes: [0],
            },
            {
                prize: 17.3668,
                title: '只含尾1-9',
                codes: [1,2,3,4,5,6,7,8,9],
            },
        ]
    },
    ZtWuLw: {
        title: '五连尾',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择5个尾数组成1注，所选的5个尾数在开奖号码的尾号中都有出现，即中奖。且含0尾，即中0尾奖，若不含0尾，即中1-9尾奖。 不论相同尾数次数，只中一次奖。' }
            ],
            example: '投注方案：0,2,6,7,8；开奖号码：18,06,17,22,30,11,12，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 5,
        },
        layout: {
            type: 'ZtTail',
            rows: [{
                number: tail,
                min_selected: 5,
                max_selected: 10,
                position: [1,2,3,4,5,6,7],
            }],
            code_total_count: {min: 5, max: 10},
            tips: "至少选择<b>5</b>个号码",

        },
        levels: [
            {
                prize: 58.9875,
                title: '含尾0',
                codes: [0],
            },
            {
                prize: 48.5657,
                title: '只含尾1-9',
                codes: [1,2,3,4,5,6,7,8,9],
            },
        ]
    },
    ZtErZt: {
        title: '二中特',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择2个号码即组成1注，开奖号码包含所选号码，且2个号码都是开奖号码之正码，则中二正，若其中一 个是正码，一个是特别号码，则中一特一正。' }
            ],
            example: '投注方案：08,18；开奖号码：01,07,08,18,13,11,12，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'Numbers',
            rows: [{
                number: numbers,
                min_selected: 2,
                max_selected: 49,
                position: [1,2,3,4,5,6,7],
            }],
            code_total_count: {min: 2, max: 49},
            tips: "至少选择<b>2</b>个号码",
        },
        levels: [
            {
                prize: 63.2258,
                title: '中二正',
                codes: [],
            },
            {
                prize: 37.9354,
                title: '中一特一正',
                codes: [],
            },
        ]
    },
    ZtTc: {
        title: '特串',
        desc: {
            title: '',
            content: [
                { title: '', content: '2个号码组成1注，其中1个号码与开奖的特码相同，另一个号码与任意一个正码相同，即中奖。' }
            ],
            example: '投注方案：06,08；开奖号码：正码包含06，特码08，反之亦可，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'Numbers',
            rows: [{
                number: numbers,
                min_selected: 2,
                max_selected: 49,
                position: [1,2,3,4,5,6,7],
            }],
            code_total_count: {min: 2, max: 49},
            tips: "至少选择<b>2</b>个号码",
        },
        levels: [
            {
                prize: 196.0000,
                title: '一等奖',
                codes: [],
            },
        ]
    },

    ZtZodiacYi: {
        title: '一肖',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个生肖组成1注，开奖的7个号码所对应的生肖包含这个生肖，即中奖。且投注的生肖非本命年生肖中一等奖，若为本命年生肖中二等奖。 不论同生肖的号码出现次数，只中一次奖。' }
            ],
            example: '投注方案：马；开奖号码：在马包含的号码范围内，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Zodiac',
            rows: [{
                number: zodiac,
                min_selected: 1,
                max_selected: 12,
                position: [1,2,3,4,5,6,7]
            }],
            code_total_count: {min: 1, max: 12},
            tips: "至少选择<b>1</b>个生肖",
        },
        levels: [
            {
                prize: 12.25,
                title: '非本命年生肖',
                codes: ['other'],
            },
            {
                prize: 9.8,
                title: '本命年生肖',
                codes: ['first'],
            },
        ]
    },
    ZtZodiacEr: {
        title: '二连肖',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择2个生肖组成1注，开奖的7个号码所对应的生肖包含这2个生肖（顺序不限），即中奖。且投注的2个生肖不含本命年生肖中一等奖，若含本命年生肖中二等奖。 不论同生肖的号码出现次数，只中一次奖。' }
            ],
            example: '投注方案：龙,虎；开奖号码：有出现龙、虎对应的号码，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'Zodiac',
            rows: [{
                number: zodiac,
                min_selected: 2,
                max_selected: 12,
                position: [1,2,3,4,5,6,7]
            }],
            code_total_count: {min: 2, max: 12},
            tips: "至少选择<b>2</b>个生肖",
        },
        levels: [
            {
                prize: 4.8742,
                title: '非本命年生肖',
                codes: ['other'],
            },
            {
                prize: 4.1211,
                title: '本命年生肖',
                codes: ['first'],
            },
        ]
    },
    ZtZodiacSan: {
        title: '三连肖',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择3个生肖组成1注，开奖的7个号码所对应的生肖包含这3个生肖（顺序不限），即中奖。且投注的3个生肖不含本命年生肖中一等奖，若含本命年生肖中二等奖。 不论同生肖的号码出现次数，只中一次奖。' }
            ],
            example: '投注方案：龙,虎,牛；开奖号码：有出现龙、虎、牛对应的号码，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 3,
        },
        layout: {
            type: 'Zodiac',
            rows: [{
                number: zodiac,
                min_selected: 3,
                max_selected: 12,
                position: [1,2,3,4,5,6,7]
            }],
            code_total_count: {min: 3, max: 12},
            tips: "至少选择<b>3</b>个生肖",
        },
        levels: [
            {
                prize: 12.4276,
                title: '非本命年生肖',
                codes: ['other'],
            },
            {
                prize: 10.4221,
                title: '本命年生肖',
                codes: ['first'],
            },
        ]
    },
    ZtZodiacSi: {
        title: '四连肖',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择4个生肖组成1注，开奖的7个号码所对应的生肖包含这4个生肖（顺序不限），即中奖。且投注的4个生肖不含本命年生肖中一等奖，若含本命年生肖中二等奖。 不论同生肖的号码出现次数，只中一次奖。' }
            ],
            example: '投注方案：龙,虎,牛,马；开奖号码：有出现龙、虎、牛、马对应的号码，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 4,
        },
        layout: {
            type: 'Zodiac',
            rows: [{
                number: zodiac,
                min_selected: 4,
                max_selected: 12,
                position: [1,2,3,4,5,6,7]
            }],
            code_total_count: {min: 4, max: 12},
            tips: "至少选择<b>4</b>个生肖",
        },
        levels: [
            {
                prize: 36.3384,
                title: '非本命年生肖',
                codes: ['other'],
            },
            {
                prize: 30.1935,
                title: '本命年生肖',
                codes: ['first'],
            },
        ]
    },
    ZtZodiacWu: {
        title: '五连肖',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择5个生肖组成1注，开奖的7个号码所对应的生肖包含这5个生肖（顺序不限），即中奖。且投注的5个生肖不含本命年生肖中一等奖，若含本命年生肖中二等奖。 不论同生肖的号码出现次数，只中一次奖。' }
            ],
            example: '投注方案：龙,虎,牛,马,猪；开奖号码：有出现龙、虎、牛、马、猪对应的号码，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 5,
        },
        layout: {
            type: 'Zodiac',
            rows: [{
                number: zodiac,
                min_selected: 5,
                max_selected: 12,
                position: [1,2,3,4,5,6,7]
            }],
            code_total_count: {min: 5, max: 12},
            tips: "至少选择<b>5</b>个生肖",

        },
        levels: [
            {
                prize: 128.8591,
                title: '非本命年生肖',
                codes: ['other'],
            },
            {
                prize: 105.935,
                title: '本命年生肖',
                codes: ['first'],
            },
        ]
    },
    ZtZodiacAll: {
        title: '总肖',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个总肖数，开奖的7个号码对应的不同生肖的数量与投注的总肖数量相同，即为中奖。' }
            ],
            example: '投注方案：二肖；开奖号码：不同生肖的数量是2个，即为中奖。'
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZtZodiacAll',
            rows: [{
                number: zodiacAll,
                min_selected: 1,
                max_selected: 6,
                position: [1,2,3,4,5,6,7]
            }],
            code_total_count: {min: 1, max: 6},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 102751.8947,
                title: '二肖',
                codes: [0],
            },
            {
                prize: 396.4000,
                title: '三肖',
                codes: [1],
            },
            {
                prize: 17.1931,
                title: '四肖',
                codes: [2],
            },
            {
                prize: 5.7773,
                title: '五肖',
                codes: [3],
            },
            {
                prize: 3.2642,
                title: '六肖',
                codes: [4],
            },
            {
                prize: 2.1745,
                title: '七肖',
                codes: [5],
            },
        ]
    },
    ZtZodiacAllBs: {
        title: '总肖单双',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择一个形态（单：3,5,7；双：2,4,6），开奖的7个号码的不同生肖数量与所选投注形态一致，则中奖。' }
            ],
            example: '投注方案：单；开奖号码：不同的生肖数为单数，即中奖。'
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZtZodiacAllBs',
            rows: [{
                number: zodiacAllBs,
                min_selected: 1,
                max_selected: 2,
                position: [1,2,3,4,5,6,7]
            }],
            opposition: [[0, 1]],
            code_total_count: {min: 1, max: 2},
            tips: "至少选择<b>1</b>个形态", // Corrected based on min_selected
        },
        levels: [
            {
                prize: 2.0748,
                title: '单',
                codes: [0],
            },
            {
                prize: 1.9303,
                title: '双',
                codes: [1],
            },
        ]
    },
    ZtWaveSeven: {
        title: '七色波',
        desc: {
            title: '',
            content: [
                { title: '', content: '投注1个波色，即形成1注。以开奖的7个色波中，那种颜色最多为中奖。 开出的6个正码各以1个色波计，特别号以1.5个色波计。 而以下3种结果视为和局。 1： 6个正码开出3蓝波3绿波，而特别码是红波 2： 6个正码开出3蓝波3红波，而特别码是绿波 3： 6个正码开出3绿波3红波，而特别码是蓝波 如果出现和局，所有投注红，绿，蓝七色波的注单退还本金；可投注和局。' }
            ],
            example: '投注方案：红波，开奖号码：红波的号码最多，即中奖。'
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZtWave',
            rows: [{
                number: waveSeven,
                min_selected: 1,
                max_selected: 4,
                position: [1,2,3,4,5,6,7]
            }],
            code_total_count: {min: 1, max: 4},
            tips: "至少选择<b>1</b>种形态",
        },
        levels: [
            {
                prize: 34.3272,
                title: '和',
                codes: [3],
            },
            {
                prize: 3.1415,
                title: '蓝波、绿波',
                codes: [1,2],
            },
            {
                prize: 2.7520,
                title: '红波',
                codes: [0],
            },
        ]
    },
};
export default officialDefine;