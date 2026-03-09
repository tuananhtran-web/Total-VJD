import React, { useEffect, useState } from "react";
import { Page, Header, Box, Text, Icon } from "zmp-ui";
import { getNotifications, Notification } from "../../services/notification-service";

const NotificationListPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="bg-gray-50">
      <Header title="Thông báo" />
      
      <Box className="p-4">
        {loading ? (
           <div className="flex justify-center mt-8">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
           </div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <Icon icon="zi-notif" size={48} className="mx-auto mb-2 opacity-50" />
            <Text>Bạn chưa có thông báo nào</Text>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm relative overflow-hidden">
                {!item.isRead && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500"></div>
                )}
                <Text.Title size="small" className="font-bold mb-1">{item.title}</Text.Title>
                <Text size="small" className="text-gray-600 mb-2 line-clamp-2">{item.body}</Text>
                <Text size="xxSmall" className="text-gray-400">
                  {new Date(item.date).toLocaleDateString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit'
                  })}
                </Text>
              </div>
            ))}
          </div>
        )}
      </Box>
    </Page>
  );
};

export default NotificationListPage;
