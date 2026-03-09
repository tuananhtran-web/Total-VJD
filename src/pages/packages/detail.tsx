import React, { useState } from "react";
import { Page, Header, Box, Text, Button, Icon, Input, useSnackbar } from "zmp-ui";
import { useLocation, useNavigate } from "react-router-dom";
import { Package } from "../../services/package-service";

const UserPackageDetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const pkg = (location.state as any)?.pkg as Package | undefined;
  const [voucherCode, setVoucherCode] = useState("");

  if (!pkg) {
    return <Page className="flex justify-center items-center">Gói tập không tồn tại</Page>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleApplyVoucher = () => {
    if (voucherCode.trim().toUpperCase() === "DISCOUNT50") {
      openSnackbar({ text: "Áp dụng voucher thành công!", type: "success" });
    } else {
      openSnackbar({ text: "Mã voucher không hợp lệ", type: "error" });
    }
  };

  return (
    <Page className="bg-white pb-24">
      <Header title="Chi tiết gói tập" />

      {/* Banner & Image Section */}
      <div className="relative">
        {pkg.banner ? (
           <div 
             className="w-full h-48 bg-cover bg-center"
             style={{ backgroundImage: `url(${pkg.banner})` }}
           />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
            No Banner
          </div>
        )}
        
        {/* Overlay Image (Thumbnail) */}
        <div className="absolute -bottom-10 left-4 border-4 border-white rounded-lg shadow-md">
           <img src={pkg.image} alt={pkg.name} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
        </div>
      </div>

      <Box className="mt-12 px-4">
        <div className="flex justify-between items-start">
           <div>
             <Text.Title size="large" className="font-bold mb-1">{pkg.name}</Text.Title>
             <div className="flex items-center gap-2">
               <Icon icon="zi-clock-1" size={16} className="text-blue-500" />
               <Text className="text-blue-600 font-medium">{pkg.durationMonths} Tháng</Text>
             </div>
           </div>
           {pkg.saleBadge && (
             <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold text-xs">
               -{pkg.saleBadge}
             </div>
           )}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
           <Text className="text-gray-500 text-sm line-through mb-1">Giá gốc: {formatCurrency(pkg.originalPrice)}</Text>
           <Text.Title className="text-primary text-2xl font-bold">{formatCurrency(pkg.currentPrice)}</Text.Title>
        </div>

        <div className="mt-6">
          <Text.Title size="small" className="font-bold mb-2">Mô tả gói tập</Text.Title>
          <Text className="text-gray-600 leading-relaxed">
            {pkg.description || "Gói tập bao gồm quyền lợi sử dụng toàn bộ trang thiết bị hiện đại, tham gia các lớp GroupX không giới hạn và được hướng dẫn bởi đội ngũ HLV chuyên nghiệp."}
          </Text>
        </div>

        {/* Voucher Section */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <Text.Title size="small" className="font-bold mb-3 flex items-center gap-2">
            <Icon icon="zi-ticket" /> Voucher khuyến mãi
          </Text.Title>
          <div className="flex gap-2">
            <Input 
              placeholder="Nhập mã giảm giá" 
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
            />
            <Button 
              size="medium" 
              variant="secondary"
              onClick={handleApplyVoucher}
            >
              Áp dụng
            </Button>
          </div>
        </div>
      </Box>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Button fullWidth size="large" className="font-bold text-lg">
          Đăng ký ngay
        </Button>
      </div>
    </Page>
  );
};

export default UserPackageDetailPage;
