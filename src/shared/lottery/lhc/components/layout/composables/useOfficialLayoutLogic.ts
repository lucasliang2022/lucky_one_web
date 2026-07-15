import { ref, watch, Ref } from "vue";
import { storeToRefs, Store } from "pinia";
import { getBallColor } from "@shared/utils/common";
import { blueWave, greenWave, redWave } from "@shared/utils/common";

interface Ball {
    value: string | number;
    title: string;
    prize: string | number;
    selected: boolean;
    animating: boolean;
    hotCount: number | null;
    omission: number | null;
    colorClass?: string;
    numbers?: { number: number; color: string }[];
    row?: number;
    zodiac?: number[];
}

interface RowConfig {
    title: string;
    position?: number | number[];
    min_selected?: number;
    max_selected?: number;
    number: any[]; // Define a more specific type if possible
}

interface LayoutConfig {
    type?: string;
    rows?: RowConfig;
    max_selected?: number;
    opposition?: any[]; // Define a more specific type if possible
    code_total_count?: { min: number; max: number };
}

interface OfficialMethodCurrent {
    value: {
        layout?: LayoutConfig;
        calc?: any; // Define a more specific type if possible
        levels?: any[]; // Define a more specific type if possible
        sign?: string;
    } | null;
}

interface LhcStore {
    officialMethodCurrent: Ref<OfficialMethodCurrent>;
    reset: Ref<boolean>;
    officialSelectedBalls: Ref<any[]>;
    officialBetCount: Ref<number>;
    showColdHot: Ref<boolean>;
    showOmission: Ref<boolean>;
    selectedRange: Ref<number>;
    issueHistory: Ref<any[]>;
    unit: Ref<number>;
    zodiacMap: Ref<Record<string, any>>;
    zodiacFirst: Ref<number | null>;
    setDisplayPrize: (levels: any[]) => void;
    displayPrize: Ref<any[]>;
}

interface CalculateHotColdFn {
    (issueCount: number, history: any[], ballsData: Ball[], positions: number | number[]): Record<string, number>;
}

interface CalculateOmissionFn {
    (history: any[], ballsData: Ball[], positions: number | number[]): Record<string, number>;
}

export function useOfficialLayoutLogic(
    store: Store<'lhc'>,
    { calculateHotColdFn, calculateOmissionFn }: { calculateHotColdFn?: CalculateHotColdFn; calculateOmissionFn?: CalculateOmissionFn }
) {
    const {
        officialMethodCurrent,
        reset,
        officialSelectedBalls,
        officialBetCount,
        showColdHot,
        showOmission,
        selectedRange,
        issueHistory,
        unit,
        zodiacMap,
        zodiacFirst,
    } = storeToRefs(store as LhcStore);

    const balls = ref<Ball[]>([]);
    const hotColdData = ref<Record<string, number>>({});
    const omissionData = ref<Record<string, number>>({});
    let currentLayoutType = '';

    const getLayoutConfig = <T>(path: string, defaultValue: T): T => {
        let current = officialMethodCurrent.value?.layout;
        const keys = path.split('.');
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return defaultValue;
            }
        }
        return (current ?? defaultValue) as T;
    };

    function initBalls(): void {
        const layout = officialMethodCurrent.value?.layout;
        const rowsConfig = layout?.rows;
        const numberConfig = rowsConfig?.number;
        currentLayoutType = layout?.type || '';
        const currentPrizeLevels = officialMethodCurrent.value?.levels ?? [];

        if (!Array.isArray(numberConfig)) {
            balls.value = [];
            return;
        }

        const sourceData: any[] = JSON.parse(JSON.stringify(numberConfig));
        const birthYearZodiac = zodiacFirst.value;
        const zodiacData = zodiacMap.value;

        balls.value = sourceData.map(item => {
            const ballValue = item.value;
            let level: any; // Define a more specific type for level if possible
            let prizeValue: number = 0;

            if (currentPrizeLevels.length === 1) {
                level = currentPrizeLevels[0];
                prizeValue = (level && typeof level.prize === 'number') ? level.prize : 0;
            } else if (currentPrizeLevels.length > 1) {
                if (currentLayoutType === 'Zodiac' || currentLayoutType === 'TmZodiacHe') {
                    const isBirthYearZodiac = (birthYearZodiac !== null && ballValue === birthYearZodiac);
                    const levelCode = isBirthYearZodiac ? 'first' : 'other';
                    level = currentPrizeLevels.find(l => l.codes?.includes(levelCode));
                    prizeValue = (level && typeof level.prize === 'number') ? level.prize : 0;
                } else {
                    level = currentPrizeLevels.find(l => l.codes?.includes(ballValue));
                    prizeValue = (level && typeof level.prize === 'number') ? level.prize : 0;
                }
            } else {
                prizeValue = 0;
            }

            const rawPrize = prizeValue * (unit.value || 1);

            const ball: Ball = {
                ...item,
                prize: rawPrize % 1 === 0 ? rawPrize : rawPrize.toFixed(2),
                selected: false,
                animating: false,
                hotCount: null,
                omission: null
            };

            if ((currentLayoutType === 'Zodiac' || currentLayoutType === 'TmZodiacHe') && zodiacData[ballValue]) {
                ball.numbers = (zodiacData[ballValue].numbers || []).map(num => ({
                    number: num,
                    color: redWave.includes(num) ? 'ball-red' :
                        blueWave.includes(num) ? 'ball-blue' :
                            greenWave.includes(num) ? 'ball-green' : ''
                }));
            }

            if (!ball.colorClass) {
                const colorName = getBallColor(ball.title);
                if (colorName) {
                    ball.colorClass = `${colorName}-wave`;
                }
            }
            if (ball.row === undefined || ball.row === null) {
                ball.row = Math.ceil((parseInt(ballValue as string) + 1) / 6);
            }

            if (currentLayoutType === 'TmZodiacStat' || currentLayoutType === 'TmWave') {
                ball.zodiac = item.zodiac || [parseInt(ballValue as string)];
            }

            return ball;
        });

        updateDisplayPrize();
    }

    function toggleBall(ball: Ball): void {
        const targetBallRef = balls.value.find(b => b.value === ball.value);
        if (!targetBallRef) return;

        const targetIndex = balls.value.findIndex(b => b.value === ball.value);

        const maxSelected = getLayoutConfig<number>('rows.max_selected', Infinity);
        const opposition = getLayoutConfig<any[]>('opposition', []); // Define a more specific type for opposition if possible
        let initialSelectedCount = balls.value.filter(b => b.selected).length;

        const targetBallCopy = { ...targetBallRef };
        targetBallCopy.animating = true;
        balls.value[targetIndex] = targetBallCopy;

        setTimeout(() => {
            const isCurrentlySelected = targetBallCopy.selected;
            let newSelectedState = !isCurrentlySelected;
            let oppositionApplied = false;
            let deselectedDueToOpposition = 0;

            if (newSelectedState) {
                if (Array.isArray(opposition) && opposition.length > 0) {
                    const isNestedOpposition = Array.isArray(opposition[0]);
                    let groupToCheck: any; // Define a more specific type for groupToCheck if possible

                    if (isNestedOpposition) {
                        groupToCheck = opposition.find(group => Array.isArray(group) && group.includes(targetBallCopy.value));
                    } else {
                        if (opposition.includes(targetBallCopy.value)) {
                            groupToCheck = opposition;
                        }
                    }

                    if (groupToCheck) {
                        balls.value.forEach((b, index) => {
                            if (index !== targetIndex && groupToCheck.includes(b.value) && b.selected) {
                                balls.value[index] = { ...balls.value[index], selected: false };
                                oppositionApplied = true;
                                deselectedDueToOpposition++;
                            }
                        });
                    }
                }

                let currentSelectedCountAfterOpposition = initialSelectedCount - deselectedDueToOpposition;

                if (currentSelectedCountAfterOpposition >= maxSelected) {
                    newSelectedState = false;
                }
            }

            balls.value[targetIndex] = { ...targetBallCopy, selected: newSelectedState, animating: false };

            updateSelectedBalls();

        }, 100);
    }

    function updateSelectedBalls(): void {
        const selected = balls.value
            .filter(b => b.selected)
            .map(b => ({ value: b.value, title: b.title }));
        officialSelectedBalls.value = selected;
        officialBetCount.value = calculateBetCount(selected);
        updateDisplayPrize();
    }

    function combination(n: number, r: number): number {
        if (n < r || r < 0) return 0;
        if (r === 0 || r === n) return 1;
        if (r > n / 2) r = n - r;
        let res = 1;
        for (let i = 1; i <= r; i++) {
            res = res * (n - i + 1) / i;
        }
        return Math.round(res);
    }

    function calculateBetCount(selected: { value: string | number; title: string }[]): number {
        const calcConfig = officialMethodCurrent.value?.calc;
        const minSelected = getLayoutConfig<number>('rows.min_selected', 1);
        const maxSelected = getLayoutConfig<number>('rows.max_selected', Infinity);
        const codeTotalCount = getLayoutConfig<{ min: number; max: number }>('code_total_count', { min: 1, max: Infinity });

        const selectedCount = selected.length;

        if (selectedCount < minSelected || selectedCount > maxSelected) {
            return 0;
        }

        if (selectedCount < codeTotalCount.min || selectedCount > codeTotalCount.max) {
            return 0;
        }

        if (calcConfig?.type === 'combination' && calcConfig.base) {
            const n = selectedCount;
            const r = calcConfig.base;
            if (typeof n !== 'number' || typeof r !== 'number' || n < r) return 0;
            return combination(n, r);
        } else if (calcConfig?.type === 'only-one') {
            return selectedCount >= minSelected ? 1 : 0;
        }
        return selectedCount;
    }

    function randomOneBet(): any[] { // Define a more specific return type if possible
        const minSelected = getLayoutConfig<number>('rows.min_selected', 1);
        const maxSelected = getLayoutConfig<number>('rows.max_selected', Infinity);
        const randomType = getLayoutConfig<string>('random_type', 'min'); // 默认 'min'
        const opposition = getLayoutConfig<any[]>('opposition', []); // Define a more specific type for opposition if possible

        balls.value.forEach((b, index) => balls.value[index] = { ...b, selected: false });

        const availableBalls = [...balls.value];
        const selected: Ball[] = [];
        const selectedValues: (string | number)[] = [];

        let targetCount: number;
        if (randomType === 'random') {
            targetCount = Math.floor(Math.random() * (maxSelected - minSelected + 1)) + minSelected;
        } else {
            targetCount = minSelected;
        }

        targetCount = Math.min(targetCount, availableBalls.length);

        while (selected.length < targetCount && availableBalls.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableBalls.length);
            const chosenBall = availableBalls.splice(randomIndex, 1)[0];
            let violatesOpposition = false;
            const isNestedOpposition = Array.isArray(opposition[0]);
            let groupToCheck: any; // Define a more specific type for groupToCheck if possible

            if (isNestedOpposition) {
                groupToCheck = opposition.find(group => Array.isArray(group) && group.includes(chosenBall.value));
            } else {
                if (opposition.includes(chosenBall.value)) {
                    groupToCheck = opposition;
                }
            }

            if (groupToCheck) {
                violatesOpposition = selectedValues.some(selValue => groupToCheck.includes(selValue));
            }

            if (!violatesOpposition) {
                selected.push(chosenBall);
                selectedValues.push(chosenBall.value);
                if (groupToCheck) {
                    for (let j = availableBalls.length - 1; j >= 0; j--) {
                        if (groupToCheck.includes(availableBalls[j].value)) {
                            availableBalls.splice(j, 1);
                        }
                    }
                }
            }
        }

        selected.forEach(selBall => {
            const targetIndex = balls.value.findIndex(b => b.value === selBall.value);
            if (targetIndex !== -1) {
                balls.value[targetIndex] = { ...balls.value[targetIndex], selected: true };
            }
        });

        const betResult = selected.map(ball => ({ value: ball.value, title: ball.title }));
        updateSelectedBalls();

        balls.value.forEach((b, index) => balls.value[index] = { ...b, selected: false });
        officialSelectedBalls.value = [];
        officialBetCount.value = 0;
        updateDisplayPrize();

        return betResult;
    }

    function updateDisplayPrize(): void {
        let levelsToDisplay = [...officialMethodCurrent.value?.levels ?? []];
        const selectedValues = officialSelectedBalls.value.map(b => b.value);

        if (levelsToDisplay.length > 1 && selectedValues.length > 0) {
            levelsToDisplay = levelsToDisplay.filter(level => {
                return level.codes?.length === 0 ||
                    level.codes?.some(code => selectedValues.includes(code)) ||
                    (currentLayoutType === 'Zodiac' && (
                        (level.codes.includes('first') && selectedValues.includes(zodiacFirst.value)) ||
                        (level.codes.includes('other') && selectedValues.some(val => val !== zodiacFirst.value))
                    ));
            });
        }
        (store as LhcStore).setDisplayPrize(levelsToDisplay);
    }

    function getHotColdClass(count: number,): string {
        const currentCount = (typeof count === 'number') ? count : 0;
        const allCounts = Object.values(hotColdData.value).map(c => (typeof c === 'number') ? c : 0);
        if (!allCounts.length) return '';
        const max = Math.max(...allCounts);
        const min = Math.min(...allCounts);
        if (max === 0 && min === 0) return '';
        return currentCount === max ? 'hot' : currentCount === min ? 'cold' : '';
    }

    function getOmissionClass(omission: number): string {
        const currentOmission = (typeof omission === 'number') ? omission : 0;
        const allOmissions = Object.values(omissionData.value).map(o => (typeof o === 'number') ? o : 0);
        if (!allOmissions.length) return '';
        const max = Math.max(...allOmissions);
        const min = Math.min(...allOmissions);
        if (max === 0 && min === 0 && currentOmission === 0) return '';
        return currentOmission === max ? 'max-omission' : currentOmission === min ? 'min-omission' : '';
    }

    watch(
        () => [officialMethodCurrent.value, officialSelectedBalls.value, unit.value],
        () => {
            updateDisplayPrize();
        },
        { immediate: true, deep: true }
    );

    watch(
        () => officialMethodCurrent.value,
        (newMethod, oldMethod) => {
            if (newMethod?.sign) {
                const currentSelectionValues = (newMethod.sign === oldMethod?.sign)
                    ? officialSelectedBalls.value.map(b => b.value)
                    : [];
                initBalls();
                if (currentSelectionValues.length > 0) {
                    balls.value.forEach((b, index) => {
                        if (currentSelectionValues.includes(b.value)) {
                            balls.value[index] = { ...b, selected: true };
                        }
                    });
                    updateSelectedBalls();
                } else {
                    officialSelectedBalls.value = [];
                    officialBetCount.value = 0;
                    updateDisplayPrize();
                }
            } else {
                balls.value = [];
                officialSelectedBalls.value = [];
                officialBetCount.value = 0;
                updateDisplayPrize();
            }
        },
        { immediate: true, deep: true }
    );

    watch(
        () => unit.value,
        () => {
            if (officialMethodCurrent.value?.sign) {
                const currentSelectionValues = officialSelectedBalls.value.map(b => b.value);
                initBalls();
                balls.value.forEach((b, index) => {
                    if (currentSelectionValues.includes(b.value)) {
                        balls.value[index] = { ...b, selected: true };
                    }
                });
                updateSelectedBalls();
            }
        },
        { deep: true }
    );

    watch(
        () => reset.value,
        (newReset) => {
            if (newReset) {
                balls.value.forEach((b, index) => balls.value[index] = {...b, selected: false, animating: false});
                hotColdData.value = {};
                omissionData.value = {};
                officialSelectedBalls.value = [];
                officialBetCount.value = 0;
                updateDisplayPrize();
            }
        }
    );

    watch(
        () => [showColdHot.value, showOmission.value, issueHistory.value, selectedRange.value],
        ([newColdHot, newOmission, newHistory, newRange]) => {
            if (!officialMethodCurrent.value?.sign) return;
            const positions = getLayoutConfig<number | number[]>('rows.position', undefined);
            if (newHistory && newHistory.length > 0) {
                if (newColdHot && typeof calculateHotColdFn === 'function') {
                    hotColdData.value = calculateHotColdFn(newRange, newHistory, balls.value, positions);
                } else {
                    hotColdData.value = {};
                }
                if (newOmission && typeof calculateOmissionFn === 'function') {
                    omissionData.value = calculateOmissionFn(newHistory, balls.value, positions);
                } else {
                    omissionData.value = {};
                }
            } else {
                hotColdData.value = {};
                omissionData.value = {};
            }
        },
        { deep: true, immediate: true }
    );

    return {
        balls,
        hotColdData,
        omissionData,
        toggleBall,
        randomOneBet,
        getHotColdClass,
        getOmissionClass,
        showColdHot,
        showOmission,
        updateSelectedBalls,
        getLayoutConfig
    };
}