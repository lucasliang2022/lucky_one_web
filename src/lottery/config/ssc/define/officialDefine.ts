import { MethodDefineList } from "@/types"
import {
    dsNumbers,
    exZuBd,
    exZuHz,
    exZxHz,
    exZxKd,
    lh,
    nn,
    numbers,
    sh,
    sumTail,
    sxZuBd,
    sxZuHz,
    sxZxHz,
    sxZxKd,
    zjh,
    bsoe,
    positions, r2ZxHz, r2ZuHz, r2ZuBd
} from "@lottery/config/ssc/define/officialCodeDefine";

const sscOfficialDefine: MethodDefineList = {
    WxZx: {
        title: '五星直选复式',
        title_sign: 'lottery.ssc.method.WxZx',
        desc: '从万位、千位、百位、十位、个位上各选1个号码组成1注。所选号码与开奖号码相同，且顺序一致，即中奖。',
        example: '投注方案：1,2,3,4,5；开奖号码：1,2,3,4,5，即中奖。',
        calc: {
            type: 'zx',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZxFs',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [1], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [5], buttons: true},
            ],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 5, max: 50},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    WxZxDs: {
        title: '五星直选单式',
        desc: '录入1个5位数的号码组成1注。录入的号码与开奖号码相同，且顺序一致，即中奖。',
        example: '投注方案：12345；开奖号码：1,2,3,4,5，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        layout: {
            type: 'ZxDs',
            rows: [{
                length: 5,
                allowed_numbers: dsNumbers,
            }],
            unit_repeat: true,
            unit_separator: '',
            row_repeat: false,
            row_separator: ',|， ；;',
            code_total_count: {min: 1, max: 100000},
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
    WxZxZh: {
        title: '五星直选组合',
        desc: '从万位、千位、百位、十位、个位上各选1个号码组成1~5星的组合，共5注。所选号码的个位与开奖号码的个位相同，则中个位定位胆；所选号码的十位、个位与开奖号码的十位、个位相同，则中个位定位胆及后二直选。依此类推，最多可同时中5个奖。',
        example: '投注方案：6,6,8,8,9；开奖号码：6,6,8,8,9，即中-,-,-,-,9、-,-,-,8,9、-,-,8,8,9、-,6,8,8,9、6,6,8,8,9,各一注。',
        lr_status: true,
        yl_status: true,
        random_bet: false,
        calc: {
            type: 'zh',
        },
        layout: {
            type: 'Zh',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [1], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [5], buttons: true},
            ],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 5, max: 50},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {prize: 'N/A', title: '一等奖', codes: [],},
            {prize: 'N/A', title: '二等奖', codes: [],},
            {prize: 'N/A', title: '三等奖', codes: [],},
            {prize: 'N/A', title: '四等奖', codes: [],},
            {prize: 'N/A', title: '五等奖', codes: [],},
        ]
    },
    WxZu120: {
        title: '五星组选120',
        desc: '选择5个号码组成1注，所选号码与开奖号码相同(顺序不限)，即为中奖。',
        example: '投注方案：6,2,1,8,9；开奖号码：9,8,6,2,1，即中奖。',
        calc: {
            type: 'combination',
            base: 5,
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZuFsOneRow',
            rows: [{
                number:numbers,
                min_selected: 5,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 5, max: 10},
            tips: "至少选择<b>5</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    WxZu60: {
        title: '五星组选60',
        desc: '选择1个二重号和3个单号组成1注。开奖号码包含所选3个单号，且所选二重号在开奖号码中出现了2次，即中奖。',
        example: '投注方案：二重号：6，单号：3,7,8；开奖号码：6,7,3,8,6，即中奖。',
        calc: {
            type: 'wx60',
            base: {2:1,1:3},
            totalPositions: 5
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZuFsTwoRow',
            rows: [
                {
                    title: '二重号',
                    number:numbers,
                    min_selected: 1,
                    max_selected: 10,
                    buttons: true
                },
                {
                    title: '单号',
                    number:numbers,
                    min_selected: 3,
                    max_selected: 10,
                    buttons: true
                },
            ],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            tips: "二重号至少选择<b>1</b>个号码 单号至少选择<b>3</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    WxZu30: {
        title: '五星组选30',
        desc: '选择2个二重号和1个单号组成1注。开奖号码包含所选单号，且所选2个二重号在开奖号码中各出现2次，即中奖。',
        example: '投注方案：二重号：6,8，单号：0；开奖号码：6,8,1,8,6，即中奖。',
        calc: {
            type: 'wx30',
            base: {2:2,1:1},
            totalPositions: 5
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZuFsTwoRow',
            rows: [
                {
                    title: '二重号', number:numbers, min_selected: 2, max_selected: 10, buttons: true
                },
                {
                    title: '单号', number:numbers, min_selected: 1, max_selected: 10, buttons: true
                },
            ],
            stat_big_min: 5,
            unit_separator: ',',
            row_separator: '|',
            tips: "二重号至少选择<b>2</b>个号码 单号至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    WxZu20: {
        title: '五星组选20',
        desc: '选择1个三重号和2个单号组成1注。开奖号码包含所选2个单号，且所选三重号在开奖号码中出现3次，即中奖。',
        example: '投注方案：三重号：8，单号：1,6；开奖号码：6,8,1,8,8，即中奖。',
        calc: {
            type: 'wx20',
            base: {3:1,1:2},
            totalPositions: 5
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZuFsTwoRow',
            rows: [
                {title: '三重号', number:numbers, min_selected: 1, max_selected: 10,buttons: true},
                {title: '单号', number:numbers, min_selected: 2, max_selected: 10,buttons: true},
            ],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            tips: "三重号至少选择<b>1</b>个号码 单号至少选择<b>2</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    WxZu10: {
        title: '五星组选10',
        desc: '选择1个三重号和1个二重号组成1注。开奖号码中所选三重号出现3次，且所选二重号出现2次，即中奖。',
        example: '投注方案：三重号：8，二重号：6；开奖号码：6,8,6,8,8，即中奖。',
        calc: {
            type: 'wx10',
            base: {3:1,2:1},
            totalPositions: 5
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZuFsTwoRow',
            rows: [
                {
                    title: '三重号', number:numbers, min_selected: 1, max_selected: 10, buttons: true
                },
                {
                    title: '二重号', number:numbers, min_selected: 1, max_selected: 10, buttons: true
                },
            ],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            tips: "三重号至少选择<b>1</b>个号码 二重号至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    WxZu5: {
        title: '五星组选5',
        desc: '选择1个四重号和1个单号组成1注。开奖号码包含所选单号，且所选四重号在开奖号码中出现4次，即中奖。',
        example: '投注方案：四重号：8，单号：6；开奖号码：8,8,6,8,8，即中奖。',
        calc: {
            type: 'wx5',
            base: {4:1,1:1},
            totalPositions: 5
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZuFsTwoRow',
            rows: [
                {
                    title: '四重号', number:numbers, min_selected: 1, max_selected: 10, buttons: true
                },
                {
                    title: '单号', number:numbers, min_selected: 1, max_selected: 10, buttons: true
                },
            ],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            tips: "四重号至少选择<b>1</b>个号码 单号至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsiZx: {
        title: '前四直选复式',
        desc: '从49个号码中选择1个号码形成1注，所选号码与开奖的特码相同，即中奖。',
        example: '投注方案：01；开奖特码：01，即中奖。',
        calc: {
            type: 'zx',
            base: [1,1,1,1],
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZxFs',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [1], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true},
            ],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 4, max: 40},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsiZxDs: {
        title: '前四直选单式',
        desc: '录入1个4位数的号码组成1注。录入的号码与开奖号码的万位、千位、百位、十位相同，且顺序一致，即中奖。',
        example: '投注方案：1234；开奖号码：1,2,3,4,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        layout: {
            type: 'ZxDs',
            rows: [{
                length: 4,
                allowed_numbers: dsNumbers,
            }],
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 100000},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsiZxZh: {
        title: '前四直选组合',
        desc: '从万位、千位、百位、十位上各选择1个号码组成1~4星的组合，共4注。所选号码的十位与开奖号码的十位相同，则中十位定位胆；所选号码的百位、十位与开奖号码的百位、十位相同，则中十位定位胆及百十位直选。依此类推，最多可同时中4个奖。',
        example: '投注方案：1,2,3,4；开奖号码：1,2,3,4,*，即中-,-,-,4,*、-,-,3,4,*、-,2,3,4,*、1,2,3,4,*,各一注。',
        lr_status: true,
        yl_status: true,
        random_bet: false,
        layout: {
            type: 'Zh',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [1], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true},
            ],
            stat_big_min: 5,
            unit_separator: ',',
            unit_repeat: false,
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 4, max: 40},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {prize: '0', title: '一等奖', codes: [],},
            {prize: '0', title: '二等奖', codes: [],},
            {prize: '0', title: '三等奖', codes: [],},
            {prize: '0', title: '四等奖', codes: [],},
        ]
    },
    QsiZu24: {
        title: '前四组选24',
        desc: '选择4个号码组成1注，所选号码与开奖号码的万位、千位、百位、十位相同(顺序不限），即为中奖。',
        example: '投注方案：6,8,3,1；开奖号码：4,1,6,8,*，即中奖。',
        calc: {
            type: 'combination',
            base: 4,
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZuFsOneRow',
            rows: [{
                number: numbers,
                min_selected: 4,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 4, max: 10},
            tips: "至少选择<b>4</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsiZu12: {
        title: '前四组选12',
        desc: '选择1个二重号和2个单号组成1注。开奖号码的万位、千位、百位、十位包含所选2个单号，且所选二重号在开奖号码的万位、千位、百位、十位中出现2次，即中奖。',
        example: '投注方案：二重号：6，单号：8,9；开奖号码：6,8,9,6,*,即中奖。',
        calc: {
            type: 'sx12',
            base: {2:1,1:2},
            totalPositions: 4
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZuFsTwoRow',
            rows: [
                {
                    title: '二重号',
                    number:numbers,
                    min_selected: 1,
                    max_selected: 10,
                    buttons: true
                },
                {
                    title: '单号',
                    number:numbers,
                    min_selected: 2,
                    max_selected: 10,
                    buttons: true
                },
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            tips: "二重号至少选择<b>1</b>个号码 单号至少选择<b>2</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsiZu6: {
        title: '前四组选6',
        desc: '选择2个二重号组成1注。所选2个二重号在开奖号码的万位、千位、百位、十位各出现2次，即中奖。',
        example: '投注方案：6,8；开奖号码：6,8,6,8,*,即中奖。',
        calc: {
            type: 'combination',
            base: 2,
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZuFsOneRow',
            rows: [{
                number:numbers,
                min_selected: 2,
                max_selected: 10,
                position: [2,3,4,5],
                buttons: true
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsiZu4: {
        title: '前四组选4',
        desc: '选择1个三重号和1个单号组成1注。开奖号码的万位、千位、百位、十位包含所选单号，且所选三重号在开奖号码的万位、千位、百位、十位出现3次，即中奖。',
        example: '投注方案：三重号：1，单号：2；开奖号码：1,2,1,1,*，即中奖。',
        calc: {
            type: 'sx4',
            base: {3:1,1:1},
            totalPositions: 4
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZuFsTwoRow',
            rows: [
                {
                    title: '三重号',
                    number:numbers,
                    min_selected: 1,
                    max_selected: 10,
                    buttons: true
                },
                {
                    title: '单号',
                    number:numbers,
                    min_selected: 1,
                    max_selected: 10,
                    buttons: true
                },
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            tips: "三重号至少选择<b>1</b>个号码 单号至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsiZx: {
        title: '后四直选复式',
        desc: '从千位、百位、十位、个位上各选择1个号码组成1注。所选号码与开奖号码的千位、百位、十位、个位相同，且顺序一致，即中奖。',
        example: '投注方案：6,2,8,5；开奖号码：*,6,2,5,8，即中奖。',
        calc: {
            type: 'zx',
            base: [1,1,1,1],
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZxFs',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [5], buttons: true},
            ],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 4, max: 40},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsiZxDs: {
        title: '后四直选单式',
        desc: '录入1个4位数的号码组成1注。录入的号码与开奖号码的千位、百位、十位、个位相同，且顺序一致，即中奖。',
        example: '投注方案：1638；开奖号码：*,1,8,3,6，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZxDs',
            rows: [{
                length: 4,
                allowed_numbers: dsNumbers,
            }],
            stat_big_min: 5,
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 100000},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsiZxZh: {
        title: '后四直选组合',
        desc: '从万位、千位、百位、十位上各选择1个号码组成1~4星的组合，共4注。所选号码的十位与开奖号码的十位相同，则中十位定位胆；所选号码的百位、十位与开奖号码的百位、十位相同，则中十位定位胆及百十位直选。依此类推，最多可同时中4个奖。',
        example: '投注方案：1,2,3,4；开奖号码：1,2,3,4,*，即中-,-,-,4,*、-,-,3,4,*、-,2,3,4,*、1,2,3,4,*,各一注。',
        lr_status: true,
        yl_status: true,
        random_bet: false,
        layout: {
            type: 'Zh',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [5], buttons: true},
            ],
            stat_big_min: 5,
            unit_separator: ',',
            unit_repeat: false,
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 4, max: 40},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {prize: 'N/A', title: '一等奖', codes: [],},
            {prize: 'N/A', title: '二等奖', codes: [],},
            {prize: 'N/A', title: '三等奖', codes: [],},
            {prize: 'N/A', title: '四等奖', codes: [],},
        ]
    },
    HsiZu24: {
        title: '后四组选24',
        desc: '选择4个号码组成1注，所选号码与开奖号码的千位、百位、十位、个位相同(顺序不限)，即为中奖。',
        example: '投注方案：1,2,3,4；开奖号码：*,4,3,2,1,即中奖。',
        calc: {
            type: 'combination',
            base: 4,
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZuFsOneRow',
            rows: [{
                number:numbers,
                min_selected: 4,
                max_selected: 10,
                position: [2,3,4,5],
                buttons: true
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 4, max: 10},
            tips: "至少选择<b>4</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsiZu12: {
        title: '后四组选12',
        desc: '选择1个二重号和2个单号组成1注。开奖号码的千位、百位、十位、个位包含所选2个单号，且所选二重号在开奖号码的千位、百位、十位、个位中出现2次，即中奖。',
        example: '投注方案：二重号：3，单号：1,2；开奖号码：*,3,1,2,3,即中奖。',
        calc: {
            type: 'sx12',
            base: {2:1,1:2},
            totalPositions: 4
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZuFsTwoRow',
            rows: [
                {
                    title: '二重号', number:numbers, min_selected: 1, max_selected: 10, buttons: true
                },
                {
                    title: '单号', number:numbers, min_selected: 2, max_selected: 10, buttons: true
                },
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            tips: "二重号至少选择<b>1</b>个号码 单号至少选择<b>2</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsiZu6: {
        title: '后四组选6',
        desc: '选择2个二重号组成1注。所选2个二重号在开奖号码的千位、百位、十位、个位各出现2次，即中奖。',
        example: '投注方案：6,8； 开奖号码：*,6,8,6,8,即中奖。',
        calc: {
            type: 'combination',
            base: 2,
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZuFsOneRow',
            rows: [{
                number:numbers,
                min_selected: 2,
                max_selected: 10,
                position: [2,3,4,5],
                buttons: true
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsiZu4: {
        title: '后四组选4',
        desc: '选择1个三重号和1个单号组成1注。开奖号码的千位、百位、十位、个位包含所选单号，且所选三重号在开奖号码的千位、百位、十位、个位出现3次，即中奖。',
        example: '投注方案：三重号：1，单号：2；开奖号码：*,1,2,1,1，即中奖。',
        calc: {
            type: 'sx4',
            base: {3:1,1:1},
            totalPositions: 4
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZuFsTwoRow',
            rows: [
                {
                    title: '三重号', number:numbers, min_selected: 1, max_selected: 10, buttons: true
                },
                {
                    title: '单号', number:numbers, min_selected: 1, max_selected: 10, buttons: true
                },
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            tips: "三重号至少选择<b>1</b>个号码 单号至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },

    QsZx: {
        title: '前三直选复式',
        desc: '从万位、千位、百位中各选择1个号码组成1注，所选号码与开奖号码的万位、千位、百位相同，且顺序一致，即为中奖。',
        example: '投注方案：6,6,8；开奖号码：6,6,8,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'zx',
        },
        layout: {
            type: 'ZxFs',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [1], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true},
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 3, max: 30},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsZxDs: {
        title: '前三直选单式',
        desc: '录入1个3位数的号码组成1注。录入的号码与开奖号码的万位、千位、百位相同，且顺序一致，即中奖。',
        example: '投注方案：678；开奖号码：6,7,8,*,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZxDs',
            rows: [{
                length: 3,
                allowed_numbers: dsNumbers,
            }],
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 100000},
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsZxZh: {
        title: '前三直选组合',
        desc: '从万位、千位、百位、十位上各选择1个号码组成1~4星的组合，共4注。所选号码的十位与开奖号码的十位相同，则中十位定位胆；所选号码的百位、十位与开奖号码的百位、十位相同，则中十位定位胆及百十位直选。依此类推，最多可同时中4个奖。',
        example: '投注方案：1,2,3,4；开奖号码：1,2,3,4,*，即中-,-,-,4,*、-,-,3,4,*、-,2,3,4,*、1,2,3,4,*,各一注。',
        lr_status: true,
        yl_status: true,
        random_bet: false,
        calc: {
            type: 'zh',
        },
        layout: {
            type: 'Zh',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [1],buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [2],buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [3],buttons: true},
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 3, max: 30},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {prize: '0', title: '一等奖', codes: [],},
            {prize: '0', title: '二等奖', codes: [],},
            {prize: '0', title: '三等奖', codes: [],},
        ]
    },
    QsZxHz: {
        title: '前三直选和值',
        desc: '选择1个数值，与开奖号码的万位、千位、百位3个号码之和相同，即中奖。',
        example: '投注方案：3；开奖号码：1,2,0,*,*，即中奖。',
        calc: {
            type: 'map',
        },
        lr_status: false,
        yl_status: false,
        random_bet: false,
        layout: {
            type: 'Sum',
            rows: [{
                number: sxZxHz,
                min_selected: 1,
                max_selected: 28,
                position: [1,2,3],
                buttons: true
            }],
            stat_big_min: 14,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 28},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsZxKd: {
        title: '前三直选跨度',
        desc: '选择1个数值，与开奖号码的万位、千位、百位中最大与最小数字相减之差相同，即中奖。',
        example: '投注方案：6；开奖号码：1,2,7,*,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Span',
            rows: [{
                number: sxZxKd,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3],
                buttons: true
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },

    QsZu3: {
        title: '前三组选三',
        desc: '选择2个号码组成2注，任意1个号码在开奖号码的万位、千位、百位上出现2次，另外1个号码出现1次（顺序不限），即中奖。',
        example: '投注方案：1,8；开奖号码：1,8,8,*,*,即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'Zu3',
            rows: [{
                number:numbers,
                min_selected: 2,
                max_selected: 10,
                buttons: true
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsZu3Ds: {
        title: '前三组选三单式',
        desc: '录入2个相同的号码和1个不同的号码组成1注。录入号码与开奖号码的万位、千位、百位相同（顺序不限），即中奖。',
        example: '投注方案：188；开奖号码：8,8,1,*,*,即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        layout: {
            type: 'ZuDs',
            rows: [{
                length: 3,
                type:'AAB',
                allowed_numbers: dsNumbers,
            }],
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 100000},
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsZu6: {
        title: '前三组选六',
        desc: '选择3个号码组成1注。所选号码与开奖号码的万位、千位、百位相同(顺序不限)，即中奖。',
        example: '投注方案：1,6,8；开奖号码：1,8,6,*,*,即中奖。。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 3,
        },
        layout: {
            type: 'ZuFsOneRow',
            rows: [{
                number:numbers,
                min_selected: 3,
                max_selected: 10,
                position: [1,2,3],
                buttons: true,
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 3, max: 10},
            tips: "至少选择<b>3</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsZu6Ds: {
        title: '前三组选六单式',
        desc: '录入3个不相同的号码组成1注。录入号码与开奖号码的万位、千位、百位相同，且顺序不限，即中奖。',
        example: '投注方案：168；开奖号码：1,8,6,*,*,即中前三组六。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        layout: {
            type: 'ZuDs',
            rows: [{
                length: 3,
                type:'ABC',
                allowed_numbers: dsNumbers,
            }],
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 10000},
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsZuHz: {
        title: '前三组选和值',
        desc: '选择1个数值，所选数值等于开奖号码的万位、千位、百位3个号码之和（不含豹子号），且万位、千位、百位有对子，即中前三组选和值组三，若万位、千位、百位为单号，即中前三组选和值组六；',
        example: '投注方案；6；开奖号码A：3,3,0,*,*,即中前三组选和值组三；开奖号码B：1,2,3,*,*,即中前三组选和值组六。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Sum',
            rows: [{number:sxZuHz, min_selected: 1, max_selected: 26,}],
            stat_big_min: 14,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 26},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QsZuBd: {
        title: '前三组选包胆',
        desc: '选择1个号码，当开奖号码的万位、千位、百位中任意1位和所选号码相同（不含豹子号），且万位、千位、百位有对子，即中前三组选包胆组三，且万位、千位、百位为单号，即中前三组选包胆组六；',
        example: '投注方案：8；开奖号码A：1,8,8,*,*,即中前三组选包胆组三；开奖号码B：1,2,8,*,*,即中前三组选包胆组六。',
        lr_status: true,
        yl_status: true,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Bd',
            rows: [{
                number: sxZuBd,
                position: [1,2,3],
                min_selected: 1,
                max_selected: 1,
            }],
            stat_big_min: 14,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 1},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
            {
                prize: "N/A",
                title: '二等奖',
                codes: [],
            },
        ]
    },
    QsHzWs: {
        title: '前三和值尾数',
        desc: '选择1个数值，与开奖号码的万位、千位、百位3个号码之和的尾数相同，即中奖。',
        example: '投注方案：6；开奖号码：3,2,1,*,*,即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        layout: {
            type: 'SumTail',
            rows: [{
                number: sumTail,
                min_selected: 1,
                max_selected: 10,
                buttons: true
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },

    ZsZx: {
        title: '中三直选复式',
        desc: '从千位、百位、十位中各选择1个号码组成1注，所选号码与开奖号码的千位、百位、十位相同，且顺序一致，即为中奖。',
        example: '投注方案：6,6,8；开奖号码：*,6,6,8,*，即中奖。',
        calc: {
            type: 'zx',
            base: [1,1,1],
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZxFs',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true},
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 3, max: 30},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZsZxDs: {
        title: '中三直选单式',
        desc: '录入1个3位数的号码组成1注。录入的号码与开奖号码的千位、百位、十位 相同，且顺序一致，即中奖。',
        example: '投注方案：678；开奖号码：*,6,7,8,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZxDs',
            rows: {
                length: 3,
                allowed_numbers: dsNumbers,
            },
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 100000},
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZsZxZh: {
        title: '中三直选组合',
        desc: '从千位、百位、十位中各选择1个号码组成1~3星的组合，共3注。所选号码的十位与开奖号码的十位相同，则中十位定位胆；所选号码的百位、十位与开奖号码的百位、十位相同，则中十位定位胆及百十位直选。依此类推，最多可同时中3个奖。',
        example: '投注方案：1,2,3；开奖号码：*,1,2,3,*，即中*,-,-,3,*、*,-,2,3,*、*,1,2,3,*，各一注。',
        lr_status: true,
        yl_status: true,
        random_bet: false,
        calc: {
            type: 'zh',
        },
        layout: {
            type: 'Zh',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true},
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 3, max: 30},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {prize: '0', title: '一等奖', codes: [],},
            {prize: '0', title: '二等奖', codes: [],},
            {prize: '0', title: '三等奖', codes: [],},
        ]
    },
    ZsZxHz: {
        title: '中三直选和值',
        calc: {
            type: 'map',
        },
        desc: '选择1个数值，与开奖号码的千位、百位、十位3个号码之和相同，即中奖。',
        example: '投注方案：8；开奖号码：*,1,2,5,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        layout: {
            type: 'Sum',
            rows: [{
                number:sxZxHz,
                min_selected: 1,
                max_selected: 28,
                buttons: true,
            }],
            stat_big_min: 14,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 28},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZsZxKd: {
        title: '中三直选跨度',
        desc: '选择1个数值，与开奖号码的千位、百位、十位中最大与最小数字相减之差相同，即中奖。',
        example: '投注方案：8；开奖号码：*,1,2,9,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Span',
            rows: [{
                number:sxZxKd,
                min_selected: 1,
                max_selected: 10,
                position: [2,3,4],
                buttons: true
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },

    ZsZu3: {
        title: '中三组选三',
        desc: '选择2个号码组成2注，任意1个号码在开奖号码的千位、百位、十位上出现2次，另外1个号码出现1次（顺序不限），即中奖。',
        example: '投注方案：1,8；开奖号码：*,1,8,8,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'Zu3',
            rows: [{
                number:numbers,
                min_selected: 2,
                max_selected: 10,
                buttons: true
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZsZu3Ds: {
        title: '中三组选三单式',
        desc: '录入2个相同的号码和1个不同的号码组成1注。录入号码与开奖号码的千位、百位、十位相同（顺序不限），即中奖。',
        example: '投注方案：188；开奖号码：*,8,1,8,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        layout: {
            type: 'ZuDs',
            rows: [{
                length: 3,
                type:'AAB',
                allowed_numbers: dsNumbers,
            }],
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 100000},
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZsZu6: {
        title: '中三组选六',
        desc: '选择3个号码组成1注。所选号码与开奖号码的千位、百位、十位相同(顺序不限)，即中奖。',
        example: '投注方案：1,6,8；开奖号码：*,1,8,6,*,即中奖。。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 3,
        },
        layout: {
            type: 'ZuFsOneRow',
            rows: [{
                number:numbers,
                min_selected: 3,
                max_selected: 10,
                position: [2,3,4],
                buttons: true
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 3, max: 10},
            tips: "至少选择<b>3</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZsZu6Ds: {
        title: '中三组选六单式',
        desc: '录入3个不相同的号码组成1注。录入号码与开奖号码的千位、百位、十位相同，且顺序不限，即中奖。',
        example: '投注方案：168；开奖号码：*,6,1,8,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        layout: {
            type: 'ZuDs',
            rows: [{
                length: 3,
                type:'ABC',
                allowed_numbers: dsNumbers,
            }],
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 100000},
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZsZuHz: {
        title: '中三组选和值',
        desc: '选择1个数值，所选数值等于开奖号码的千位、百位、十位3个号码之和（不含豹子号），且千位、百位、十位有对子，即中中三组选和值组三，若千位、百位、十位为单号，即中中三组选和值组六；',
        example: '投注方案：8；开奖号码A：*,4,4,0,*，即中中三组选和值组三；开奖号码B：*,1,2,5,*，即中中三组选和值组六。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Sum',
            rows: [{
                number:sxZuHz,
                min_selected: 1,
                max_selected: 26,
                buttons: true,
            }],
            stat_big_min: 14,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 26},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ZsZuBd: {
        title: '中三组选包胆',
        desc: '选择1个号码，当开奖号码的万位、千位、百位中任意1位和所选号码相同（不含豹子号），且万位、千位、百位有对子，即中前三组选包胆组三，且万位、千位、百位为单号，即中前三组选包胆组六；',
        example: '投注方案：8；开奖号码A：*,1,8,8,*,即中前三组选包胆组三；开奖号码B：*,1,2,8,*,即中前三组选包胆组六。',
        lr_status: true,
        yl_status: true,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Bd',
            rows: [{
                number:sxZuBd,
                position: [1,2,3],
                min_selected: 1,
                max_selected: 1,
            }],
            stat_big_min: 14,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 1},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
            {
                prize: "N/A",
                title: '二等奖',
                codes: [],
            },
        ]
    },

    ZsHzWs: {
        title: '中三和值尾数',
        desc: '选择1个数值，与开奖号码的千位、百位、十位3个号码之和的尾数相同，即中奖。',
        example: '投注方案：8；开奖号码：*,1,2,5,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        layout: {
            type: 'SumTail',
            rows: [{
                number: sumTail,
                min_selected: 1,
                max_selected: 10,
                buttons: true,
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },

    HsZx: {
        title: '后三直选复式',
        desc: '从百位、十位、个位中各选择1个号码组成1注，所选号码与开奖号码的百位、十位、个位相同，且顺序一致，即为中奖。',
        example: '投注方案：6,6,8；开奖号码：*,*,6,6,8，即中奖。',
        calc: {
            type: 'zx',
            base: [1,1,1],
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZxFs',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [5], buttons: true},
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 3, max: 30},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsZxDs: {
        title: '后三直选单式',
        desc: '录入1个3位数的号码组成1注。录入的号码与开奖号码的 百位、十位、个位 相同，且顺序一致，即中奖。',
        example: '投注方案：678；开奖号码：*,*,6,7,8 即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZxDs',
            rows: [{
                length: 3,
                allowed_numbers: dsNumbers,
            }],
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 10000},
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsZxZh: {
        title: '后三直选组合',
        desc: '从百位、十位、个位中各选择1个号码组成1~3星的组合，共3注。所选号码的个位与开奖号码的个位相同，则中个位定位胆；所选号码的十位、个位与开奖号码的十位、个位相同，则中个位定位胆及后二直选。依此类推，最多可同时中3个奖。',
        example: '投注方案：5,6,7；开奖号码：*,*,5,6,7，即中*,*,-,-,7、*,*,-,6,7、*,*,5,6,7，各一注。',
        lr_status: true,
        yl_status: true,
        random_bet: false,
        calc: {
            type: 'zh',
        },
        layout: {
            type: 'Zh',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [5], buttons: true},
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 3, max: 30},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {prize: '0', title: '一等奖', codes: [],},
            {prize: '0', title: '二等奖', codes: [],},
            {prize: '0', title: '三等奖', codes: [],},
        ]
    },
    HsZxHz: {
        title: '后三直选和值',
        desc: '选择1个数值，与开奖号码的百位、十位、个位3个号码之和相同，即中奖。',
        example: '投注方案：8； 开奖号码：*,*,2,3,5，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Sum',
            rows: [{
                number: sxZxHz,
                min_selected: 1,
                max_selected: 28,
                buttons: true,
            }],
            stat_big_min: 14,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 28},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsZxKd: {
        title: '后三直选跨度',
        desc: '选择1个数值，与开奖号码的百位、十位、个位中最大与最小数字相减之差相同，即中奖。',
        example: '投注方案：8；开奖号码：*,*,1,2,9，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Span',
            rows: [{
                number:sxZxKd,
                min_selected: 1,
                max_selected: 10,
                position: [3,4,5],
                buttons: true
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },

    HsZu3: {
        title: '后三组选三',
        desc: '选择2个号码组成2注，任意1个号码在开奖号码的百位、十位、个位上出现2次，另外1个号码出现1次（顺序不限），即中奖。',
        example: '投注方案：1,6；开奖号码：*,*,1,6,6，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'Zu3',
            rows: [{
                number:numbers,
                min_selected: 2,
                max_selected: 10,
                buttons: true
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsZu3Ds: {
        title: '后三组选三单式',
        desc: '录入2个相同的号码和1个不同的号码组成1注。录入号码与开奖号码的百位、十位、个位相同（顺序不限），即中奖。',
        example: '投注方案：188；开奖号码：*,*,8,1,8，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        layout: {
            type: 'ZuDs',
            rows: [{
                length: 3,
                type:'AAB',
                allowed_numbers: dsNumbers,
            }],
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 100000},
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsZu6: {
        title: '后三组选六',
        desc: '选择3个号码组成1注。所选号码与开奖号码的百位、十位、个位相同(顺序不限)，即中奖。',
        example: '投注方案：1,2,8；开奖号码：*,*,1,8,2，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 3,
        },
        layout: {
            type: 'ZuFsOneRow',
            rows: [{
                number:numbers,
                min_selected: 3,
                max_selected: 10,
                position: [2,3,4],
                buttons: true
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 3, max: 10},
            tips: "至少选择<b>3</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsZu6Ds: {
        title: '后三组选六单式',
        desc: '录入3个不相同的号码。录入号码与开奖号码的百位、十位、个位相同，且顺序不限，即中奖。',
        example: '投注方案：168；开奖号码：*,*,1,8,6，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        layout: {
            type: 'ZuDs',
            rows: [{
                length: 3,
                type:'ABC',
                allowed_numbers: dsNumbers,
            }],
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 100000},
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsZuHz: {
        title: '后三组选和值',
        desc: '选择1个数值，所选数值等于开奖号码的百位、十位、个位3个号码之和（不含豹子号），且百位、十位、个位有对子，即中后三组选和值组三，若百位、十位、个位为单号，即中后三组选和值组六；',
        example: '投注方案；8；开奖号码A：*,*,4,4,0，即中后三组选和值组三；开奖号码B：*,*,1,2,5，即中后三组选和值组六。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Sum',
            rows: [{
                number:sxZuHz,
                min_selected: 1,
                max_selected: 26,
                buttons: true,
            }],
            stat_big_min: 14,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 26},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsZuBd: {
        title: '后三组选包胆',
        desc: '选择1个号码，当开奖号码的百位、十位、个位中任意1位和所选号码相同（不含豹子号），且百位、十位、个位有对子，即中后三组选包胆组三，若百位、十位、个位为单号，即中后三组选包胆组六；',
        example: '投注方案：3；开奖号码A：*,*,1,8,8，即中后三组选包胆组三；开奖号码B：*,*,1,6,8，即中后三组选包胆组六。',
        lr_status: true,
        yl_status: true,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Bd',
            rows: [{
                number:sxZuBd,
                position: [1,2,3],
                min_selected: 1,
                max_selected: 1,
            }],
            stat_big_min: 14,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 1},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HsHzWs: {
        title: '后三和值尾数',
        desc: '选择1个数值，与开奖号码的百位、十位、个位3个号码之和的尾数相同，即中奖。',
        example: '投注方案：8；开奖号码：*,*,1,2,5，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        layout: {
            type: 'SumTail',
            rows: [{
                number: sumTail,
                min_selected: 1,
                max_selected: 10,
                buttons: true,
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },

    QeZx: {
        title: '前二直选复式',
        desc: '从万位、千位上各选择1个号码组成1注。所选号码与开奖号码的万位、千位相同，且顺序一致，即中奖。',
        example: '投注方案：6,7；开奖号码：6,7,*,*,*，即中奖。',
        calc: {
            type: 'zx',
            base: [1,1],
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZxFs',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [1], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true},
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 2, max: 20},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QeZxDs: {
        title: '前二直选单式',
        desc: '录入1个2位数的号码组成1注。录入的号码与开奖号码的万位、千位相同，且顺序一致，即中奖。',
        example: '投注方案：68；开奖号码：6,8,*,*,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZxDs',
            rows: [{
                length: 2,
                allowed_numbers: dsNumbers,
            }],
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 100000},
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QeZxHz: {
        title: '前二直选和值',
        desc: '选择1个数值，与开奖号码的万位、千位2个号码之和相同，即中奖。',
        example: '投注方案：8；开奖号码：6,2,*,*,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Sum',
            rows: [{
                number: exZxHz,
                min_selected: 1,
                max_selected: 19,
                position: [1,2],
                buttons: true,
            }],
            stat_big_min: 9,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 19},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QeZxKd: {
        title: '前二直选跨度',
        desc: '选择1个数值，与开奖号码的万位、千位中相减之差相同，即中奖。',
        example: '投注方案：6；开奖号码：1,9,*,*,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Span',
            rows: [{
                number: exZxKd,
                min_selected: 1,
                max_selected: 10,
                position: [1,2],
                buttons: true
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QeZu: {
        title: '前二组选复式',
        desc: '选择2个号码组成1注。所选号码与开奖号码的万位、千位相同（顺序不限），即中奖。',
        example: '投注方案：6,8；开奖号码：8,6,*,*,*，即中奖。',
        calc: {
            type: 'combination',
            base: 2,
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZuFsOneRow',
            rows: [{
                number:numbers,
                min_selected: 2,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true
            }],
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QeZuDs: {
        title: '前二组选单式',
        desc: '录入2个不相同的号码组成1注。录入号码与开奖号码万位、千位相同（顺序不限），即中奖。',
        example: '投注方案：68；开奖号码：8,6,*,*,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZuDs',
            rows: [{
                length: 2,
                allowed_numbers: dsNumbers,
                type: 'AB',
            }],
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 100000},
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
    QeZuHz: {
        title: '前二组选和值',
        desc: '选择1个数值，所选数值等于开奖号码的万位、千位2个号码之和（不含对子号），即中奖。',
        example: '投注方案：8；开奖号码：6,2,*,*,*，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Sum',
            rows: [{
                number: exZuHz,
                min_selected: 1,
                max_selected: 18,
                position: [1,2],
                buttons: true,
            }],
            stat_big_min: 9,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 18},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QeZuBd: {
        title: '前二组选包胆',
        desc: '选择1个号码，开奖号码的万位、千位中任意一位和所选号码相同（不含对子号），即中奖。',
        example: '投注方案：3；开奖号码：1,3,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Bd',
            rows: [{
                number: exZuBd,
                min_selected: 1,
                max_selected: 1,
                position: [1,2],
            }],
            stat_big_min: 9,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 1},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },

    HeZx: {
        title: '后二直选复式',
        desc: '从十位、个位上各选择1个号码组成1注。所选号码与开奖号码的十位、个位相同，且顺序一致，即中奖。',
        example: '投注方案：6,8；开奖号码：*,*,*,6,8，即中奖。',
        calc: {
            type: 'zx',
            base: [1,1],
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZxFs',
            rows: [
                {number:numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true},
                {number:numbers, min_selected: 1, max_selected: 10, position: [5], buttons: true},
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 2, max: 20},
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HeZxDs: {
        title: '后二直选单式',
        desc: '录入1个2位数的号码组成1注。录入的号码与开奖号码的十位、个位相同，且顺序一致，即中奖。',
        example: '投注方案：68；开奖号码：*,*,*,6,8，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZxDs',
            rows: [{
                length: 2,
                allowed_numbers: dsNumbers,
            }],
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 100000},
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HeZxHz: {
        title: '后二直选和值',
        desc: '选择1个数值，与开奖号码的十位、个位2个号码之和相同，即中奖。',
        example: '投注方案：8；开奖号码：*,*,*,6,2，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Sum',
            rows: [{
                number: exZxHz,
                min_selected: 1,
                max_selected: 19,
                position: [4,5],
                buttons: true,
            }],
            stat_big_min: 9,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 19},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HeZxKd: {
        title: '后二直选跨度',
        desc: '选择1个数值，与开奖号码的十位、个位中相减之差相同，即中奖。',
        example: '投注方案：6；开奖号码：*,*,*，1,9，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Span',
            rows: [{
                number: exZxKd,
                min_selected: 1,
                max_selected: 10,
                position: [4,5],
                buttons: true
            }],
            stat_big_min: 5,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HeZu: {
        title: '后二组选复式',
        desc: '选择2个号码组成1注。所选号码与开奖号码的十位、个位相同（顺序不限），即中奖。',
        example: '投注方案：6,7；开奖号码：*,*,*,6,7，即中奖。',
        calc: {
            type: 'combination',
            base: 2,
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZuFsOneRow',
            rows: [{
                number:numbers,
                min_selected: 2,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true
            }],
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HeZuDs: {
        title: '后二组选单式',
        desc: '录入2个不相同的号码组成1注。录入号码与开奖号码十位、个位相同（顺序不限），即中奖。',
        example: '投注方案：68；开奖号码：*,*,*,6,8，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'ZuDs',
            rows: [{
                length: 2,
                allowed_numbers: dsNumbers,
                type: 'AB',
            }],
            row_repeat: false,
            row_separator: ',|， ；;',
            unit_separator: '',
            unit_repeat: true,
            code_total_count: {min: 1, max: 100000},
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
    HeZuHz: {
        title: '后二组选和值',
        desc: '选择1个数值，所选数值等于开奖号码的十位、个位2个号码之和（不含对子号），即中奖。',
        example: '投注方案：8；开奖号码：*,*,*,6,2，即中奖。',
        lr_status: false,
        yl_status: false,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Sum',
            rows: [{
                number: exZuHz,
                min_selected: 1,
                max_selected: 18,
                position: [4,5],
                buttons: true,
            }],
            stat_big_min: 9,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 18},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    HeZuBd: {
        title: '后二组选包胆',
        desc: '选择1个号码，开奖号码的十位、个位中任意一位和所选号码相同（不含对子号），即中奖。',
        example: '投注方案：6；开奖号码：*,*,*,1,7，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: false,
        calc: {
            type: 'map',
        },
        layout: {
            type: 'Bd',
            rows: [{
                number: exZuBd,
                min_selected: 1,
                max_selected: 1,
                position: [4,5],
            }],
            stat_big_min: 9,
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 1},
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },

    Dwd: {
        title: '定位胆',
        desc: '从万位、千位、百位、十位、个位任意位置选择1个号码组成1注，所选号码与相同位置上的开奖号码一致，即中奖。',
        example: '投注方案：8,-,-,-,-；开奖号码：8,*,*,*,* ，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: false,
        layout: {
            type: 'Dwd',
            rows: [
                {number:numbers, min_selected: 0, max_selected: 10, position: [1], buttons: true},
                {number:numbers, min_selected: 0, max_selected: 10, position: [2], buttons: true},
                {number:numbers, min_selected: 0, max_selected: 10, position: [3], buttons: true},
                {number:numbers, min_selected: 0, max_selected: 10, position: [4], buttons: true},
                {number:numbers, min_selected: 0, max_selected: 10, position: [5], buttons: true},
            ],
            row_separator: '|',
            row_repeat: true,
            unit_repeat: false,
            unit_separator: ',',
            code_total_count: { min: 1, max: 50 },
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },

    BdwQsYm: {
        title: '前三一码不定胆',
        desc: '选择1个号码组成1注。开奖号码的万位、千位、百位中包含所选号码，即中奖。',
        example: '投注方案：3；开奖号码：1,3,2,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'BdwSingle',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BdwQsEm: {
        title: '前三二码不定胆',
        desc: '选择2个号码组成1注。开奖号码的万位、千位、百位中包含所选2个号码，即中奖。',
        example: '投注方案：6,8；开奖号码：8,6,2,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'BdwMulti',
            rows: [{
                number: numbers,
                min_selected: 2,
                max_selected: 10,
                position: [1,2,3],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BdwZsYm: {
        title: '中三一码不定胆',
        desc: '选择1个号码组成1注。开奖号码的千位、百位、十位中包含所选号码，即中奖。',
        example: '投注方案：3；开奖号码：*,1,3,2,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'BdwSingle',
            rows: [{
                number:numbers,
                min_selected: 1,
                max_selected: 10,
                position: [2,3,4],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BdwZsEm: {
        title: '中三二码不定胆',
        desc: '选择2个号码组成1注。开奖号码的千位、百位、十位中包含所选2个号码，即中奖。',
        example: '投注方案：6,8；开奖号码：*,6,3,8,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'BdwMulti',
            rows: [{
                number: numbers,
                min_selected: 2,
                max_selected: 10,
                position: [2,3,4],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BdwHsYm: {
        title: '后三一码不定胆',
        desc: '选择1个号码组成1注。开奖号码的百位、十位、个位中包含所选号码，即中奖。',
        example: '投注方案：6；开奖号码：*,*,1,6,2，即中奖。。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'BdwSingle',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 10,
                position: [3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BdwHsEm: {
        title: '后三二码不定胆',
        desc: '选择2个号码组成1注。开奖号码的百位、十位、个位中包含所选2个号码，即中奖。',
        example: '投注方案：6,8；开奖号码：*,*,6,8,2，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'BdwMulti',
            rows: [{
                number: numbers,
                min_selected: 2,
                max_selected: 10,
                position: [3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },

    BdwQsiYm: {
        title: '前四一码不定胆',
        desc: '选择1个号码组成1注。开奖号码的万位、千位、百位、十位中包含所选号码，即中奖。',
        example: '投注方案：6；开奖号码：1,2,6,8,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'BdwSingle',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3,4],
                buttons: true
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BdwQsiEm: {
        title: '前四二码不定胆',
        desc: '选择2个号码组成1注。开奖号码的万位、千位、百位、十位中包含所选2个号码，即中奖。',
        example: '投注方案：6,7；开奖号码：8,2,6,4,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'BdwMulti',
            rows: [{
                number: numbers,
                min_selected: 2,
                max_selected: 10,
                position: [1,2,3,4],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BdwQsiSm: {
        title: '前四三码不定胆',
        desc: '选择3个号码组成1注。开奖号码的万位、千位、百位、十位中包含所选3个号码，即中奖。',
        example: '投注方案：6,8,5；开奖号码：5,2,8,6,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 3,
        },
        layout: {
            type: 'BdwMulti',
            rows: [{
                number: numbers,
                min_selected: 3,
                max_selected: 10,
                position: [1,2,3,4],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 3, max: 10},
            tips: "至少选择<b>3</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BdwHsiYm: {
        title: '后四一码不定胆',
        desc: '选择1个号码组成1注。开奖号码的千位、百位、十位、个位中包含所选号码，即中奖。',
        example: '投注方案：8；开奖号码：*,1,2,8,6，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'BdwSingle',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 10,
                position: [2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BdwHsiEm: {
        title: '后四二码不定胆',
        desc: '选择2个号码组成1注。开奖号码的千位、百位、十位、个位中包含所选2个号码，即中奖。',
        example: '投注方案：6,8；开奖号码：*,1,2,6,8，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'BdwMulti',
            rows: [{
                number: numbers,
                min_selected: 2,
                max_selected: 10,
                position: [2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BdwHsiSm: {
        title: '后四三码不定胆',
        desc: '选择3个号码组成1注。开奖号码的千位、百位、十位、个位中包含所选3个号码，即中奖。',
        example: '投注方案：6,8,1；开奖号码：*,1,2,6,8，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 3,
        },
        layout: {
            type: 'BdwMulti',
            rows: [{
                number:numbers,
                min_selected: 3,
                max_selected: 10,
                position: [2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 3, max: 10},
            tips: "至少选择<b>3</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BdwWuYm: {
        title: '五星一码不定胆',
        desc: '选择1个号码组成1注。开奖号码的万位、千位、百位、十位、个位中包含所选号码，即中奖。',
        example: '投注方案：8；开奖号码：1,2,8,6,9，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'BdwSingle',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BdwWuEm: {
        title: '五星二码不定胆',
        desc: '选择2个号码组成1注。开奖号码的万位、千位、百位、十位、个位中包含所选2个号码，即中奖。',
        example: '投注方案：2,3；开奖号码：1,2,3,4,5，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 2,
        },
        layout: {
            type: 'BdwMulti',
            rows: [{
                number: numbers,
                min_selected: 2,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 2, max: 10},
            tips: "至少选择<b>2</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BdwWuSm: {
        title: '五星三码不定胆',
        desc: '选择3个号码组成1注。开奖号码的万位、千位、百位、十位、个位中包含所选3个号码，即中奖。',
        example: '投注方案：2,6,8；开奖号码：1,2,6,8,5，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'combination',
            base: 3,
        },
        layout: {
            type: 'BdwMulti',
            rows: [{
                number: numbers,
                min_selected: 3,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 3, max: 10},
            tips: "至少选择<b>3</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },

    BsoeQeZh: {
        title: '前二大小单双组合',
        desc: '分别选择万位和千位的1个形态（大：5-9；小：0-4；单：1,3,5,7,9； 双：0,2,4,6,8)，组成1注。所选位置的形态与开奖号码的位置与形态相同，即中奖。',
        example: '投注方案：万位：大，千位：小；开奖号码：9,4,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'zx',
        },
        layout: {
            type: 'BsoeZx',
            rows: [
                {number: bsoe, min_selected: 1, max_selected: 4, shape: 'rectangle', position: [1]},
                {number: bsoe, min_selected: 1, max_selected: 4, shape: 'rectangle', position: [2]}
            ],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 2, max: 8},
            tips: "万位、千位至少各选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BsoeQsZh: {
        title: '前三大小单双组合',
        desc: '分别选择万位、千位和百位的1个形态（大：5-9；小：0-4；单：1,3,5,7,9； 双：0,2,4,6,8)，组成1注，所选位置的形态与开奖号码的位置与形态相同，即中奖。',
        example: '投注方案：万位：大,千位：小,百位：单；开奖号码：9,4,5,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'zx',
        },
        layout: {
            type: 'BsoeZx',
            rows: [
                {number: bsoe, min_selected: 1, max_selected: 4, shape: 'rectangle', position: [1]},
                {number: bsoe, min_selected: 1, max_selected: 4, shape: 'rectangle', position: [2]},
                {number: bsoe, min_selected: 1, max_selected: 4, shape: 'rectangle', position: [3]}
            ],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 3, max: 12},
            tips: "万位、千位和百位至少选择各<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BsoeHeZh: {
        title: '后二大小单双组合',
        desc: '分别选择十位和个位的1个形态（大：5-9；小：0-4；单：1,3,5,7,9； 双：0,2,4,6,8),组成1注，所选位置的形态与开奖号码的位置与形态相同，即中奖。',
        example: '投注方案：十位：大,个位：小；开奖号码：*,*,*,9,4，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'zx',
        },
        layout: {
            type: 'BsoeZx',
            rows: [
                {number: bsoe, min_selected: 1, max_selected: 4, shape: 'rectangle', position: [4]},
                {number: bsoe, min_selected: 1, max_selected: 4, shape: 'rectangle', position: [5]}
            ],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 2, max: 8},
            tips: "十位、个位至少选择各<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BsoeHsZh: {
        title: '后三大小单双组合',
        desc: '分别选择百位、十位和个位的1个形态（大：5-9；小：0-4；单：1,3,5,7,9； 双：0,2,4,6,8)，组成1注，所选位置的形态与开奖号码的位置与形态相同，即中奖。',
        example: '投注方案：百位：大,十位：小,个位：单；开奖号码：*,*,9,4,5，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'zx',
        },
        layout: {
            type: 'BsoeZx',
            rows: [
                {number: bsoe, min_selected: 1, max_selected: 4, shape: 'rectangle', position: [3]},
                {number: bsoe, min_selected: 1, max_selected: 4, shape: 'rectangle', position: [4]},
                {number: bsoe, min_selected: 1, max_selected: 4, shape: 'rectangle', position: [5]}
            ],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 3, max: 12},
            tips: "百位、十位和个位至少各选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },

    BsoeWxHz: {
        title: '五星和值大小单双',
        desc: '选择1个形态（大：23-45；小：0-22；单：个位数1,3,5,7,9；双：个位数0,2,4,6,8），与开奖的5个号码的和值的形态相同，即中奖。',
        example: '投注方案：大；开奖号码：9,8,7,6,9，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'BsoeHz',
            rows: [{
                number: bsoe,
                min_selected: 1,
                max_selected: 4,
                shape: 'rectangle',
                position: [1,2,3,4,5],
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 4},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BsoeQsHz: {
        title: '前三和值大小单双',
        desc: '选择前三的1个形态（大：14-27；小：0-13；单：个位数1,3,5,7,9；双：个位数0,2,4,6,8），所选位置的形态与开奖号码对应位置的和值的形态相同，即中奖。',
        example: '投注方案：万位：大,千位：小,百位：单；开奖号码：9,4,5,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'BsoeHz',
            rows: [{
                number: bsoe,
                min_selected: 1,
                max_selected: 4,
                shape: 'rectangle',
                position: [1,2,3],
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 4},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BsoeZsHz: {
        title: '中三和值大小单双',
        desc: '选择中三的1个形态（大：14-27；小：0-13；单：个位数1,3,5,7,9；双：个位数0,2,4,6,8），所选位置的形态与开奖号码对应位置的和值的形态相同，即中奖。',
        example: '投注方案：千位：小,百位：单,十位：大；开奖号码：*,9,4,6,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'BsoeHz',
            rows: [{
                number: bsoe,
                min_selected: 1,
                max_selected: 4,
                shape: 'rectangle',
                position: [2,3,4],
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 4},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BsoeHsHz: {
        title: '后三和值大小单双',
        desc: '选择后三的1个形态（大：14-27；小：0-13；单：个位数1,3,5,7,9；双：个位数0,2,4,6,8），所选位置的形态与开奖号码对应位置的和值的形态相同，即中奖。',
        example: '投注方案：百位：单,十位：大,个位：小,；开奖号码：*,*,9,4,2，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'BsoeHz',
            rows: [
                {number: bsoe, min_selected: 1, max_selected: 4, shape: 'rectangle', position: [3,4,5],}
            ],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 4},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },

    ReZx: {
        title: '任二直选复式',
        desc: '从万位、千位、百位、十位、个位中任意选择2个位置，在这2个位置上各选择1个号码组成1注。开奖号码与所选2个位置的号码相同，且顺序一致，即中奖。',
        example: '投注方案：1,2,-,-,-；开奖号码：1,2,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'rxZx',
            position: 2,
        },
        layout: {
            type: 'RxZxFs',
            rows: [
                {title: "万位", number: numbers, min_selected: 0, max_selected: 10, position: [1], buttons: true,},
                {title: "千位", number: numbers, min_selected: 0, max_selected: 10, position: [2], buttons: true,},
                {title: "百位", number: numbers, min_selected: 0, max_selected: 10, position: [3], buttons: true,},
                {title: "十位", number: numbers, min_selected: 0, max_selected: 10, position: [4], buttons: true,},
                {title: "个位", number: numbers, min_selected: 0, max_selected: 10, position: [5], buttons: true,}
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 2, max: 50},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ReZxDs: {
        title: '任二直选单式',
        desc: '从万位、千位、百位、十位、个位中任意勾选2个位置。录入1个2位数的号码组成1注。被勾选2个位置上的开奖号码与所录入号码相同，且顺序一致，即中奖',
        example: '投注方案：(万千)12；开奖号码：1,2,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'RxZxDs',
            positions: {
                options: positions,
                min_checked: 2,
                max_checked: 5,
            },
            rows: [{
                length: 2,
                allowed_numbers: dsNumbers,
            }],
            unit_repeat: false,
            unit_separator: '',
            row_repeat: false,
            row_separator: ',|， ；;',
            code_total_count: { min: 1, max: 100000 },
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ReZxHz: {
        title: '任二直选和值',
        desc: '从万位、千位、百位、十位、个位中任意勾选2个位置，选择1个数值。被勾选2个位置上的开奖号码之和与所选和值相同，即中奖。',
        example: '投注方案：(万千)3；开奖号码：1,2,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'mapRx',
        },
        layout: {
            type: 'RxSum',
            positions: {
                options: positions,
                min_checked: 2,
                max_checked: 5,
            },
            rows: [{
                number: r2ZxHz,
                min_selected: 1,
                max_selected: 19,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 9,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 19},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ReZu: {
        title: '任二组选复式',
        desc: '从万位、千位、百位、十位、个位中任意勾选2个位置，选择2个号码组成1注。被勾选2个位置的开奖号码与所选号码相同（顺序不限），即中奖。',
        example: '投注方案：(万千)1,2；开奖号码：2,1,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'RxZuFs',
            positions: {
                options: positions,
                min_checked: 2,
                max_checked: 5,
            },
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ReZuDs: {
        title: '任二组选单式',
        desc: '从万位、千位、百位、十位、个位中任意勾选2个位置。录入2个不相同的码号。被勾选2个位置的开奖号码与录入号码相同（顺序不限），即中奖。',
        example: '投注方案：(万千)12；开奖号码：2,1,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'RxZuDs',
            positions: {
                options: positions,
                min_checked: 2,
                max_checked: 5,
            },
            rows: [{
                length: 2,
                allowed_numbers: dsNumbers,
            }],
            unit_repeat: false,
            unit_separator: '',
            row_repeat: false,
            row_separator: ',|， ；;',
            code_total_count: { min: 1, max: 100000 },
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ReZuHz: {
        title: '任二组选和值',
        desc: '从万位、千位、百位、十位、个位中任意勾选2个位置，选择1个数值。被勾选2个位置上的开奖号码（不含对子号）之和与所选号和值一致，即中奖。',
        example: '投注方案：(万千)3；开奖号码：1,2,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'mapRx',
        },
        layout: {
            type: 'RxSum',
            positions: {
                options: positions,
                min_checked: 2,
                max_checked: 5,
            },
            rows: [{
                number: r2ZuHz,
                min_selected: 1,
                max_selected: 17,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 9,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 17},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    ReZuBd: {
        title: '任二组选包胆',
        desc: '从万位、千位、百位、十位、个位中任意勾选2个位置，选择1个号码。被勾选2个位置上的开奖号码（不含对子号）中任意1位与所选号码相同，即中奖。',
        example: '投注方案：(万千)3；开奖号码：1,3,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'RxBd',
            positions: {
                options: positions,
                min_checked: 2,
                max_checked: 5,
            },
            rows: [{
                number: r2ZuBd,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },

    RsZx: {
        title: '任三直选复式',
        desc: '从万位、千位、百位、十位、个位中任意选择3个位置，在这3个位置上各选择1个号码组成1注。开奖号码与所选3个位置的号码相同，且顺序一致，即中奖。。',
        example: '投注方案：1,2,3,-,-；开奖号码：1,2,3,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'rxZx',
            position: 3,
        },
        layout: {
            type: 'RxZxFs',
            rows: [
                {title: "万位", number: numbers, min_selected: 0, max_selected: 10, position: [1], buttons: true,},
                {title: "千位", number: numbers, min_selected: 0, max_selected: 10, position: [2], buttons: true,},
                {title: "百位", number: numbers, min_selected: 0, max_selected: 10, position: [3], buttons: true,},
                {title: "十位", number: numbers, min_selected: 0, max_selected: 10, position: [4], buttons: true,},
                {title: "个位", number: numbers, min_selected: 0, max_selected: 10, position: [5], buttons: true,}
            ],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 3, max: 50},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    RsZxDs: {
        title: '任三直选单式',
        desc: '从万位、千位、百位、十位、个位中任意勾选3个位置。录入1个3位数的号码组成1注。被勾选3个位置上的开奖号码与所录入号码相同，且顺序一致，即中奖。',
        example: '投注方案：(万千百)123；开奖号码：1,2,3*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'RxZxDs',
            positions: {
                options: positions,
                min_checked: 3,
                max_checked: 5,
            },
            rows: [{
                length: 3,
                allowed_numbers: dsNumbers,
            }],
            unit_repeat: false,
            unit_separator: '',
            row_repeat: false,
            row_separator: ',|， ；;',
            code_total_count: { min: 1, max: 100000 },
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    RsZxHz: {
        title: '任二直选和值',
        desc: '从万位、千位、百位、十位、个位中任意勾选2个位置，选择1个数值。被勾选2个位置上的开奖号码之和与所选和值相同，即中奖。',
        example: '投注方案：(万千)3；开奖号码：1,2,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'mapRx',
        },
        layout: {
            type: 'RxSum',
            positions: {
                options: positions,
                min_checked: 2,
                max_checked: 5,
            },
            rows: [{
                number: r2ZxHz,
                min_selected: 1,
                max_selected: 19,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 9,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 19},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    RsZu: {
        title: '任二组选复式',
        desc: '从万位、千位、百位、十位、个位中任意勾选2个位置，选择2个号码组成1注。被勾选2个位置的开奖号码与所选号码相同（顺序不限），即中奖。',
        example: '投注方案：(万千)1,2；开奖号码：2,1,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'RxZuFs',
            positions: {
                options: positions,
                min_checked: 2,
                max_checked: 5,
            },
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    RsZuDs: {
        title: '任二组选单式',
        desc: '从万位、千位、百位、十位、个位中任意勾选2个位置。录入2个不相同的码号。被勾选2个位置的开奖号码与录入号码相同（顺序不限），即中奖。',
        example: '投注方案：(万千)12；开奖号码：2,1,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'BdwSingle',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    RsZuHz: {
        title: '任二组选和值',
        desc: '从万位、千位、百位、十位、个位中任意勾选2个位置，选择1个数值。被勾选2个位置上的开奖号码（不含对子号）之和与所选号和值一致，即中奖。',
        example: '投注方案：(万千)3；开奖号码：1,2,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'mapRx',
        },
        layout: {
            type: 'RxSum',
            positions: {
                options: positions,
                min_checked: 2,
                max_checked: 5,
            },
            rows: [{
                number: r2ZuHz,
                min_selected: 1,
                max_selected: 17,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 9,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 17},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    RsZuBd: {
        title: '任二组选包胆',
        desc: '从万位、千位、百位、十位、个位中任意勾选2个位置，选择1个号码。被勾选2个位置上的开奖号码（不含对子号）中任意1位与所选号码相同，即中奖。',
        example: '投注方案：(万千)3；开奖号码：1,3,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'RxBd',
            positions: {
                options: positions,
                min_checked: 2,
                max_checked: 5,
            },
            rows: [{
                number: r2ZuBd,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },

    QwYffs: {
        title: '一帆风顺',
        desc: '选择1个号码组成1注。开奖号码的万位、千位、百位、十位、个位中包含所选号码，即中奖。',
        example: '投注方案：8；开奖号码：1,9,6,5,8，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Qw',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QwHscs: {
        title: '好事成双',
        desc: '选择1个号码组成1注。所选号码在开奖号码的万位、千位、百位、十位、个位中出现2次或以上，即为中奖。',
        example: '投注方案：6；开奖号码：9,8,6,2,6，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Qw',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QwSxbx: {
        title: '三星报喜',
        desc: '选择1个号码组成1注。所选号码在开奖号码的万位、千位、百位、十位、个位中出现3次或以上，即为中奖。',
        example: '投注方案：6；开奖号码：6,6,6,1,8，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Qw',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },
    QwSjfc: {
        title: '四季发财',
        desc: '选择1个号码组成1注。所选号码在开奖号码的万位、千位、百位、十位、个位中出现4次或以上，即为中奖。',
        example: '投注方案：6；开奖号码：6,6,8,6,6，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Qw',
            rows: [{
                number: numbers,
                min_selected: 1,
                max_selected: 10,
                position: [1,2,3,4,5],
                buttons: true,
            }],
            stat_big_min: 5,
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 10},
            tips: "至少选择<b>1</b>个值",
        },
        levels: [
            {
                prize: 'N/A',
                title: '一等奖',
                codes: [],
            },
        ]
    },

    LhWq: {
        title: '万千',
        desc: '从1组位置中选择1个形态组成1注，1组位置中的开奖号码比较大小，前者大于后者为龙，反之为虎，号码相同则为和。所选形态与开奖形态一致，即中奖。',
        example: '投注方案：万千和；开奖号码：6,6,*,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [{
                number: lh,
                min_selected: 1,
                max_selected: 3,
                position: [1,2],
                shape: 'rectangle'
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 3},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '和',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '龙虎',
                codes: [0, 1],
            },
        ]
    },
    LhWb: {
        title: '万百',
        desc: '从1组位置中选择1个形态组成1注，1组位置中的开奖号码比较大小，前者大于后者为龙，反之为虎，号码相同则为和。所选形态与开奖形态一致，即中奖。',
        example: '投注方案：万百和；开奖号码：6,*,6,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [{
                number: lh,
                min_selected: 1,
                max_selected: 3,
                position: [1,3],
                shape: 'rectangle'
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 3},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '和',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '龙虎',
                codes: [0, 1],
            },
        ]
    },
    LhWs: {
        title: '万十',
        desc: '从1组位置中选择1个形态组成1注，1组位置中的开奖号码比较大小，前者大于后者为龙，反之为虎，号码相同则为和。所选形态与开奖形态一致，即中奖。',
        example: '投注方案：万十和；开奖号码：6,*,*,6,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [{
                number: lh,
                min_selected: 1,
                max_selected: 3,
                position: [1,4],
                shape: 'rectangle'
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 3},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '和',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '龙虎',
                codes: [0, 1],
            },
        ]
    },
    LhWg: {
        title: '万个',
        desc: '从1组位置中选择1个形态组成1注，1组位置中的开奖号码比较大小，前者大于后者为龙，反之为虎，号码相同则为和。所选形态与开奖形态一致，即中奖。',
        example: '投注方案：万个和；开奖号码：6,*,*,*,6，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [{
                number: lh,
                min_selected: 1,
                max_selected: 3,
                position: [1,5],
                shape: 'rectangle'
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 3},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '和',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '龙虎',
                codes: [0, 1],
            },
        ]
    },
    LhQb: {
        title: '千百',
        desc: '从1组位置中选择1个形态组成1注，1组位置中的开奖号码比较大小，前者大于后者为龙，反之为虎，号码相同则为和。所选形态与开奖形态一致，即中奖。',
        example: '投注方案：万百和；开奖号码：*,6,6,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [{
                number: lh,
                min_selected: 1,
                max_selected: 3,
                position: [2,3],
                shape: 'rectangle'
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 3},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '和',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '龙虎',
                codes: [0, 1],
            },
        ]
    },
    LhQs: {
        title: '千十',
        desc: '从1组位置中选择1个形态组成1注，1组位置中的开奖号码比较大小，前者大于后者为龙，反之为虎，号码相同则为和。所选形态与开奖形态一致，即中奖。',
        example: '投注方案：千十和；开奖号码：*,6,*,6,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [{
                number: lh,
                min_selected: 1,
                max_selected: 3,
                position: [2,4],
                shape: 'rectangle'
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 3},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '和',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '龙虎',
                codes: [0, 1],
            },
        ]
    },
    LhQg: {
        title: '千个',
        desc: '从1组位置中选择1个形态组成1注，1组位置中的开奖号码比较大小，前者大于后者为龙，反之为虎，号码相同则为和。所选形态与开奖形态一致，即中奖。',
        example: '投注方案：千个和；开奖号码：*,6,*,*,6，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [{
                number: lh,
                min_selected: 1,
                max_selected: 3,
                position: [2,5],
                shape: 'rectangle'
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 3},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '和',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '龙虎',
                codes: [0, 1],
            },
        ]
    },
    LhBs: {
        title: '百十',
        desc: '从1组位置中选择1个形态组成1注，1组位置中的开奖号码比较大小，前者大于后者为龙，反之为虎，号码相同则为和。所选形态与开奖形态一致，即中奖。',
        example: '投注方案：百十和；开奖号码：*,*,6,6,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [{
                number: lh,
                min_selected: 1,
                max_selected: 3,
                position: [3,4],
                shape: 'rectangle'
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 3},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '和',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '龙虎',
                codes: [0, 1],
            },
        ]
    },
    LhBg: {
        title: '百个',
        desc: '从1组位置中选择1个形态组成1注，1组位置中的开奖号码比较大小，前者大于后者为龙，反之为虎，号码相同则为和。所选形态与开奖形态一致，即中奖。',
        example: '投注方案：百个和；开奖号码：*,*,6,*,6，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [{
                number: lh,
                min_selected: 1,
                max_selected: 3,
                position: [3,5],
                shape: 'rectangle'
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 3},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '和',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '龙虎',
                codes: [0, 1],
            },
        ]
    },
    LhSg: {
        title: '十个',
        desc: '从1组位置中选择1个形态组成1注，1组位置中的开奖号码比较大小，前者大于后者为龙，反之为虎，号码相同则为和。所选形态与开奖形态一致，即中奖。',
        example: '投注方案：十个和；开奖号码：*,*,*,6,6，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [{
                number: lh,
                min_selected: 1,
                max_selected: 3,
                position: [4,5],
                shape: 'rectangle'
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 3},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '和',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '龙虎',
                codes: [0, 1],
            },
        ]
    },
    Sh: {
        title: '梭哈',
        desc: '选择1个形态为1注，所选形态和开奖形态相同，顺序不限，即中奖。 四条：开奖号码中1个号码出现1次，另1个号码出现4次； 葫芦：开奖号码中1个号码出现2次，另1个号码出现3次； 顺子：开奖号码为5个顺序相连的号码；9与0相连，0与1相连； 三条：开奖号码中1个数字出现3次，其余2个号码不相同； 两对：开奖号码中出现两对二重号； 一对：开奖号码中出现二重号，而另外3个号码不相同； 单牌：开奖号码的5个数字各不相同且不为顺子。',
        example: '投注方案：顺子；开奖号码：0,1,6,7,8，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Sh',
            rows: [{
                number: sh,
                min_selected: 1,
                max_selected: 7,
                position: [1,2,3,4,5],
                shape: 'rectangle'
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 7},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '四条',
                codes: [0],
            },
            {
                prize: 'N/A',
                title: '葫芦',
                codes: [1],
            },
            {
                prize: 'N/A',
                title: '顺子',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '三条',
                codes: [3],
            },
            {
                prize: 'N/A',
                title: '两对',
                codes: [4],
            },
            {
                prize: 'N/A',
                title: '一对',
                codes: [5],
            },
            {
                prize: 'N/A',
                title: '单牌',
                codes: [6],
            },
        ]
    },
    ZjhQs: {
        title: '前三扎金花',
        desc: '选择1个形态为1注，所选形态和开奖号码对应位置的3个数字的形态相同，顺序不限，即中奖。 豹子：3个号码相同； 顺子：3个顺序相连的号码；9与0相连，0与1相连； 对子：3个数字中有1个数字出现2次，另1个数字出现1次（如：151、887）； 半顺：3个数字各不相同，且其中只有2个数字相连（如：238、769）； 杂六：3个数字各不相同且互不相连（如：357、962）。。',
        example: '前三：顺子；开奖号码：1,2,3,*,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Zjh',
            rows: [{
                number: zjh,
                min_selected: 1,
                max_selected: 5,
                position: [1,2,3],
                shape: 'rectangle'
            }],
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 5},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '豹子',
                codes: [0],
            },
            {
                prize: 'N/A',
                title: '顺子',
                codes: [1],
            },
            {
                prize: 'N/A',
                title: '对子',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '杂六',
                codes: [3],
            },
            {
                prize: 'N/A',
                title: '半顺',
                codes: [4],
            },
        ]
    },
    ZjhZs: {
        title: '中三扎金花',
        desc: '选择1个形态为1注，所选形态和开奖号码对应位置的3个数字的形态相同，顺序不限，即中奖。 豹子：3个号码相同； 顺子：3个顺序相连的号码；9与0相连，0与1相连； 对子：3个数字中有1个数字出现2次，另1个数字出现1次（如：151、887）； 半顺：3个数字各不相同，且其中只有2个数字相连（如：238、769）； 杂六：3个数字各不相同且互不相连（如：357、962）。。',
        example: '中三：顺子；开奖号码：*,1,2,3,*，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Zjh',
            rows: [{
                number: zjh,
                min_selected: 1,
                max_selected: 5,
                position: [1,2,3],
                shape: 'rectangle'
            }],
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 5},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '豹子',
                codes: [0],
            },
            {
                prize: 'N/A',
                title: '顺子',
                codes: [1],
            },
            {
                prize: 'N/A',
                title: '对子',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '杂六',
                codes: [3],
            },
            {
                prize: 'N/A',
                title: '半顺',
                codes: [4],
            },
        ]
    },
    ZjhHs: {
        title: '后三扎金花',
        desc: '选择1个形态为1注，所选形态和开奖号码对应位置的3个数字的形态相同，顺序不限，即中奖。 豹子：3个号码相同； 顺子：3个顺序相连的号码；9与0相连，0与1相连； 对子：3个数字中有1个数字出现2次，另1个数字出现1次（如：151、887）； 半顺：3个数字各不相同，且其中只有2个数字相连（如：238、769）； 杂六：3个数字各不相同且互不相连（如：357、962）。。',
        example: '后三：顺子；开奖号码：*,*,1,2,3，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Zjh',
            rows: [{
                number: zjh,
                min_selected: 1,
                max_selected: 5,
                position: [1,2,3],
                shape: 'rectangle'
            }],
            row_separator: '|',
            row_repeat: true,
            unit_separator: ',',
            unit_repeat: false,
            code_total_count: {min: 1, max: 5},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '豹子',
                codes: [0],
            },
            {
                prize: 'N/A',
                title: '顺子',
                codes: [1],
            },
            {
                prize: 'N/A',
                title: '对子',
                codes: [2],
            },
            {
                prize: 'N/A',
                title: '杂六',
                codes: [3],
            },
            {
                prize: 'N/A',
                title: '半顺',
                codes: [4],
            },
        ]
    },
    Nn: {
        title: '牛牛',
        desc: '选择1个形态为1注，所选形态与开奖形态相同，即中奖。 1、无牛：开奖号码中任意3位数相加都无法是0或10的倍数； 2、牛牛：开奖号码中任意3位数相加可以为0或10的倍数，另外2个数字相加的个位数为0； 3、牛1-牛9：开奖号码中任意3位数相加可以为0或10的倍数，另外2个数字相加的个位数为所选号码； 4、牛大：牛牛，牛9、牛8、牛7、牛6； 5、牛小：牛5、牛4、牛3、牛2、牛1； 6、牛单：牛1、牛3、牛5、牛7、牛9； 7、牛双：牛2、牛4、牛6、牛8、牛牛',
        example: '投注方案：牛8；开奖号码：8,6,3,1,0，即中奖。',
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Nn',
            rows: [{
                number: nn,
                min_selected: 1,
                max_selected: 15,
                shape: 'rectangle',
                position: [1,2,3,4,5],
            }],
            unit_repeat: false,
            unit_separator: ',',
            row_separator: '|',
            row_repeat: true,
            code_total_count: {min: 1, max: 15},
            tips: "至少选择<b>1</b>个形态",
        },
        levels: [
            {
                prize: 'N/A',
                title: '牛1/3/5/7/9',
                codes: [1,3,5,7,9],
            },
            {
                prize: 'N/A',
                title: '牛牛',
                codes: [10],
            },
            {
                prize: 'N/A',
                title: '牛2/4/6/8',
                codes: [2,4,6,8],
            },
            {
                prize: 'N/A',
                title: '牛单',
                codes: [13],
            },
            {
                prize: 'N/A',
                title: '牛小',
                codes: [12],
            },
            {
                prize: 'N/A',
                title: '牛大',
                codes: [11],
            },
            {
                prize: 'N/A',
                title: '牛双',
                codes: [14],
            },
            {
                prize: 'N/A',
                title: '无牛',
                codes: [0],
            },
        ]
    },
};

export default sscOfficialDefine;