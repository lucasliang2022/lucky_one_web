import { defineAsyncComponent, type Component } from 'vue';
import { resolveTheme } from '@/theme/resolveTheme';
import { useCommonStore } from '@/stores/commonStore';
import { THEMES } from '@/theme/registry';
import type { RegionKey, RegionLoader } from '@/theme/types';

export type { RegionKey };

/**
 * 各区块的默认实现(所有主题兜底)。base 直接复用现有组件或 base 目录下的组件。
 * 主题只需在自己的 themes/<name>/index.ts 里覆盖「与 base 不同」的区块。
 */
const BASE: Record<RegionKey, RegionLoader> = {
  topNav:          () => import('@/components/nav/NavTop.vue'),
  logo:            () => import('@/theme/regions/base/LogoRegion.vue'),
  menu:            () => import('@/components/nav/NavMenu.vue'),
  gameLottery:     () => import('@/theme/regions/base/GameLotteryRegion.vue'),
  floatingButtons: () => import('@/theme/regions/base/FloatingRegion.vue'),
  footer:          () => import('@/theme/regions/base/FooterRegion.vue'),
};

const cache = new Map<string, Component>();

/** 当前主题下某区块应渲染的组件:主题覆盖 → base 兜底(带缓存)。 */
export function regionComponent(key: RegionKey): Component {
  const store = useCommonStore();
  const name = resolveTheme(store.partner?.theme).raw;
  const loader = THEMES[name]?.regions?.[key] ?? BASE[key];
  const cacheKey = `${name}:${key}`;
  if (!cache.has(cacheKey)) {
    cache.set(cacheKey, defineAsyncComponent(loader as () => Promise<Component>));
  }
  return cache.get(cacheKey)!;
}
