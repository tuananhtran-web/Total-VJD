import React, { useMemo, useState } from "react";
import { Page, Header, Box, Text, Button, Icon, useNavigate, useLocation, Input, Modal } from "zmp-ui";

interface BookingSummaryState {
  clubName: string;
  date: Date | string;
  slots: { id: string; court: string; time: string; price: number }[];
  mode: string;
  total: number;
  services?: Record<number, number>;
}

const SERVICES_LIST = [
  { id: 1, name: "Monster (Lon)", price: 30000 },
  { id: 2, name: "Nước suối (Chai)", price: 10000 },
  { id: 3, name: "Nước suối lớn (Chai)", price: 20000 },
  { id: 4, name: "Pocari (chai)", price: 20000 },
  { id: 5, name: "Pocari Lớn (chai)", price: 35000 },
  { id: 6, name: "Thuê vợt", price: 50000 },
];

const BookingSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as any) || {};
  const bookingState = state.summary ? state.summary : state; // Handle nested or flat state

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  if (!bookingState || !bookingState.slots) {
    return <Page><Text>Không có thông tin đặt lịch</Text></Page>;
  }

  const { clubName, date, slots, mode, total: slotTotal, services } = bookingState;

  // Format date
  const displayDate = typeof date === 'string' ? date : new Date(date).toLocaleDateString('vi-VN');

  // Calculate service total
  const serviceTotal = useMemo(() => {
    if (!services) return 0;
    return Object.entries(services).reduce((sum, [id, qty]) => {
      const item = SERVICES_LIST.find(s => s.id === Number(id));
      return sum + (item ? item.price * (qty as number) : 0);
    }, 0);
  }, [services]);

  const grandTotal = slotTotal + serviceTotal;

  const title =
    mode === "daily"
      ? "Đặt lịch theo ngày"
      : mode === "fixed"
      ? "Đặt lịch cố định"
      : mode === "visual"
      ? "Đặt lịch ngày trực quan"
      : "Đặt lịch sự kiện";

  const handlePaymentSelect = (method: 'cash' | 'transfer') => {
    setShowPaymentModal(false);
    navigate("/payment", {
      state: {
        booking: bookingState,
        paymentMethod: method,
        grandTotal,
        userInfo: { name: userName, phone: userPhone }
      }
    });
  };

  return (
    <Page className="bg-[#15225a] min-h-full pb-32">
      <Header title={title} className="bg-[#15225a] text-white" textColor="white" />

      <Box className="p-4 space-y-4">
        {/* Club Info */}
        <div className="bg-[#1a2b70] rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Icon icon="zi-location" className="text-[#d32829]" />
            <Text className="font-bold text-[#d32829]">Thông tin sân</Text>
          </div>
          <Text className="font-medium mb-1">Tên CLB: {clubName}</Text>
          <Text size="xSmall" className="opacity-80">
            Địa chỉ: Số 16, ngách 4A/4, Đặng Văn Ngữ, Đống Đa, Hà Nội
          </Text>
        </div>

        {/* Booking Info */}
        <div className="bg-[#1a2b70] rounded-2xl p-4 text-white space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Icon icon="zi-calendar" className="text-[#d32829]" />
            <Text className="font-bold text-[#d32829]">Thông tin lịch đặt</Text>
          </div>
          <Text className="text-sm">Ngày: {displayDate}</Text>
          
          <div className="space-y-1">
            {slots.map((slot: any, index: number) => (
              <div key={index} className="text-sm text-yellow-100">
                - {slot.court}: {slot.time} | {slot.price.toLocaleString("vi-VN")} đ
              </div>
            ))}
          </div>

          <div className="mt-2 text-sm pt-2 border-t border-white/10">
            <Text>Đối tượng: Bảng giá theo ngày-tháng sân 1 & 3</Text>
            <Text className="mt-1">
              Tổng giờ: <span className="font-bold">{slots.length}h00</span>
            </Text>
            <Text className="mt-1">
              Tổng tiền: <span className="font-bold">{slotTotal.toLocaleString("vi-VN")} đ</span>
            </Text>
          </div>
          
          {/* Services Display */}
          {services && Object.keys(services).length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/10">
               <Text className="font-bold text-yellow-400 mb-1">Dịch vụ đã chọn:</Text>
               {Object.entries(services).map(([id, qty]) => {
                 const item = SERVICES_LIST.find(s => s.id === Number(id));
                 if (!item) return null;
                 return (
                   <div key={id} className="flex justify-between text-sm text-yellow-100">
                     <span>{item.name} (x{qty})</span>
                     <span>{(item.price * (qty as number)).toLocaleString('vi-VN')} đ</span>
                   </div>
                 );
               })}
            </div>
          )}
        </div>

        {/* Add Service Button */}
        <Button 
          variant="secondary" 
          fullWidth 
          className="border border-white/30 bg-transparent text-white hover:bg-white/10"
          onClick={() => navigate("/booking/services", { state: bookingState })}
        >
          Thêm dịch vụ
        </Button>

        {/* User Inputs */}
        <div className="space-y-3">
          <div>
            <Text className="font-bold text-white mb-1 uppercase text-sm">TÊN CỦA BẠN</Text>
            <Input 
              placeholder="Nhập tên của bạn" 
              className="bg-white rounded-lg border-none"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          
          <div>
            <Text className="font-bold text-white mb-1 uppercase text-sm">SỐ ĐIỆN THOẠI</Text>
            <div className="flex bg-white rounded-lg overflow-hidden">
               <div className="flex items-center px-3 bg-gray-100 border-r">
                 <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[8px] mr-1">★</div>
                 <span className="text-sm font-bold">+ 84</span>
                 <Icon icon="zi-chevron-down" size={12} className="ml-1" />
               </div>
               <input 
                 className="flex-1 p-3 outline-none text-sm"
                 placeholder="Nhập số điện thoại"
                 type="tel"
                 value={userPhone}
                 onChange={(e) => setUserPhone(e.target.value)}
               />
            </div>
          </div>
          
          <div>
            <Text className="font-bold text-white mb-1 uppercase text-sm">GHI CHÚ CHO CHỦ SÂN</Text>
            <Input.TextArea 
              placeholder="Nhập ghi chú" 
              className="bg-white rounded-lg border-none"
              rows={3}
            />
          </div>
        </div>
      </Box>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#1a2b70] z-50">
        <Button 
          fullWidth 
          className="bg-[#d32829] text-white font-bold rounded-lg h-12 text-lg shadow-lg"
          onClick={() => setShowPaymentModal(true)}
        >
          XÁC NHẬN & THANH TOÁN
        </Button>
      </div>

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        title="Chọn phương thức thanh toán"
        onClose={() => setShowPaymentModal(false)}
        actions={[]}
      >
        <div className="p-4 space-y-3">
          <div 
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white shadow-sm active:bg-gray-50 cursor-pointer"
            onClick={() => handlePaymentSelect('transfer')}
          >
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#283b91]">
                <Icon icon="zi-poll" />
             </div>
             <div>
                <Text className="font-bold text-[#283b91]">Chuyển khoản ngân hàng</Text>
                <Text size="xSmall" className="text-gray-500">Quét mã QR để thanh toán nhanh</Text>
             </div>
             <Icon icon="zi-chevron-right" className="ml-auto text-gray-400" />
          </div>

          <div 
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white shadow-sm active:bg-gray-50 cursor-pointer"
            onClick={() => handlePaymentSelect('cash')}
          >
             <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Icon icon="zi-user-solid" />
             </div>
             <div>
                <Text className="font-bold text-green-700">Thanh toán tại quầy</Text>
                <Text size="xSmall" className="text-gray-500">Thanh toán bằng tiền mặt khi đến sân</Text>
             </div>
             <Icon icon="zi-chevron-right" className="ml-auto text-gray-400" />
          </div>
        </div>
      </Modal>
    </Page>
  );
};

export default BookingSummaryPage;
