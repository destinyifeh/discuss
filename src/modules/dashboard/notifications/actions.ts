import api from '@/lib/auth/api';

export async function getNotificationsRequestAction(
  page = 1,
  limit = 10,
  requestedNote: string,
) {
  const params: any = {page, limit, requestedNote};

  const res = await api.get(`/notifications`, {params});
  return res.data?.data;
}

export async function markAllAsReadRequestAction() {
  try {
    const res = await api.patch(`/notifications/mark-all-as-read`);
    return res.data;
  } catch (err: any) {
    throw err?.response?.data ?? err;
  }
}

export async function markAsReadRequestAction(id: string) {
  try {
    const res = await api.patch(`/notifications/mark-as-read/${id}`);
    return res.data;
  } catch (err: any) {
    throw err?.response?.data ?? err;
  }
}

export async function getUnreadNotificationsCounntRequestAction() {
  try {
    const res = await api.get(`/notifications/unread-notifications`);
    return res.data?.unreadData;
  } catch (err: any) {
    throw err?.response?.data ?? err;
  }
}
