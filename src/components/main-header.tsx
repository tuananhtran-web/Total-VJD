import React from "react";
import { Box, Text, Button, Icon, useNavigate } from "zmp-ui";
import { useLocation } from "react-router-dom";

export const MainHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ẩn header trên các trang admin
  if (location.pathname.includes("/admin")) {
    return null;
  }

  const isHome = location.pathname === "/";
  const isMap = location.pathname.includes("/map");
  const isDiscovery = location.pathname.includes("/discovery");
  const isFeatured = location.pathname.includes("/featured");
  const isProfile =
    location.pathname.includes("/profile") || location.pathname.includes("/user");
  const isBooking = location.pathname.includes("/booking");

  const topHomeActive = isHome || isDiscovery || isFeatured || isMap || isProfile;

  return (
    <Box className="bg-[#050910] text-white pt-4 pb-3 px-4 sticky top-0 z-40">
      {/* Dòng trên cùng: logo + nút Trang chủ / Đăng nhập */}
      <Box className="flex items-center justify-between mb-2">
        <Box>
          <Text className="text-[11px] text-white/70 leading-tight">Total Club</Text>
          <Text className="text-2xl font-semibold leading-tight tracking-wide">
            VJD
          </Text>
        </Box>

        <Box className="flex items-center gap-2">
          <Button
            size="small"
            className={`rounded-full px-4 py-1 text-xs font-semibold shadow-md ${
              topHomeActive
                ? "bg-[#0BA36C] text-white"
                : "bg-transparent border border-white/40 text-white"
            }`}
            onClick={() => navigate("/")}
          >
            Trang chủ
          </Button>
          <Button
            size="small"
            variant="secondary"
            className="bg-transparent border border-white/40 text-white rounded-full px-4 py-1 text-xs font-semibold"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </Button>
        </Box>
      </Box>

      {/* Dòng tab FEED VIDEO / CỘNG ĐỒNG / BOOKING */}
      <Box className="flex items-center justify-between text-[11px] uppercase tracking-wide text-white/70 border-t border-white/10 pt-2">
        <Box
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Icon icon="zi-video" className="text-xs" />
          <Text
            className={`text-[11px] font-medium ${
              !isBooking ? "text-white" : "text-white/70"
            }`}
          >
            Feed video
          </Text>
        </Box>
        <Box
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => navigate("/pages/discovery")}
        >
          <Icon icon="zi-user-group" className="text-xs" />
          <Text
            className={`text-[11px] font-medium ${
              isDiscovery ? "text-white" : "text-white/70"
            }`}
          >
            Cộng đồng
          </Text>
        </Box>
        <Box
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => navigate("/booking")}
        >
          <Icon icon="zi-calendar" className="text-xs" />
          <Text
            className={`text-[11px] font-medium ${
              isBooking ? "text-white" : "text-white/70"
            }`}
          >
            Booking
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

