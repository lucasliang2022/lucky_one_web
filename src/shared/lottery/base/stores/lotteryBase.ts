import { useCommonBase } from './commonBase';
import { useCreditBase } from './creditBase';
import { useOfficialBase } from './officialBase';
import {
    CmsGroup,
    CmsList,
    CommonBase,
    CreditBase,
    CsList,
    IssueItem,
    LotteryBase,
    MethodDefineItem,
    MethodDefineList,
    MethodItemFromServer,
    OfficialBase,
    OmsGroup,
    OmsList,
    OsCategory,
    OsGroup,
    OsList,
} from '@shared/types';
import { handleGlobalError } from "@shared/utils/common";

export function useLotteryBase(): LotteryBase {
    const common: CommonBase = useCommonBase();
    const credit: CreditBase = useCreditBase(common);
    const official: OfficialBase = useOfficialBase(common);

    const onStoreReset = (): void => {
        common.sign.value = '';
        common.selectedPositions.value = [];
        common.issueHistory.value = [];
        common.issueCurrent.value = {} as IssueItem;
        common.issueLast.value = {} as IssueItem;

        credit.creditMethodStructure.value = {};
        credit.creditCategoryCurrent.value = '';
        credit.creditGroupCurrent.value = {} as CmsGroup;
        credit.creditMethodCurrent.value = {} as MethodDefineItem;
        credit.creditDisplayMethodDesc.value = [];

        official.officialMethodStructure.value = {};
        official.officialCategoryCurrent.value = '';
        official.officialGroupCurrent.value = {} as OmsGroup;
        official.officialMethodCurrent.value = {} as MethodDefineItem;
    };

    const onLotteryChange = async (newSign: string): Promise<void> => {
        onStoreReset();
        common.setSignCurrent(newSign);
        await common.fetchLotteryConfig();
        common.fetchIssueCurrent(true);
        await initMethodStructure();
        await onModeChange('official');
    };

    /**
     * 接口 LotteryBase.onModeChange 签名是 (mode: string) => Promise<void>，
     * 所以这里必须 async，原来写成 void 会被 TS 标红。
     */
    const onModeChange = async (mode: string): Promise<void> => {
        common.setModeCurrent(mode);
        if (mode === 'official') {
            if (!official.officialCategoryCurrent.value) {
                initOfficialMethod();
            }
        } else if (mode === 'credit') {
            if (!credit.creditCategoryCurrent.value) {
                initCreditMethod();
            }
        }
    };

    const initOfficialMethod = (): void => {
        if (Object.keys(official.officialMethodStructure.value).length > 0) {
            official.setCategoryOfficialCurrent(Object.keys(official.officialMethodStructure.value)[0]);
        }
    };

    const initCreditMethod = (): void => {
        if (Object.keys(credit.creditMethodStructure.value).length > 0) {
            credit.setCategoryCreditCurrent(Object.keys(credit.creditMethodStructure.value)[0]);
        }
    };

    // 把后端下发的一档赔率 map({ "1": prize, ... })注入到本地 define 的 levels[i].prize。
    const injectServerLevels = (def: any, serverLevels: any): void => {
        if (!def || !Array.isArray(def.levels) || !serverLevels || typeof serverLevels !== 'object') return;
        for (const k in serverLevels) {
            if (!Object.prototype.hasOwnProperty.call(serverLevels, k)) continue;
            const idx = parseInt(k, 10) - 1;
            if (!Number.isNaN(idx) && idx >= 0 && idx < def.levels.length) {
                def.levels[idx].prize = serverLevels[k];
            }
        }
    };

    /**
     * 用后端结构树(分类→分组→玩法)构建官方盘 OmsList:
     *  - 拓扑与标题来自后端(标题已翻译);
     *  - 每个玩法按 leaf 匹配本地 define(layout/calc/desc),挂上后端 sign/赔率/标题;
     *  - 本地无 define 的玩法跳过(无渲染定义无法下注)。
     */
    const buildOfficialFromServer = (cats: any[], officialDefine: MethodDefineList): OmsList => {
        const out: Record<string, any> = {};
        for (const cat of (cats || [])) {
            if (!cat?.sign) continue;
            const catNode: any = { title: cat.title || cat.sign, groups: {} };
            for (const g of (cat.groups || [])) {
                if (!g?.sign) continue;
                const groupNode: any = { title: g.title || g.sign, methods: {} };
                for (const m of (g.methods || [])) {
                    // 官方盘 define 已按完整后端 sign 为 key(和信用盘一致,零转换);兼容个别仍按 leaf 的旧条目。
                    const def = officialDefine[m?.sign ?? ''] ?? officialDefine[m?.leaf ?? ''];
                    if (!def) continue;
                    const merged: any = JSON.parse(JSON.stringify(def));
                    merged.sign = m.sign;        // 后端复合 sign
                    merged.sdk_sign = m.sign;    // 官方盘下注发送 sdk_sign
                    merged.target = m.sign;
                    if (m.title) { merged.title = m.title; merged.title_sign = undefined; } // 用后端翻译标题
                    injectServerLevels(merged, m.levels);
                    groupNode.methods[m.sign] = merged;
                }
                if (Object.keys(groupNode.methods).length) catNode.groups[g.sign] = groupNode;
            }
            if (Object.keys(catNode.groups).length) out[cat.sign] = catNode;
        }
        return out as OmsList;
    };

    /**
     * 用后端结构树(分类→分组→玩法)构建信用盘 CmsList。与官方盘同理,但:
     *  - 每个玩法按「完整 sign」匹配本地 creditDefine(盘面/布局/desc),后端只出拓扑+翻译标题+赔率;
     *  - 结构是「组 → methods 扁平表」,DefaultGroup 会把组内所有玩法渲染在一页;
     *  - 本地无 define 的玩法跳过(无盘面无法渲染/下注)。
     */
    const buildCreditFromServer = (cats: any[], creditDefine: MethodDefineList): CmsList => {
        const out: Record<string, any> = {};
        for (const cat of (cats || [])) {
            if (!cat?.sign) continue;
            const catNode: any = { title: cat.title || cat.sign, groups: {} };
            for (const g of (cat.groups || [])) {
                if (!g?.sign) continue;
                const groupNode: any = { title: g.title || g.sign, sign: g.sign, methods: {} };
                for (const m of (g.methods || [])) {
                    const sign = m?.sign ?? '';
                    const def = creditDefine[sign];
                    if (!def) continue;
                    const merged: any = JSON.parse(JSON.stringify(def));
                    merged.sign = sign;          // 后端复合 sign,下注即用它
                    merged.target = sign;
                    if (m.title) { merged.title = m.title; merged.title_sign = undefined; } // 后端翻译标题
                    injectServerLevels(merged, m.levels);
                    groupNode.methods[sign] = merged;
                }
                if (Object.keys(groupNode.methods).length) catNode.groups[g.sign] = groupNode;
            }
            if (Object.keys(catNode.groups).length) out[cat.sign] = catNode;
        }
        return out as CmsList;
    };

    const initMethodStructure = async (): Promise<void> => {
        const type = common.type.value;
        if (!type) {
            handleGlobalError(new Error("sign empty"), "lottery not selected (0X20001)", "initMethodStructure");
            return;
        }

        if (!common.methodServerList.value?.official || !common.methodServerList.value?.credit) {
            handleGlobalError(new Error("method config not load"), "lottery method not load (0X20002)", "initMethodStructure");
            return;
        }

        return Promise.all([
            // officialStructure 同 creditStructure:仅未迁移彩种(lhc)的本地兜底;ssc/pk10 已删,import 失败回落空对象。
            import(`@lottery/${type}/config/officialStructure.ts`).then((module) => module.default || module).catch(() => ({})),
            import(`@lottery/${type}/config/define/officialDefine.ts`).then((module) => module.default || module),
            // creditStructure 只是「未迁移彩种」的本地兜底;已迁移的(ssc)该文件已删除,import 失败即回落空对象。
            import(`@lottery/${type}/config/creditStructure.ts`).then((module) => module.default || module).catch(() => ({})),
            import(`@lottery/${type}/config/define/creditDefine.ts`).then((module) => module.default || module),
        ]).then(
            ([
                 loadedOfficialStructure,
                 loadedOfficialDefine,
                 loadedCreditStructure,
                 loadedCreditDefine,
             ]) => {
                const officialStructureCopy = JSON.parse(JSON.stringify(loadedOfficialStructure || {}));
                const officialDefineCopy = JSON.parse(JSON.stringify(loadedOfficialDefine || {}));
                const creditStructureCopy = JSON.parse(JSON.stringify(loadedCreditStructure || {}));
                const creditDefineCopy = JSON.parse(JSON.stringify(loadedCreditDefine || {}));

                updateMethodPrize(officialDefineCopy, creditDefineCopy);

                const serverMethods = common.methodServerList.value;

                // ---- 官方盘:优先后端结构树(拓扑+翻译好的标题+赔率),本地 define 只出 layout/calc ----
                // 失败或后端未下发时回落旧硬编码结构,保证不空屏。
                // 逐彩种灰度:已适配组件标题渲染(resolveStructTitle)的类型才切后端结构;其余仍走旧路径。
                const MIGRATED_OFFICIAL_TYPES = ['ssc', 'pk10', 'ks'];
                const serverStructure = common.methodStructureServer?.value;
                let officialFromServer = false;
                if (MIGRATED_OFFICIAL_TYPES.includes(type)
                    && Array.isArray(serverStructure?.official) && serverStructure!.official.length > 0) {
                    try {
                        official.officialMethodStructure.value =
                            buildOfficialFromServer(serverStructure!.official, officialDefineCopy);
                        officialFromServer = true;
                    } catch (e) {
                        handleGlobalError(e, "official structure from server failed, fallback (0X20004)", "initMethodStructure");
                    }
                }
                if (!officialFromServer) {
                    updateOfficialMethod(officialStructureCopy, officialDefineCopy);
                    pruneStructureByEnabled(officialStructureCopy, buildEnabledSignSet(serverMethods?.official));
                    official.officialMethodStructure.value = officialStructureCopy as OmsList;
                }

                // ---- 信用盘:拓扑来自后端 struct(category/group/method + 翻译标题 + levels 赔率),
                // 盘面来自本地 creditDefine(按完整 sign 匹配);组内所有玩法同页展示。
                // 已迁移彩种(ssc:creditDefine 用后端 sign 为 key)→ buildCreditFromServer 有内容;
                // 未迁移彩种(pk10/lhc:creditDefine 仍是旧本地 key)→ 匹配不到、结果为空 → 回落本地 creditStructure。
                let creditFromServer = false;
                if (Array.isArray(serverStructure?.credit) && serverStructure!.credit.length > 0) {
                    try {
                        const built = buildCreditFromServer(serverStructure!.credit, creditDefineCopy);
                        if (Object.keys(built).length > 0) {
                            credit.creditMethodStructure.value = built;
                            creditFromServer = true;
                        }
                    } catch (e) {
                        handleGlobalError(e, "credit structure from server failed, fallback (0X20005)", "initMethodStructure");
                    }
                }
                if (!creditFromServer) {
                    updateCreditMethod(creditStructureCopy, creditDefineCopy);
                    pruneStructureByEnabled(creditStructureCopy, buildEnabledSignSet(serverMethods?.credit));
                    credit.creditMethodStructure.value = creditStructureCopy as CmsList;
                }
            }).catch((error: any) => {
            handleGlobalError(error, "promise failed (0X20003)", "initMethodStructure");
            official.officialMethodStructure.value = {};
            credit.creditMethodStructure.value = {};
        });
    };

    const updateMethodPrize = (
        officialDefine: MethodDefineList,
        creditDefine: MethodDefineList,
    ): void => {
        const serverData = common.methodServerList.value;
        if (!serverData || !serverData.official || !serverData.credit) {
            handleGlobalError(new Error("Server methods data structure is invalid."), "prize config invalid", "updateMethodPrize");
            return;
        }

        _updateMethodPrize(officialDefine, serverData.official as any);
        _updateMethodPrize(creditDefine, serverData.credit as any);
    };

    /**
     * 在后端方法集合中按 sdk_sign 找出对应方法。
     * 兼容两种结构：
     *   1) Record<sign, MethodItemFromServer>  —— service 层归一化后的形态（推荐）
     *   2) MethodItemFromServer[]              —— 后端原始数组形态
     */
    const _findServerMethod = (
        serverMethods: MethodItemFromServer[] | Record<string, MethodItemFromServer> | null | undefined,
        serverMethodKey: string,
    ): MethodItemFromServer | undefined => {
        if (!serverMethods) return undefined;

        if (Array.isArray(serverMethods)) {
            return serverMethods.find(m => m && m.sign === serverMethodKey);
        }

        if (typeof serverMethods === 'object') {
            const obj = serverMethods as Record<string, MethodItemFromServer>;
            if (Object.prototype.hasOwnProperty.call(obj, serverMethodKey)) {
                return obj[serverMethodKey];
            }
            // 兜底：对象的某个 value 的 sign 命中
            for (const k in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, k)) {
                    const item = obj[k];
                    if (item && item.sign === serverMethodKey) return item;
                }
            }
        }
        return undefined;
    };

    const _updateMethodPrize = (
        defineObject: MethodDefineList,
        serverMethodsObject: MethodItemFromServer[] | Record<string, MethodItemFromServer>,
    ): void => {
        if (!defineObject || !serverMethodsObject) return;

        for (const localMethodKey in defineObject) {
            if (!Object.prototype.hasOwnProperty.call(defineObject, localMethodKey)) continue;

            // 只对接单一后台:玩法键即后端 sdk_sign。已移除多后台映射层(map.ts / maplist)。
            const serverMethodKey = localMethodKey;

            const serverMethodData = _findServerMethod(serverMethodsObject, serverMethodKey);
            if (!serverMethodData) continue;

            const localMethodDef = defineObject[localMethodKey];
            localMethodDef.sdk_sign = serverMethodKey;

            if (
                Array.isArray(localMethodDef.levels)
                && serverMethodData.levels
                && typeof serverMethodData.levels === 'object'
                && !Array.isArray(serverMethodData.levels)
                && localMethodDef.levels.length > 0
            ) {
                const localLevelsArray = localMethodDef.levels;
                const serverLevelsObject = serverMethodData.levels as Record<string, number | string>;

                for (const serverLevelKey in serverLevelsObject) {
                    if (!Object.prototype.hasOwnProperty.call(serverLevelsObject, serverLevelKey)) continue;

                    const serverPrize = serverLevelsObject[serverLevelKey];
                    const targetLocalIndex = parseInt(serverLevelKey, 10) - 1;

                    if (
                        !Number.isNaN(targetLocalIndex)
                        && targetLocalIndex >= 0
                        && targetLocalIndex < localLevelsArray.length
                    ) {
                        localLevelsArray[targetLocalIndex].prize = serverPrize;
                    }
                }
            }
        }
    };

    // 收集"已启用"的方法 sign 集合(后端 config 只返回 status & admin_status 皆开的方法)。
    // 兼容后端返回 Record<sign, method> 或 method[] 两种形态。
    const buildEnabledSignSet = (serverMethods: any): Set<string> => {
        const set = new Set<string>();
        if (!serverMethods) return set;
        if (Array.isArray(serverMethods)) {
            serverMethods.forEach((m: any) => { if (m?.sign) set.add(String(m.sign)); });
        } else if (typeof serverMethods === 'object') {
            Object.keys(serverMethods).forEach((k) => set.add(k));
            Object.values(serverMethods).forEach((m: any) => { if (m?.sign) set.add(String(m.sign)); });
        }
        return set;
    };

    // 按启用集剪枝结构:未启用方法删除;组内无方法删组;类内无方法/组删类。
    // 启用集为空(后端异常/未返回)时不剪枝,避免把整棵树误清空。
    const pruneStructureByEnabled = (structure: any, enabled: Set<string>): void => {
        if (!structure || typeof structure !== 'object' || enabled.size === 0) return;
        const isEnabled = (m: any, mKey: string): boolean => {
            const sign = m?.target ?? m?.sdk_sign ?? mKey;
            return enabled.has(mKey) || enabled.has(sign);
        };
        const pruneMethods = (methods: Record<string, any>): number => {
            const keys = Object.keys(methods);
            // 保护:整组无任何方法命中启用集时,视为 key 体系与后端 sign 命名不一致
            // (如信用盘/两面盘:结构 key BallOneBs 与后端 sign DiYiQiu 不同),不剪枝以免误删整组。
            // 只有"部分命中"才删未命中的(那才是真被后台禁用的)。
            if (!keys.some((mKey) => isEnabled(methods[mKey], mKey))) {
                return keys.length;
            }
            for (const mKey of keys) {
                if (!isEnabled(methods[mKey], mKey)) delete methods[mKey];
            }
            return Object.keys(methods).length;
        };
        for (const catKey in structure) {
            if (!Object.prototype.hasOwnProperty.call(structure, catKey)) continue;
            const category = structure[catKey];
            if (!category || typeof category !== 'object') continue;
            if (category.groups && typeof category.groups === 'object') {
                for (const gKey in category.groups) {
                    if (!Object.prototype.hasOwnProperty.call(category.groups, gKey)) continue;
                    const group = category.groups[gKey];
                    if (group?.methods && pruneMethods(group.methods) === 0) delete category.groups[gKey];
                }
                if (Object.keys(category.groups).length === 0) delete structure[catKey];
            } else if (category.methods && typeof category.methods === 'object') {
                if (pruneMethods(category.methods) === 0) delete structure[catKey];
            }
        }
    };

    const updateOfficialMethod = (structure: OsList, defineData: MethodDefineList): void => {
        if (!structure || typeof structure !== 'object' || !defineData) return;
        for (const categoryKey in structure) {
            if (!Object.prototype.hasOwnProperty.call(structure, categoryKey)) continue;

            const category = structure[categoryKey] as OsCategory;
            if (!category || typeof category !== 'object') continue;

            if (typeof (category as any).methods === 'object' && (category as any).methods !== null) {
                _updateMethodsObject((category as any).methods, defineData);
            } else if (typeof (category as any).groups === 'object' && (category as any).groups !== null) {
                const groups = (category as any).groups as Record<string, OsGroup>;
                for (const groupKey in groups) {
                    if (!Object.prototype.hasOwnProperty.call(groups, groupKey)) continue;
                    const group = groups[groupKey];
                    if (!group || typeof group !== 'object') continue;
                    if (typeof group.methods === 'object' && group.methods !== null) {
                        _updateMethodsObject(group.methods as any, defineData);
                    }
                }
            }
        }
    };

    const updateCreditMethod = (structure: CsList, defineData: MethodDefineList): void => {
        if (!structure || typeof structure !== 'object' || !defineData) return;

        for (const categoryKey in structure) {
            if (!Object.prototype.hasOwnProperty.call(structure, categoryKey)) continue;

            const category = structure[categoryKey];
            if (!category || typeof category !== 'object' || !category.groups || typeof category.groups !== 'object') continue;

            const groups = category.groups;
            for (const groupKey in groups) {
                if (!Object.prototype.hasOwnProperty.call(groups, groupKey)) continue;

                const group = groups[groupKey] as any;
                if (!group) continue;

                const merged: Record<string, MethodDefineItem & { target?: string; segmentation?: number }> = {};

                if (group.methods && typeof group.methods === 'object' && !Array.isArray(group.layout)) {
                    // 新:扁平玩法表(ssc)。就地合并 define;sign 取 methodKey(=后端复合 sign),供下注/注赔率用。
                    const src = group.methods as Record<string, { target?: string }>;
                    for (const methodKey in src) {
                        if (!Object.prototype.hasOwnProperty.call(src, methodKey)) continue;
                        const target = src[methodKey]?.target || methodKey;
                        const methodDefinition = defineData[target] || defineData[methodKey];
                        if (!methodDefinition) continue;
                        merged[methodKey] = { ...methodDefinition, target, sign: methodDefinition.sign || methodKey };
                    }
                } else if (Array.isArray(group.layout)) {
                    // 旧:盘面块(pk10/lhc 待迁移)。保持原行为不变。
                    for (const layoutItem of group.layout) {
                        if (!layoutItem || typeof layoutItem !== 'object' || !layoutItem.methods || typeof layoutItem.methods !== 'object') continue;
                        for (const methodKey in layoutItem.methods) {
                            if (!Object.prototype.hasOwnProperty.call(layoutItem.methods, methodKey)) continue;
                            if (!Object.prototype.hasOwnProperty.call(defineData, methodKey)) continue;
                            const node = layoutItem.methods[methodKey];
                            const methodDefinition = defineData[methodKey];
                            if (methodDefinition && node && typeof node === 'object') {
                                merged[methodKey] = {
                                    ...methodDefinition,
                                    target: node.target || methodKey,
                                    segmentation: node.segmentation,
                                    sign: methodDefinition.sign || methodKey,
                                };
                            }
                        }
                    }
                } else {
                    continue;
                }

                group.methods = merged;
            }
        }
    };

    const _updateMethodsObject = (
        methodsObject: Record<string, { target: string } & MethodDefineItem>,
        defineData: MethodDefineList,
    ): void => {
        if (!methodsObject || typeof methodsObject !== 'object' || !defineData) return;

        for (const methodKey in methodsObject) {
            if (!Object.prototype.hasOwnProperty.call(methodsObject, methodKey)) continue;
            if (!Object.prototype.hasOwnProperty.call(defineData, methodKey)) continue;

            const methodNodeInStructure = methodsObject[methodKey];
            const methodDefinition = defineData[methodKey];
            if (methodDefinition && typeof methodNodeInStructure === 'object' && methodNodeInStructure !== null) {
                methodNodeInStructure.sign       = methodDefinition.sign || methodKey;
                methodNodeInStructure.sdk_sign   = methodDefinition.sdk_sign || methodKey;
                methodNodeInStructure.title      = methodDefinition.title || methodNodeInStructure.title || methodKey;
                methodNodeInStructure.levels     = methodDefinition.levels;
                methodNodeInStructure.lr_status  = methodDefinition.lr_status;
                methodNodeInStructure.yl_status  = methodDefinition.yl_status;
                methodNodeInStructure.random_bet = methodDefinition.random_bet;
                methodNodeInStructure.calc       = methodDefinition.calc;     // calc 是可选，原来 `|| {}` 类型不通过
                methodNodeInStructure.example    = methodDefinition.example;  // example 在 method.ts 里新增为可选字段
                methodNodeInStructure.desc       = methodDefinition.desc;
                methodNodeInStructure.layout     = methodDefinition.layout;
            }
        }
    };

    const clearSelectedBalls = (): void => {
        official.officialSelectedBalls.value = [];
        official.officialBetCount.value = 0;
        credit.creditSelectedBalls.value = {};
        credit.creditBetCount.value = 0;
        common.reset.value = true;
        setTimeout(() => common.reset.value = false, 100);
    };

    /**
     * LotteryBase 接口里声明了 updateDisplayPrize: () => void，
     * 原代码并没有返回它，导致 useLotteryBase(): LotteryBase 整个返回值标红。
     * 真正用到的地方是各 layout 自己的 composable（useOfficialLayoutLogic 等）
     * 里同名局部函数，store 这一层不需要做具体动作，给个空实现满足接口契约即可。
     */
    const updateDisplayPrize = (): void => {
        // intentionally empty: 实际逻辑在 useOfficialLayoutLogic 等 composable 里
    };

    return {
        ...common,
        ...credit,
        ...official,
        onStoreReset,
        onLotteryChange,
        onModeChange,
        clearSelectedBalls,
        updateDisplayPrize,
    };
}