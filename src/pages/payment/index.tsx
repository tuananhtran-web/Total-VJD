import React, { useState, useRef } from "react";
import { Page, Header, Box, Text, Button, Icon, useNavigate, useLocation, useSnackbar } from "zmp-ui";
import { UserService } from "../../services/user-service";
import { BookingService } from "../../services/booking-service";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSnackbar } = useSnackbar();
  const state = (location.state as any) || {};
  const { booking, paymentMethod, grandTotal, userInfo } = state;

  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod || 'transfer');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!booking) {
    return (
      <Page>
        <Header title="Thanh toán" className="bg-[#283b91] text-white" textColor="white" />
        <Box className="p-4 flex items-center justify-center h-full">
          <Text>Không có thông tin thanh toán</Text>
        </Box>
      </Page>
    );
  }

  const bankInfo = {
    bankName: "Mbbank",
    accountName: "CONG TY TNHH DICH VU DU LICH HTP",
    accountNumber: "1981888883979",
  };

  const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankName}-${bankInfo.accountNumber}-compact.png?amount=${grandTotal || 0}&addInfo=${encodeURIComponent((userInfo?.name || 'Khach') + ' chuyen tien')}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    openSnackbar({
      text: "Đã sao chép vào bộ nhớ tạm",
      type: "success",
      duration: 2000,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
        // 1. Ensure user exists
        let userId = '';
        const phone = userInfo?.phone;
        const name = userInfo?.name || "Khách vãng lai";

        if (phone) {
            let user = await UserService.getUserByPhone(phone);
            if (!user) {
                // Create new user if not exists
                user = await UserService.register({
                    phoneNumber: phone,
                    displayName: name,
                    avatar: "",
                    isLocked: false,
                    package: { name: "Thành viên mới", expiryDate: 0, status: "pending" },
                    password: "123" // Default password
                } as any);
            }
            userId = user.id;
        } else {
            // Should prompt for phone if missing, but for now assume it's passed
            openSnackbar({ text: "Thiếu thông tin số điện thoại", type: "error" });
            setLoading(false);
            return;
        }

        // 2. Create Booking
        if (!booking.slots || booking.slots.length === 0) {
            openSnackbar({ text: "Không có thông tin slot đặt", type: "error" });
            setLoading(false);
            return;
        }

        const bookingData = {
            userId: userId,
            courtId: booking.slots[0].court || 'unknown', 
            date: typeof booking.date === 'string' ? booking.date : new Date(booking.date).toISOString().split('T')[0],
            slots: booking.slots.map((s: any) => s.time),
            type: booking.mode || 'daily',
            totalPrice: grandTotal,
            eventName: booking.mode === 'event' ? 'Đặt lịch sự kiện' : '',
            participants: 0
        };

        const result = await BookingService.createBooking(bookingData as any);
        
        if (result) {
            openSnackbar({
                text: "Đã xác nhận thanh toán và tạo lịch đặt thành công!",
                type: "success",
                duration: 3000,
            });
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } else {
            throw new Error("Không thể tạo lịch đặt");
        }

    } catch (error) {
        console.error(error);
        openSnackbar({ text: "Có lỗi xảy ra khi tạo đơn", type: "error" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Page className="bg-gray-100 min-h-full pb-24">
      <Header title="Thanh toán" className="bg-[#283b91] text-white" textColor="white" />
      
      <div className="p-4 space-y-4">
        {/* Booking Info Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Text.Title size="small">Thông tin lịch đặt</Text.Title>
            <Icon icon={isExpanded ? "zi-chevron-up" : "zi-chevron-down"} />
          </div>
          
          {isExpanded && (
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Icon icon="zi-user" className="text-green-600" size={16} />
                </div>
                <div>
                  <Text size="xSmall" className="text-gray-500">Tên</Text>
                  <Text className="font-medium">{userInfo?.name || "Khách hàng"}</Text>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Icon icon="zi-call" className="text-green-600" size={16} />
                </div>
                <div>
                  <Text size="xSmall" className="text-gray-500">SĐT</Text>
                  <Text className="font-medium">{userInfo?.phone || "Chưa cung cấp"}</Text>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Icon icon="zi-note" className="text-green-600" size={16} />
                </div>
                <div>
                   <Text size="xSmall" className="text-gray-500">Mã đơn</Text>
                   <Text className="font-bold">#5457</Text>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Icon icon="zi-calendar" className="text-green-600" size={16} />
                </div>
                <div>
                  <Text size="xSmall" className="text-gray-500">Chi tiết đơn</Text>
                  <Text className="font-medium">{new Date().toLocaleDateString('vi-VN')}</Text>
                  <Text size="small" className="text-gray-600">
                    {booking.mode === 'visual' ? `Đặt trực quan - ${booking.clubName}` : `Đặt theo ngày - ${booking.clubName}`}
                  </Text>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Icon icon="zi-dollar" className="text-green-600" size={16} />
                </div>
                <div>
                  <Text size="xSmall" className="text-gray-500">Tổng đơn</Text>
                  <Text className="font-bold">{grandTotal?.toLocaleString('vi-VN')} đ</Text>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                   <Icon icon="zi-wallet" className="text-green-600" size={16} />
                </div>
                <div>
                   <Text size="xSmall" className="text-gray-500">Cần thanh toán</Text>
                   <Text className="font-bold text-[#283b91]">{grandTotal?.toLocaleString('vi-VN')} đ</Text>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <Text.Title size="small" className="mb-3">Phương thức thanh toán</Text.Title>
          <div className="grid grid-cols-2 gap-3">
            <div 
              className={`
                p-3 rounded-lg border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                ${selectedMethod === 'transfer' 
                  ? 'border-[#283b91] bg-blue-50 text-[#283b91]' 
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'}
              `}
              onClick={() => setSelectedMethod('transfer')}
            >
              <Icon icon="zi-poll" className={selectedMethod === 'transfer' ? 'text-[#283b91]' : 'text-gray-400'} />
              <Text className="font-medium text-sm">Chuyển khoản</Text>
            </div>
            
            <div 
              className={`
                p-3 rounded-lg border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                ${selectedMethod === 'cash' 
                  ? 'border-green-600 bg-green-50 text-green-600' 
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'}
              `}
              onClick={() => setSelectedMethod('cash')}
            >
              <Icon icon="zi-user-solid" className={selectedMethod === 'cash' ? 'text-green-600' : 'text-gray-400'} />
              <Text className="font-medium text-sm">Tiền mặt</Text>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        {selectedMethod === 'transfer' ? (
            <div className="bg-white rounded-xl shadow-sm p-4">
                <Text.Title size="small" className="mb-3">1. Tài khoản ngân hàng</Text.Title>
                <div className="flex gap-2">
                    <div className="flex-1 space-y-2">
                        <div>
                            <Text size="xSmall" className="text-gray-500">Tên tài khoản:</Text>
                            <Text className="font-bold uppercase text-sm">{bankInfo.accountName}</Text>
                        </div>
                        <div>
                            <Text size="xSmall" className="text-gray-500">Số tài khoản:</Text>
                            <div className="flex items-center gap-2">
                                <Text className="font-bold text-lg text-[#283b91]">{bankInfo.accountNumber}</Text>
                                <Icon 
                                    icon="zi-copy" 
                                    className="text-gray-400 cursor-pointer" 
                                    onClick={() => handleCopy(bankInfo.accountNumber)}
                                />
                            </div>
                        </div>
                        <div>
                            <Text size="xSmall" className="text-gray-500">Ngân hàng:</Text>
                            <Text className="font-bold">{bankInfo.bankName}</Text>
                        </div>
                        <div>
                            <Text size="xSmall" className="text-gray-500">Nội dung:</Text>
                            <div className="flex items-center gap-2">
                                <Text className="font-bold text-sm text-[#283b91]">{(userInfo?.name || 'Khach') + ' chuyen tien'}</Text>
                                <Icon 
                                    icon="zi-copy" 
                                    className="text-gray-400 cursor-pointer" 
                                    onClick={() => handleCopy((userInfo?.name || 'Khach') + ' chuyen tien')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-32 shrink-0">
                        <img 
                            src={qrUrl} 
                            alt="VietQR" 
                            className="w-full h-auto rounded-lg border border-gray-200"
                        />
                    </div>
                </div>
            </div>
        ) : (
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Icon icon="zi-check" className="text-green-600 text-3xl" />
                 </div>
                 <Text.Title className="text-green-600 mb-2">Thanh toán tại quầy</Text.Title>
                 <Text className="text-gray-600 text-sm">
                    Vui lòng thanh toán <b>{grandTotal?.toLocaleString('vi-VN')} đ</b> tại quầy thu ngân khi đến nhận sân.
                 </Text>
            </div>
        )}

        {/* Warning/Instruction Box */}
        {selectedMethod === 'transfer' && (
            <div className="bg-[#2e7d32] text-white p-4 rounded-xl flex items-start gap-3 shadow-sm">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-black font-bold">!</div>
                <Text size="small" className="flex-1 font-medium leading-5">
                    Vui lòng chuyển khoản <span className="text-[#FFC107] font-bold">{grandTotal?.toLocaleString('vi-VN')} đ</span> và gửi ảnh vào ô bên dưới để hoàn tất đặt lịch!
                </Text>
            </div>
        )}

        {/* Upload Proof Section - NEW */}
        {selectedMethod === 'transfer' && (
            <div className="bg-white rounded-xl shadow-sm p-4">
                <Text.Title size="small" className="mb-3">2. Xác thực chuyển khoản</Text.Title>
                <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-gray-50/50"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {proofImage ? (
                        <div className="relative w-full">
                            <img src={proofImage} alt="Proof" className="w-full h-48 object-contain rounded-lg" />
                            <div 
                                className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 shadow-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setProofImage(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                            >
                                <Icon icon="zi-close" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#283b91] mb-2">
                                <Icon icon="zi-photo" size={24} />
                            </div>
                            <Text className="font-medium text-[#283b91]">Tải ảnh xác thực</Text>
                            <Text size="xSmall" className="text-gray-400">Chạm để tải ảnh</Text>
                        </>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            </div>
        )}

        {/* Info Note */}
        <div className="bg-[#e8f5e9] p-4 rounded-xl text-center border border-green-100">
            <Text size="small" className="text-gray-800 font-medium mb-3">
                Sau khi gửi ảnh, vui lòng kiểm tra trạng thái lịch đặt tại tab "Tài khoản" tới khi chủ sân xác nhận đơn.
            </Text>
            <Text size="small" className="text-gray-600 font-medium">
                Đơn của bạn còn được giữ chỗ trong
            </Text>
        </div>
      </div>

      {/* Footer Action */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white border-t z-50">
        <Button 
            fullWidth 
            className="bg-gradient-to-r from-[#b8870b] to-[#d4af37] text-white font-bold rounded-lg h-12 text-lg shadow-md border-none uppercase"
            onClick={handleConfirm}
            loading={loading}
        >
            XÁC NHẬN ĐẶT
        </Button>
      </div>
    </Page>
  );
};

export default PaymentPage;