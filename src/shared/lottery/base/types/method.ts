
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

// 单注钱档位(元/角/分),由后端 config 按币种下发;value=1/0.1/0.01,label 已本地化。
export interface UnitMode {
    value: number;
    label?: string;
}

// 单价配置(倍数已下线):后端按币种下发。「每注」= 可自由输入的数字(clamp 到 [min,max])
// + 快捷档位 options(默认 1/2/5/10/50/100,后台可设)。
export interface UnitPriceConfig {
    min: number;
    max: number;
    options: number[];
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
    extra_content?: string[];
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
    /** 需要翻译时才加:title 的 i18n key。默认用中文 title;当前语言有该 key 的翻译时用翻译。 */
    title_sign?: string;
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
    // 组合玩法(连码/连肖连尾/自选/不中):多选 + 统一金额,注数 = C(选中数, groupSize)。
    combo?: { groupSize: number; minSelected?: number };
}

export interface MethodDefineList {
    [key: string]: MethodDefineItem;
}

// ========================== method form server ======================



// ===================== credit structure / merged ===================
// 迁移中:新结构与官方盘同构(category → groups → methods 扁平,method 只写 target);
// 旧结构(pk10/lhc 尚未迁移)仍是 groups → layout[] 盘面块。两者并存,逐步淘汰 layout。
export interface CsMethodItem {
    target: string;
    layout?: string;
    segmentation?: number;
}

export interface CsLayoutItem {
    title: string;
    methods: Record<string, CsMethodItem>;
    direction?: string;
}

export interface CsGroupItem {
    title: string;
    sign?: string;
    // 新:扁平玩法表(ssc 已迁移)
    methods?: Record<string, { target: string }>;
    // 旧:盘面块(pk10/lhc 待迁移)
    layout?: CsLayoutItem[];
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
    sign?: string;
    methods: Record<string, MethodDefineItem>;
    // 旧渲染器(pk10/lhc)仍读 layout;ssc 新渲染器只读 methods。
    layout?: CsLayoutItem[];
}

export interface CmsCategory {
    title: string;
    groups: Record<string, CmsGroup>;
}

export interface CmsList {
    [category: string]: CmsCategory;
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
    methods: Record<string, MethodDefineItem>;
}

export interface OmsCategoryWithGroups {
    title: string;
    groups: Record<string, OmsGroup>;
}

export interface OmsDirectMethods {
    title: string;
    methods: Record<string, MethodDefineItem>;
}

/** 一个分类:要么带 groups(分组玩法),要么直接 methods(无分组);officialBase 运行时二选一判别。
 *  用可选字段而非联合,便于消费方直接读 .groups / .methods。 */
export interface OmsCategory {
    title: string;
    groups?: Record<string, OmsGroup>;
    methods?: Record<string, MethodDefineItem>;
}

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