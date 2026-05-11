import {MethodDefineItem} from "@lottery/types/method";

export interface LhcOfficialMergedGroup {
    title: string;
    methods: MethodDefineItem[];
}

export interface LhcOfficialMergedStructureList {
    [category: string]: {
        title: string;
        group: Record<string, LhcOfficialMergedGroup>;
    };
}
