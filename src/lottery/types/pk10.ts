import {OmsCategoryWithGroups, OsCategoryWithGroups} from "@lottery/types/method";

export interface Pk10OsList {
    [category: string]: OsCategoryWithGroups
}

export interface Pk10OmsList {
    [category: string]: OmsCategoryWithGroups
}
