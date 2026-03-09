import React from "react";
import { Page, Text, Icon, Button, Box, useNavigate, useSnackbar } from "zmp-ui";

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }
  }, []);

  const MenuItem = ({ icon, title, subtitle, onClick, isNew }: { icon: string, title: string, subtitle?: string, onClick?: () => void, isNew?: boolean }) => (
    <div 
      className="bg-white p-4 flex items-center justify-between border-b border-gray-50 last:border-0 active:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Icon icon={icon} className="text-green-600" size={24} />
        <div>
           <Text className="text-gray-700 font-medium text-base">{title}</Text>
           {subtitle && <Text className="text-gray-400 text-xs">{subtitle}</Text>}
        </div>
        {isNew && (
           <div className="bg-green-100 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded ml-2">NEW</div>
        )}
      </div>
      <Icon icon="zi-chevron-right" className="text-gray-300" size={20} />
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    openSnackbar({ text: "Đã đăng xuất", type: "success" });
    navigate("/login");
  };

  return (
    <Page className="bg-gray-50 h-full pb-20">
      {/* Green Header Background */}
      <div className="bg-[#283b91] h-40 relative">
        {/* Decorative curves could go here */}
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-24 relative z-10 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg flex flex-col gap-4">
          
          <div className="flex gap-4">
            {/* Logo or Avatar */}
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 border-4 border-white overflow-hidden shadow-sm">
               {user?.avatar || user?.user_metadata?.avatar ? (
                 <img src={user?.avatar || user?.user_metadata?.avatar} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <>
                   <Icon icon="zi-user-solid" className="text-gray-400" size={32} />
                 </>
               )}
            </div>
            
            {/* Text Content */}
            <div className="flex-1">
               {user ? (
                 <>
                   <Text.Title className="font-bold text-lg leading-tight mb-1">{user.displayName || user.user_metadata?.full_name || "Thành viên"}</Text.Title>
                   <Text className="text-green-600 text-sm font-medium">{user.phoneNumber || user.user_metadata?.phone_number || "Thành viên thân thiết"}</Text>
                 </>
               ) : (
                 <>
                   <Text.Title className="font-bold text-lg leading-tight mb-1">Khách</Text.Title>
                   <Text className="text-yellow-500 text-sm font-medium">Đăng nhập để nhận ưu đãi</Text>
                 </>
               )}
            </div>
          </div>

          {/* Buttons */}
          {!user ? (
            <div className="flex gap-3 mt-1">
              <Button 
                className="flex-1 bg-[#283b91] hover:bg-blue-800 text-white font-bold rounded-lg py-2"
                size="medium"
                onClick={() => navigate('/login')}
              >
                Đăng nhập
              </Button>
              <button 
                className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg py-2 active:bg-gray-50 transition-colors"
                onClick={() => navigate('/register')}
              >
                Đăng kí
              </button>
            </div>
          ) : (
             <div className="mt-1 pt-3 border-t border-gray-100 flex justify-end">
                <div 
                   className="flex items-center gap-1 text-red-500 font-medium cursor-pointer"
                   onClick={handleLogout}
                >
                   <Icon icon="zi-leave" size={18} />
                   <Text>Đăng xuất</Text>
                </div>
             </div>
          )}

        </div>
      </div>

      {/* Activity Section */}
      <div className="px-4 mb-6">
        <Text.Title className="text-green-700 font-bold mb-2 ml-1">Hoạt động</Text.Title>
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
           <MenuItem 
             icon="zi-calendar" 
             title="Danh sách lịch đã đặt" 
             onClick={() => navigate('/notifications')} 
           />
        </div>
      </div>

      {/* System Section */}
      <div className="px-4 mb-6">
        <Text.Title className="text-green-700 font-bold mb-2 ml-1">Hệ thống</Text.Title>
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
           <MenuItem 
             icon="zi-info-circle" 
             title="Thông tin phiên bản: 2.8.5" 
             onClick={() => openSnackbar({ text: "Phiên bản hiện tại là mới nhất", type: "info" })}
           />
           <MenuItem 
             icon="zi-shield-solid" 
             title="Điều khoản và chính sách" 
             onClick={() => openSnackbar({ text: "Chức năng đang phát triển", type: "info" })}
           />
           <MenuItem 
             icon="zi-star" 
             title="Ứng dụng có gì mới" 
             isNew
             onClick={() => openSnackbar({ text: "Chưa có cập nhật mới", type: "info" })}
           />
           <MenuItem 
             icon="zi-globe" 
             title="Ngôn ngữ - Tiếng Việt" 
             onClick={() => openSnackbar({ text: "Chỉ hỗ trợ Tiếng Việt", type: "info" })}
           />
        </div>
      </div>

    </Page>
  );
};

export default UserProfilePage;
