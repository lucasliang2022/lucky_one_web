import { numbers, lh, bsoe, dsNumbers, gyHz, qsHz, positions } from "@/lottery/config/pk10/define/officialCodeDefine";
import { MethodDefineList } from "@/types";

const officialDefine: MethodDefineList = {
    CaiGj: {
        title: '猜冠军',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个号码为1注。所选号码和开奖号码的冠军相同，即中奖。' },
            ],
            example: '投注方案：8；开奖号码：8,*,*,*,*,*,*,*,*,*,即中奖',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'zxFs',
        },
        layout: {
            type: 'ZxFs',
            rows: [
                { number: numbers, title: '', min_selected: 1, max_selected: 10, position: [1], buttons: true },
            ],
            unit_repeat: false,
            unit_separator: '&',
            row_separator: ',',
            row_repeat: true,
            code_total_count: { min: 5, max: 50 },
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    CaiQianErFs: {
        title: '猜前二复式',
        desc: {
            title: '',
            content: [
                { title: '', content: '从冠军和亚军中各选择1个不重复的号码组成1注。所选号码与开奖号码的前两位号码相同，且顺序一致，即中奖。' },
            ],
            example: '投注方案：1,2；开奖号码：1,2,*,*,*,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'zxFs',
        },
        layout: {
            type: 'ZxFs',
            rows: [
                { title: '冠军', number: numbers, min_selected: 1, max_selected: 10, position: [1], buttons: true },
                { title: '亚军', number: numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true },
            ],
            unit_repeat: false,
            unit_separator: '&',
            row_repeat: false,
            row_separator: ',',
            code_total_count: { min: 2, max: 20 },
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    CaiQianErDs: {
        title: '猜前二单式',
        desc: {
            title: '',
            content: [
                { title: '', content: '从01-10中录入2个不重复号码。录入的号码与开奖号码的前2位相同，且顺序一致，即中奖。' },
            ],
            example: '投注方案：0102；开奖号码：1,2,*,*,*,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZxDs',
            rows: [{ allowed_numbers: dsNumbers, length: 3 }],
            unit_repeat: false, 
            unit_separator: '',
            row_repeat: false,
            row_separator: ',|， ；;',
            code_total_count: { min: 1, max: 100000 },
            tips: "至少输入<b>1</b>组号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    CaiQianSanFs: {
        title: '猜前三复式',
        desc: {
            title: '',
            content: [
                { title: '', content: '从冠军、亚军、第三名中各选择1个不重复的号码组成1注。所选号码与开奖号码的前3位号码相同，且顺序一致，即中奖。' },
            ],
            example: '投注方案：1,2,8；开奖号码：1,2,8,*,*,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'zxFs',
        },
        layout: {
            type: 'ZxFs',
            rows: [
                { title: '冠军', number: numbers, min_selected: 1, max_selected: 10, position: [1], buttons: true },
                { title: '亚军', number: numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true },
                { title: '第三名', number: numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true },
            ],
            unit_repeat: false,
            unit_separator: '&',
            row_repeat: false,
            row_separator: ',',
            code_total_count: { min: 3, max: 30 },
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    CaiQianSanDs: {
        title: '猜前三单式',
        desc: {
            title: '',
            content: [
                { title: '', content: '从01-10中录入3个不重复号码。录入的号码与开奖号码的前3位相同，且顺序一致，即中奖。' },
            ],
            example: '投注方案：010203；开奖号码：1,2,3,*,*,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZxDs',
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
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    CaiQianSiFs: {
        title: '猜前四复式',
        desc: {
            title: '',
            content: [
                { title: '', content: '从冠军、亚军、第三名、第四名中各选择1个不重复的号码组成1注。所选号码与开奖号码的前4位号码相同，且顺序一致，即中奖。' },
            ],
            example: '投注方案：1,2,3,4；开奖号码：1,2,3,4,*,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'zxFs',
        },
        layout: {
            type: 'ZxFs',
            rows: [
                { title: '冠军', number: numbers, min_selected: 1, max_selected: 10, position: [1], buttons: true },
                { title: '亚军', number: numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true },
                { title: '第三名', number: numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true },
                { title: '第四名', number: numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true },
            ],
            unit_repeat: false,
            unit_separator: '&', 
            row_separator: ',',
            code_total_count: { min: 4, max: 40 },
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    CaiQianSiDs: {
        title: '猜前四单式',
        desc: {
            title: '',
            content: [
                { title: '', content: '从01-10中录入4个不重复号码。录入的号码与开奖号码的前4位相同，且顺序一致，即中奖。' },
            ],
            example: '投注方案：01020304；开奖号码：1,2,3,4,*,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZxDs',
            rows: [{
                length: 4,
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
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    CaiQianWuFs: {
        title: '猜前五复式',
        desc: {
            title: '',
            content: [
                { title: '', content: '从冠军、亚军、第三名、第四名、第五名中各选择1个不重复的号码组成1注。所选号码与开奖号码的前5位号码相同，且顺序一致，即中奖。' },
            ],
            example: '投注方案：1,2,3,4,5；开奖号码：1,2,3,4,5,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'zxFs',
        },
        layout: {
            type: 'ZxFs',
            rows: [
                { title: '冠军', number: numbers, min_selected: 1, max_selected: 10, position: [1], buttons: true },
                { title: '亚军', number: numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true },
                { title: '第三名', number: numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true },
                { title: '第四名', number: numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true },
                { title: '第五名', number: numbers, min_selected: 1, max_selected: 10, position: [5], buttons: true },
            ],
            unit_repeat: false,
            unit_separator: '&',
            row_separator: ',',
            row_repeat: false,
            code_total_count: { min: 5, max: 50 },
            tips: "每个位置上至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    CaiQianWuDs: {
        title: '猜前五单式',
        desc: {
            title: '',
            content: [
                { title: '', content: '从01-10中录入5个不重复号码。录入的号码与开奖号码的前5位相同，且顺序一致，即中奖。' },
            ],
            example: '投注方案：0102030405；开奖号码：1,2,3,4,5,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'ZxDs',
            rows: [{
                length: 5,
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
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    DwdQw: {
        title: '前五定位胆',
        desc: {
            title: '',
            content: [
                { title: '', content: '在冠军、亚军、第三名、第四名、第五名中的任意位置上选择1个号码。所选号码与相同位置上的开奖号码一致，即中奖。' },
            ],
            example: '投注方案：冠军1；开奖号码：1,*,*,*,*,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'dwd',
        },
        layout: {
            type: 'Dwd',
            rows: [
                { title: '冠军', number: numbers, min_selected: 0, max_selected: 10, position: [1], buttons: true },
                { title: '亚军', number: numbers, min_selected: 0, max_selected: 10, position: [2], buttons: true },
                { title: '第三名', number: numbers, min_selected: 0, max_selected: 10, position: [3], buttons: true },
                { title: '第四名', number: numbers, min_selected: 0, max_selected: 10, position: [4], buttons: true },
                { title: '第五名', number: numbers, min_selected: 0, max_selected: 10, position: [5], buttons: true },
            ],
            row_separator: ',',
            row_repeat: false,
            unit_repeat: false,
            unit_separator: '&', 
            code_total_count: { min: 1, max: 50 },
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    DwdHw: {
        title: '后五定位胆',
        desc: {
            title: '',
            content: [
                { title: '', content: '在第六名、第七名、第八名、第九名、第十名中的任意位置上选择1个号码。所选号码与相同位置上的开奖号码一致，即中奖。' },
            ],
            example: '投注方案：第六名1；开奖号码：*,*,*,*,*,1,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        calc: {
            type: 'dwd',
        },
        layout: {
            type: 'Dwd',
            rows: [
                { title: '第六名', number: numbers, min_selected: 1, max_selected: 10, position: [6], buttons: true },
                { title: '第七名', number: numbers, min_selected: 1, max_selected: 10, position: [7], buttons: true },
                { title: '第八名', number: numbers, min_selected: 1, max_selected: 10, position: [8], buttons: true },
                { title: '第九名', number: numbers, min_selected: 1, max_selected: 10, position: [9], buttons: true },
                { title: '第十名', number: numbers, min_selected: 1, max_selected: 10, position: [10], buttons: true },
            ],
            unit_repeat: false,
            unit_separator: '&', 
            code_total_count: { min: 0, max: 50 },
            tips: "至少选择<b>1</b>个号码",
            row_separator: ',',
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    Lh1V10: {
        title: '龙虎1V10',
        desc: {
            title: '',
            content: [
                { title: '', content: '第一名和第十名开出的号码进行比较，前者大于后者为龙，反之为虎。所选形态与开奖形态一致，即中奖。' },
            ],
            example: '投注方案：1V10龙；开奖号码：10,*,*,*,*,*,*,*,*,1,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [{ number: lh, shape: 'rectangle', min_selected: 1, max_selected: 2, position: [1, 10] }],
            unit_repeat: false,
            unit_separator: '&', 
            code_total_count: { min: 1, max: 2 },
            tips: "至少选择<b>1</b>个号码",
            row_separator: ',',
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    Lh2V9: {
        title: '龙虎2V9',
        desc: {
            title: '',
            content: [
                { title: '', content: '第2名和第9名开出的号码进行比较，前者大于后者为龙，反之为虎。所选形态与开奖形态一致，即中奖。' },
            ],
            example: '投注方案：2V9龙；开奖号码：*,10,*,*,*,*,*,*,1,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [
                { number: lh, shape: 'rectangle', min_selected: 1, max_selected: 2, position: [2, 9] }
            ],
            unit_repeat: false,
            unit_separator: '&', 
            code_total_count: { min: 1, max: 2 },
            tips: "至少选择<b>1</b>个号码",
            row_separator: ',',
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    Lh3V8: {
        title: '龙虎3V8',
        desc: {
            title: '',
            content: [
                { title: '', content: '第3名和第8名开出的号码进行比较，前者大于后者为龙，反之为虎。所选形态与开奖形态一致，即中奖。' },
            ],
            example: '投注方案：3V8 龙；开奖号码：*,*,10,*,*,*,*,1,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [
                {
                    number: lh,
                    shape: 'rectangle',
                    min_selected: 1,
                    max_selected: 2,
                    position: [3, 8]
                }
            ],
            unit_repeat: false,
            unit_separator: '&', 
            code_total_count: { min: 1, max: 2 },
            tips: "至少选择<b>1</b>个号码",
            row_separator: ',',
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    Lh4V7: {
        title: '龙虎4V7',
        desc: {
            title: '',
            content: [
                { title: '', content: '第4名和第7名开出的号码进行比较，前者大于后者为龙，反之为虎。所选形态与开奖形态一致，即中奖。' },
            ],
            example: '投注方案：4V7 龙；开奖号码：*,*,*,10,*,*,1,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [
                {
                    number: lh,
                    shape: 'rectangle',
                    min_selected: 1,
                    max_selected: 2,
                    position: [4, 7]
                }
            ],
            unit_repeat: false,
            unit_separator: '&', 
            code_total_count: { min: 1, max: 2 },
            tips: "至少选择<b>1</b>个号码",
            row_separator: ',',
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    Lh5V6: {
        title: '龙虎5V6',
        desc: {
            title: '',
            content: [
                { title: '', content: '第5名和第6名开出的号码进行比较，前者大于后者为龙，反之为虎。所选形态与开奖形态一致，即中奖。' },
            ],
            example: '投注方案：5V6 龙；开奖号码：*,*,*,*,10,1,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Lh',
            rows: [
                {
                    number: lh,
                    shape: 'rectangle',
                    min_selected: 1,
                    max_selected: 2,
                    position: [5, 6]
                }
            ],
            unit_repeat: false,
            unit_separator: '&', 
            code_total_count: { min: 1, max: 2 },
            tips: "至少选择<b>1</b>个号码",
            row_separator: ',',
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    RxErZxFs: {
        title: '任二直选复式',
        desc: {
            title: '',
            content: [
                { title: '', content: '从10个位置中任意选择2个位置，在这2个位置上各选择1个不重复的号码组成1注。开奖号码与所选2个位置的号码相同，且顺序一致，即中奖。' },
            ],
            example: '投注方案：冠军1、亚军2开奖号码：1,2,*,*,*,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'RxFs',
            rows: [
                { title: '冠军', number: numbers, min_selected: 1, max_selected: 10, position: [1], buttons: true },
                { title: '亚军', number: numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true },
                { title: '第三名', number: numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true },
                { title: '第四名', number: numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true },
                { title: '第五名', number: numbers, min_selected: 1, max_selected: 10, position: [5], buttons: true },
                { title: '第六名', number: numbers, min_selected: 1, max_selected: 10, position: [6], buttons: true },
                { title: '第七名', number: numbers, min_selected: 1, max_selected: 10, position: [7], buttons: true },
                { title: '第八名', number: numbers, min_selected: 1, max_selected: 10, position: [8], buttons: true },
                { title: '第九名', number: numbers, min_selected: 1, max_selected: 10, position: [9], buttons: true },
                { title: '第十名', number: numbers, min_selected: 1, max_selected: 10, position: [10], buttons: true },
            ],
            unit_repeat: false,
            unit_separator: '&', 
            code_total_count: { min: 3, max: 100 },
            tips: "至少选择<b>1</b>个号码",
            row_separator: ',',
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    RxErZxDs: {
        title: '任二直选单式',
        desc: {
            title: '',
            content: [
                { title: '', content: '从10个位置中任意勾选2个位置。从01-10中录入2个不重复的号码组成1注。被勾选2个位置上的开奖号码与所录入号码相同，且顺序一致，即中奖。' },
            ],
            example: '投注方案：（冠军亚军）0102；开奖号码：1,2,*,*,*,*,*,*,*,*,即中奖。',
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'RxDs',
            positions: {
                options: positions,
                min_checked: 2,
                max_checked: 10,
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
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    RxSanZxFs: {
        title: '任三直选复式',
        desc: {
            title: '',
            content: [
                { title: '', content: '从10个位置中任意选择3个位置，在这3个位置上各选择1个不重复的号码组成1注。开奖号码与所选3个位置的号码相同，且顺序一致，即中奖。' },
            ],
            example: '投注方案：冠军1、亚军2、第三名3；开奖号码：1,2,3,*,*,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'RxFs',
            rows: [
                { title: '冠军', number: numbers, min_selected: 1, max_selected: 10, position: [1], buttons: true },
                { title: '亚军', number: numbers, min_selected: 1, max_selected: 10, position: [2], buttons: true },
                { title: '第三名', number: numbers, min_selected: 1, max_selected: 10, position: [3], buttons: true },
                { title: '第四名', number: numbers, min_selected: 1, max_selected: 10, position: [4], buttons: true },
                { title: '第五名', number: numbers, min_selected: 1, max_selected: 10, position: [5], buttons: true },
                { title: '第六名', number: numbers, min_selected: 1, max_selected: 10, position: [6], buttons: true },
                { title: '第七名', number: numbers, min_selected: 1, max_selected: 10, position: [7], buttons: true },
                { title: '第八名', number: numbers, min_selected: 1, max_selected: 10, position: [8], buttons: true },
                { title: '第九名', number: numbers, min_selected: 1, max_selected: 10, position: [9], buttons: true },
                { title: '第十名', number: numbers, min_selected: 1, max_selected: 10, position: [10], buttons: true },
            ],
            unit_repeat: false,
            unit_separator: '&',
            row_separator: ',',
            code_total_count: { min: 1, max: 2 },
            tips: "至少选择<b>1</b>个号码",
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    RxSanZxDs: {
        title: '任三直选单式',
        desc: {
            title: '',
            content: [
                { title: '', content: '从10个位置中任意勾选3个位置。从01-10中录入3个不重复的号码组成1注。被勾选3个位置上的开奖号码与所录入号码相同，且顺序一致，即中奖。' },
            ],
            example: '投注方案：（冠军亚军第三名）010203；开奖号码：1,2,3,*,*,*,*,*,*,*,即中奖。',
        },
        lr_status: false,
        yl_status: false,
        random_bet: true,
        layout: {
            type: 'RxDs',
            positions: {
                options: positions,
                min_checked: 3,
                max_checked: 10,
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
                prize: "N/A",
                title: '一等奖',
                codes: [],
            },
        ],
    },
    DxDsQw: {
        title: '前五大小单双',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择冠军、亚军、第三名、第四名、第五名中的1个形态（大：6-10；小：1-5；单：个位数1,3,5,7,9；双：个位数0,2,4,6,8），所选位置的形态与开奖号码对应位置的形态相同，即中奖。' },
            ],
            example: '投注方案：位置选择冠军，号码 双；开奖号码：8,*,*,*,*,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'Bsoe',
            rows: [
                { title: '冠军', number: bsoe, shape: 'rectangle', min_selected: 0, max_selected: 4, position: [1] },
                { title: '亚军', number: bsoe, shape: 'rectangle', min_selected: 0, max_selected: 4, position: [2] },
                { title: '第三名', number: bsoe, shape: 'rectangle', min_selected: 0, max_selected: 4, position: [3] },
                { title: '第四名', number: bsoe, shape: 'rectangle', min_selected: 0, max_selected: 4, position: [4] },
                { title: '第五名', number: bsoe, shape: 'rectangle', min_selected: 0, max_selected: 4, position: [5] },
            ],
            unit_repeat: false,
            unit_separator: '&', 
            code_total_count: { min: 1, max: 20 },
            tips: "至少在任意<b>1</b>个位置选择<b>1</b>个形态",
            row_separator: ',',
        },
        levels: [
            {
                prize: "N/A",
                title: '一等奖',
                codes: [0, 1, 2, 3],
            },
        ],
    },
    DxDsGyh: {
        title: '冠亚和大小单双',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个形态（大：12-19；小：3-11；单：个位数1,3,5,7,9；双：个位数0,2,4,6,8），与开奖号码中冠军、亚军2个号码之和的形态相同，即中奖。' },
            ],
            example: '投注方案：大；开奖号码：10,9,*,*,*,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'BsoeGyh',
            rows: [
                {
                    number: bsoe,
                    shape: 'rectangle',
                    min_selected: 1,
                    max_selected: 4,
                    position: [1, 2]
                }
            ],
            unit_repeat: false,
            unit_separator: '&', 
            code_total_count: { min: 1, max: 4 },
            tips: "至少选择<b>1</b>个形态",
            row_separator: ',',
        },
        levels: [
            {
                prize: "N/A",
                title: '冠亚和值大、双',
                codes: [0, 3],
            },
            {
                prize: "N/A",
                title: '冠亚和值小、单',
                codes: [1, 2],
            },
        ],
    },
    HzGy: {
        title: '冠亚和值',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个数值，与开奖号码中冠军、亚军2个号码之和相同，即中奖。' },
            ],
            example: '投注方案：8；开奖号码：3,5,*,*,*,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'HzGy',
            rows: [
                {
                    number: gyHz,
                    min_selected: 1,
                    max_selected: 17,
                    position: [1, 2],
                    buttons: true,
                }
            ],
            unit_repeat: false,
            unit_separator: '&', 
            code_total_count: { min: 1, max: 17 },
            tips: "至少选择<b>1</b>个值",
            row_separator: ',',
        },
        levels: [
            {
                prize: "N/A",
                title: '冠亚和值3、4、18、19',
                codes: [3, 4, 18, 19],
            },
            {
                prize: "N/A",
                title: '冠亚和值5、6、16、17',
                codes: [5, 6, 16, 17],
            },
            {
                prize: "N/A",
                title: '冠亚和值7、8、14、15',
                codes: [7, 8, 14, 15],
            },
            {
                prize: "N/A",
                title: '冠亚和值9、10、12、13',
                codes: [9, 10, 12, 13],
            },
            {
                prize: "N/A",
                title: '冠亚和值11',
                codes: [11],
            },
        ],
    },
    HzQs: {
        title: '前三和值',
        desc: {
            title: '',
            content: [
                { title: '', content: '选择1个数值，与开奖号码中冠军、亚军、第三名3个号码之和相同，即中奖。' },
            ],
            example: '投注方案：6；开奖号码：1,2,3,*,*,*,*,*,*,*,即中奖。',
        },
        lr_status: true,
        yl_status: true,
        random_bet: true,
        layout: {
            type: 'HzQs',
            rows: [
                {
                    number: qsHz,
                    min_selected: 1,
                    max_selected: 22,
                    position: [1, 2, 3]
                }
            ],
            unit_repeat: false,
            unit_separator: '&', 
            code_total_count: { min: 1, max: 22 },
            tips: "至少选择<b>1</b>个值",
            row_separator: ',',
        },
        levels: [
            {
                prize: "N/A",
                title: '前三和值6 、7 、26 、27',
                codes: [6, 7, 26, 27],
            },
            {
                prize: "N/A",
                title: '前三和值8 、25',
                codes: [8, 25],
            },
            {
                prize: "N/A",
                title: '前三和值9 、24',
                codes: [9, 24],
            },
            {
                prize: "N/A",
                title: '前三和值10 、23',
                codes: [10, 23],
            },
            {
                prize: "N/A",
                title: '前三和值11 、22',
                codes: [11, 22],
            },
            {
                prize: "N/A",
                title: '前三和值12 、21',
                codes: [12, 21],
            },
            {
                prize: "N/A",
                title: '前三和值13 、20',
                codes: [13, 20],
            },
            {
                prize: "N/A",
                title: '前三和值14 、19',
                codes: [14, 19],
            },
            {
                prize: "N/A",
                title: '前三和值15 、16 、17 、18',
                codes: [15, 16, 17, 18],
            },
        ],
    },
};

export default officialDefine;