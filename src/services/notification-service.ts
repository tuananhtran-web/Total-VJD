import { supabase } from './supabase';

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  isRead: boolean;
  target: 'all' | 'selected';
  userIds?: string[];
}

const TABLE_NAME = 'notifications';

export const getNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return (data || []).map((n: any) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    date: n.created_at,
    isRead: false, // Cannot track read status per user easily without a separate table
    target: n.target,
    userIds: n.user_ids
  }));
};

export const sendNotification = async (title: string, body: string, target: 'all' | 'selected', userIds?: string[]): Promise<void> => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .insert({
      title,
      body,
      target,
      user_ids: userIds || []
    });

  if (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};
