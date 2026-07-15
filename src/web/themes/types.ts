import type { Component } from 'vue';

/** 可被主题单独定制的功能模块(区块 region 的 key) */
export type RegionKey =
  | 'topNav'          // 顶部导航条
  | 'logo'            // logo 部位
  | 'menu'            // 菜单导航
  | 'gameLottery'     // 游戏与彩票摆放(内容级,通用容器)
  | 'homeLottery'     // 首页-重要彩票入口
  | 'homeGame'        // 首页-游戏入口(体育/真人/电子/棋牌…,按 category 复用)
  | 'floatingButtons' // 右侧悬浮按钮
  | 'footer';         // 尾部

export type RegionLoader = () => Promise<{ default: Component } | Component>;
