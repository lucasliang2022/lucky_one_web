import { api } from '@/api';
import type { SystemConfig, NoticeItem } from '@/types/common';

export const fetchSystemConfig = () => api.get<SystemConfig>('/common/config');
export const fetchNoticeList   = () => api.get<NoticeItem[]>('/notice/list');