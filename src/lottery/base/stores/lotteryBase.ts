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
    MethodMapList,
    OfficialBase,
    OmsGroup,
    OmsList,
    OsCategory,
    OsGroup,
    OsList,
} from '@/types';
import { handleGlobalError } from "@/utils/common";
import { getSdkSignKey } from "@lottery/base/utils/common";

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
            import(`@lottery/${type}/config/officialStructure.ts`).then((module) => module.default || module),
            import(`@lottery/${type}/config/define/officialDefine.ts`).then((module) => module.default || module),
            import(`@lottery/${type}/config/define/officialMap.ts`).then((module) => module.default || module),
            import(`@lottery/${type}/config/creditStructure.ts`).then((module) => module.default || module),
            import(`@lottery/${type}/config/define/creditDefine.ts`).then((module) => module.default || module),
            import(`@lottery/${type}/config/define/creditMap.ts`).then((module) => module.default || module),
        ]).then(
            ([
                 loadedOfficialStructure,
                 loadedOfficialDefine,
                 loadedOfficialMap,
                 loadedCreditStructure,
                 loadedCreditDefine,
                 loadedCreditMap,
             ]) => {
                const officialStructureCopy = JSON.parse(JSON.stringify(loadedOfficialStructure || {}));
                const officialDefineCopy = JSON.parse(JSON.stringify(loadedOfficialDefine || {}));
                const officialMapCopy = JSON.parse(JSON.stringify(loadedOfficialMap || {}));
                const creditStructureCopy = JSON.parse(JSON.stringify(loadedCreditStructure || {}));
                const creditDefineCopy = JSON.parse(JSON.stringify(loadedCreditDefine || {}));
                const creditMapCopy = JSON.parse(JSON.stringify(loadedCreditMap || {}));

                updateMethodPrize(officialDefineCopy, creditDefineCopy, officialMapCopy as MethodMapList, creditMapCopy as MethodMapList);
                updateOfficialMethod(officialStructureCopy, officialDefineCopy);
                updateCreditMethod(creditStructureCopy, creditDefineCopy);

                official.officialMethodStructure.value = officialStructureCopy as OmsList;
                credit.creditMethodStructure.value = creditStructureCopy as CmsList;
            }).catch((error: any) => {
            handleGlobalError(error, "promise failed (0X20003)", "initMethodStructure");
            official.officialMethodStructure.value = {};
            credit.creditMethodStructure.value = {};
        });
    };

    const updateMethodPrize = (
        officialDefine: MethodDefineList,
        creditDefine: MethodDefineList,
        officialMap: MethodMapList,
        creditMap: MethodMapList,
    ): void => {
        const serverData = common.methodServerList.value;
        if (!serverData || !serverData.official || !serverData.credit) {
            handleGlobalError(new Error("Server methods data structure is invalid."), "prize config invalid", "updateMethodPrize");
            return;
        }

        const sdkSignKey = getSdkSignKey();
        _updateMethodPrize(officialDefine, officialMap, serverData.official as any, sdkSignKey);
        _updateMethodPrize(creditDefine, creditMap, serverData.credit as any, sdkSignKey);
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
        mapObject: MethodMapList,
        serverMethodsObject: MethodItemFromServer[] | Record<string, MethodItemFromServer>,
        sdkSignKey: 'sd' | 'momo',
    ): void => {
        if (!defineObject || !mapObject || !serverMethodsObject) return;

        for (const localMethodKey in defineObject) {
            if (!Object.prototype.hasOwnProperty.call(defineObject, localMethodKey)) continue;

            const mapEntry = mapObject[localMethodKey];
            if (!mapEntry) continue;

            // method.ts 里把 MethodMapItem 修成 {sd?:string; momo?:string; [k]:string|undefined}
            // 之后，这里就是 string | undefined，不再是 Record，整条链路类型就通了。
            const serverMethodKey = mapEntry[sdkSignKey];
            if (!serverMethodKey) continue;

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

                const group = groups[groupKey];
                if (!group || !Array.isArray(group.layout)) continue;

                (group as any).methods = {};
                // 注意：去掉了原来的 `layout?: string`。
                // MethodDefineItem.layout 是 MethodLayout（必填），
                // 跟 string 交叉会变成 never，导致下面的赋值永远不通过。
                const targetGroupMethods = (group as any).methods as Record<
                    string,
                    MethodDefineItem & { target?: string; segmentation?: number }
                >;

                for (const layoutItem of group.layout) {
                    if (!layoutItem || typeof layoutItem !== 'object' || !layoutItem.methods || typeof layoutItem.methods !== 'object') continue;

                    const methodsInLayout = layoutItem.methods;
                    for (const methodKey in methodsInLayout) {
                        if (!Object.prototype.hasOwnProperty.call(methodsInLayout, methodKey)) continue;
                        if (!Object.prototype.hasOwnProperty.call(defineData, methodKey)) continue;

                        const methodNodeFromStructure = methodsInLayout[methodKey];
                        const methodDefinition = defineData[methodKey];

                        if (methodDefinition && typeof methodNodeFromStructure === 'object' && methodNodeFromStructure !== null) {
                            targetGroupMethods[methodKey] = {
                                ...methodDefinition,
                                target: methodNodeFromStructure.target || methodKey,
                                segmentation: methodNodeFromStructure.segmentation,
                                sign: methodDefinition.sign || methodKey,
                            };
                        }
                    }
                }
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