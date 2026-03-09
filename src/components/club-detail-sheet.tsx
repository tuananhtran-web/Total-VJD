import React, { useState, useEffect } from 'react';
import { Sheet, Text, Button, Icon, useSnackbar, Modal } from 'zmp-ui';
import { Club } from '../mock/data';
import { useNavigate } from "react-router-dom";

interface ClubDetailSheetProps {
  club: Club | null;
  visible: boolean;
  onClose: () => void;
}

export const ClubDetailSheet: React.FC<ClubDetailSheetProps> = ({ club, visible, onClose }) => {
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('booking');
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedCourts, setSelectedCourts] = useState<number[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBookingType, setShowBookingType] = useState(false);

  // Reset state when club changes or sheet opens
  useEffect(() => {
    if (visible) {
      setSelectedDateIndex(0);
      setSelectedCourts([]);
      setActiveTab('booking');
    }
  }, [visible, club]);

  if (!club) return null;

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const toggleCourt = (id: number) => {
    if (selectedCourts.includes(id)) {
      setSelectedCourts(selectedCourts.filter(c => c !== id));
    } else {
      setSelectedCourts([...selectedCourts, id]);
    }
  };

  const calculateTotal = () => {
    // Parse price range or use default. E.g. "50.000đ - 100.000đ/giờ" -> take 50000
    // For demo, let's assume a fixed price of 50,000 VND per slot
    const pricePerSlot = 50000;
    return selectedCourts.length * pricePerSlot;
  };

  const handleBooking = () => {
    setShowBookingType(true);
  };

  const handleAction = (action: string) => {
    openSnackbar({
        text: `Đã thực hiện: ${action}`,
        type: "info",
        duration: 2000
    });
  }

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      mask
      handler
      swipeToClose
      height="85%"
      title={club.name}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 w-full flex-shrink-0">
          <img 
            src={club.image} 
            alt={club.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
             <div 
               className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
               onClick={() => handleAction("Yêu thích")}
             >
               <Icon icon="zi-heart" className="text-[#d32829]" />
             </div>
             <div 
               className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
               onClick={() => handleAction("Chia sẻ")}
             >
               <Icon icon="zi-share" />
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
           <div className="bg-white p-4 mb-2">
              <div className="flex justify-between items-start mb-2">
                 <div>
                    <Text.Title className="font-bold text-lg">{club.name}</Text.Title>
                    <div 
                        className="flex items-center text-gray-500 mt-1 cursor-pointer"
                        onClick={() => handleAction("Xem bản đồ")}
                    >
                       <Icon icon="zi-location" size={16} className="mr-1 text-red-500" />
                       <Text size="small" className="line-clamp-1">{club.address}</Text>
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                       <Icon icon="zi-star-solid" className="text-yellow-500" size={14} />
                       <Text className="font-bold text-yellow-700 text-xs">{club.rating}</Text>
                    </div>
                 </div>
              </div>
              
              <div className="flex gap-4 mt-4 border-t pt-4">
                 <div className="flex-1 text-center border-r">
                    <Text size="xSmall" className="text-gray-500">Khoảng cách</Text>
                    <Text className="font-bold text-[#283b91]">{club.distance}</Text>
                 </div>
                 <div className="flex-1 text-center border-r">
                    <Text size="xSmall" className="text-gray-500">Giờ mở cửa</Text>
                    <Text className="font-bold text-[#283b91]">{club.openTime}</Text>
                 </div>
                 <div className="flex-1 text-center">
                    <Text size="xSmall" className="text-gray-500">Giá tham khảo</Text>
                    <Text className="font-bold text-[#283b91]">{club.priceRange ? club.priceRange.split('-')[0] : 'Liên hệ'}</Text>
                 </div>
              </div>
           </div>

           {/* Tabs for Booking and Info */}
           <div className="bg-white mt-2">
              <div className="flex border-b sticky top-0 bg-white z-10">
                {[
                  { id: "booking", label: "Thông tin sân" },
                  { id: "services", label: "Dịch vụ" },
                  { id: "photos", label: "Hình ảnh" },
                  { id: "rules", label: "Điều khoản" },
                  { id: "reviews", label: "Đánh giá" },
                ].map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex-1 py-3 text-center font-bold text-[11px] cursor-pointer transition-colors ${
                      activeTab === tab.id
                        ? "text-[#283b91] border-b-2 border-[#283b91]"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>

              <div className="p-4">
                 {/* Info Tab - Simplified */}
                 {activeTab === 'booking' ? (
                    <div className="space-y-4">
                       <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <Text.Title size="small" className="mb-2 text-[#283b91]">Giới thiệu sân</Text.Title>
                          <Text size="small" className="text-gray-600 mb-2">
                            {club.name} là một trong những sân cầu lông hiện đại và tiện nghi nhất tại khu vực. 
                            Chúng tôi cung cấp hệ thống sân thảm tiêu chuẩn thi đấu, hệ thống chiếu sáng chống lóa và không gian thoáng mát.
                          </Text>
                          <div className="space-y-1 mt-3">
                             <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Icon icon="zi-check-circle" className="text-green-500" size={16} />
                                <span>Thảm sân tiêu chuẩn BWF</span>
                             </div>
                             <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Icon icon="zi-check-circle" className="text-green-500" size={16} />
                                <span>Hệ thống đèn LED chống lóa</span>
                             </div>
                             <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Icon icon="zi-check-circle" className="text-green-500" size={16} />
                                <span>Khu vực chờ rộng rãi, thoáng mát</span>
                             </div>
                             <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Icon icon="zi-check-circle" className="text-green-500" size={16} />
                                <span>Có quầy nước giải khát và dịch vụ thuê vợt</span>
                             </div>
                          </div>
                       </div>

                       <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                          <Text.Title size="small" className="mb-2 text-yellow-700">Lưu ý từ chủ sân</Text.Title>
                          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                             <li>Vui lòng mang giày đế cao su chuyên dụng để bảo vệ mặt sân.</li>
                             <li>Không mang thức ăn vào khu vực sân đấu.</li>
                             <li>Giữ gìn vệ sinh chung và tài sản của câu lạc bộ.</li>
                             <li>Vui lòng đến trước giờ đặt 10 phút để làm thủ tục nhận sân.</li>
                          </ul>
                       </div>
                    </div>
                 ) : activeTab === "services" ? (
                  <div className="space-y-4">
                    <div>
                      <Text.Title size="small" className="mb-2">Tiện ích</Text.Title>
                      <div className="flex flex-wrap gap-2">
                        {club.services && club.services.length > 0 ? (
                          club.services.map((service, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200"
                            >
                              {service}
                            </span>
                          ))
                        ) : (
                          <Text className="text-gray-500 italic">Đang cập nhật...</Text>
                        )}
                      </div>
                    </div>
                    <div>
                      <Text.Title size="small" className="mb-2">Liên hệ</Text.Title>
                      <Button size="small" variant="secondary" onClick={() => handleAction("Gọi điện")}>
                        Gọi ngay
                      </Button>
                    </div>
                  </div>
                ) : activeTab === "photos" ? (
                  <div className="space-y-4">
                    <Text.Title size="small" className="mb-2">Hình ảnh</Text.Title>
                    {club.images && club.images.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {club.images.map((img, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden border border-gray-200">
                            <img src={img} alt={`Hình ${idx + 1}`} className="w-full h-24 object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Text className="text-gray-500 italic">Chưa có hình ảnh.</Text>
                    )}
                  </div>
                ) : activeTab === "rules" ? (
                  <div className="space-y-3">
                    <Text.Title size="small" className="mb-2">Điều khoản & quy định</Text.Title>
                    {club.rules && club.rules.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {club.rules.map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                    ) : (
                      <Text className="text-gray-500 italic">Chưa có điều khoản cụ thể.</Text>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Text.Title size="small" className="mb-2">Đánh giá</Text.Title>
                    {club.reviews && club.reviews.length > 0 ? (
                      <div className="space-y-3">
                        {club.reviews.map((review, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <Icon icon="zi-user" className="text-green-600" size={16} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <Text size="small" className="font-medium">
                                  {review.user}
                                </Text>
                                <div className="flex items-center gap-1">
                                  <Text size="small" className="text-yellow-500 font-bold">
                                    {review.rating.toFixed(1)}
                                  </Text>
                                  <Icon icon="zi-star-solid" className="text-yellow-400" size={14} />
                                </div>
                              </div>
                              <Text size="xSmall" className="text-gray-600">
                                {review.comment}
                              </Text>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Text className="text-gray-500 italic">Chưa có đánh giá nào.</Text>
                    )}
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center gap-3 z-50">
           <div className="flex-1">
              <Text size="xSmall" className="text-gray-500">Tổng tạm tính</Text>
              <Text.Title className="text-[#283b91]">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}</Text.Title>
           </div>
           <Button 
             className={`flex-1 rounded-lg bg-[#283b91]`} 
             onClick={handleBooking}
             disabled={false}
           >
              {selectedCourts.length === 0 ? "ĐẶT LỊCH NGAY" : `ĐẶT LỊCH (${selectedCourts.length})`}
           </Button>
        </div>

        {/* Booking Type Modal */}
        <Modal
          visible={showBookingType}
          title="Chọn hình thức đặt"
          onClose={() => setShowBookingType(false)}
          actions={[]}
        >
          <div className="space-y-3 py-2">
            <div
              className="rounded-xl bg-[#eef2ff] px-4 py-3 flex items-center justify-between cursor-pointer"
              onClick={() => {
                setShowBookingType(false);
                onClose();
                navigate("/booking", {
                  state: { mode: "daily", clubName: club.name },
                });
              }}
            >
              <div>
                <Text.Title className="text-[#283b91] text-sm">Đặt lịch theo ngày</Text.Title>
                <Text size="xSmall" className="text-gray-600">
                  Đặt nhanh khi khách chỉ chơi 1 khung giờ, có thể trên nhiều sân.
                </Text>
              </div>
              <Icon icon="zi-chevron-right" className="text-[#283b91]" />
            </div>

            <div
              className="rounded-xl bg-[#e4f2ff] px-4 py-3 flex items-center justify-between cursor-pointer"
              onClick={() => {
                setShowBookingType(false);
                onClose();
                navigate("/booking", {
                  state: { mode: "fixed", clubName: club.name },
                });
              }}
            >
              <div>
                <Text.Title className="text-[#0050b3] text-sm">Đặt lịch cố định</Text.Title>
                <Text size="xSmall" className="text-gray-600">
                  Đặt lịch cố định theo từng khung giờ trong tuần.
                </Text>
              </div>
              <Icon icon="zi-chevron-right" className="text-[#0050b3]" />
            </div>

            <div
              className="rounded-xl bg-[#f1fff0] px-4 py-3 flex items-center justify-between cursor-pointer"
              onClick={() => {
                setShowBookingType(false);
                onClose();
                navigate("/booking", {
                  state: { mode: "visual", clubName: club.name },
                });
              }}
            >
              <div>
                <Text.Title className="text-[#2f855a] text-sm">Đặt lịch ngày trực quan</Text.Title>
                <Text size="xSmall" className="text-gray-600">
                  Đặt nhiều khung giờ, nhiều sân trên cùng một màn hình.
                </Text>
              </div>
              <Icon icon="zi-chevron-right" className="text-[#2f855a]" />
            </div>

            <div
              className="rounded-xl bg-[#ffe8f3] px-4 py-3 flex items-center justify-between cursor-pointer"
              onClick={() => {
                setShowBookingType(false);
                onClose();
                navigate("/booking", {
                  state: { mode: "event", clubName: club.name },
                });
              }}
            >
              <div>
                <Text.Title className="text-[#c5306f] text-sm">Đặt lịch sự kiện</Text.Title>
                <Text size="xSmall" className="text-gray-600">
                  Tổ chức giải đấu, sự kiện cho cộng đồng người chơi.
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-white bg-[#c5306f] px-2 py-0.5 rounded-full">
                  NEW
                </span>
                <Icon icon="zi-chevron-right" className="text-[#c5306f]" />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </Sheet>
  );
};
