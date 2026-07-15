import {CsList} from "@shared/types";

const creditStructure: CsList = {
    'kj': {
        title: 'lottery.pk10.cat.kj',
        groups: {
            'one': {
                title: 'lottery.pk10.group.one',
                sign: 'one',
                layout: [
                    {
                        title: '',
                        methods: {
                            OneBs: { target: 'OneBs', layout: 'Bs', segmentation: 4 },
                            OneOe: { target: 'OneOe', layout: 'Oe', segmentation: 4 },
                            OneLh: { target: 'OneLh', layout: 'Lh', segmentation: 4 },
                        }
                    },
                    {
                        title: '',
                        methods: {
                            OneNumber: { target: 'OneNumber', layout: 'Ball', segmentation: 4 },
                        }
                    },
                ],
            },
            'two': {
                title: 'lottery.pk10.group.two',
                sign: 'two',
                layout: [
                    {
                        title: '',
                        methods: {
                            TwoBs: { target: 'TwoBs', layout: 'Bs', segmentation: 4 },
                            TwoOe: { target: 'TwoOe', layout: 'Oe', segmentation: 4 },
                            TwoLh: { target: 'TwoLh', layout: 'Lh', segmentation: 4 },
                        }
                    },
                    {
                        title: '',
                        methods: {
                            TwoNumber: { target: 'TwoNumber', layout: 'Ball', segmentation: 4 },
                        }
                    },
                ],
            },
        }
    },
};

export default creditStructure;