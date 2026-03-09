import React, { useEffect, useState } from "react";
import { Page, Header, Box, Text, Button, Icon, Modal, Input, useSnackbar, useNavigate, Tabs } from "zmp-ui";
import { useLocation } from "react-router-dom";
import { UserService, User } from "../../services/user-service";
import { BookingService, Booking } from "../../services/booking-service";

const UserDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSnackbar } = useSnackbar();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bonusDays, setBonusDays] = useState("");
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Get userId from navigation state
  const userId = (location.state as any)?.userId;

  useEffect(() => {
    if (userId) {
      loadUser(userId);
      loadBookings(userId);
    }
  }, [userId]);

  const loadUser = async (id: string) => {
    try {
      setLoading(true);
      const data = await UserService.getUserById(id);
      setUser(data);
    } catch (error) {
      console.error("Error loading user", error);
      openSnackbar({ text: "Không thể tải thông tin user", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async (id: string) => {
      try {
          const data = await BookingService.getUserBookings(id);
          setBookings(data);
      } catch (error) {
          console.error("Error loading bookings", error);
      }
  };

  const handleToggleLock = async () => {
    if (!user) return;
    try {
      await UserService.toggleLockUser(user.id, !user.isLocked);
      setUser({ ...user, isLocked: !user.isLocked });
      openSnackbar({ text: user.isLocked ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản", type: "success" });
    } catch (error) {
      openSnackbar({ text: "Lỗi khi cập nhật trạng thái", type: "error" });
    }
  };

  const handleAddBonus = async () => {
    if (!user || !bonusDays) return;
    try {
      const days = parseInt(bonusDays);
      if (isNaN(days)) return;
      
      await UserService.addBonusDays(user.id, days);
      await loadUser(user.id); // Reload to get new date
      setShowBonusModal(false);
      setBonusDays("");
      openSnackbar({ text: `Đã cộng thêm ${days} ngày`, type: "success" });
    } catch (error) {
      openSnackbar({ text: "Lỗi khi cộng ngày", type: "error" });
    }
  };

  const handleChangeStatus = async (status: User['package']['status']) => {
    if (!user) return;
    try {
      await UserService.updatePackageStatus(user.id, status);
      setUser({ ...user, package: { ...user.package, status } });
      openSnackbar({ text: "Đã cập nhật trạng thái gói", type: "success" });
    } catch (error) {
      openSnackbar({ text: "Lỗi cập nhật", type: "error" });
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    try {
      await UserService.deleteUser(user.id);
      openSnackbar({ text: "Đã xóa người dùng", type: "success" });
      navigate(-1);
    } catch (error) {
      openSnackbar({ text: "Lỗi khi xóa", type: "error" });
    }
  };

  if (loading) return <Page className="flex items-center justify-center">Loading...</Page>;
  if (!user) return <Page className="flex items-center justify-center">User not found</Page>;

  const remainingDays = Math.ceil((user.package.expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpired = remainingDays <= 0;

  return (
    <Page className="bg-gray-50 pb-20">
      <Header title="Chi tiết thành viên" />
      
      {/* Profile Header */}
      <Box className="bg-white p-6 flex flex-col items-center mb-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-3 text-2xl font-bold text-gray-500">
           {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" /> : user.displayName.charAt(0)}
        </div>
        <Text.Title size="large">{user.displayName}</Text.Title>
        <Text className="text-gray-500">{user.phoneNumber}</Text>
        {user.isLocked && (
          <div className="mt-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
            TÀI KHOẢN BỊ KHÓA
          </div>
        )}
      </Box>

      {/* Package Info */}
      <Box className="bg-white p-4 mb-4">
        <Text.Title size="small" className="mb-4 font-bold">Thông tin gói tập</Text.Title>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Text size="xSmall" className="text-gray-500 mb-1">Tên gói</Text>
            <Text className="font-bold text-blue-700">{user.package.name}</Text>
          </div>
          <div className={`${isExpired ? 'bg-red-50' : 'bg-green-50'} p-3 rounded-lg`}>
            <Text size="xSmall" className="text-gray-500 mb-1">Trạng thái</Text>
            <Text className={`font-bold ${isExpired ? 'text-red-700' : 'text-green-700'}`}>
              {user.package.status === 'active' ? 'Hoạt động' : user.package.status}
            </Text>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
           <div className="flex justify-between items-center mb-2">
             <Text className="text-gray-600">Ngày hết hạn</Text>
             <Text className="font-medium">{new Date(user.package.expiryDate).toLocaleDateString('vi-VN')}</Text>
           </div>
           <div className="flex justify-between items-center">
             <Text className="text-gray-600">Còn lại</Text>
             <Text className={`font-bold ${isExpired ? 'text-red-500' : 'text-green-600'}`}>
               {remainingDays > 0 ? `${remainingDays} ngày` : 'Đã hết hạn'}
             </Text>
           </div>
        </div>
      </Box>

      {/* Actions */}
      <Box className="bg-white p-4">
        <Text.Title size="small" className="mb-4 font-bold">Thao tác quản trị</Text.Title>
        
        <div className="space-y-3">
          <Button 
            fullWidth 
            variant="secondary" 
            prefixIcon={<Icon icon="zi-calendar" />}
            onClick={() => setShowBonusModal(true)}
          >
            Cộng thêm ngày sử dụng
          </Button>

          {user.isLocked ? (
             <Button 
               fullWidth 
               variant="primary" 
               className="bg-green-600"
               prefixIcon={<Icon icon="zi-unlock" />}
               onClick={handleToggleLock}
             >
               Mở khóa tài khoản
             </Button>
          ) : (
            <Button 
               fullWidth 
               variant="secondary" 
               className="text-red-600 bg-red-50 border-red-100"
               prefixIcon={<Icon icon="zi-lock" />}
               onClick={handleToggleLock}
             >
               Khóa tài khoản
             </Button>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button 
               size="small"
               variant={user.package.status === 'active' ? "primary" : "secondary"}
               onClick={() => handleChangeStatus('active')}
            >
              Kích hoạt
            </Button>
            <Button 
               size="small"
               variant={user.package.status === 'expired' ? "primary" : "secondary"}
               onClick={() => handleChangeStatus('expired')}
            >
              Hết hạn
            </Button>
          </div>

          <Button 
             fullWidth 
             variant="tertiary" 
             className="text-red-500 mt-4"
             onClick={() => setShowDeleteModal(true)}
          >
            Xóa người dùng vĩnh viễn
          </Button>
        </div>
      </Box>

      <Box className="mt-4 bg-white p-4 pb-20">
        <Text.Title size="small" className="font-bold mb-3">Lịch sử đặt sân ({bookings.length})</Text.Title>
        <div className="space-y-3">
            {bookings.length === 0 && (
                <div className="text-center py-4 text-gray-500">Chưa có lịch sử đặt sân</div>
            )}
            {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                        <span className="font-bold text-sm">{booking.date}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {booking.status === 'confirmed' ? 'Đã duyệt' : booking.status === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt'}
                        </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                        Sân: {booking.courtId} | {booking.slots.length} slot(s)
                    </div>
                    <div className="text-sm font-bold text-[#006442]">
                        {booking.totalPrice?.toLocaleString()}đ
                    </div>
                </div>
            ))}
        </div>
      </Box>

      {/* Bonus Modal */}
      <Modal
        visible={showBonusModal}
        title="Cộng ngày sử dụng"
        onClose={() => setShowBonusModal(false)}
        actions={[
          { text: "Hủy", onClick: () => setShowBonusModal(false) },
          { text: "Xác nhận", highLight: true, onClick: handleAddBonus }
        ]}
      >
        <Box className="p-4">
          <Input 
            type="number" 
            label="Số ngày cộng thêm" 
            placeholder="VD: 30" 
            value={bonusDays}
            onChange={(e) => setBonusDays(e.target.value)}
          />
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        title="Xác nhận xóa"
        onClose={() => setShowDeleteModal(false)}
        actions={[
          { text: "Hủy", onClick: () => setShowDeleteModal(false) },
          { text: "Xóa vĩnh viễn", danger: true, onClick: handleDeleteUser }
        ]}
      >
        <Box className="p-4">
          <Text>Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.</Text>
        </Box>
      </Modal>
    </Page>
  );
};

export default UserDetailPage;
