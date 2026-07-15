import { api } from '@shared/api';

/** 站内信列表项(对应后端 SystemMsgResource) */
export interface SystemMsgItem {
  id: number;
  title: string;
  category: number;
  category_title: string;
  content: string;
  publish_at: string | null;
  is_read: number;      // 0 未读 / 1 已读
  read_at: string | null;
}

/** 站内信未读数(需登录)。后端返回 { unread }。 */
export const fetchUnreadCount = () => api.get<{ unread: number }>('/systemMsg/unreadCount');

/** 站内信列表(分页;与站内其它列表一致走 POST + page/pageSize)。 */
export const fetchMessages = (page = 1, pageSize = 10) =>
  api.post<{ items: SystemMsgItem[]; total: number }>('/systemMsg/index', { page, pageSize });

/** 标记单条已读。 */
export const markMsgRead = (id: number) => api.post('/systemMsg/markRead', { id });

/** 全部标为已读,返回本次标记条数。 */
export const markAllMsgRead = () => api.post<{ marked: number }>('/systemMsg/markAllRead');

/** 按用户软删一条(仅对本人隐藏,不影响他人)。 */
export const deleteMsg = (id: number) => api.post('/systemMsg/delete', { id });
