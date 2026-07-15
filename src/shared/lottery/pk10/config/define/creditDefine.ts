import { bs, oe, lh, numbers } from './creditCodeDefine';
import {MethodDefineList} from "@shared/types";

const creditDefine: MethodDefineList = {
    GyBs: {
        title: '冠亚军&大小',
        desc: {
            title: '大小',
            content: [
                { title: '', content: '开奖号码中冠军与亚军之和>11为“大”，≤11为“小”。' },
            ],
            example: '投注方案：大；开奖号码：8,9,1,2,3,4,5,6,7,10，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [
                {number: bs, position: [1],},
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    GyOe: {
        title: '冠亚军&单双',
        desc: {
            title: '单双',
            content: [
                { title: '', content: '开奖号码中冠军与亚军之和的个位数为1、3、5、7、9为“单”，0、2、4、6、8为“双”。' },
            ],
            example: '投注方案：双；开奖号码：1,3,2,4,5,6,7,8,9,10，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [
                {
                    number: oe,
                    position: [1],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    GySum: {
        title: '冠亚军&和值',
        desc: {
            title: '和值',
            content: [
                { title: '', content: '选择1个数值，与开奖号码中冠军、亚军的2个号码之和相同，即中奖。' },
            ],
            example: '投注方案：5；开奖号码：2,3,4,5,6,7,8,9,10,1，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [
                {
                    number: oe,
                    position: [1],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    OneBs: {
        title: '第一名&大小',
        desc: {
            title: '大小',
            content: [
                { title: '', content: '开奖号码≥6为“大”，≤5为“小”' },
            ],
            example: '投注方案：大；第一名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [
                {
                    number: bs,
                    position: [1],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    OneOe: {
        title: '第一名&单双',
        desc: {
            title: '单双',
            content: [
                { title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。' },
            ],
            example: '投注方案：双；第一名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [
                {
                    number: oe,
                    position: [1],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    OneLh: {
        title: '冠军龙虎',
        desc: {
            title: '冠军龙虎',
            content: [
                { title: '', content: '冠军与第十名比较，前面的比后面的大为“龙”，反之为“虎”。（1最小，10最大）' },
            ],
            example: '投注方案：龙；第一名和第十名开奖号码分别：8,2，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Lh',
            rows: [
                {
                    number: lh,
                    position: [1],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    OneNumber: {
        title: '第一名',
        desc: {
            title: '第一名',
            content: [
                { title: '', content: '在冠军～第十名中的任意位置上选择1个号码为1注。所选号码与该位置上的开奖号码一致，即中奖。' },
            ],
            example: '投注方案：8；第一名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [
                {
                    number: numbers,
                    position: [1],
                },
            ],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    TwoBs: {
        title: '第二名&大小',
        desc: {
            title: '大小',
            content: [
                { title: '', content: '开奖号码≥6为“大”，≤5为“小”' },
            ],
            example: '投注方案：大；第二名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [
                {
                    number: bs,
                    position: [2],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    TwoOe: {
        title: '第二名&单双',
        desc: {
            title: '单双',
            content: [
                { title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。' },
            ],
            example: '投注方案：双；第二名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [
                {
                    number: oe,
                    position: [2],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    TwoLh: {
        title: '第二名龙虎',
        desc: {
            title: '第二名龙虎',
            content: [
                { title: '', content: '第二名与第十名比较，前面的比后面的大为“龙”，反之为“虎”。（1最小，10最大）' },
            ],
            example: '投注方案：龙；第二名和第十名开奖号码分别：8,2，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Lh',
            rows: [
                {
                    number: lh,
                    position: [2],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    TwoNumber: {
        title: '第二名',
        desc: {
            title: '第二名',
            content: [
                { title: '', content: '在冠军～第十名中的任意位置上选择1个号码为1注。所选号码与该位置上的开奖号码一致，即中奖。' },
            ],
            example: '投注方案：8；第二名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [
                {
                    number: numbers,
                    position: [2],
                },
            ],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    ThreeBs: {
        title: '第三名&大小',
        desc: {
            title: '大小',
            content: [
                { title: '', content: '开奖号码≥6为“大”，≤5为“小”' },
            ],
            example: '投注方案：大；第三名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [
                {
                    number: bs,
                    position: [3],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    ThreeOe: {
        title: '第三名&单双',
        desc: {
            title: '单双',
            content: [
                { title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。' },
            ],
            example: '投注方案：双；第三名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [
                {
                    number: oe,
                    position: [3],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    ThreeLh: {
        title: '第三名龙虎',
        desc: {
            title: '第三名龙虎',
            content: [
                { title: '', content: '第三名与第十名比较，前面的比后面的大为“龙”，反之为“虎”。（1最小，10最大）' },
            ],
            example: '投注方案：龙；第三名和第十名开奖号码分别：8,2，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Lh',
            rows: [
                {
                    number: lh,
                    position: [3],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    ThreeNumber: {
        title: '第三名',
        desc: {
            title: '第三名',
            content: [
                { title: '', content: '在冠军～第十名中的任意位置上选择1个号码为1注。所选号码与该位置上的开奖号码一致，即中奖。' },
            ],
            example: '投注方案：8；第三名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [
                {
                    number: numbers,
                    position: [3],
                },
            ],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    FourBs: {
        title: '第四名&大小',
        desc: {
            title: '大小',
            content: [
                { title: '', content: '开奖号码≥6为“大”，≤5为“小”' },
            ],
            example: '投注方案：大；第四名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [
                {
                    number: bs,
                    position: [4],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    FourOe: {
        title: '第四名&单双',
        desc: {
            title: '单双',
            content: [
                { title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。' },
            ],
            example: '投注方案：双；第四名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [
                {
                    number: oe,
                    position: [4],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    FourLh: {
        title: '第四名龙虎',
        desc: {
            title: '第四名龙虎',
            content: [
                { title: '', content: '第四名与第十名比较，前面的比后面的大为“龙”，反之为“虎”。（1最小，10最大）' },
            ],
            example: '投注方案：龙；第四名和第十名开奖号码分别：8,2，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Lh',
            rows: [
                {
                    number: lh,
                    position: [4],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    FourNumber: {
        title: '第四名',
        desc: {
            title: '第四名',
            content: [
                { title: '', content: '在冠军～第十名中的任意位置上选择1个号码为1注。所选号码与该位置上的开奖号码一致，即中奖。' },
            ],
            example: '投注方案：8；第四名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [
                {
                    number: numbers,
                    position: [4],
                },
            ],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    FiveBs: {
        title: '第五名&大小',
        desc: {
            title: '大小',
            content: [
                { title: '', content: '开奖号码≥6为“大”，≤5为“小”' },
            ],
            example: '投注方案：大；第五名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [
                {
                    number: bs,
                    position: [5],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    FiveOe: {
        title: '第五名&单双',
        desc: {
            title: '单双',
            content: [
                { title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。' },
            ],
            example: '投注方案：双；第五名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [
                {
                    number: oe,
                    position: [5],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    FiveLh: {
        title: '第五名龙虎',
        desc: {
            title: '第五名龙虎',
            content: [
                { title: '', content: '第五名与第十名比较，前面的比后面的大为“龙”，反之为“虎”。（1最小，10最大）' },
            ],
            example: '投注方案：龙；第五名和第十名开奖号码分别：8,2，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Lh',
            rows: [
                {
                    number: lh,
                    position: [5],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    FiveNumber: {
        title: '第五名',
        desc: {
            title: '第五名',
            content: [
                { title: '', content: '在冠军～第十名中的任意位置上选择1个号码为1注。所选号码与该位置上的开奖号码一致，即中奖。' },
            ],
            example: '投注方案：8；第五名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [
                {
                    number: numbers,
                    position: [5],
                },
            ],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    SixBs: {
        title: '第六名&大小',
        desc: {
            title: '大小',
            content: [
                { title: '', content: '开奖号码≥6为“大”，≤5为“小”' },
            ],
            example: '投注方案：大；第六名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [
                {
                    number: bs,
                    position: [6],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    SixOe: {
        title: '第六名&单双',
        desc: {
            title: '单双',
            content: [
                { title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。' },
            ],
            example: '投注方案：双；第六名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [
                {
                    number: oe,
                    position: [6],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    SixLh: {
        title: '第六名龙虎',
        desc: {
            title: '第六名龙虎',
            content: [
                { title: '', content: '第六名与第十名比较，前面的比后面的大为“龙”，反之为“虎”。（1最小，10最大）' },
            ],
            example: '投注方案：龙；第六名和第十名开奖号码分别：8,2，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Lh',
            rows: [
                {
                    number: lh,
                    position: [6],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    SixNumber: {
        title: '第六名',
        desc: {
            title: '第六名',
            content: [
                { title: '', content: '在冠军～第十名中的任意位置上选择1个号码为1注。所选号码与该位置上的开奖号码一致，即中奖。' },
            ],
            example: '投注方案：8；第六名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [
                {
                    number: numbers,
                    position: [6],
                },
            ],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    SevenBs: {
        title: '第七名&大小',
        desc: {
            title: '大小',
            content: [
                { title: '', content: '开奖号码≥6为“大”，≤5为“小”' },
            ],
            example: '投注方案：大；第七名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [
                {
                    number: bs,
                    position: [7],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    SevenOe: {
        title: '第七名&单双',
        desc: {
            title: '单双',
            content: [
                { title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。' },
            ],
            example: '投注方案：双；第七名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [
                {
                    number: oe,
                    position: [7],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    SevenLh: {
        title: '第七名龙虎',
        desc: {
            title: '第七名龙虎',
            content: [
                { title: '', content: '第七名与第十名比较，前面的比后面的大为“龙”，反之为“虎”。（1最小，10最大）' },
            ],
            example: '投注方案：龙；第七名和第十名开奖号码分别：8,2，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Lh',
            rows: [
                {
                    number: lh,
                    position: [7],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    SevenNumber: {
        title: '第七名',
        desc: {
            title: '第七名',
            content: [
                { title: '', content: '在冠军～第十名中的任意位置上选择1个号码为1注。所选号码与该位置上的开奖号码一致，即中奖。' },
            ],
            example: '投注方案：8；第七名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [
                {
                    number: numbers,
                    position: [7],
                },
            ],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    EightBs: {
        title: '第八名&大小',
        desc: {
            title: '大小',
            content: [
                { title: '', content: '开奖号码≥6为“大”，≤5为“小”' },
            ],
            example: '投注方案：大；第八名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [
                {
                    number: bs,
                    position: [8],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    EightOe: {
        title: '第八名&单双',
        desc: {
            title: '单双',
            content: [
                { title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。' },
            ],
            example: '投注方案：双；第八名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [
                {
                    number: oe,
                    position: [8],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    EightLh: {
        title: '第八名龙虎',
        desc: {
            title: '第八名龙虎',
            content: [
                { title: '', content: '第八名与第十名比较，前面的比后面的大为“龙”，反之为“虎”。（1最小，10最大）' },
            ],
            example: '投注方案：龙；第八名和第十名开奖号码分别：8,2，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Lh',
            rows: [
                {
                    number: lh,
                    position: [8],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    EightNumber: {
        title: '第八名',
        desc: {
            title: '第八名',
            content: [
                { title: '', content: '在冠军～第十名中的任意位置上选择1个号码为1注。所选号码与该位置上的开奖号码一致，即中奖。' },
            ],
            example: '投注方案：8；第八名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [
                {
                    number: numbers,
                    position: [8],
                },
            ],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    NineBs: {
        title: '第九名&大小',
        desc: {
            title: '大小',
            content: [
                { title: '', content: '开奖号码≥6为“大”，≤5为“小”' },
            ],
            example: '投注方案：大；第九名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [
                {
                    number: bs,
                    position: [9],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    NineOe: {
        title: '第九名&单双',
        desc: {
            title: '单双',
            content: [
                { title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。' },
            ],
            example: '投注方案：双；第九名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [
                {
                    number: oe,
                    position: [9],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    NineLh: {
        title: '第九名龙虎',
        desc: {
            title: '第九名龙虎',
            content: [
                { title: '', content: '第九名与第十名比较，前面的比后面的大为“龙”，反之为“虎”。（1最小，10最大）' },
            ],
            example: '投注方案：龙；第九名和第十名开奖号码分别：8,2，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Lh',
            rows: [
                {
                    number: lh,
                    position: [9],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    NineNumber: {
        title: '第九名',
        desc: {
            title: '第九名',
            content: [
                { title: '', content: '在冠军～第十名中的任意位置上选择1个号码为1注。所选号码与该位置上的开奖号码一致，即中奖。' },
            ],
            example: '投注方案：8；第九名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [
                {
                    number: numbers,
                    position: [9],
                },
            ],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    TenBs: {
        title: '第十名&大小',
        desc: {
            title: '大小',
            content: [
                { title: '', content: '开奖号码≥6为“大”，≤5为“小”' },
            ],
            example: '投注方案：大；第十名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [
                {
                    number: bs,
                    position: [10],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    TenOe: {
        title: '第十名&单双',
        desc: {
            title: '单双',
            content: [
                { title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。' },
            ],
            example: '投注方案：双；第十名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [
                {
                    number: oe,
                    position: [10],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    TenLh: {
        title: '第十名龙虎',
        desc: {
            title: '第十名龙虎',
            content: [
                { title: '', content: '第十名与第一名比较，前面的比后面的大为“龙”，反之为“虎”。（1最小，10最大）' },
            ],
            example: '投注方案：龙；第十名和第一名开奖号码分别：8,2，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Lh',
            rows: [
                {
                    number: lh,
                    position: [10],
                },
            ],
            opposition: [[1, 2]],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
    TenNumber: {
        title: '第十名',
        desc: {
            title: '第十名',
            content: [
                { title: '', content: '在冠军～第十名中的任意位置上选择1个号码为1注。所选号码与该位置上的开奖号码一致，即中奖。' },
            ],
            example: '投注方案：8；第十名开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [
                {
                    number: numbers,
                    position: [10],
                },
            ],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ],
    },
};

export default creditDefine;