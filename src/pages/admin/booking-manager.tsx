import React, { useState, useEffect } from "react";
import { Page, Header, Box, Text, Button, Icon, useSnackbar, Input, Modal } from "zmp-ui";
import { BookingService, Booking } from "../../services/booking-service";
import { CourtService, Court } from "../../services/court-service";
import { ClubService, Club } from "../../services/club-service";

const BookingManager: React.FC = () => {
  const { openSnackbar } = useSnackbar();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [showCourtModal, setShowCourtModal] = useState(false);
  const [courtForm, setCourtForm] = useState<Partial<Court>>({});
  const [clubs, setClubs] = useState<Club[]>([]);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
    loadClubs();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const data = await BookingService.getAllBookings();
    setBookings(data);
    setLoading(false);
  };
  
  const loadClubs = async () => {
    const data = await ClubService.getAllClubs();
    setClubs(data);
  };

  const handleStatusChange = async (id: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
        await BookingService.updateStatus(id, newStatus);
        setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
        openSnackbar({ text: `Đã cập nhật trạng thái: ${newStatus === 'confirmed' ? 'Đã duyệt' : 'Đã hủy'}`, type: "success" });
    } catch (error) {
        openSnackbar({ text: "Có lỗi xảy ra", type: "error" });
    }
  };

  const filteredBookings = bookings.filter(b => filter === "all" || b.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
        case "confirmed": return "Đã xác nhận";
        case "pending": return "Chờ duyệt";
        case "cancelled": return "Đã hủy";
        default: return status;
    }
  };

  return (
    <Page className="bg-gray-50 pb-safe-bottom">
      <Header title="Quản lý Đặt sân" showBackIcon={true} className="bg-[#006442] text-white" textColor="white" />
      
      <Box className="p-4">
        <Button 
          fullWidth 
          className="bg-blue-600 mb-4 font-bold"
          onClick={() => {
            if (clubs.length === 0) {
              openSnackbar({ text: "Vui lòng tạo Câu lạc bộ trước", type: "warning" });
              return;
            }
            setCourtForm({
              clubId: clubs[0].id,
              name: "",
              pricePerHour: 0,
              openTime: "06:00 - 22:00",
              status: "active",
            });
            setShowCourtModal(true);
          }}
          prefixIcon={<Icon icon="zi-plus" />}
        >
          THÊM SÂN (COURT)
        </Button>
        {/* Filter Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-4 pb-2 no-scrollbar">
            {['all', 'pending', 'confirmed', 'cancelled'].map(status => (
                <div 
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium cursor-pointer transition-colors ${
                        filter === status ? 'bg-[#006442] text-white' : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                >
                    {status === 'all' ? 'Tất cả' : getStatusText(status)}
                </div>
            ))}
        </div>

        {/* Booking List */}
        {loading ? (
             <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006442]"></div>
             </div>
        ) : (
        <div className="space-y-3">
            {filteredBookings.length === 0 && (
                <div className="text-center py-8 text-gray-500">Chưa có dữ liệu đặt sân</div>
            )}
            {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#006442]">
                    <div onClick={() => setSelectedBooking(booking)} className="cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <Text.Title size="small" className="font-bold">
                                {booking.user_details?.display_name || "Khách vãng lai"}
                            </Text.Title>
                            <Text size="xxSmall" className="text-gray-500">
                                {booking.user_details?.phone_number || "Không có SĐT"}
                            </Text>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center gap-1 text-gray-600 text-xs">
                            <Icon icon="zi-calendar" size={14} />
                            <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 text-xs">
                            <Icon icon="zi-clock-1" size={14} />
                            <span>{booking.slots.length} slot(s)</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 text-xs">
                            <Icon icon="zi-location" size={14} />
                            <span>{booking.courtId}</span>
                        </div>
                         <div className="flex items-center gap-1 text-[#006442] font-bold text-xs">
                            <Icon icon="zi-poll" size={14} />
                            <span>{booking.totalPrice?.toLocaleString()}đ</span>
                        </div>
                    </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                        {booking.status === 'pending' && (
                            <Button 
                                size="small"
                                className="bg-[#006442] flex-1 h-8 text-xs"
                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            >
                                Duyệt
                            </Button>
                        )}
                        {booking.status !== 'cancelled' && (
                             <Button 
                                size="small"
                                variant="secondary"
                                className="border-red-500 text-red-500 flex-1 h-8 text-xs bg-red-50"
                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            >
                                Hủy
                            </Button>
                        )}
                         {booking.status === 'cancelled' && (
                             <Button 
                                size="small"
                                variant="tertiary"
                                className="text-gray-500 flex-1 h-8 text-xs"
                                disabled
                            >
                                Đã hủy
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
        )}
      </Box>
       
       <Modal
          visible={showCourtModal}
          title="Thêm sân (Court)"
          onClose={() => setShowCourtModal(false)}
          actions={[
            { text: "Hủy", onClick: () => setShowCourtModal(false) },
            { text: "Lưu", highLight: true, onClick: async () => {
                try {
                  const created = await CourtService.createCourt(courtForm as Court);
                  if (created) {
                    openSnackbar({ text: "Đã tạo sân mới", type: "success" });
                  }
                  setShowCourtModal(false);
                } catch {
                  openSnackbar({ text: "Lỗi khi tạo sân", type: "error" });
                }
            }}
          ]}
        >
          <div className="space-y-4 py-2">
            <div>
              <Text size="small" className="font-medium mb-1">Thuộc Câu lạc bộ</Text>
              <select
                className="w-full p-2 border border-[#e5e7eb] rounded-lg bg-white outline-none focus:border-[#006442]"
                value={courtForm.clubId || (clubs[0]?.id || "")}
                onChange={(e) => setCourtForm({ ...courtForm, clubId: e.target.value })}
              >
                {clubs.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Text size="small" className="font-medium mb-1">Tên sân</Text>
              <Input
                value={courtForm.name || ""}
                onChange={(e) => setCourtForm({ ...courtForm, name: e.target.value })}
                placeholder="Nhập tên sân..."
              />
            </div>
            <div>
              <Text size="small" className="font-medium mb-1">Giá/giờ</Text>
              <Input
                value={String(courtForm.pricePerHour || "")}
                onChange={(e) => setCourtForm({ ...courtForm, pricePerHour: Number(e.target.value) })}
                placeholder="Ví dụ: 50000"
              />
            </div>
            <div>
              <Text size="small" className="font-medium mb-1">Giờ mở cửa</Text>
              <Input
                value={courtForm.openTime || "06:00 - 22:00"}
                onChange={(e) => setCourtForm({ ...courtForm, openTime: e.target.value })}
              />
            </div>
            <div>
              <Text size="small" className="font-medium mb-1">Trạng thái</Text>
              <select
                className="w-full p-2 border border-[#e5e7eb] rounded-lg bg-white outline-none focus:border-[#006442]"
                value={courtForm.status || "active"}
                onChange={(e) => setCourtForm({ ...courtForm, status: e.target.value as Court['status'] })}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm ngưng</option>
              </select>
            </div>
          </div>
        </Modal>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedBooking(null)}>
            <div className="bg-white rounded-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-[#006442] p-4 text-white flex justify-between items-center">
                    <Text.Title className="text-white">Chi tiết Đặt sân</Text.Title>
                    <Icon icon="zi-close" onClick={() => setSelectedBooking(null)} />
                </div>
                <div className="p-4 space-y-3">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Mã đơn:</span>
                        <span className="font-bold">{selectedBooking.id.substring(0, 8)}...</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Khách hàng:</span>
                        <span className="font-bold">{selectedBooking.user_details?.display_name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">SĐT:</span>
                        <span className="font-bold">{selectedBooking.user_details?.phone_number}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Sân:</span>
                        <span className="font-bold">{selectedBooking.courtId}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Ngày:</span>
                        <span className="font-bold">{selectedBooking.date}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Khung giờ:</span>
                        <div className="text-right">
                            {selectedBooking.slots.map(s => (
                                <div key={s} className="font-bold text-[#006442]">{s}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Tổng tiền:</span>
                        <span className="font-bold text-lg text-[#006442]">{selectedBooking.totalPrice?.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-500">Trạng thái:</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(selectedBooking.status)}`}>
                            {getStatusText(selectedBooking.status)}
                        </span>
                    </div>
                    
                    <div className="pt-4 flex gap-2">
                         {selectedBooking.status === 'pending' && (
                            <Button 
                                fullWidth
                                className="bg-[#006442]"
                                onClick={() => {
                                    handleStatusChange(selectedBooking.id, 'confirmed');
                                    setSelectedBooking(null);
                                }}
                            >
                                Duyệt đơn
                            </Button>
                        )}
                        {selectedBooking.status !== 'cancelled' && (
                             <Button 
                                fullWidth
                                variant="secondary"
                                className="border-red-500 text-red-500 bg-red-50"
                                onClick={() => {
                                    handleStatusChange(selectedBooking.id, 'cancelled');
                                    setSelectedBooking(null);
                                }}
                            >
                                Hủy đơn
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </Page>
  );
};

export default BookingManager;
