import {OmsCategoryWithGroups, OsCategoryWithGroups} from "@lottery/base/types/method";

export interface Pk10OsList {
    [category: string]: OsCategoryWithGroups
}

export interface Pk10OmsList {
    [category: string]: OmsCategoryWithGroups
}
