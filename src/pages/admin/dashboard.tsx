import React, { useEffect, useState } from "react";
import { Page, Header, Box, Text, Icon, useNavigate } from "zmp-ui";
import { BookingService } from "../../services/booking-service";
import { UserService } from "../../services/user-service";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { label: "Doanh thu", value: "0", icon: "zi-poll", color: "bg-blue-500" },
    { label: "Lượt đặt sân", value: "0", icon: "zi-calendar", color: "bg-green-500" },
    { label: "Thành viên", value: "0", icon: "zi-user", color: "bg-orange-500" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const [bookings, users] = await Promise.all([
                BookingService.getAllBookings(),
                UserService.getAllUsers()
            ]);

            const revenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
            const revenueFormatted = revenue > 1000000 
                ? `${(revenue / 1000000).toFixed(1)}M` 
                : `${(revenue / 1000).toFixed(0)}k`;

            setStats([
                { label: "Doanh thu", value: revenueFormatted, icon: "zi-poll", color: "bg-blue-500" },
                { label: "Lượt đặt sân", value: bookings.length.toString(), icon: "zi-calendar", color: "bg-green-500" },
                { label: "Thành viên", value: users.length.toString(), icon: "zi-user", color: "bg-orange-500" },
            ]);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };
    fetchStats();
  }, []);

  const menuItems = [
    {
      title: "Quản lý Người dùng",
      icon: "zi-user-group",
      color: "bg-blue-600",
      path: "/pages/admin/user-list",
      desc: "Thành viên, Nhân viên"
    },
    {
      title: "Quản lý Đặt sân",
      icon: "zi-calendar",
      color: "bg-green-600",
      path: "/pages/admin/booking-manager",
      desc: "Lịch đặt, Duyệt đơn"
    },
    {
      title: "Quản lý Câu lạc bộ",
      icon: "zi-location",
      color: "bg-teal-600",
      path: "/pages/admin/facility-manager",
      desc: "CLB, Sân, Giá, Giờ"
    },
    {
      title: "Quản lý Gói tập",
      icon: "zi-list-1",
      color: "bg-purple-600",
      path: "/pages/admin/packages/list",
      desc: "Gói tháng, Voucher"
    },
    {
      title: "Báo cáo Doanh thu",
      icon: "zi-poll",
      color: "bg-orange-600",
      path: "/pages/admin/revenue/index",
      desc: "Thống kê tài chính"
    },
    {
      title: "Gửi Thông báo",
      icon: "zi-notif",
      color: "bg-red-600",
      path: "/pages/admin/notifications/send",
      desc: "Tin nhắn CSKH"
    },
    {
      title: "Cấu hình Hệ thống",
      icon: "zi-setting",
      color: "bg-gray-600",
      path: "/pages/admin/settings/index",
      desc: "Banner, Liên hệ"
    }
  ];

  return (
    <Page className="bg-gray-100 pb-20">
      <div className="bg-[#006442] pb-12 pt-safe-top">
          <div className="px-4 py-4 flex justify-between items-center text-white">
            <div>
                <Text size="xSmall" className="opacity-80">Xin chào,</Text>
                <Text.Title className="font-bold">Administrator</Text.Title>
            </div>
            <div 
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
                onClick={() => {
                    if (confirm("Đăng xuất Admin?")) {
                        navigate('/admin-login');
                    }
                }}
            >
                <Icon icon="zi-user" />
            </div>
          </div>
      </div>
      
      <Box className="px-4 -mt-8">
        {/* Stats Row */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl shadow-md min-w-[120px] flex flex-col items-center">
                    <div className={`${stat.color} w-8 h-8 rounded-full flex items-center justify-center text-white mb-2 shadow-sm`}>
                        <Icon icon={stat.icon} size={16} />
                    </div>
                    <Text.Title size="normal" className="font-bold text-gray-800">{stat.value}</Text.Title>
                    <Text size="xxSmall" className="text-gray-500 font-medium">{stat.label}</Text>
                </div>
            ))}
        </div>

        <Text.Title className="mb-3 mt-2 font-bold text-gray-700 ml-1">Chức năng quản lý</Text.Title>
        
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center text-center gap-2 active:scale-95 transition-transform border border-gray-100"
            >
              <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-white shadow-md`}>
                <Icon icon={item.icon} size={24} />
              </div>
              <div>
                <Text.Title size="small" className="font-bold text-gray-800">{item.title}</Text.Title>
                <Text size="xxSmall" className="text-gray-500 line-clamp-1">{item.desc}</Text>
              </div>
            </div>
          ))}
        </div>
      </Box>

      <div className="fixed bottom-4 left-0 right-0 flex justify-center">
          <div 
            className="bg-white/80 backdrop-blur-md border border-gray-200 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/login')}
          >
              <Icon icon="zi-arrow-left" size={16} className="text-red-500" />
              <Text size="small" className="font-bold text-red-500">Đăng xuất</Text>
          </div>
      </div>
    </Page>
  );
};

export default AdminDashboard;
