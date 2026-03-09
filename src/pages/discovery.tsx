import React from "react";
import { Page, Text, Icon, Button, Box, useNavigate } from "zmp-ui";

const DiscoveryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page className="bg-[#F4F7FA] pb-24">
      <Box className="px-4 pt-3">
        {/* Nút tạo phòng mới */}
        <Button
          fullWidth
          size="large"
          className="bg-[#0B7A4B] text-white rounded-2xl h-12 flex items-center justify-center gap-2 shadow-md"
          onClick={() => navigate("/pages/community/create-room")}
        >
          <Icon icon="zi-plus-circle" className="text-lg" />
          <span className="font-semibold text-sm">Tạo phòng mới</span>
        </Button>

        {/* Danh sách phòng */}
        <Box className="mt-4 space-y-4">
          {/* Room 1 */}
          <Box className="bg-white rounded-3xl p-4 shadow-sm">
            <Box className="flex items-center justify-between mb-2">
              <Text className="font-semibold text-base">Phòng chơi 1</Text>
              <span className="px-3 py-1 rounded-full bg-[#EAF3FF] text-[10px] font-semibold text-[#3B82F6] uppercase">
                Pickleball
              </span>
            </Box>

            <Box className="flex items-center text-xs text-gray-600 mb-2 gap-1">
              <Icon icon="zi-user" className="text-[#0B7A4B]" />
              <span>2/4 thành viên</span>
            </Box>

            <Button
              size="small"
              className="mt-2 bg-[#0B7A4B] text-white rounded-xl px-4 h-9 text-sm font-semibold"
              onClick={() => navigate("/pages/community/room/1")}
            >
              Quản lý
            </Button>
          </Box>

          {/* Room 2 */}
          <Box className="bg-white rounded-3xl p-4 shadow-sm">
            <Box className="flex items-center justify-between mb-2">
              <Text className="font-semibold text-base">Phòng chơi 2</Text>
              <span className="px-3 py-1 rounded-full bg-[#E8FFF3] text-[10px] font-semibold text-[#10B981] uppercase">
                Football
              </span>
            </Box>

            <Box className="flex items-center text-xs text-gray-600 mb-1 gap-1">
              <Icon icon="zi-user" className="text-[#0B7A4B]" />
              <span>2/4 thành viên</span>
            </Box>

            <Box className="flex items-center text-xs text-[#F97316] mb-2 gap-1">
              <Icon icon="zi-lock" />
              <span>Có mật khẩu</span>
            </Box>

            <Button
              size="small"
              className="mt-1 bg-[#0B7A4B] text-white rounded-xl px-4 h-9 text-sm font-semibold"
              onClick={() => navigate("/pages/community/room/2")}
            >
              Quản lý
            </Button>
          </Box>

          {/* Empty state ở cuối */}
          <Box className="mt-2 rounded-3xl border border-dashed border-gray-300 bg-white/60 py-6 flex flex-col items-center justify-center gap-2">
            <Icon icon="zi-search" className="text-gray-400 text-xl" />
            <Text className="text-xs text-gray-500">
              Đang tìm thêm sân chơi...
            </Text>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default DiscoveryPage;
