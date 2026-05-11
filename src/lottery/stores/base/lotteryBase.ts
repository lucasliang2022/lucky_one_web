import {useCommonBase} from './commonBase';
import {useCreditBase} from './creditBase';
import {useOfficialBase} from './officialBase';
import {
    CmsGroup, CmsList,
    CommonBase,
    CreditBase,
    CsList,
    IssueItem,
    LotteryBase,
    MethodDefineItem,
    MethodDefineList, MethodItemFromServer,
    MethodMapList,
    OfficialBase,
    OmsGroup, OmsList, OsCategory, OsGroup, OsList
} from '@/types';
import {handleGlobalError} from "@/utils/common";
import {getSdkSignKey} from "@lottery/utils/common";

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

    const onModeChange = (mode: string): void => {
        common.setModeCurrent(mode);
        if (mode === 'official') {
            if (!official.officialCategoryCurrent.value) {
                initOfficialMethod()
            }
        } else if (mode === 'credit') {
            if (!credit.creditCategoryCurrent.value) {
                initCreditMethod()
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
            import(`@lottery/config/${type}/officialStructure.ts`).then((module) => module.default || module),
            import(`@lottery/config/${type}/define/officialDefine.ts`).then((module) => module.default || module),
            import(`@lottery/config/${type}/define/officialMap.ts`).then((module) => module.default || module),
            import(`@lottery/config/${type}/creditStructure.ts`).then((module) => module.default || module),
            import(`@lottery/config/${type}/define/creditDefine.ts`).then((module) => module.default || module),
            import(`@lottery/config/${type}/define/creditMap.ts`).then((module) => module.default || module),
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

                updateMethodPrize(officialDefineCopy, creditDefineCopy,officialMapCopy as MethodMapList, creditMapCopy as MethodMapList );
                updateOfficialMethod(officialStructureCopy, officialDefineCopy);
                updateCreditMethod(creditStructureCopy, creditDefineCopy);

                official.officialMethodStructure.value = officialStructureCopy as OmsList;
                credit.creditMethodStructure.value = creditStructureCopy as CmsList;
            }).catch((error: any) => {
                handleGlobalError(error, "promise failed (0X20003)", "initMethodStructure");
                official.officialMethodStructure.value = {};
                credit.creditMethodStructure.value = {};
            })
    }

    const updateMethodPrize = (officialDefine: MethodDefineList, creditDefine: MethodDefineList, officialMap: MethodMapList, creditMap: MethodMapList ): void => {
        const serverData = common.methodServerList.value;
        if (!serverData || !serverData.official || !serverData.credit) {
            handleGlobalError(new Error("Server methods data structure is invalid."), "prize config invalid", "updateMethodPrize");
            return;
        }

        const sdkSignKey = getSdkSignKey();
        _updateMethodPrize(
            officialDefine, officialMap, serverData.official, sdkSignKey
        );

        _updateMethodPrize(
            creditDefine, creditMap, serverData.credit, sdkSignKey
        );
    };

    const _updateMethodPrize = (
        defineObject: MethodDefineList,
        mapObject: MethodMapList,
        serverMethodsObject: MethodItemFromServer[],
        sdkSignKey: 'sd' | 'momo'
    ): void => {
        for (const localMethodKey in defineObject) {
            if (defineObject.hasOwnProperty(localMethodKey)) {
                const mapEntry = mapObject[localMethodKey];
                if (!mapEntry) {
                    continue;
                }

                const serverMethodKey = mapEntry[sdkSignKey];
                if (!serverMethodKey) {
                    continue;
                }

                if (serverMethodsObject.hasOwnProperty(serverMethodKey)) {
                    const localMethodDef = defineObject[localMethodKey];
                    const serverMethodData = serverMethodsObject[serverMethodKey];

                    localMethodDef.sdk_sign = serverMethodKey;

                    if (Array.isArray(localMethodDef.levels) &&
                        serverMethodData.levels &&
                        typeof serverMethodData.levels === 'object' &&
                        !Array.isArray(serverMethodData.levels) &&
                        localMethodDef.levels.length > 0)
                    {
                        const localLevelsArray = localMethodDef.levels;
                        const serverLevelsObject = serverMethodData.levels;

                        for (const serverLevelKey in serverLevelsObject) {
                            if (serverLevelsObject.hasOwnProperty(serverLevelKey)) {
                                const serverPrize = serverLevelsObject[serverLevelKey];
                                const targetLocalIndex = parseInt(serverLevelKey, 10) - 1;

                                if (!isNaN(targetLocalIndex) && targetLocalIndex >= 0 && targetLocalIndex < localLevelsArray.length) {
                                    localLevelsArray[targetLocalIndex].prize = serverPrize;
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    const updateOfficialMethod = (structure: OsList, defineData: MethodDefineList): void => {
        if (!structure || typeof structure !== 'object' || !defineData) { return; }
        for (const categoryKey in structure) {
            if (structure.hasOwnProperty(categoryKey)) {
                const category = structure[categoryKey] as OsCategory;
                if (!category || typeof category !== 'object') continue;
                if (typeof category.methods === 'object' && category.methods !== null) {
                    _updateMethodsObject(category.methods, defineData);
                } else if (typeof category.groups === 'object' && category.groups !== null) {
                    const groups = category.groups;
                    for (const groupKey in groups) {
                        if (groups.hasOwnProperty(groupKey)) {
                            const group = groups[groupKey] as OsGroup;
                            if (!group || typeof group !== 'object') continue;
                            if (typeof group.methods === 'object' && group.methods !== null) {
                                _updateMethodsObject(group.methods, defineData);
                            }
                        }
                    }
                }
            }
        }
    };

    const updateCreditMethod = (structure: CsList, defineData: MethodDefineList): void => {
        if (!structure || typeof structure !== 'object' || !defineData) {
            return;
        }

        for (const categoryKey in structure) {
            if (structure.hasOwnProperty(categoryKey)) {
                const category = structure[categoryKey];
                if (!category || typeof category !== 'object' || !category.groups || typeof category.groups !== 'object') continue;

                const groups = category.groups;
                for (const groupKey in groups) {
                    if (groups.hasOwnProperty(groupKey)) {
                        const group = groups[groupKey];
                        if (!group || !Array.isArray(group.layout)) continue;

                        (group as any).methods = {};
                        const targetGroupMethods = (group as any).methods as Record<string, MethodDefineItem & { target?: string; layout?: string; segmentation?: number }>;
                        for (const layoutItem of group.layout) {
                            if (!layoutItem || typeof layoutItem !== 'object' || !layoutItem.methods || typeof layoutItem.methods !== 'object') continue;

                            const methodsInLayout = layoutItem.methods;
                            for (const methodKey in methodsInLayout) {
                                if (methodsInLayout.hasOwnProperty(methodKey) && defineData.hasOwnProperty(methodKey)) {
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
                }
            }
        }
    };

    const _updateMethodsObject = (methodsObject: Record<string, { target: string } & MethodDefineItem>, defineData: MethodDefineList): void => {
        if (!methodsObject || typeof methodsObject !== 'object' || !defineData) {
            return;
        }

        for (const methodKey in methodsObject) {
            if (methodsObject.hasOwnProperty(methodKey) && defineData.hasOwnProperty(methodKey)) {
                const methodNodeInStructure = methodsObject[methodKey];
                const methodDefinition = defineData[methodKey];
                if (methodDefinition && typeof methodNodeInStructure === 'object' && methodNodeInStructure !== null) {
                    methodNodeInStructure.sign = methodDefinition.sign || methodKey;
                    methodNodeInStructure.sdk_sign = methodDefinition.sdk_sign || methodKey;
                    methodNodeInStructure.title = methodDefinition.title || methodNodeInStructure.title || methodKey;
                    methodNodeInStructure.levels = methodDefinition.levels;
                    methodNodeInStructure.lr_status = methodDefinition.lr_status;
                    methodNodeInStructure.yl_status = methodDefinition.yl_status;
                    methodNodeInStructure.random_bet = methodDefinition.random_bet;
                    methodNodeInStructure.calc = methodDefinition.calc || {};
                    methodNodeInStructure.example = methodDefinition.example;
                    methodNodeInStructure.desc = methodDefinition.desc;
                    methodNodeInStructure.layout = methodDefinition.layout;
                }
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

    return {
        ...common,
        ...credit,
        ...official,
        onStoreReset,
        onLotteryChange,
        onModeChange,
        clearSelectedBalls,
    };
}