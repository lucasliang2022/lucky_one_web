import { api } from '@/api';
import type { SystemConfig, NoticeItem } from '@/types/common';

export const fetchSystemConfig = () => api.get<SystemConfig>('/common/config');
// 后端返回 { items, total }
export const fetchNoticeList   = () => api.get<{ items: NoticeItem[]; total: number }>('/notice/list');