import {CsList} from "@/types";

const sscCreditStructure: CsList = {
    'kj': {
        title: 'lottery.ssc.cat.kj',
        groups: {
            'ballOne': {
                title: 'lottery.ssc.group.ballOne',
                sign: 'ballOne',
                layout: [
                    {
                        title: '',
                        methods: {
                            BallOneBs: {target: 'BallOneBs', layout: 'Bs', segmentation: 4},
                            BallOneOe: {target: 'BallOneOe', layout: 'Oe', segmentation: 4},
                            BallOnePs: {target: 'BallOnePs', layout: 'Ps', segmentation: 4},
                        }
                    },
                    {
                        title: '',
                        methods: {
                            BallOne: {target: 'BallOne', layout: 'Ball', segmentation: 5},
                        }
                    },
                ],
            },
            'ballTwo': {
                title: 'lottery.ssc.group.ballTwo',
                sign: 'ballTwo',
                layout: [
                    {
                        title: '',
                        methods: {
                            BallTwoBs: {target: 'BallTwoBs', layout: 'Bs', segmentation: 4},
                            BallTwoOe: {target: 'BallTwoOe', layout: 'Oe', segmentation: 4},
                            BallTwoPs: {target: 'BallTwoPs', layout: 'Ps', segmentation: 4},
                        }
                    },
                    {
                        title: '',
                        methods: {
                            BallTwo: {target: 'BallTwo', layout: 'Ball', segmentation: 5},
                        }
                    },
                ],
            },
            'ballThree': {
                title: 'lottery.ssc.group.ballThree',
                sign: 'ballThree',
                layout: [
                    {
                        title: '',
                        methods: {
                            BallThreeBs: {target: 'BallThreeBs', layout: 'Bs', segmentation: 4},
                            BallThreeOe: {target: 'BallThreeOe', layout: 'Oe', segmentation: 4},
                            BallThreePs: {target: 'BallThreePs', layout: 'Ps', segmentation: 4},
                        }
                    },
                    {
                        title: '',
                        methods: {
                            BallThree: {target: 'BallThree', layout: 'Ball', segmentation: 5},
                        }
                    },
                ],
            },
            'ballFour': {
                title: 'lottery.ssc.group.ballFour',
                sign: 'ballFour',
                layout: [
                    {
                        title: '',
                        methods: {
                            BallFourBs: {target: 'BallFourBs', layout: 'Bs', segmentation: 4},
                            BallFourOe: {target: 'BallFourOe', layout: 'Oe', segmentation: 4},
                            BallFourPs: {target: 'BallFourPs', layout: 'Ps', segmentation: 4},
                        }
                    },
                    {
                        title: '',
                        methods: {
                            BallFour: {target: 'BallFour', layout: 'Ball', segmentation: 5},
                        }
                    },
                ],
            },
            'ballFive': {
                title: 'lottery.ssc.group.ballFive',
                sign: 'ballFive',
                layout: [
                    {
                        title: '',
                        methods: {
                            BallFiveBs: {target: 'BallFiveBs', layout: 'Bs', segmentation: 4},
                            BallFiveOe: {target: 'BallFiveOe', layout: 'Oe', segmentation: 4},
                            BallFivePs: {target: 'BallFivePs', layout: 'Ps', segmentation: 4},
                        }
                    },
                    {
                        title: '',
                        methods: {
                            BallFive: {target: 'BallFive', layout: 'Ball', segmentation: 5},
                        }
                    },
                ],
            },
        }
    },
    'sum': {
        title: 'lottery.ssc.cat.sum',
        groups: {
            'bsoe': {
                title: 'lottery.ssc.group.bsoe',
                sign: 'bsoe',
                layout: [
                    {
                        title: '',
                        methods: {
                            SumBs: {target: 'SumBs', layout: 'SumBs', segmentation: 4},
                            SumOe: {target: 'SumOe', layout: 'SumOe', segmentation: 4},
                        }
                    },
                ],
            },
            'lhwg': {
                title: 'lottery.ssc.group.lhwg',
                sign: 'lhwg',
                layout: [
                    {
                        title: '',
                        methods: {
                            LhWg: {target: 'LhWg', layout: 'Lh', segmentation: 3},
                        }
                    },
                ],
            },
        }
    },
    'ball': {
        title: 'lottery.ssc.cat.ball',
        groups: {
            'ballOne': {
                title: 'lottery.ssc.group.ballOne',
                sign: 'ballOne',
                layout: [
                    {
                        title: '',
                        methods: {
                            BallOne: {target: 'BallOne', layout: 'Ball', segmentation: 5},
                        }
                    },
                ],
            },
            'ballTwo': {
                title: 'lottery.ssc.group.ballTwo',
                sign: 'ballTwo',
                layout: [
                    {
                        title: '',
                        methods: {
                            BallTwo: {target: 'BallTwo', layout: 'Ball', segmentation: 5},
                        }
                    },
                ],
            },
            'ballThree': {
                title: 'lottery.ssc.group.ballThree',
                sign: 'ballThree',
                layout: [
                    {
                        title: '',
                        methods: {
                            BallThree: {target: 'BallThree', layout: 'Ball', segmentation: 5},
                        }
                    },
                ],
            },
            'ballFour': {
                title: 'lottery.ssc.group.ballFour',
                sign: 'ballFour',
                layout: [
                    {
                        title: '',
                        methods: {
                            BallFour: {target: 'BallFour', layout: 'Ball', segmentation: 5},
                        }
                    },
                ],
            },
            'ballFive': {
                title: 'lottery.ssc.group.ballFive',
                sign: 'ballFive',
                layout: [
                    {
                        title: '',
                        methods: {
                            BallFive: {target: 'BallFive', layout: 'Ball', segmentation: 5},
                        }
                    },
                ],
            },
        }
    },
    'zjh': {
        title: 'lottery.ssc.cat.zjh',
        groups: {
            'qianSan': {
                title: 'lottery.ssc.group.qianSan',
                sign: 'qianSan',
                layout: [
                    {
                        title: '',
                        methods: {
                            ZjhQs: {target: 'ZjhQs', layout: 'Zjh', segmentation: 3},
                        }
                    },
                ],
            },
            'zhongSan': {
                title: 'lottery.ssc.group.zhongSan',
                sign: 'zhongSan',
                layout: [
                    {
                        title: '',
                        methods: {
                            ZjhZs: {target: 'ZjhZs', layout: 'Zjh', segmentation: 3},
                        }
                    },
                ],
            },
            'houSan': {
                title: 'lottery.ssc.group.houSan',
                sign: 'houSan',
                layout: [
                    {
                        title: '',
                        methods: {
                            ZjhHs: {target: 'ZjhHs', layout: 'Zjh', segmentation: 3},
                        }
                    },
                ],
            },
        }
    },
};

export default sscCreditStructure;