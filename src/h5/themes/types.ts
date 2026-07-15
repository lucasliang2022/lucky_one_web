import type { Component } from 'vue';

/** 可被主题单独定制的功能模块(区块 region 的 key)。h5 端骨架用到的区块。 */
export type RegionKey =
  | 'topNav'   // 顶部导航条
  | 'tabbar'   // 底部标签栏(首页/彩票/我的)
  | 'footer';  // 尾部

export type RegionLoader = () => Promise<{ default: Component } | Component>;
