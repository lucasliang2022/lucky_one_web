import { ref, watch} from 'vue';
import { ElMessageBox, UploadInstance } from 'element-plus';
import { SelectedUnit } from '@/types';
import { storeToRefs } from "pinia";

export function OfficialLogicInput(store: any) {
    const {
        officialMethodCurrent,
        reset,
        officialSelectedBalls,
        officialBetCount,
    } = storeToRefs(store)

    const inputText = ref('');
    const uploadRef = ref<UploadInstance | null>(null);

    const validateTickets = (text: string): { validTickets: SelectedUnit[]; invalidTickets: SelectedUnit[] } => {
        const currentMethod = officialMethodCurrent.value;
        if (!text || text.trim() === '' || !currentMethod?.layout?.rows?.[0]) {
            return { validTickets: [], invalidTickets: [] };
        }

        const layout = currentMethod.layout;
        const rowConfig = layout.rows[0];

        const allowedNumbers = rowConfig.allowed_numbers ?? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const maxTicketCount = layout.code_total_count?.max ?? 100000;
        const rowSeparator = layout.row_separator ?? ',|， ；;\\n';
        const unitLength = rowConfig.length ?? 0;
        const unitSeparator = layout.unit_separator ?? '';
        const unitRepeat = layout.unit_repeat !== false;
        const rowRepeat = layout.row_repeat !== false;
        const type = rowConfig.type ?? 'ANY';
        const typeOptions = type.split(',');

        const rawTickets = text.trim().split(new RegExp(`[${rowSeparator}]+`)).filter(t => t.length > 0);

        const validTickets: SelectedUnit[] = [];
        const invalidTickets: SelectedUnit[] = [];
        const seenTickets = new Set<string>();

        for (let ticketStr of rawTickets) {
            ticketStr = ticketStr.replace(/[^0-9]/g, '');

            const currentTicket: SelectedUnit = { value: ticketStr, title: ticketStr };

            if (unitLength > 0 && ticketStr.length !== unitLength) {
                invalidTickets.push(currentTicket);
                continue;
            }

            const ticketChars = ticketStr.split(unitSeparator);
            if (!ticketChars.every(char => allowedNumbers.includes(parseInt(char, 10)))) {
                invalidTickets.push(currentTicket);
                continue;
            }

            if (!isValidTicketFormat(ticketChars, typeOptions, unitRepeat)) {
                invalidTickets.push(currentTicket);
                continue;
            }

            const checkValue = (type === 'ANY' || type.startsWith('Zx')) ? ticketStr : ticketChars.slice().sort().join(unitSeparator);
            if (!rowRepeat && seenTickets.has(checkValue)) {
                invalidTickets.push(currentTicket);
                continue;
            }

            seenTickets.add(checkValue);
            validTickets.push(currentTicket);

            if (validTickets.length >= maxTicketCount) {
                const remainingIndex = rawTickets.indexOf(ticketStr.replace(/[^0-9]/g, '')) + 1;
                if(remainingIndex < rawTickets.length) {
                    invalidTickets.push(...rawTickets.slice(remainingIndex).map(t => ({ value: t, title: t})));
                }
                break;
            }
        }

        return { validTickets, invalidTickets };
    };

    const isValidTicketFormat = (ticketChars: string[], typeOptions: string[], unitRepeat: boolean): boolean => {
        if (typeOptions.includes('ANY')) return true;

        const numbers = ticketChars.map(num => parseInt(num, 10));
        const numCount: Record<number, number> = {};
        numbers.forEach(num => {
            numCount[num] = (numCount[num] || 0) + 1;
        });
        const counts = Object.values(numCount);
        const distinctCount = counts.length;

        return typeOptions.some(type => {
            if (type === 'AAB') {
                return distinctCount === 2 && counts.some(c => c === 2);
            } else if (type === 'ABC') {
                return distinctCount === 3 && counts.every(c => c === 1);
            } else if (type === 'AB') {
                return distinctCount === 2 && counts.every(c => c === 1);
            } else if (type === 'AA') {
                return distinctCount === 1 && counts[0] === 2;
            }
            return false;
        }) || (unitRepeat && typeOptions.includes('Zx'));
    };

    const updateStoreState = () => {
        const { validTickets } = validateTickets(inputText.value);
        const storeTickets: SelectedUnit[][] = validTickets.map(ticket => ([{ value: ticket.value, title: ticket.title }]));
        const count = storeTickets.length;

        officialSelectedBalls.value = storeTickets;
        officialBetCount.value = count;
    };

    const handleInput = () => {
        updateStoreState();
    };

    const handleBlur = () => {
        const currentText = inputText.value;
        const { validTickets, invalidTickets } = validateTickets(currentText);
        const rowSeparator = officialMethodCurrent.value?.layout?.row_separator?.charAt(0) ?? ';';
        const formattedText = validTickets.map(ticket => ticket.value).join(rowSeparator + '\n');

        if (invalidTickets.length > 0 && currentText.trim() !== '') {
            const message = `已保留 ${validTickets.length} 注有效号码，移除了 ${invalidTickets.length} 注无效或重复号码。`;
            ElMessageBox.alert(message, '提示', {
                confirmButtonText: '确定',
                callback: () => {
                    inputText.value = formattedText;
                    updateStoreState();
                }
            });
            updateStoreState();
        } else if (inputText.value.trim() !== formattedText.trim()) {
            inputText.value = formattedText;
            updateStoreState();
        }
    };

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        if (event.dataTransfer?.files) {
            const file = event.dataTransfer.files[0];
            if (file && file.type === 'text/plain') {
                readFile(file);
            } else if (file) {
                ElMessageBox.alert('请拖拽 txt 格式的文件。', '文件格式错误', { confirmButtonText: '确定'});
            }
        }
    };

    const handleFileUpload = (uploadFile: any) => {
        if (uploadFile?.raw) {
            if (uploadFile.raw.type === 'text/plain') {
                readFile(uploadFile.raw);
            } else {
                ElMessageBox.alert('请选择 txt 格式的文件。', '文件格式错误', { confirmButtonText: '确定'});
            }
        }
        if (uploadRef.value) {
            uploadRef.value.clearFiles();
        }
    };

    const readFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                inputText.value = e.target.result as string;
                handleBlur();
            }
        };
        reader.onerror = () => {
            ElMessageBox.alert('读取文件失败。', '错误', { confirmButtonText: '确定'});
        };
        reader.readAsText(file);
    };

    const clearInput = () => {
        inputText.value = '';
        updateStoreState();
    };

    const generateRandomBet = (): SelectedUnit[][] => {
        const currentMethod = officialMethodCurrent.value;
        if (!currentMethod?.layout?.rows?.[0]) return [];

        const rowConfig = currentMethod.layout.rows[0];
        const rowLength = rowConfig.length ?? 0;
        const allowedNumbers = rowConfig.allowed_numbers ?? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const unitRepeat = currentMethod.layout.unit_repeat !== false;
        const type = rowConfig.type ?? 'ANY';

        if (rowLength <= 0) return [];

        let selectedNums: number[] = [];
        let available = [...allowedNumbers];

        if (type === 'AAB' && rowLength === 3) {
            if (available.length < 2) return [];
            const repeatIndex = Math.floor(Math.random() * available.length);
            const repeatNum = available[repeatIndex];
            available.splice(repeatIndex, 1);
            if (available.length < 1) return [];
            const singleIndex = Math.floor(Math.random() * available.length);
            const singleNum = available[singleIndex];
            selectedNums = [repeatNum, repeatNum, singleNum];
            for (let i = selectedNums.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [selectedNums[i], selectedNums[j]] = [selectedNums[j], selectedNums[i]];
            }
        } else if ((type === 'ABC' || type === 'AB') && !unitRepeat) {
            if (available.length < rowLength) return [];
            for (let i = 0; i < rowLength; i++) {
                const randomIndex = Math.floor(Math.random() * available.length);
                selectedNums.push(available.splice(randomIndex, 1)[0]);
            }
        } else {
            for (let i = 0; i < rowLength; i++) {
                const randomIndex = Math.floor(Math.random() * available.length);
                selectedNums.push(available[randomIndex]);
                if (!unitRepeat) {

                }
            }
        }

        const selectedStr = selectedNums.join('');
        return [[{ value: selectedStr, title: selectedStr }]];
    };

    watch(
        () => officialMethodCurrent.value,
        (newMethod, oldMethod) => {
            if(newMethod?.sign !== oldMethod?.sign) {
                inputText.value = '';
                updateStoreState();
            }
        },
        { deep: true }
    );

    watch(
        () => reset.value,
        (newReset) => {
            if (newReset) {
                clearInput();
            }
        }
    );

    return {
        inputText,
        uploadRef,
        handleInput,
        handleBlur,
        handleDrop,
        handleFileUpload,
        clearInput,
        randomOneBet: generateRandomBet
    };
}