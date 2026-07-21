import { api } from '@shared/api';

/** VIP 等级项(对应后端 VipLevelResource) */
/** 各品类返水%(体育/电竞/篮球/真人/棋牌/电子/娱乐) */
export interface VipRebateRates {
  sport?: number; esport?: number; basketball?: number; live?: number;
  card?: number; slot?: number; ent?: number;
}

export interface VipLevelItem {
  level: number;
  title: string;
  upgrade_turnover: number;     // 有效流水(升级门槛)
  keep_turnover: number;        // 保级流水
  keep_cycle_days: number;
  daily_withdraw_count: number; // 每日提款次数
  daily_withdraw_limit: number; // 每日提款总额度
  reward_amount: number;        // 升级礼金
  birthday_bonus: number;       // 生日礼金
  weekly_bonus: number;         // 每周红包
  rebate_rates: VipRebateRates;
  reward_currency: string;
  image_url: string;
}

export interface VipInfo {
  current_level: number;
  next_level: number | null;
  next_upgrade_turnover: number | null;
  levels: VipLevelItem[];
}

/** 玩家 VIP 详情(当前等级 + 各级门槛/礼金)。需登录。 */
export const fetchVipInfo = () => api.post<VipInfo>('/vip/info', {});
