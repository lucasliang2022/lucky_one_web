import md5 from 'crypto-js/md5'

// 生成缓存键
export function getCacheKey(lotterySign: string, mode: string, dataVersion: string): string {
    return `methodList_${md5(lotterySign + mode + dataVersion)}`;
}

// 获取缓存数据
export function getCachedData(cacheKey: string): any {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return JSON.parse(cached);
    }
    return null;
}

// 设置缓存数据
export function setCachedData(cacheKey: string, data: any): void {
    localStorage.setItem(cacheKey, JSON.stringify(data));
    console.log(`Cache set for key: ${cacheKey}`);
}