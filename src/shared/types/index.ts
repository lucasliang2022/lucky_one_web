export * from './user';
export * from './i18n';
export * from './service';
export * from './api';
export * from './common';
export * from '@lottery/base/types';

// 同名冲突消歧:CurrencyOption / LanguageOption 在 ./common(系统配置项)与 @lottery/types
// (彩票下拉项)里形状不同。显式指定 ./common 为 /types 的规范版本(显式导出优先于 export *)。
// 彩票内部的同名下拉项类型请从 @lottery/types 直接引入。
export type { CurrencyOption, LanguageOption } from './common';