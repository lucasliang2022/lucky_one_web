import { ElMessage } from 'element-plus';
import { ApiError } from '@/types/api';

export function handleGlobalError(
    error: unknown,
    customMessage?: string,
    contextInfo?: string,
): void {
    const ctx = contextInfo ? ` (${contextInfo})` : '';
    console.error(`--- Error Captured${ctx} ---:`, error);

    // ApiError 已在 axios 拦截器里 ElMessage 过了，避免重复
    if (error instanceof ApiError) return;

    const msg = customMessage
        ?? (error instanceof Error ? error.message : null)
        ?? 'Something went wrong';

    if (msg) ElMessage.error(msg);

    // Sentry 接入时反注释（之前直接调 Sentry 但没 import，会抛 ReferenceError）
    // try { Sentry.captureException(error); } catch { /* ignore */ }
}

export function strLength(str: string): number {
    let length = 0;
    for (const char of str) {
        length += /[\u4e00-\u9fa5]/.test(char) ? 2 : 1;
    }
    return length;
}

export function strSub(str: string, maxLength: number): string {
    if (strLength(str) < maxLength) return str;

    let count = 0;
    let result = '';
    for (const char of str) {
        count += /[\u4e00-\u9fa5]/.test(char) ? 2 : 1;
        if (count > maxLength) break;
        result += char;
    }
    return result;
}

export function formatPrize(amount: number, unit: number = 1, times: number = 1): number {
    return parseFloat((amount * unit * times).toFixed(2));
}

export function stripUsernameSign(full: string | null | undefined): string {
    if (!full) return '';
    const idx = full.indexOf('@');
    return idx >= 0 ? full.slice(idx + 1) : full;
}

// ===== Lottery wave colors =====
export const redWave: string[] = [
    '01','02','07','08','12','13','18','19','23','24',
    '29','30','34','35','40','45','46',
];
export const blueWave: string[] = [
    '03','04','09','10','14','15','20','25','26','31',
    '36','37','41','42','47','48',
];
export const greenWave: string[] = [
    '05','06','11','16','17','21','22','27','28','32',
    '33','38','39','43','44','49',
];

export function getBallColor(number: string): 'red' | 'blue' | 'green' | '' {
    if (redWave.includes(number)) return 'red';
    if (blueWave.includes(number)) return 'blue';
    if (greenWave.includes(number)) return 'green';
    return '';
}