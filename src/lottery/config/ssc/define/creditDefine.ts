import { bs, oe, ps, numbers, lh, zjh } from "@/lottery/config/ssc/define/creditCodeDefine";
import {MethodDefineList} from "@/types";

const sscCreditDefine: MethodDefineList = {
    BallOneBs: {
        title: '第一球&大小',
        desc: {
            title: '大小',
            content: [
                {title: '', content: '开奖号码≥5为“大”，≤4为“小”。'},
            ],
            example: '投注方案：大；第一球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [{number: bs, position: [1]}],
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
    BallOneOe: {
        title: '第一球&单双',
        desc: {
            title: '单双',
            content: [
                {title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。'},
            ],
            example: '投注方案：双；第一球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [{number: oe, position: [1],}],
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
    BallOnePs: {
        title: '第一球&质合',
        desc: {
            title: '质合',
            content: [
                {title: '', content: '开奖号码1、2、3、5、7为“质”，0、4、6、8、9为“合”。'},
            ],
            example: '投注方案：质；第一球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ps',
            rows: [{number: ps, position: [1],}],
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
    BallOne: {
        title: '第一球',
        desc: {
            title: '第一球',
            content: [
                {title: '', content: '从第一球选择1个号码组成1注，所选号码与第一球的开奖号码一致，即中奖。'},
            ],
            example: '投注方案：8；第一球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [{number: numbers, position: [1],shape: 'circle'}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BallTwoBs: {
        title: '第二球&大小',
        desc: {
            title: '大小',
            content: [
                {title: '', content: '开奖号码≥5为“大”，≤4为“小”。'},
            ],
            example: '投注方案：大；第二球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [{number: bs, position: [2],}],
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
    BallTwoOe: {
        title: '第二球&单双',
        desc: {
            title: '单双',
            content: [
                {title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。'},
            ],
            example: '投注方案：双；第二球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [{number: oe, position: [2],}],
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
    BallTwoPs: {
        title: '第二球&质合',
        desc: {
            title: '质合',
            content: [
                {title: '', content: '开奖号码1、2、3、5、7为“质”，0、4、6、8、9为“合”。'},
            ],
            example: '投注方案：质；第二球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ps',
            rows: [{number: ps, position: [2],}],
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
    BallTwo: {
        title: '第二球',
        desc: {
            title: '第二球',
            content: [
                {title: '', content: '从第二球选择1个号码组成1注，所选号码与第二球的开奖号码一致，即中奖。'},
            ],
            example: '投注方案：8；第二球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [{number: numbers, position: [2],shape: 'circle'}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BallThreeBs: {
        title: '第三球&大小',
        desc: {
            title: '大小',
            content: [
                {title: '', content: '开奖号码≥5为“大”，≤4为“小”。'},
            ],
            example: '投注方案：大；第三球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [{number: bs, position: [3],}],
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
    BallThreeOe: {
        title: '第三球&单双',
        desc: {
            title: '单双',
            content: [
                {title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。'},
            ],
            example: '投注方案：双；第三球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [{number: oe, position: [3],}],
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
    BallThreePs: {
        title: '第三球&质合',
        desc: {
            title: '质合',
            content: [
                {title: '', content: '开奖号码1、2、3、5、7为“质”，0、4、6、8、9为“合”。'},
            ],
            example: '投注方案：质；第三球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ps',
            rows: [{number: ps, position: [3],}],
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
    BallThree: {
        title: '第三球',
        desc: {
            title: '第三球',
            content: [
                {title: '', content: '从第三球选择1个号码组成1注，所选号码与第三球的开奖号码一致，即中奖。'},
            ],
            example: '投注方案：8；第三球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [{number: numbers, position: [3],shape: 'circle'}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BallFourBs: {
        title: '第四球&大小',
        desc: {
            title: '大小',
            content: [
                {title: '', content: '开奖号码≥5为“大”，≤4为“小”。'},
            ],
            example: '投注方案：大；第四球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [{number: bs, position: [4],}],
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
    BallFourOe: {
        title: '第四球&单双',
        desc: {
            title: '单双',
            content: [
                {title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。'},
            ],
            example: '投注方案：双；第四球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [{number: oe, position: [4],}],
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
    BallFourPs: {
        title: '第四球&质合',
        desc: {
            title: '质合',
            content: [
                {title: '', content: '开奖号码1、2、3、5、7为“质”，0、4、6、8、9为“合”。'},
            ],
            example: '投注方案：质；第四球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ps',
            rows: [{number: ps, position: [4],}],
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
    BallFour: {
        title: '第四球',
        desc: {
            title: '第四球',
            content: [
                {title: '', content: '从第四球选择1个号码组成1注，所选号码与第四球的开奖号码一致，即中奖。'},
            ],
            example: '投注方案：8；第四球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [{number: numbers, position: [4],shape: 'circle'}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    BallFiveBs: {
        title: '第五球&大小',
        desc: {
            title: '大小',
            content: [
                {title: '', content: '开奖号码≥5为“大”，≤4为“小”。'},
            ],
            example: '投注方案：大；第四球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Bs',
            rows: [{number: bs, position: [5],}],
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
    BallFiveOe: {
        title: '第五球&单双',
        desc: {
            title: '单双',
            content: [
                {title: '', content: '开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。'},
            ],
            example: '投注方案：双；第五球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Oe',
            rows: [{number: oe, position: [5],}],
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
    BallFivePs: {
        title: '第五球&质合',
        desc: {
            title: '质合',
            content: [
                {title: '', content: '开奖号码1、2、3、5、7为“质”，0、4、6、8、9为“合”。'},
            ],
            example: '投注方案：质；第五球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ps',
            rows: [{number: ps, position: [5],}],
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
    BallFive: {
        title: '第五球',
        desc: {
            title: '第五球',
            content: [
                {title: '', content: '从第五球选择1个号码组成1注，所选号码与第五球的开奖号码一致，即中奖。'},
            ],
            example: '投注方案：8；第五球开奖号码：8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Ball',
            rows: [{number: numbers, position: [5],shape: 'circle'}],
        },
        levels: [
            {
                prize: 49,
                title: '一等奖',
                codes: [],
            },
        ]
    },
    SumBs: {
        title: '总和大小',
        desc: {
            title: '大小',
            content: [
                {title: '', content: '开奖号码之和≥23为“大”，≤22为“小”。'},
            ],
            example: '投注方案：小；开奖号码：1,1,6,7,8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'SumBs',
            rows: [{number: bs, position: [1,2,3,4,5],}],
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
    SumOe: {
        title: '总和单双',
        desc: {
            title: '单双',
            content: [
                {title: '', content: '开奖号码之和的个位数为1、3、5、7、9为“单”，0、2、4、6、8为“双”。'},
            ],
            example: '投注方案：双；开奖号码：1,3,4,7,9，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'SumOe',
            rows: [{number: oe, position: [1,2,3,4,5],}],
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
    LhWg: {
        title: '龙虎和',
        desc: {
            title: '龙虎和(万个)',
            content: [
                {title: '', content: '第一球的开奖号码>第五球的开奖号码（0为最小，9为最大）为龙，反之为虎，相同为和'},
            ],
            example: '投注方案：龙；开奖8,1,2,4,6，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Lh',
            rows: [{number: lh, position: [1,5],}],
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
    ZjhQs: {
        title: '扎金花前三',
        desc: {
            title: '扎金花前三',
            content: [
                {title: '豹子', content: '3个相同的号码'},
                {title: '顺子', content: '3个相连的号码；顺序不限，相连定义：0-1-2-3-4-5-6-7-8-9-0之间循环'},
                {title: '对子', content: '3个数字中有1个数字出现2次，另1个数字出现1次，顺序不限'},
                {title: '杂六', content: '3个数字各不相同且互不相连'},
                {title: '半顺', content: '3个数字各不相同，且其中只有2个数字相连；顺序不限'},
            ],
            example: '投注方案：豹子；开奖号码：8,8,8,6,1，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Zjh',
            rows: [{number: zjh, position: [1,2,3],}],
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
        title: '扎金花中三',
        desc: {
            title: '扎金花中三',
            content: [
                {title: '豹子', content: '3个相同的号码'},
                {title: '顺子', content: '3个相连的号码；顺序不限，相连定义：0-1-2-3-4-5-6-7-8-9-0之间循环'},
                {title: '对子', content: '3个数字中有1个数字出现2次，另1个数字出现1次，顺序不限'},
                {title: '杂六', content: '3个数字各不相同且互不相连'},
                {title: '半顺', content: '3个数字各不相同，且其中只有2个数字相连；顺序不限'},
            ],
            example: '投注方案：豹子；开奖号码：1,8,8,8,1，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Zjh',
            rows: [{number: zjh, position: [2,3,4],}],
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
        title: '扎金花后三',
        desc: {
            title: '扎金花后三',
            content: [
                {title: '豹子', content: '3个相同的号码'},
                {title: '顺子', content: '3个相连的号码；顺序不限，相连定义：0-1-2-3-4-5-6-7-8-9-0之间循环'},
                {title: '对子', content: '3个数字中有1个数字出现2次，另1个数字出现1次，顺序不限'},
                {title: '杂六', content: '3个数字各不相同且互不相连'},
                {title: '半顺', content: '3个数字各不相同，且其中只有2个数字相连；顺序不限'},
            ],
            example: '投注方案：豹子；开奖号码：1,6,8,8,8，即中奖。',
        },
        lr_status: true,
        yl_status: true,
        layout: {
            type: 'Zjh',
            rows: [{number: zjh, position: [3,4,5],}],
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
};

export default sscCreditDefine;