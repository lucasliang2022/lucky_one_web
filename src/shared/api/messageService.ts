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

/** 站内信未读数(需登录)。后端返回 { unread, by_category }(by_category = {分类值: 未读数})。 */
export const fetchUnreadCount = () =>
  api.get<{ unread: number; by_category: Record<string, number> }>('/systemMsg/unreadCount');

/** 站内信分类:通知 / 优惠 / 充提 / 私信(对应后端 SystemMsgCategoryConst)。 */
export const MSG_CATEGORIES = [
  { value: 1, label: '通知' },
  { value: 2, label: '优惠' },
  { value: 3, label: '充提' },
  { value: 4, label: '私信' },
] as const;

/** 站内信列表(分页;category 为空取全部)。与站内其它列表一致走 POST + page/pageSize。 */
export const fetchMessages = (page = 1, pageSize = 10, category?: number) =>
  api.post<{ items: SystemMsgItem[]; total: number }>('/systemMsg/index', { page, pageSize, category });

/** 标记单条已读。 */
export const markMsgRead = (id: number) => api.post('/systemMsg/markRead', { id });

/** 批量标记已读。 */
export const markMsgReadBatch = (ids: number[]) =>
  api.post<{ marked: number }>('/systemMsg/markRead', { ids });

/** 全部标为已读,返回本次标记条数。 */
export const markAllMsgRead = () => api.post<{ marked: number }>('/systemMsg/markAllRead');

/** 按用户软删一条(仅对本人隐藏,不影响他人)。 */
export const deleteMsg = (id: number) => api.post('/systemMsg/delete', { id });

/** 批量软删。 */
export const deleteMsgBatch = (ids: number[]) =>
  api.post<{ deleted: number }>('/systemMsg/delete', { ids });
