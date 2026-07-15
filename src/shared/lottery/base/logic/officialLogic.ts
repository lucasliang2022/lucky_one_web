import { ref, Ref, watch, WatchSource } from 'vue';
import { storeToRefs } from 'pinia';
import { combination, formatPrize } from '@lottery/base/utils/common';
import {MethodDefineItem, MethodRow, MethodRowNumber, Options, SelectedUnit, Level, IssueItem} from "@shared/types";
import type { LotteryStore } from '@lottery/base/stores/storeTypes';

export function officialLogic(store: LotteryStore, options: Options = {}) {
    const {
        calculateChmFn = defaultCalculateChmFn,
        randomOneBetFn = defaultRandomOneBetFn,
        calculateCountFn = defaultCalculateCountFn,
    } = options;

    const {
        officialMethodCurrent,
        reset,
        officialSelectedBalls,
        officialBetCount,
        showColdHot,
        showOmission,
        selectedRange,
        issueHistory,
        price,
        selectedPositions,
    } = storeToRefs(store);

    const rows: Ref<MethodRow[]> = ref([]);

    function initRows(): void {
        const methodConfig = officialMethodCurrent.value;
        if (!methodConfig || !methodConfig.layout) {
            rows.value = [];
            updateSelectedBalls();
            return;
        }

        const configLayout = methodConfig.layout;
        const configRows = configLayout.rows || [];
        const levels = methodConfig.levels || [];
        const currentPrice = price.value;

        const mapItemToBall = (item: any): MethodRowNumber => {
            const ballValue = item?.value;
            let displayPrize: string | number | null = null;

            const matchingLevel = levels.find((level: Level) =>
                Array.isArray(level.codes) && level.codes.some(code => String(code) === String(ballValue))
            );

            const rawPrize = matchingLevel?.prize;
            if (rawPrize !== undefined && rawPrize !== null && String(rawPrize).toUpperCase() !== 'N/A') {
                try {
                    displayPrize = formatPrize(rawPrize, currentPrice);
                } catch (e) {
                    console.error("Error formatting prize:", e);
                    displayPrize = null;
                }
            }

            return {
                title: item?.title,
                value: ballValue,
                count: item?.count,
                prize: displayPrize,
                animating: false,
                selected: false,
                hot_cold: null,
                omission: null
            };
        };

        if (!configRows.length && configLayout.type) {
            const numberField = configLayout.number || [];
            let ballsData: MethodRowNumber[];
            if (numberField && typeof numberField === 'object' && !Array.isArray(numberField)) {
                const orderedKeys = configLayout.ordered_keys || Object.keys(numberField);
                ballsData = orderedKeys.map(key => mapItemToBall({ value: key, title: numberField[key] }));
            } else if (Array.isArray(numberField)) {
                ballsData = numberField.map(mapItemToBall);
            } else {
                ballsData = [];
            }

            rows.value = [{
                title: configLayout.title || methodConfig.title || '',
                position: configLayout.position || [],
                min_selected: configLayout.min_selected || 0,
                max_selected: configLayout.max_selected || 10,
                shape: configLayout.shape || 'circle',
                buttons: configLayout.buttons || false,
                number: ballsData,
                length: configLayout.length,
                allowed_numbers: configLayout.allowed_numbers,
            }];
        } else if (configRows.length > 0){
            rows.value = configRows.map((rowConfig: any): MethodRow => {
                const numberField = rowConfig?.number || [];
                let ballsData: MethodRowNumber[];
                if (numberField && typeof numberField === 'object' && !Array.isArray(numberField)) {
                    const orderedKeys = rowConfig.ordered_keys || Object.keys(numberField);
                    ballsData = orderedKeys.map(key => mapItemToBall({ value: key, title: numberField[key] }));
                } else if (Array.isArray(numberField)) {
                    ballsData = numberField.map(mapItemToBall);
                } else {
                    ballsData = [];
                }

                return {
                    title: rowConfig.title || '',
                    position: rowConfig.position || [],
                    min_selected: rowConfig.min_selected || 0,
                    max_selected: rowConfig.max_selected || 10,
                    shape: rowConfig.shape || 'circle',
                    buttons: rowConfig.buttons || false,
                    number: ballsData,
                    length: rowConfig.length,
                    allowed_numbers: rowConfig.allowed_numbers,
                };
            });
        } else {
            rows.value = [];
        }

        updateSelectedBalls();
    }

    function togglePosition(): void {
        updateSelectedBalls();
    }

    function toggleBall(rowIndex: number, ball: MethodRowNumber): void {
        const row = rows.value[rowIndex];
        if (!row || !row.number) return;

        const rowConfig = officialMethodCurrent.value?.layout?.rows?.[rowIndex]
            || officialMethodCurrent.value?.layout;

        const minSelected = rowConfig?.min_selected ?? 0;
        const maxSelected = rowConfig?.max_selected ?? row.number.length;
        const numbersArray = row.number;
        const selectedInRow = numbersArray.filter(b => b.selected).length;

        if (!ball.selected) {
            if (maxSelected === 1 && selectedInRow === 1) {
                const currentSelected = numbersArray.find(b => b.selected);
                if (currentSelected) {
                    currentSelected.selected = false;
                }
                ball.animating = true;
                setTimeout(() => {
                    ball.selected = true;
                    ball.animating = false;
                    updateSelectedBalls();
                }, 100);
            } else if (selectedInRow >= maxSelected) {
                return;
            } else {
                ball.animating = true;
                setTimeout(() => {
                    ball.selected = true;
                    ball.animating = false;
                    updateSelectedBalls();
                }, 100);
            }
        } else {
            ball.selected = false;
            updateSelectedBalls();
        }
    }

    function handleQuick(rowIndex: number, type: string): void {
        const row = rows.value[rowIndex];
        if (!row || !row.number) return;

        const rowConfig = officialMethodCurrent.value?.layout?.rows?.[rowIndex]
            || officialMethodCurrent.value?.layout;
        const layoutConfig = officialMethodCurrent.value?.layout;


        const statBigMin = layoutConfig?.stat_big_min ?? layoutConfig?.small ?? 5;
        const maxSelected = rowConfig?.max_selected ?? row.number.length;
        const numbersArray = row.number;
        const selectedInRow = numbersArray.filter(b => b.selected).length;

        switch (type) {
            case 'all':
                let canSelectCount = maxSelected - selectedInRow;
                numbersArray.forEach(ball => {
                    if (!ball.selected && canSelectCount > 0) {
                        ball.selected = true;
                        canSelectCount--;
                    }
                });
                break;
            case 'big':
                selectByCondition(rowIndex, num => num >= statBigMin, maxSelected);
                break;
            case 'small':
                selectByCondition(rowIndex, num => num < statBigMin, maxSelected);
                break;
            case 'odd':
                selectByCondition(rowIndex, num => num % 2 === 1, maxSelected);
                break;
            case 'even':
                selectByCondition(rowIndex, num => num % 2 === 0, maxSelected);
                break;
            case 'clear':
                numbersArray.forEach(ball => ball.selected = false);
                break;
        }
        updateSelectedBalls();
    }

    function selectByCondition(rowIndex: number, condition: (num: number) => boolean, maxCount: number): void {
        const numbersArray = rows.value[rowIndex]?.number ?? [];
        numbersArray.forEach(ball => ball.selected = false);
        let count = 0;
        numbersArray.forEach(ball => {
            const valueAsNumber = Number(ball.value);
            if (!isNaN(valueAsNumber) && condition(valueAsNumber) && count < maxCount) {
                ball.selected = true;
                ball.animating = true;
                setTimeout(() => {
                    ball.animating = false;
                }, 100);
                count++;
            }
        });
    }

    function updateSelectedBalls(): void {
        const layoutConfig = officialMethodCurrent.value?.layout;
        const { min: minTotal, max: maxTotal } = layoutConfig?.code_total_count || { min: 0, max: Infinity };

        const tickets = rows.value.map((row: MethodRow): SelectedUnit[] => {
            const numbersArray = row.number ?? [];
            return numbersArray.filter(ball => ball.selected).map(ball => ({
                value: (ball.value ?? '').toString(),
                title: (ball.title ?? ball.value ?? '').toString()
            }));
        });

        const totalSelected = tickets.reduce((sum: number, row: SelectedUnit[]) => sum + row.length, 0);

        let currentBetCount = 0;
        if (calculateCountFn) {
            currentBetCount = calculateCountFn(tickets, officialMethodCurrent.value);
        }

        if (totalSelected < minTotal || totalSelected > maxTotal ) {

        }

        officialSelectedBalls.value = tickets;
        officialBetCount.value = currentBetCount;
        updateDisplayPrize()
    }

    // ======================### random bet function ###=========================
    function defaultRandomOneBetFn(rowsData: MethodRow[], currentMethod: MethodDefineItem): SelectedUnit[][] {
        if (!rowsData.length || !currentMethod.layout.rows.length) {
            throw new Error('Invalid rows configuration');
        }

        const result: SelectedUnit[][] = [];
        const { unit_repeat, row_repeat, code_total_count } = currentMethod.layout;

        const minTotal = code_total_count.min;
        const maxTotal = code_total_count.max;

        const selectedValues = new Set<string>();

        const selectionsPerRow: number[] = rowsData.map(row => row.min_selected);

        const totalSelected = selectionsPerRow.reduce((acc, count) => acc + count, 0);
        if (totalSelected < minTotal || totalSelected > maxTotal) {
            throw new Error(
                `Total selected count (${totalSelected}) does not satisfy code_total_count: [${minTotal}, ${maxTotal}]`
            );
        }

        rowsData.forEach((row, index) => {
            const availableCount = (row.number?.length || 0) - (row_repeat ? 0 : result.flat().length);
            if (row.min_selected > availableCount) {
                throw new Error(`Row ${index} min_selected (${row.min_selected}) exceeds available balls (${availableCount})`);
            }
        });

        rowsData.forEach((rowConfig, index) => {
            const availableBalls = [...(rowConfig.number ?? [])];
            if (availableBalls.length === 0) {
                result.push([]);
                return;
            }

            const selectCount = rowConfig.min_selected;

            const selectedUnits = getRandomBalls(
                availableBalls,
                selectCount,
                row_repeat ? new Set() : selectedValues,
                unit_repeat
            );

            if (!row_repeat) {
                selectedUnits.forEach(unit => selectedValues.add(unit.value));
            }

            result.push(selectedUnits);
        });

        return result;
    }

    function randomOneBet(): SelectedUnit[][] {
        if (randomOneBetFn) {
            return randomOneBetFn(rows.value, officialMethodCurrent.value);
        }
        return [];
    }

    function getRandomBalls(
        availableBalls: NumberBall[],
        n: number,
        excludeValues: Set<string> = new Set(),
        unitRepeat: boolean = false
    ): SelectedUnit[] {
        if (n < 0 || (!unitRepeat && n > availableBalls.length - excludeValues.size)) {
            throw new Error(`Invalid number of selections: ${n}`);
        }

        const selected: SelectedUnit[] = [];
        const balls = availableBalls.filter(ball => !excludeValues.has(ball.value.toString()));

        if (balls.length === 0) {
            return selected;
        }

        if (unitRepeat) {
            for (let i = 0; i < n; i++) {
                const randomIndex = Math.floor(Math.random() * balls.length);
                const ball = balls[randomIndex];
                selected.push({
                    value: ball.value.toString(),
                    title: ball.title?.toString() ?? ball.value.toString(),
                });
            }
        } else {
            const available = [...balls];
            for (let i = 0; i < n && available.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * available.length);
                const ball = available.splice(randomIndex, 1)[0];
                selected.push({
                    value: ball.value.toString(),
                    title: ball.title?.toString() ?? ball.value.toString(),
                });
            }
        }

        return selected;
    }

    // ======================### calculate chm function ###=========================
    function defaultCalculateChmFn(issue: IssueItem, ball: MethodRowNumber, positions: number[]): boolean {
        return false;
    }

    function calculateChm(issueCount: number): void {
        if (!issueHistory.value?.length || (!showColdHot.value && !showOmission.value)) return;

        rows.value.forEach((row: MethodRow, rowIndex: number) => {
            const numbersArray = row.number ?? [];
            if (numbersArray.length === 0) return;

            const ballsData = numbersArray as MethodRowNumber[];
            const rowConfig = officialMethodCurrent.value?.layout?.rows?.[rowIndex] || officialMethodCurrent.value?.layout;
            const positions = rowConfig?.position ?? row.position ?? [];

            const hotCold: Record<string | number, number> = {};
            const omission: Record<string | number, number> = {};
            ballsData.forEach(ball => {
                if (ball && ball.value != null) {
                    hotCold[ball.value] = 0;
                    omission[ball.value] = -1;
                }
            });

            const totalIssues = issueHistory.value.length;
            if (!positions.length || !calculateChmFn) {
                ballsData.forEach(ball => {
                    if (ball && ball.value != null) {
                        if (showColdHot.value) hotCold[ball.value] = 0;
                        if (showOmission.value) omission[ball.value] = totalIssues;
                    }
                });
                numbersArray.forEach(ball => {
                    if (showColdHot.value) ball.hot_cold = hotCold[ball.value] ?? null;
                    if (showOmission.value) ball.omission = omission[ball.value] ?? null;
                });
                return;
            }

            ballsData.forEach(ball => {
                if (ball && ball.value != null) {
                    let hotColdCount = 0;
                    let issuesSinceLastSeen = 0;
                    let found = false;

                    for (let i = 0; i < totalIssues; i++) {
                        const issue = issueHistory.value[i];
                        if (!issue || !issue.open_code) {
                            issuesSinceLastSeen++;
                            continue;
                        }

                        const isMatched = calculateChmFn(issue, ball, positions);
                        if (isMatched) {
                            if (showColdHot.value && i < issueCount) {
                                hotColdCount++;
                            }
                            if (showOmission.value && !found) {
                                omission[ball.value] = issuesSinceLastSeen;
                                found = true;
                            }
                        }
                        if (!found) {
                            issuesSinceLastSeen++;
                        }
                    }

                    if (showColdHot.value) {
                        hotCold[ball.value] = hotColdCount;
                    }
                    if (showOmission.value && !found) {
                        omission[ball.value] = totalIssues;
                    }
                }
            });

            numbersArray.forEach(ball => {
                if (showColdHot.value) ball.hot_cold = hotCold[ball.value] ?? null;
                if (showOmission.value) ball.omission = omission[ball.value] ?? null;
            });
        });
    }

    // ======================### bet count function ###=========================
    function defaultCalculateCountFn(tickets: SelectedUnit[][], currentMethod: MethodDefineItem): number {
        const layoutRows = currentMethod?.layout?.rows || [];
        const calcType = currentMethod?.calc?.type || 'length';

        const unitRepeat = currentMethod?.layout?.unit_repeat ?? false;
        const rowRepeat = currentMethod?.layout?.row_repeat ?? true;
        const codeTotalCount = currentMethod?.layout?.code_total_count || { min: 1, max: Infinity };

        if (tickets.length < layoutRows.length) {
            return 0;
        }

        const minSelectedMet = tickets.every((rowTickets, index) => {
            const minRequired = layoutRows[index]?.min_selected || 1;
            if (rowTickets.length < minRequired) {
                return false;
            }
            if (!unitRepeat) {
                const values = rowTickets.map(unit => unit.value);
                return new Set(values).size === values.length;
            }
            return true;
        });

        if (!minSelectedMet) {
            return 0;
        }

        const totalSelected = tickets.reduce((sum, row) => sum + row.length, 0);
        if (totalSelected < codeTotalCount.min || totalSelected > codeTotalCount.max) {
            return 0;
        }

        if (!rowRepeat) {
            const allValues = tickets.flatMap(row => row.map(unit => unit.value));
            const uniqueValues = new Set(allValues);
            if (uniqueValues.size !== allValues.length) {
                return 0;
            }
        }

        switch (calcType) {
            case 'zx':
                return tickets.reduce((product, rowTickets) => product * rowTickets.length, 1);
            case 'combination': {
                if (tickets.length !== 1) return 0;
                const n = tickets[0].length;
                const calcBase = currentMethod?.calc?.base || 2;
                return combination(n, calcBase);
            }
            case 'wx60': {
                if (tickets.length < 2) return 0;
                const row1 = tickets[0].map(t => t.value);
                const row2 = tickets[1].map(t => t.value);
                const minRow1 = currentMethod?.calc?.base?.['2'] ?? 1;
                const minRow2 = currentMethod?.calc?.base?.['1'] ?? 3;
                if (row1.length < minRow1 || row2.length < minRow2) return 0;

                let count = 0;
                row1.forEach(num => {
                    const validSingles = row2.filter(s => s !== num);
                    if (validSingles.length >= 3) {
                        count += combination(validSingles.length, 3);
                    }
                });
                return count;
            }
            case 'wx30': {
                if (tickets.length < 2) return 0;
                const row1 = tickets[0].map(t => t.value);
                const row2 = tickets[1].map(t => t.value);
                const minRow1 = currentMethod?.calc?.base?.['2'] ?? 2;
                const minRow2 = currentMethod?.calc?.base?.['1'] ?? 1;
                if (row1.length < minRow1 || row2.length < minRow2) return 0;

                let count = 0;
                for (let i = 0; i < row1.length - 1; i++) {
                    for (let j = i + 1; j < row1.length; j++) {
                        const pair = [row1[i], row1[j]];
                        const validSingles = row2.filter(s => !pair.includes(s));
                        count += validSingles.length;
                    }
                }
                return count;
            }
            case 'wx20': {
                if (tickets.length < 2) return 0;
                const row1 = tickets[0].map(t => t.value);
                const row2 = tickets[1].map(t => t.value);
                const minRow1 = currentMethod?.calc?.base?.['3'] ?? 1;
                const minRow2 = currentMethod?.calc?.base?.['1'] ?? 2;
                if (row1.length < minRow1 || row2.length < minRow2) return 0;

                let count = 0;
                row1.forEach(num => {
                    const validSingles = row2.filter(s => s !== num);
                    if (validSingles.length >= 2) {
                        count += combination(validSingles.length, 2);
                    }
                });
                return count;
            }
            case 'wx10': {
                if (tickets.length < 2) return 0;
                const row1 = tickets[0].map(t => t.value);
                const row2 = tickets[1].map(t => t.value);
                const minRow1 = currentMethod?.calc?.base?.['3'] ?? 1;
                const minRow2 = currentMethod?.calc?.base?.['2'] ?? 1;
                if (row1.length < minRow1 || row2.length < minRow2) return 0;

                let count = 0;
                row1.forEach(num => {
                    const validDoubles = row2.filter(s => s !== num);
                    count += validDoubles.length;
                });
                return count;
            }
            case 'wx5': {
                if (tickets.length < 2) return 0;
                const row1 = tickets[0].map(t => t.value);
                const row2 = tickets[1].map(t => t.value);
                const minRow1 = currentMethod?.calc?.base?.['4'] ?? 1;
                const minRow2 = currentMethod?.calc?.base?.['1'] ?? 1;
                if (row1.length < minRow1 || row2.length < minRow2) return 0;

                let count = 0;
                row1.forEach(num => {
                    const validSingles = row2.filter(s => s !== num);
                    count += validSingles.length;
                });
                return count;
            }
            case 'sx12': {
                if (tickets.length < 2) return 0;
                const row1 = tickets[0].map(t => t.value);
                const row2 = tickets[1].map(t => t.value);
                const minRow1 = currentMethod?.calc?.base?.['2'] ?? 1;
                const minRow2 = currentMethod?.calc?.base?.['1'] ?? 2;
                if (row1.length < minRow1 || row2.length < minRow2) return 0;

                let count = 0;
                row1.forEach(num => {
                    const validSingles = row2.filter(s => s !== num);
                    if (validSingles.length >= 2) {
                        count += combination(validSingles.length, 2);
                    }
                });
                return count;
            }
            case 'sx4': {
                if (tickets.length < 2) return 0;
                const row1Sx4 = tickets[0].map(t => t.value);
                const row2Sx4 = tickets[1].map(t => t.value);
                const minRow1Sx4 = currentMethod?.calc?.base?.['3'] ?? 1;
                const minRow2Sx4 = currentMethod?.calc?.base?.['1'] ?? 1;
                if (row1Sx4.length < minRow1Sx4 || row2Sx4.length < minRow2Sx4) return 0;

                let countSx4 = 0;
                row1Sx4.forEach(num => {
                    const validSingles = row2Sx4.filter(s => s !== num);
                    countSx4 += validSingles.length;
                });
                return countSx4;
            }
            case 'map':
                return calculateBetCountByMap(tickets, currentMethod)
            case 'length':
                return tickets.reduce((sum, rowTickets) => sum + rowTickets.length, 0);
            default:
                return tickets.reduce((sum, rowTickets) => sum + rowTickets.length, 0);
        }
    }

    function calculateBetCountByMap(tickets: SelectedUnit[][], currentMethod: MethodDefineItem): number {
        const layoutRow = currentMethod?.layout?.rows?.[0];
        const numberArray = layoutRow?.number as MethodRowNumber[];
        const selectedTickets = tickets?.[0];

        let totalBetCount = 0;
        for (const ticket of selectedTickets) {
            const matchingNumberData = numberArray.find(item => item.value.toString() === ticket.value.toString());
            if (matchingNumberData && matchingNumberData.count != null) {
                totalBetCount += Number(matchingNumberData.count);
            } else {
                return 0;
            }
        }

        return totalBetCount;
    }

    // ======================### other ###=========================
    function getHotColdClass(count: number | null, rowIndex: number): string {
        if (typeof count !== 'number') {
            return '';
        }
        const currentBalls = rows.value[rowIndex]?.number ?? [];
        const validCounts = currentBalls
            .map(ball => ball.hot_cold)
            .filter((c): c is number => typeof c === 'number');

        if (validCounts.length === 0) {
            return '';
        }

        const max = Math.max(...validCounts);
        const min = Math.min(...validCounts);

        if (count === max && max !== min) {
            return 'hot';
        }
        if (count === min && max !== min) {
            return 'cold';
        }

        return '';
    }

    function getOmissionClass(omission: number | null, rowIndex: number): string {
        if (typeof omission !== 'number') {
            return '';
        }
        const currentBalls = rows.value[rowIndex]?.number ?? [];
        const validOmissions = currentBalls
            .map(ball => ball.omission)
            .filter((o): o is number => typeof o === 'number');

        if (validOmissions.length === 0) {
            return '';
        }

        const max = Math.max(...validOmissions);
        const min = Math.min(...validOmissions);

        if (omission === max && max !== min) {
            return 'max-omission';
        }

        return '';
    }

    function updateDisplayPrize(): void {
        const currentMethod = officialMethodCurrent.value;
        if (!currentMethod || !Array.isArray(currentMethod.levels)) {
            if (store.setDisplayPrize) {
                store.setDisplayPrize([]);
            }
            console.log(`updateDisplayPrize: No current method or levels found.`);
            return;
        }

        const originalLevels = [...currentMethod.levels];
        let levelsToDisplay: Level[] = originalLevels;

        const selectedTickets: SelectedUnit[] = officialSelectedBalls.value?.[0] ?? [];
        const selectedValues: string[] = selectedTickets.map(t => t.value);

        if (originalLevels.length > 1 && selectedValues.length > 0) {
            levelsToDisplay = originalLevels.filter(level => {
                const levelCodes = level.codes;
                const hasNoSpecificCodes = !Array.isArray(levelCodes) || levelCodes.length === 0;
                const hasMatchingCode = Array.isArray(levelCodes) &&
                    levelCodes.some(code => selectedValues.includes(String(code)));
                return hasNoSpecificCodes || hasMatchingCode;
            });
        }

        console.log(`updateDisplayPrize: Setting display levels to:`, levelsToDisplay);
        if (store.setDisplayPrize) {
            store.setDisplayPrize(levelsToDisplay);
        } else {
            console.error("store.setDisplayPrize action is not available.");
        }
    }

    watch(() => officialMethodCurrent.value, (newConfig: MethodDefineItem | undefined) => {
        if (newConfig) {
            initRows();
        }
    }, { immediate: true, deep: true });

    watch(() => reset.value, (newVal: boolean) => {
        if (newVal) {
            rows.value.forEach(row => {
                const rowNumber = row.number ?? [];
                rowNumber.forEach(ball => {
                    ball.selected = false;
                    ball.animating = false;
                });
            });
            updateSelectedBalls();
            if (store.setReset) {
                store.setReset(false);
            } else {
                reset.value = false;
            }
        }
    });

    const watcherSource: WatchSource<[boolean, boolean, any[], number]> = () => [
        showColdHot.value,
        showOmission.value,
        issueHistory.value,
        selectedRange.value
    ];

    watch(
        watcherSource,
        ([newColdHot, newOmission, newHistory, newRange], [oldColdHot, oldOmission, oldHistory, oldRange]) => {
            const historyChanged = newHistory !== oldHistory;
            const coldHotToggled = newColdHot !== oldColdHot;
            const omissionToggled = newOmission !== oldOmission;
            const rangeChanged = newRange !== oldRange;

            if (newHistory?.length && (historyChanged || (newColdHot && (coldHotToggled || rangeChanged)) || (newOmission && omissionToggled))) {
                calculateChm(newRange);
            } else if (!newHistory?.length || (!newColdHot && coldHotToggled) || (!newOmission && omissionToggled)) {
                rows.value.forEach(row => {
                    const rowNumber = row.number ?? [];
                    rowNumber.forEach(ball => {
                        if (!newColdHot) ball.hot_cold = null;
                        if (!newOmission) ball.omission = null;
                    });
                });
            }
            updateSelectedBalls();
        },
        { deep: true }
    );

    return {
        rows,
        toggleBall,
        togglePosition,
        handleQuick,
        randomOneBet,
        calculateChm,
        getHotColdClass,
        getOmissionClass,
        showColdHot,
        showOmission,
    };
}