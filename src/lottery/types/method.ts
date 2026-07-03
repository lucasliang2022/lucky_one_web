
export interface MethodMapItem {
    sd?: string;
    momo?: string;
    [key: string]: string | undefined;
}

export type MethodMapList = Record<string, MethodMapItem>

export interface MethodItemFromServer {
    sign: string;
    levels: Record<string, number> | any[];
}

export interface MethodServerList {
    official: MethodItemFromServer[];
    credit: MethodItemFromServer[];
}

// ------------- method define -------------------

export interface ExtraContent {
    title: string;
    color?: string;
}

export interface MethodRowNumber {
    title: string;
    value: any;
    count?: number;
    color?: string;
    extra_content?: ExtraContent[];
    animating?: boolean;
    selected?: boolean;
    hot_cold?: number|null;
    omission?: number|null;
    prize?: number|string|null;
}

export interface MethodRow {
    type?: string;
    title?: string;
    position?: number[];
    min_selected?: number;
    max_selected?: number;
    shape?: string;
    buttons?: boolean;
    number?: MethodRowNumber[];
    is_circle?: boolean,
    length?: number;
    allowed_numbers?: (number | string)[];
    prize?: number|null;
}

export interface MethodLayout {
    type: string;
    positions?: {
        options: Record<number, string>;
        min_checked: number;
        max_checked: number;
    },
    rows?: MethodRow[];
    row_separator?: string;
    row_repeat?: boolean;
    unit_repeat?: boolean;
    unit_separator?: string;
    opposition?: [number, number][];
    code_total_count?: { min: number; max: number };
    tips?: string;

    // 「单行简写」布局:无 rows 时,直接把一行的字段挂在 layout 上(见 officialLogic initRows)
    number?: MethodRowNumber[] | Record<string, string>;
    ordered_keys?: string[];
    title?: string;
    position?: number[];
    min_selected?: number;
    max_selected?: number;
    shape?: string;
    buttons?: boolean;
    length?: number;
    allowed_numbers?: (number | string)[];
    stat_big_min?: number;
}

export interface MethodDesc {
    title: string;
    content: { title: string; content: string }[];
    example: string;
}

export interface MethodLevel {
    prize: string | number;
    title: string;
    codes: number[] | string[];
    level?: number;
}

export interface MethodCalc {
    type: string,
    base?: number|Record<number, number>,
    totalPositions?: number,
    position?: number[]
}

export interface MethodDefineItem {
    target?: string;
    sign?: string;
    sdk_sign?: string;
    title: string;
    desc: string | MethodDesc;
    lr_status: boolean;
    yl_status: boolean;
    random_bet?: boolean;
    random_type?: string;
    calc?: MethodCalc;
    layout: MethodLayout;
    levels: MethodLevel[];
    template?: string;
    segmentation?: number;
    example?: string;
}

export interface MethodDefineList {
    [key: string]: MethodDefineItem;
}

// ========================== method form server ======================



// ===================== credit structure / merged ===================
export interface CsMethodItem {
    target: string;
    layout: string;
    segmentation: number;
}

export interface CsLayoutItem {
    title: string;
    methods: Record<string, CsMethodItem>;
    direction?: string;
}

export interface CsGroupItem {
    title: string;
    sign: string;
    layout: CsLayoutItem[];
}

export interface CsCategory {
    title: string;
    groups: Record<string, CsGroupItem>;
    methods?: Record<string, MethodDefineItem>;
}

export interface CsList {
    [category: string]: CsCategory
}

export interface CmsGroup {
    title: string;
    sign: string;
    layout: CsLayoutItem[];
    methods: Record<string,MethodDefineItem>
}

export interface CmsCategory {
    title: string;
    groups: Record<string, CmsGroup>;
}

export interface CmsList {
    [category: string]: CmsCategory                          ;
}

// ================== official structure / merged   =================

export interface OsGroup {
    title: string;
    methods: Record<string, { target: string }>;
}

export interface OsCategoryWithGroups {
    title: string;
    groups: Record<string, OsGroup>;
}

export interface OsCategoryWithMethods {
    title: string;
    methods: Record<string, { target: string }>;
}

export type OsCategory = OsCategoryWithGroups | OsCategoryWithMethods;

export interface OsList {
    [category: string]: OsCategory;
}

export interface OmsGroup {
    title: string;
    methods: MethodDefineItem[];
}

export interface OmsCategoryWithGroups {
    title: string;
    groups: OmsGroup[];
}

export interface OmsDirectMethods {
    title: string;
    methods: MethodDefineItem[];
}

export type OmsCategory = OmsCategoryWithGroups | OmsDirectMethods;

export interface OmsList {
    [category: string]: OmsCategory
}

// -------------------- hot code  ---
export interface HotCold {
    [key: string]: number;
}

export interface Omission {
    [key: string]: number;
}