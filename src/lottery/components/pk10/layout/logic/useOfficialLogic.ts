import {ref, Ref, watch, WatchSource} from 'vue';
import {storeToRefs} from 'pinia';
import {MethodDefineItem, MethodRow, MethodRowNumber, Options,SelectedUnit} from "@/types";
import type { LotteryStore } from '@lottery/stores/storeTypes';

export function useOfficialLogic(store: LotteryStore, options: Options = {}) {
    const {
        calculateHotColdFn,
        calculateOmissionFn,
        randomOneBetFn,
        calculateCountFn
    } = options;

    const {
        officialMethodCurrent,
        reset,
        officialSelectedBalls,
        officialBetCount,
        showColdHot,
        showOmission,
        selectedRange,
        issueHistory
    } = storeToRefs(store);

    const rows: Ref<MethodRow[]> = ref([]);

    function initRows(): void {
        const configRows = officialMethodCurrent.value?.layout?.rows || [];
        if (!configRows.length) return;
        rows.value = configRows.map((rowConfig: MethodRow) => {
            const numberField = rowConfig?.number || [];
            const ballsData:MethodRowNumber[] = numberField.map(
                (item) => ({
                    title: item.title,
                    value: item.value,
                    animating: false,
                    selected: false,
                    hot_cold: null,
                    omission: null
                })
            );

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

        updateSelectedBalls();
    }

    function toggleBall(rowIndex: number, ball: MethodRowNumber): void {
        const rowConfig = officialMethodCurrent.value?.layout?.rows?.[rowIndex] || {
            min_selected: 0,
            max_selected: 0
        };
        const minSelected = rowConfig.min_selected || 0;
        const maxSelected = rowConfig.max_selected || 10;
        const numbersArray = rows.value[rowIndex]?.number ?? [];
        const selectedInRow = numbersArray.filter(b => b.selected).length;

        if (!ball.selected) {
            if (selectedInRow >= maxSelected) return;
            ball.animating = true;
            setTimeout(() => {
                ball.selected = true;
                ball.animating = false;
                updateSelectedBalls();
            }, 100);
        } else {
            ball.selected = false;
            updateSelectedBalls();
        }
    }

    function handleQuick(rowIndex: number, type: string, offset?: number): void {
        const rowConfig = officialMethodCurrent.value?.layout?.rows?.[rowIndex] || {
            max_selected: 0
        };

        const maxSelected = rowConfig.max_selected || 10;
        const numbersArray = rows.value[rowIndex]?.number ?? [];

        switch (type) {
            case 'all':
                numbersArray.forEach(ball => {
                    if (numbersArray.filter(b => b.selected).length < maxSelected) ball.selected = true;
                });
                break;
            case 'big':
                const big = offset ? offset : 6;
                selectByCondition(rowIndex, num => num >= big, maxSelected);
                break;
            case 'small':
                const small = offset ? offset : 5;
                selectByCondition(rowIndex, num => num <= small, maxSelected);
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
            if (condition(ball.value as number) && count < maxCount) {
                ball.selected = true;
                count++;
            }
        });
    }

    function updateSelectedBalls(): void {
        const { min: minTotal, max: maxTotal } = officialMethodCurrent.value?.layout?.code_total_count || { min: 1, max: 50 };

        const tickets = rows.value.map((row: MethodRow) => {
            const numbersArray = row.number ?? [];
            return numbersArray.filter(ball => ball.selected).map(ball => ({
                value: (ball.value ?? '').toString(),
                title: (ball.title ?? '').toString()
            }));
        });

        const totalSelected = tickets.reduce((sum: number, row: any[]) => sum + row.length, 0);
        const minPerRow = officialMethodCurrent.value?.layout?.rows?.map((row: any) => row.min_selected) || [];

        officialSelectedBalls.value = tickets;
        officialBetCount.value = calculateCountFn ? calculateCountFn(tickets, officialMethodCurrent.value) : 0;

        if (totalSelected > maxTotal) {
            officialSelectedBalls.value = [];
            officialBetCount.value = 0;
        }
    }

    function randomOneBet(): any[] {
        if (randomOneBetFn) {
            return randomOneBetFn(rows.value, officialMethodCurrent.value);
        }
        return [];
    }

    function calculateHotCold(issueCount: number): void {
        if (!issueHistory.value?.length || !showColdHot.value) return;
        if (calculateHotColdFn) {
            rows.value.forEach((row: MethodRow, rowIndex: number) => {
                const numbersArray = row.number ?? [];
                const ballsData = numbersArray;
                const positions = row.position ?? [];
                const hotColdData = calculateHotColdFn(issueCount, issueHistory.value, ballsData, positions);

                numbersArray.forEach(ball => {
                    ball.hot_cold = hotColdData[ball.value] || 0;
                });
            });
        }
    }

    function calculateOmission(): void {
        if (!issueHistory.value?.length || !showOmission.value) return;
        if (calculateOmissionFn) {
            rows.value.forEach((row: MethodRow, rowIndex: number) => {
                const numbersArray = row.number ?? [];
                const ballsData = numbersArray ?? [];
                const positions = row.position??[];
                const omissionData = calculateOmissionFn(issueHistory.value, ballsData, positions);
                numbersArray.forEach(ball => {
                    ball.omission = omissionData[ball.value] || 0;
                });
            });
        }
    }

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

        if (count === max) {
            return 'hot';
        }
        if (count === min) {
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

        if (omission === max) {
            return 'max-omission';
        }
        if (omission === min) {
            return 'min-omission';
        }

        return '';
    }

    watch(() => officialMethodCurrent.value, (newConfig: MethodDefineItem | undefined) => {
        if (newConfig) {
            initRows();
        }
    }, { immediate: true });

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
            reset.value = false;
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
            if (newHistory?.length) {
                updateSelectedBalls();
                if (newColdHot) calculateHotCold(newRange);
                if (newOmission) calculateOmission();
            } else {
                rows.value.forEach(row => {
                    const rowNumber = row.number ?? [];
                    rowNumber.forEach(ball => {
                        ball.hot_cold = null;
                        ball.omission = null;
                    });
                });
            }
        }
    );

    return {
        rows,
        toggleBall,
        handleQuick,
        randomOneBet,
        calculateHotCold,
        calculateOmission,
        getHotColdClass,
        getOmissionClass,
        showColdHot,
        showOmission,
        officialMethodCurrent,
        officialSelectedBalls,
        updateSelectedBalls
    };
}