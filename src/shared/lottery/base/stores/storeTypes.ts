import type { useSscStore } from '@lottery/ssc/store';
import type { usePk10Store } from '@lottery/pk10/store';
import type { useLhcStore } from '@lottery/lhc/store';
import type { useKsStore } from '@lottery/ks/store';
import type { useHashStore } from '@lottery/hash/store';

/**
 * 各彩种 store 的「实例类型」——从实现(defineStore 的返回)推导。
 * 随实现自动同步,不会像手写 shadow 接口那样漂移。
 * import type 仅类型引用、运行时擦除,不产生模块循环。
 */
export type SscStore  = ReturnType<typeof useSscStore>;
export type Pk10Store = ReturnType<typeof usePk10Store>;
export type LhcStore  = ReturnType<typeof useLhcStore>;
export type KsStore   = ReturnType<typeof useKsStore>;
export type HashStore = ReturnType<typeof useHashStore>;

/**
 * 共享逻辑 / 布局组件用的「基类面」类型。
 * pk10 与 ssc 均为纯 base 透传,取其一即基类面;
 * lhc 结构上是其超集(base + 生肖态),可赋值给它,故共享逻辑用本类型即可覆盖三者。
 */
export type LotteryStore = SscStore;
