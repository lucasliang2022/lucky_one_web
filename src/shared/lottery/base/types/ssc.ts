import {OmsCategoryWithGroups, OsCategoryWithGroups} from "@lottery/base/types/method";
export interface SscOsList {
    [category: string]: OsCategoryWithGroups
}

export interface SscOmsList {
    [category: string]: {
        title: string;
        group: Record<string, OmsCategoryWithGroups>;
    };
}
