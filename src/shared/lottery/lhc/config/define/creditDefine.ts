import {
    bs,
    oe,
    bsSum,
    oeSum,
    bsTail,
    wave,
    numbers,
    bsoeMix,
    zodiacStatTd,
    zodiacStatQh,
    zodiacStatJy,
    waveSeven,
    waveHalf,
    waveHalfHalf,
    head,
    tail,
    zodiac,
    waveBall,
    zodiacAll,
    zodiacAllStat
} from "@lottery/lhc/config/define/creditCodeDefine";
import { MethodDefineList } from "@shared/types";

const creditDefine: MethodDefineList = {
    ZmYiBs: {
        title: '正码一&大小(号码)',
        desc: {
            title: '大小(号码)',
            content: [
                {title: '', content: '开奖号码的正码一位置≥25为“大”，≤24为“小”，该正码为49时为和，退还本金。'},
            ],
            example: '投注方案：大；开奖正码一：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [{number: bs, position: [1]}],
            opposition: [[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmYiOe: {
        title: '正码一&单双(号码)',
        desc: {
            title: '单双(号码)',
            content: [
                {title: '', content: '开奖号码的正码一位置1、3、5、7、9为单，0、2、4、6、8为“双”，该正码为49为和，退还本金'},
            ],
            example: '投注方案：双；开奖正码一：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [{
                number: oe,
                position: [1],
            }],
            opposition: [[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmYiSumBs: {
        title: '正码一&大小(合数)',
        desc: {
            title: '大小(合数)',
            content: [
                {title: '', content: '开奖号码正码一的十位数与个位数之和≥7为“合大”，≤6为“合小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合小；开奖正码一：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsSum',
            rows: [{number: bsSum, position: [1],}],
            opposition:[ [1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmYiSumOe: {
        title: '正码一&单双(合数)',
        desc: {
            title: '单双(合数)',
            content: [
                {title: '', content: '开奖号码正码一的十位数与个位数之和的个位数为1、3、5、7、9为“合单”，0、2、4、6、8为“合双”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合单；开奖正码一：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'OeSum',
            rows: [{number: oeSum, position: [1],}],
            opposition:[ [1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmYiTailBs: {
        title: '正码一&大小(尾数)',
        desc: {
            title: '大小(尾数)',
            content: [
                {title: '', content: '开奖号码正码一的个位数≥5为“尾大”，≤4为“尾小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：尾小；开奖正码一：21，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsTail',
            rows: [{number: bsTail, position: [1],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmYiWave: {
        title: '正码一&波',
        desc: {
            title: '波',
            content: [
                {title: '红波', content: '01,02,07,08,12,13,18,19,23,24,29,30,34,35,40,45,46'},
                {title: '蓝波', content: '03,04,09,10,14,15,20,25,26,31,36,37,41,42,47,48'},
                {title: '绿波', content: '05,06,11,16,17,21,22,27,28,32,33,38,39,43,44,49'},
            ],
            example: '投注方案：蓝波；开奖正码一：22，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Wave',
            rows: [{number: wave, position: [1],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmYiNumber: {
        title: '正码一&号码',
        desc: {
            title: '号码',
            content: [
                {title: '', content: '从49个号码中选择1个号码组成1注，所选号码与开奖的正码位置相同即中奖。'},
            ],
            example: '投注方案：08；开奖正码一：08，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Number',
            rows: [{number: numbers, position: [1], is_circle: true}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },

    ZmErBs: {
        title: '正码二&大小(号码)',
        desc: {
            title: '大小(号码)',
            content: [
                {title: '', content: '开奖号码的正码二位置≥25为“大”，≤24为“小”，该正码为49时为和，退还本金。'},
            ],
            example: '投注方案：大；开奖正码二：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [{number: bs, position: [2],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmErOe: {
        title: '正码二&单双(号码)',
        desc: {
            title: '单双(号码)',
            content: [
                {title: '', content: '开奖号码的正码二位置1、3、5、7、9为单，0、2、4、6、8为“双”，该正码为49为和，退还本金'},
            ],
            example: '投注方案：双；开奖正码二：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [{number: oe, position: [2],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmErSumBs: {
        title: '正码二&大小(合数)',
        desc: {
            title: '大小(合数)',
            content: [
                {title: '', content: '开奖号码正码二的十位数与个位数之和≥7为“合大”，≤6为“合小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合小；开奖正码二：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsSum',
            rows: [{number: bsSum, position: [2],}],
            opposition: [[1, 2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmErSumOe: {
        title: '正码二&单双(合数)',
        desc: {
            title: '单双(合数)',
            content: [
                {title: '', content: '开奖号码正码二的十位数与个位数之和的个位数为1、3、5、7、9为“合单”，0、2、4、6、8为“合双”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合单；开奖正码二：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'OeSum',
            rows: [{number: oeSum, position: [2],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmErTailBs: {
        title: '正码二&大小(尾数)',
        desc: {
            title: '大小(尾数)',
            content: [
                {title: '', content: '开奖号码正码二的个位数≥5为“尾大”，≤4为“尾小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：尾小；开奖正码二：21，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsTail',
            rows: [{number: bsTail, position: [2],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmErWave: {
        title: '正码二&波',
        desc: {
            title: '波',
            content: [
                {title: '红波', content: '01,02,07,08,12,13,18,19,23,24,29,30,34,35,40,45,46'},
                {title: '蓝波', content: '03,04,09,10,14,15,20,25,26,31,36,37,41,42,47,48'},
                {title: '绿波', content: '05,06,11,16,17,21,22,27,28,32,33,38,39,43,44,49'},
            ],
            example: '投注方案：蓝波；开奖正码二：22，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Wave',
            rows: [{number: wave, position: [2],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmErNumber: {
        title: '正码二&号码',
        desc: {
            title: '号码',
            content: [
                {title: '', content: '从49个号码中选择1个号码组成1注，所选号码与开奖的正码位置相同即中奖。'},
            ],
            example: '投注方案：08；开奖正码二：08，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Number',
            rows: [{number: numbers, position: [2], is_circle: true}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },

    ZmSanBs: {
        title: '正码三&大小(号码)',
        desc: {
            title: '大小(号码)',
            content: [
                {title: '', content: '开奖号码的正码三位置≥25为“大”，≤24为“小”，该正码为49时为和，退还本金。'},
            ],
            example: '投注方案：大；开奖正码三：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [{number: bs, position: [3],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSanOe: {
        title: '正码三&单双(号码)',
        desc: {
            title: '单双(号码)',
            content: [
                {title: '', content: '开奖号码的正码三位置1、3、5、7、9为单，0、2、4、6、8为“双”，该正码为49为和，退还本金'},
            ],
            example: '投注方案：双；开奖正码三：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [{number: oe, position: [3],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSanSumBs: {
        title: '正码三&大小(合数)',
        desc: {
            title: '大小(合数)',
            content: [
                {title: '', content: '开奖号码正码三的十位数与个位数之和≥7为“合大”，≤6为“合小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合小；开奖正码三：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsSum',
            rows: [{number: bsSum, position: [3],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSanSumOe: {
        title: '正码三&单双(合数)',
        desc: {
            title: '单双(合数)',
            content: [
                {title: '', content: '开奖号码正码三的十位数与个位数之和的个位数为1、3、5、7、9为“合单”，0、2、4、6、8为“合双”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合单；开奖正码三：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'OeSum',
            rows: [{number: oeSum, position: [3],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSanTailBs: {
        title: '正码三&大小(尾数)',
        desc: {
            title: '大小(尾数)',
            content: [
                {title: '', content: '开奖号码正码三的个位数≥5为“尾大”，≤4为“尾小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：尾小；开奖正码三：21，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsTail',
            rows: [{number: bsTail, position: [3],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSanWave: {
        title: '正码三&波',
        desc: {
            title: '波',
            content: [
                {title: '红波', content: '01,02,07,08,12,13,18,19,23,24,29,30,34,35,40,45,46'},
                {title: '蓝波', content: '03,04,09,10,14,15,20,25,26,31,36,37,41,42,47,48'},
                {title: '绿波', content: '05,06,11,16,17,21,22,27,28,32,33,38,39,43,44,49'},
            ],
            example: '投注方案：蓝波；开奖正码三：22，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Wave',
            rows: [{number: wave, position: [3],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSanNumber: {
        title: '正码三&号码',
        desc: {
            title: '号码',
            content: [
                {title: '', content: '从49个号码中选择1个号码组成1注，所选号码与开奖的正码位置相同即中奖。'},
            ],
            example: '投注方案：08；开奖正码三：08，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Number',
            rows: [{number: numbers, position: [3], is_circle: true}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },

    ZmSiBs: {
        title: '正码四&大小(号码)',
        desc: {
            title: '大小(号码)',
            content: [
                {title: '', content: '开奖号码的正码四位置≥25为“大”，≤24为“小”，该正码为49时为和，退还本金。'},
            ],
            example: '投注方案：大；开奖正码四：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [{number: bs, position: [4],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSiOe: {
        title: '正码四&单双(号码)',
        desc: {
            title: '单双(号码)',
            content: [
                {title: '', content: '开奖号码的正码四位置1、3、5、7、9为单，0、2、4、6、8为“双”，该正码为49为和，退还本金'},
            ],
            example: '投注方案：双；开奖正码四：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [{number: oe, position: [4],}],
            opposition: [[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSiSumBs: {
        title: '正码四&大小(合数)',
        desc: {
            title: '大小(合数)',
            content: [
                {title: '', content: '开奖号码正码四的十位数与个位数之和≥7为“合大”，≤6为“合小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合小；开奖正码四：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsSum',
            rows: [{number: bsSum, position: [4],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSiSumOe: {
        title: '正码四&单双(合数)',
        desc: {
            title: '单双(合数)',
            content: [
                {title: '', content: '开奖号码正码四的十位数与个位数之和的个位数为1、3、5、7、9为“合单”，0、2、4、6、8为“合双”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合单；开奖正码四：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'OeSum',
            rows: [{number: oeSum, position: [4],}],
            opposition: [[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSiTailBs: {
        title: '正码四&大小(尾数)',
        desc: {
            title: '大小(尾数)',
            content: [
                {title: '', content: '开奖号码正码四的个位数≥5为“尾大”，≤4为“尾小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：尾小；开奖正码四：21，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsTail',
            rows: [{number: bsTail, position: [4],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSiWave: {
        title: '正码四&波',
        desc: {
            title: '波',
            content: [
                {title: '红波', content: '01,02,07,08,12,13,18,19,23,24,29,30,34,35,40,45,46'},
                {title: '蓝波', content: '03,04,09,10,14,15,20,25,26,31,36,37,41,42,47,48'},
                {title: '绿波', content: '05,06,11,16,17,21,22,27,28,32,33,38,39,43,44,49'},
            ],
            example: '投注方案：蓝波；开奖正码四：22，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Wave',
            rows: [{number: wave, position: [4],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmSiNumber: {
        title: '正码四&号码',
        desc: {
            title: '号码',
            content: [
                {title: '', content: '从49个号码中选择1个号码组成1注，所选号码与开奖的正码位置相同即中奖。'},
            ],
            example: '投注方案：08；开奖正码四：08，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Number',
            rows: [{number: numbers, position: [4], is_circle: true}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },

    ZmWuBs: {
        title: '正码五&大小(号码)',
        desc: {
            title: '大小(号码)',
            content: [
                {title: '', content: '开奖号码的正码五位置≥25为“大”，≤24为“小”，该正码为49时为和，退还本金。'},
            ],
            example: '投注方案：大；开奖正码五：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [{number: bs, position: [5],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmWuOe: {
        title: '正码五&单双(号码)',
        desc: {
            title: '单双(号码)',
            content: [
                {title: '', content: '开奖号码的正码五位置1、3、5、7、9为单，0、2、4、6、8为“双”，该正码为49为和，退还本金'},
            ],
            example: '投注方案：双；开奖正码五：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [{number: oe, position: [5],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmWuSumBs: {
        title: '正码五&大小(合数)',
        desc: {
            title: '大小(合数)',
            content: [
                {title: '', content: '开奖号码正码五的十位数与个位数之和≥7为“合大”，≤6为“合小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合小；开奖正码五：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsSum',
            rows: [{number: bsSum, position: [5],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmWuSumOe: {
        title: '正码五&单双(合数)',
        desc: {
            title: '单双(合数)',
            content: [
                {title: '', content: '开奖号码正码五的十位数与个位数之和的个位数为1、3、5、7、9为“合单”，0、2、4、6、8为“合双”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合单；开奖正码五：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'OeSum',
            rows: [{number: oeSum, position: [5],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmWuTailBs: {
        title: '正码五&大小(尾数)',
        desc: {
            title: '大小(尾数)',
            content: [
                {title: '', content: '开奖号码正码五的个位数≥5为“尾大”，≤4为“尾小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：尾小；开奖正码五：21，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsTail',
            rows: [{number: bsTail, position: [5],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmWuWave: {
        title: '正码五&波',
        desc: {
            title: '波',
            content: [
                {title: '红波', content: '01,02,07,08,12,13,18,19,23,24,29,30,34,35,40,45,46'},
                {title: '蓝波', content: '03,04,09,10,14,15,20,25,26,31,36,37,41,42,47,48'},
                {title: '绿波', content: '05,06,11,16,17,21,22,27,28,32,33,38,39,43,44,49'},
            ],
            example: '投注方案：蓝波；开奖正码五：22，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Wave',
            rows: [{number: wave, position: [5],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmWuNumber: {
        title: '正码五&号码',
        desc: {
            title: '号码',
            content: [
                {title: '', content: '从49个号码中选择1个号码组成1注，所选号码与开奖的正码位置相同即中奖。'},
            ],
            example: '投注方案：08；开奖正码五：08，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Number',
            rows: [{number: numbers, position: [5], is_circle: true}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },

    ZmLiuBs: {
        title: '正码六&大小(号码)',
        desc: {
            title: '大小(号码)',
            content: [
                {title: '', content: '开奖号码的正码六位置≥25为“大”，≤24为“小”，该正码为49时为和，退还本金。'},
            ],
            example: '投注方案：大；开奖正码六：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [{number: bs, position: [6],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmLiuOe: {
        title: '正码六&单双(号码)',
        desc: {
            title: '单双(号码)',
            content: [
                {title: '', content: '开奖号码的正码六位置1、3、5、7、9为单，0、2、4、6、8为“双”，该正码为49为和，退还本金'},
            ],
            example: '投注方案：双；开奖正码六：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [{number: oe, position: [6],}],
            opposition:[ [1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmLiuSumBs: {
        title: '正码六&大小(合数)',
        desc: {
            title: '大小(合数)',
            content: [
                {title: '', content: '开奖号码正码六的十位数与个位数之和≥7为“合大”，≤6为“合小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合小；开奖正码六：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsSum',
            rows: [{number: bsSum, position: [6],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmLiuSumOe: {
        title: '正码六&单双(合数)',
        desc: {
            title: '单双(合数)',
            content: [
                {title: '', content: '开奖号码正码六的十位数与个位数之和的个位数为1、3、5、7、9为“合单”，0、2、4、6、8为“合双”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合单；开奖正码六：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'OeSum',
            rows: [{number: oeSum, position: [6],}],
            opposition:[ [1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmLiuTailBs: {
        title: '正码六&大小(尾数)',
        desc: {
            title: '大小(尾数)',
            content: [
                {title: '', content: '开奖号码正码六的个位数≥5为“尾大”，≤4为“尾小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：尾小；开奖正码六：21，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsTail',
            rows: [{number: bsTail, position: [6],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmLiuWave: {
        title: '正码六&波',
        desc: {
            title: '波',
            content: [
                {title: '红波', content: '01,02,07,08,12,13,18,19,23,24,29,30,34,35,40,45,46'},
                {title: '蓝波', content: '03,04,09,10,14,15,20,25,26,31,36,37,41,42,47,48'},
                {title: '绿波', content: '05,06,11,16,17,21,22,27,28,32,33,38,39,43,44,49'},
            ],
            example: '投注方案：蓝波；开奖正码六：25，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Wave',
            rows: [{number: wave, position: [6],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmLiuNumber: {
        title: '正码六&号码',
        desc: {
            title: '号码',
            content: [
                {title: '', content: '从49个号码中选择1个号码组成1注，所选号码与开奖的正码位置相同即中奖。'},
            ],
            example: '投注方案：08；开奖正码六：08，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Number',
            rows: [{number: numbers, position: [6], is_circle: true}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },

    ZmRxy: {
        title: '正码&任选一',
        desc: {
            title: '任选一',
            content: [
                {title: '任选一', content: '选择1个号码组成1注，开奖的正码包含投注号码即中奖'},
            ],
            example: '投注方案：开奖号码02,08,13,14,15,16 + 28，投注08，即中奖.',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bsoe',
            rows: [{number: numbers, position: [1,2,3,4,5,6],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmZodiac: {
        title: '正码&正肖',
        desc: {
            title: '正肖',
            content: [
                {title: '任选一', content: '选择1个号码组成1注，开奖的正码包含投注号码即中奖'},
            ],
            example: '投注方案：开奖号码02,08,13,14,15,16 + 28，投注08，即中奖.',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Zodiac',
            rows: [{number: zodiac, position: [7],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZmWaveSeven: {
        title: '正码&七色波',
        desc: {
            title: '七色波',
            content: [
                {title: '任选一', content: '选择1个号码组成1注，开奖的正码包含投注号码即中奖'},
            ],
            example: '投注方案：开奖号码02,08,13,14,15,16 + 28，投注08，即中奖.',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'WaveSeven',
            rows: [{number: waveSeven, position: [7],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },

    TmBs: {
        title: '特码&大小(号码)',
        desc: {
            title: '特码&大小(号码)',
            content: [
                {title: '', content: '开奖号码的正码位置≥25为“大”，≤24为“小”，该正码为49时为和，退还本金。'},
            ],
            example: '投注方案：大；开奖正码六：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [{number: bs, position: [7],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmOe: {
        title: '特码&单双(号码)',
        desc: {
            title: '特码&单双(号码)',
            content: [
                {title: '', content: '开奖号码的正码位置1、3、5、7、9为单，0、2、4、6、8为“双”，该正码为49为和，退还本金'},
            ],
            example: '投注方案：双；开奖正码六：38，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [{number: oe, position: [7],}],
            opposition: [[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmSumBs: {
        title: '特码&大小(合数)',
        desc: {
            title: '特码&大小(合数)',
            content: [
                {title: '', content: '开奖号码的十位数与个位数之和≥7为“合大”，≤6为“合小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合小；开奖正码六：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsSum',
            rows: [{number: bsSum, position: [7],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmSumOe: {
        title: '特码&单双(合数)',
        desc: {
            title: '特码&单双(合数)',
            content: [
                {title: '', content: '开奖号码的十位数与个位数之和的个位数为1、3、5、7、9为“合单”，0、2、4、6、8为“合双”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：合单；开奖正码六：12，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'OeSum',
            rows:[{number: oeSum, position: [7],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmTailBs: {
        title: '特码&大小(尾数)',
        desc: {
            title: '特码&大小(尾数)',
            content: [
                {title: '', content: '开奖号码的个位数≥5为“尾大”，≤4为“尾小”。该正码为49为和，退还本金'},
            ],
            example: '投注方案：尾小；开奖正码六：21，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsTail',
            rows: [{number: bsTail, position: [7],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmZodiacTd: {
        title: '特码天地肖',
        desc: {
            title: '特码&天地肖',
            content: [
                {title: '', content: '开奖特码属于十二生肖中的牛、兔、龙、马、猴、猪号码为“天肖”，鼠、虎、蛇、羊、鸡、狗号码为“地肖”，特码为49时为和局，退还本金。'},
            ],
            example: '投注方案：地肖；开奖特码符合生肖：虎，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'ZodiacStatTd',
            rows: [{number: zodiacStatTd, position: [7],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmZodiacQh: {
        title: '特码前后肖',
        desc: {
            title: '特码&前后肖',
            content: [
                {title: '', content: '开奖特码属于十二生肖中的鼠、牛、虎、兔、龙、蛇号码为“前肖”，马、羊、猴、鸡、狗、猪号码为“后肖”，特码为49时为和局，退还本金。'},
            ],
            example: '投注方案：前肖；开奖特码符合生肖：虎，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'ZodiacStatQh',
            rows: [{number: zodiacStatQh, position: [7],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmZodiacJy: {
        title: '特码家野肖',
        desc: {
            title: '特码&家野肖',
            content: [
                {title: '', content: '开奖特码属于十二生肖中的牛、马、羊、鸡、狗、猪号码为“家肖”，鼠、虎、龙、蛇、兔、猴号码为“野肖”，特码为49时为和局，退还本金。'},
            ],
            example: '投注方案：野肖；开奖特码符合生肖：虎，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'ZodiacStatJy',
            rows: [{number: zodiacStatJy, position: [7],}],
            opposition:[ [1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmBsoeMix: {
        title: '特码&大小单双(组合)',
        desc: {
            title: '特码&大小单双(组合)',
            content: [
                {title: '', content: '通过大小和单双组合产生「大单」，「小单」，「大双」和「小双」四种组合'},
            ],
            example: '投注方案：开奖特码38，投注「大双」，即中奖',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'BsoeMix',
            rows: [{number: bsoeMix, position: [7],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmNumber: {
        title: '特码&号码',
        desc: {
            title: '特码&号码',
            content: [
                {title: '', content: '从49个号码中选择1个号码组成1注，所选号码与开奖的特码位置相同即中奖。'},
            ],
            example: '投注方案：02；开奖特码：02，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Number',
            rows: [{number: numbers, position: [7], is_circle: true}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmWave: {
        title: '特码&波色',
        desc: {
            title: '波色',
            content: [
                {title: '', content: '49个号码划分为红、蓝、绿三种颜色，投注的色波与特码属于的颜色相同时，即中奖。'},
                {title: '红波', content: '01,02,07,08,12,13,18,19,23,24,29,30,34,35,40,45,46'},
                {title: '蓝波', content: '03,04,09,10,14,15,20,25,26,31,36,37,41,42,47,48'},
                {title: '绿波', content: '05,06,11,16,17,21,22,27,28,32,33,38,39,43,44,49'},
            ],
            example: '投注方案：红波；开奖特码：02，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'WaveSeven',
            rows: [{number: waveBall, position: [7],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmWaveHalf: {
        title: '特码&半波',
        desc: {
            title: '特码&半波',
            content: [
                {title: '', content: '把色波分别与大、小、单、双分别组合，即为半波。≥25为“大”；≤24为“小”；个位数为1、3、5、7、9为“单”；0、2、4、6、8为“双”。当投注的半波与开奖特码所在的半波相同时，即中奖。特码为49时为和局，退还本金。'},
            ],
            example: '投注方案：蓝大；开奖特码：48，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'WaveHalf',
            rows: [{number: waveHalf, position: [7],},]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmWaveHalfHalf: {
        title: '特码&半半波',
        desc: {
            title: '特码&半半波',
            content: [
                {title: '', content: '把色波与大单、大双、小单、小双分别组合，即为半半波。当投注的半半波与开奖特码所在的半半波相同时，即为中奖。特码为49时为和局，退还本金'},
            ],
            example: '投注方案：蓝大双；开奖特码：48，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'WaveHalfHalf',
            rows: [{number: waveHalfHalf, position: [7],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmZodiac: {
        title: '特码&特肖',
        desc: {
            title: '特码&特肖',
            content: [
                {title: '', content: '选择1个生肖为1注，开奖特码在投注的生肖所对应的号码范围内，即中奖'},
                {title: '鼠(2025)', content: '06 18 30 42'},
                {title: '牛(2025)', content: '05 17 29 41'},
                {title: '虎(2025)', content: '04 16 28 40'},
                {title: '兔(2025)', content: '03 15 27 39'},
                {title: '龙(2025)', content: '02 14 26 38'},
                {title: '蛇(2025)', content: '01 13 25 37 49'},
                {title: '马(2025)', content: '12 24 36 48'},
                {title: '羊(2025)', content: '11 23 35 47'},
                {title: '猴(2025)', content: '10 22 34 46'},
                {title: '鸡(2025)', content: '09 21 33 45'},
                {title: '狗(2025)', content: '08 20 32 44'},
                {title: '猪(2025)', content: '07 19 31 43'}
            ],
            example: '投注方案：牛；开奖特码：29，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Zodiac',
            rows: [{number: zodiac, position: [7],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmHead: {
        title: '特码&头数',
        desc: {
            title: '特码&头数',
            content: [
                {title: '', content: '选择1个数值为1注，与开奖特码的十位的数值相同，即中奖。'},
            ],
            example: '投注方案：1头；开奖特码：18，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Head',
            rows: [{number: head, position: [7],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    TmTail: {
        title: '特码&尾数',
        desc: {
            title: '特码&尾数',
            content: [
                {title: '', content: '个位为尾数，选择1个数值为1注，与开奖特码的个位的数值相同，即中奖。'},
            ],
            example: '投注方案：8尾；开奖特码：18，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Tail',
            rows: [{number: tail, position: [7],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZtZodiacOne: {
        title: '正特&一肖',
        desc: {
            title: '正特&一肖',
            content: [
                {title: '', content: '选择1个生肖组成1注，开奖的7个号码所对应的生肖包含这个生肖（顺序不限），即中奖。不论同生肖的号码出现次数，只中一次奖。'},
            ],
            example: '投注方案：虎（2025）；开奖任意号码：28，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Zodiac',
            rows: [{number: zodiac, position: [1,2,3,4,5,6,7],}],
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
    ZtZodiacAll: {
        title: '正特&总肖',
        desc: {
            title: '正特&总肖',
            content: [
                {title: '', content: '选选择1个总肖数，开奖的7个号码对应的不同生肖的数量与投注的总肖数相同，即为中奖'},
            ],
            example: '投注方案：2肖；开奖号码包含对应生肖>=2，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'ZodiacAll',
            rows: [{number: zodiacAll, position: [1,2,3,4,5,6,7],}],
        },
        levels: [
            {
                prize: 102751.8947,
                title: '二肖',
                codes: [2],
            },
            {
                prize: 396.4000,
                title: '三肖',
                codes: [3],
            },
            {
                prize: 17.1931,
                title: '四肖',
                codes: [4],
            },
            {
                prize: 5.7773,
                title: '五肖',
                codes: [5],
            },
            {
                prize: 3.2642,
                title: '六肖',
                codes: [6],
            },
            {
                prize: 2.1745,
                title: '七肖',
                codes: [7],
            },
        ]
    },
    ZtZodiacAllStat: {
        title: '总肖形态',
        desc: {
            title: '总肖形态',
            content: [
                {title: '', content: '开奖的7个号码对应的不同生肖的数量3、5、7为“总肖单”，2、4、6为“总肖双”。'},
            ],
            example: '投注方案：总肖单；开奖号码：02,12,18,21,26,21 + 33，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'ZodiacAllStat',
            rows: [{number: zodiacAllStat, position: [1,2,3,4,5,6,7],}],
            opposition: [[0, 1]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZtTail: {
        title: '正特&尾数',
        desc: {
            title: '正特&尾数',
            content: [
                {title: '', content: '选择1个尾数，开奖的7个号码中的尾数包含所选尾数，即中奖。不论相同尾数出现的次数，只中一次奖。'},
            ],
            example: '投注方案：8尾；开奖号码：01,02,03,04,05,06 + 08，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'TailAll',
            rows: [{number: tail, position: [1,2,3,4,5,6,7],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZtSumBs: {
        title: '总和',
        desc: {
            title: '总和大小',
            content: [
                {title: '', content: '7个开奖号码之和≥176为“总和大”，≤174为“总和小”，等于175时为和，退还本金。'},
            ],
            example: '投注方案：大；开奖号码：11,12,15,34,36,38 + 41，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'TotalSumBs',
            rows: [{number: bs, position: [1,2,3,4,5,6,7],}],
            opposition: [[0, 1]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZtSumOe: {
        title: '总和',
        desc: {
            title: '总和单双',
            content: [
                {title: '', content: '7个开奖号码之和的个位数1、3、5、7、9为“总和单”，0、2、4、6、8为“总和双”。'},
            ],
            example: '投注方案：单；开奖号码：11,12,15,34,36,38 + 41，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'TotalSumOe',
            rows: [{number: oe, position: [1,2,3,4,5,6,7],}],
            opposition:[[1,2]]
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },

    ZtRxy: {
        title: '自选',
        desc: {
            title: '自选',
            content: [
                {title: '', content: '从49个号码中任选1个号码为一注，如开奖的7个号码中包含选择的号码，即中奖。'},
            ],
            example: '开奖号码 05,06,07,08,09,11 + 18，投注「08」，则中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Number',
            rows: [{number: numbers, position: [1,2,3,4,5,6,7],}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
};
export default creditDefine;