import React, { useState } from "react";
import { BottomNavigation, Icon, useNavigate } from "zmp-ui";
import { useLocation } from "react-router-dom";

export const AppBottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("home");
  const isAdmin = location.pathname.includes('/admin');

  // Map path to active tab
  React.useEffect(() => {
    if (isAdmin) {
       if (location.pathname.includes('/dashboard')) setActiveTab('dashboard');
       else if (location.pathname.includes('/booking-manager')) setActiveTab('bookings');
       else if (location.pathname.includes('/facility-manager')) setActiveTab('facilities');
       else if (location.pathname.includes('/user-list')) setActiveTab('users');
       else setActiveTab('dashboard');
    } else {
       if (location.pathname === '/') setActiveTab('home');
       else if (location.pathname.includes('/map')) setActiveTab('map');
       else if (location.pathname.includes('/discovery')) setActiveTab('discovery');
       else if (location.pathname.includes('/featured')) setActiveTab('featured');
       else if (location.pathname.includes('/profile') || location.pathname.includes('/user')) setActiveTab('profile');
    }
  }, [location.pathname, isAdmin]);

  if (isAdmin) {
    return (
      <BottomNavigation
        fixed
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          switch (key) {
            case "dashboard":
              navigate("/pages/admin/dashboard");
              break;
            case "bookings":
              navigate("/pages/admin/booking-manager");
              break;
            case "facilities":
              navigate("/pages/admin/facility-manager");
              break;
            case "users":
              navigate("/pages/admin/user-list");
              break;
          }
        }}
        className="z-50 pb-safe-bottom bg-white border-t border-gray-200"
      >
        <BottomNavigation.Item
          key="dashboard"
          label="Tổng quan"
          icon={<Icon icon="zi-home" />}
          activeIcon={<Icon icon="zi-home" className="text-[#006442]" />}
        />
        <BottomNavigation.Item
          key="bookings"
          label="Đặt sân"
          icon={<Icon icon="zi-calendar" />}
          activeIcon={<Icon icon="zi-calendar" className="text-[#006442]" />}
        />
        <BottomNavigation.Item
          key="facilities"
          label="Câu lạc bộ"
          icon={<Icon icon="zi-location" />}
          activeIcon={<Icon icon="zi-location" className="text-[#006442]" />}
        />
        <BottomNavigation.Item
          key="users"
          label="Người dùng"
          icon={<Icon icon="zi-user-group" />}
          activeIcon={<Icon icon="zi-user-group" className="text-[#006442]" />}
        />
      </BottomNavigation>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-0 pointer-events-none">
      {/* Thanh dưới nền trắng trong suốt 60% */}
      <div className="mx-0 bg-white/60 backdrop-blur-md pointer-events-auto border-t border-gray-200">
        <BottomNavigation
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            switch (key) {
              case "home":
                navigate("/");
                break;
              case "map":
                navigate("/pages/community-court/index");
                break;
              case "discovery":
                navigate("/pages/discovery");
                break;
              case "featured":
                navigate("/pages/featured");
                break;
              case "profile":
                navigate("/pages/user/profile");
                break;
            }
          }}
          className="bg-transparent border-0 text-gray-500"
        >
          <BottomNavigation.Item
            key="home"
            label={
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className={`text-[11px] ${
                    activeTab === "home" ? "text-[#00796B]" : "text-gray-600"
                  }`}
                >
                  Map
                </span>
                {activeTab === "home" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
                )}
              </div>
            }
            icon={
              <Icon
                icon="zi-location"
                className={`text-xl ${
                  activeTab === "home" ? "text-[#00C853]" : "text-gray-500"
                }`}
              />
            }
            activeIcon={
              <Icon icon="zi-location" className="text-xl text-[#00C853]" />
            }
          />
          <BottomNavigation.Item
            key="map"
            label={
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className={`text-[11px] ${
                    activeTab === "map" ? "text-[#00796B]" : "text-gray-600"
                  }`}
                >
                  Community
                </span>
                {activeTab === "map" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
                )}
              </div>
            }
            icon={
              <Icon
                icon="zi-trophy"
                className={`text-xl ${
                  activeTab === "map" ? "text-[#00C853]" : "text-gray-500"
                }`}
              />
            }
            activeIcon={
              <Icon icon="zi-trophy" className="text-xl text-[#00C853]" />
            }
          />
          <BottomNavigation.Item
            key="featured"
            label={
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className={`text-[11px] ${
                    activeTab === "featured" ? "text-[#00796B]" : "text-gray-600"
                  }`}
                >
                  Nổi bật
                </span>
                {activeTab === "featured" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
                )}
              </div>
            }
            icon={
              <Icon
                icon="zi-play-circle"
                className={`text-xl ${
                  activeTab === "featured" ? "text-[#00C853]" : "text-gray-500"
                }`}
              />
            }
            activeIcon={
              <Icon icon="zi-play-circle" className="text-xl text-[#00C853]" />
            }
          />
          <BottomNavigation.Item
            key="profile"
            label={
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className={`text-[11px] ${
                    activeTab === "profile" ? "text-[#00796B]" : "text-gray-600"
                  }`}
                >
                  Tài khoản
                </span>
                {activeTab === "profile" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
                )}
              </div>
            }
            icon={
              <Icon
                icon="zi-user"
                className={`text-xl ${
                  activeTab === "profile" ? "text-[#00C853]" : "text-gray-500"
                }`}
              />
            }
            activeIcon={
              <Icon icon="zi-user" className="text-xl text-[#00C853]" />
            }
          />
        </BottomNavigation>
      </div>

      {/* Thanh home indicator xám như ảnh */}
      <div className="flex justify-center pb-1">
        <div className="w-24 h-1.5 rounded-full bg-gray-500" />
      </div>
    </div>
  );
};
