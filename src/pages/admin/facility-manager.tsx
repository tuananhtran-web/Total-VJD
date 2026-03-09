import React, { useState, useEffect } from "react";
import { Page, Header, Box, Text, Button, Icon, Input, Modal, useSnackbar } from "zmp-ui";
import { ClubService, Club } from "../../services/club-service";
import { CourtService, Court } from "../../services/court-service";

const FacilityManager: React.FC = () => {
  const { openSnackbar } = useSnackbar();
  const [facilities, setFacilities] = useState<Club[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCourtId, setEditingCourtId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCourtModal, setShowCourtModal] = useState(false);
  const [courtForm, setCourtForm] = useState<Partial<Court>>({});
  
  // Form state
  const [formData, setFormData] = useState<Partial<Club>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
        const [clubsData, courtsData] = await Promise.all([
            ClubService.getAllClubs(),
            CourtService.getAllCourts()
        ]);
        setFacilities(clubsData);
        setCourts(courtsData);
    } catch (error) {
        console.error(error);
        openSnackbar({ text: "Lỗi tải dữ liệu", type: "error" });
    }
    setLoading(false);
  };

  const handleEdit = (club: Club) => {
    setEditingId(club.id);
    setFormData(club);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
        name: "",
        address: "",
        priceRange: "",
        openTime: "06:00 - 22:00",
        rating: 5.0,
        type: 'daily',
        categoryId: '1',
        distance: '0km',
        description: '',
        image: 'https://via.placeholder.com/300'
    });
    setShowModal(true);
  };

  const handleAddCourt = () => {
    if (facilities.length === 0) {
      openSnackbar({ text: "Vui lòng tạo Câu lạc bộ trước", type: "warning" });
      return;
    }
    setEditingCourtId(null);
    setCourtForm({
      clubId: facilities[0].id,
      name: "",
      pricePerHour: 0,
      openTime: "06:00 - 22:00",
      status: "active",
    });
    setShowCourtModal(true);
  };

  const handleEditCourt = (court: Court) => {
    setEditingCourtId(court.id);
    setCourtForm(court);
    setShowCourtModal(true);
  };

  const handleDeleteCourt = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa sân con này?")) {
        try {
            await CourtService.deleteCourt(id);
            setCourts(courts.filter(c => c.id !== id));
            openSnackbar({ text: "Đã xóa sân con", type: "success" });
        } catch {
            openSnackbar({ text: "Lỗi khi xóa", type: "error" });
        }
    }
  };

  const handleSaveCourt = async () => {
      try {
        if (editingCourtId) {
            await CourtService.updateCourt(editingCourtId, courtForm);
            setCourts(courts.map(c => c.id === editingCourtId ? { ...c, ...courtForm } as Court : c));
            openSnackbar({ text: "Đã cập nhật sân", type: "success" });
        } else {
            const created = await CourtService.createCourt(courtForm as Court);
            if (created) {
                setCourts([...courts, created]);
                openSnackbar({ text: "Đã tạo sân mới", type: "success" });
            }
        }
        setShowCourtModal(false);
      } catch {
        openSnackbar({ text: "Lỗi khi lưu sân", type: "error" });
      }
  };

  const categories = [
    { id: "1", name: "Pickleball" },
    { id: "2", name: "Cầu lông" },
    { id: "3", name: "Bóng đá" },
    { id: "4", name: "Tennis" },
    { id: "5", name: "B.Chuyền" },
    { id: "6", name: "Bóng rổ" },
  ];

  const handleSave = async () => {
    try {
        if (editingId) {
            // Update
            await ClubService.updateClub(editingId, formData);
            setFacilities(facilities.map(f => f.id === editingId ? { ...f, ...formData } as Club : f));
            openSnackbar({ text: "Cập nhật thành công", type: "success" });
        } else {
            // Add new
            const newClub = await ClubService.createClub(formData as Club);
            if (newClub) {
                setFacilities([...facilities, newClub]);
                openSnackbar({ text: "Thêm mới thành công", type: "success" });
            }
        }
        setShowModal(false);
    } catch (error) {
        openSnackbar({ text: "Có lỗi xảy ra", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
      if (confirm("Bạn có chắc chắn muốn xóa sân này?")) {
          try {
             await ClubService.deleteClub(id);
             setFacilities(facilities.filter(f => f.id !== id));
             openSnackbar({ text: "Đã xóa sân", type: "success" });
          } catch (error) {
             openSnackbar({ text: "Có lỗi xảy ra", type: "error" });
          }
      }
  };

  return (
    <Page className="bg-gray-50 pb-safe-bottom">
      <Header title="Quản lý Câu lạc bộ" showBackIcon={true} className="bg-[#006442] text-white" textColor="white" />
      
      <div className="p-4 bg-white mb-2">
        <div className="flex gap-2">
            <Button 
                fullWidth 
                className="bg-[#006442] font-bold flex-1"
                onClick={handleAddNew}
                prefixIcon={<Icon icon="zi-plus" />}
            >
                THÊM CÂU LẠC BỘ
            </Button>
            <Button 
                className="bg-blue-600 font-bold"
                onClick={() => {
                    if (facilities.length === 0) {
                        openSnackbar({ text: "Vui lòng tạo Câu lạc bộ trước!", type: "warning" });
                        return;
                    }
                    setShowCourtModal(true);
                }}
                prefixIcon={<Icon icon="zi-plus-circle" />}
            >
                THÊM SÂN (COURT)
            </Button>
        </div>
      </div>

      <Box className="px-4 pb-4">
        {loading ? (
             <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006442]"></div>
             </div>
        ) : (
        <div className="space-y-4">
            {facilities.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                    <Icon icon="zi-plus-circle-solid" size={48} className="text-gray-300 mb-4" />
                    <Text className="mb-4 font-medium">Chưa có Câu lạc bộ nào</Text>
                    <Button 
                        className="bg-[#006442] font-bold"
                        onClick={handleAddNew}
                    >
                        TẠO CÂU LẠC BỘ ĐẦU TIÊN
                    </Button>
                </div>
            )}
            {facilities.map((club) => (
                <div key={club.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="h-32 w-full relative">
                        <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-[#006442]">
                            {club.rating} ⭐
                        </div>
                    </div>
                    <div className="p-4">
                        <Text.Title size="small" className="font-bold mb-1 line-clamp-1">{club.name}</Text.Title>
                        <div className="flex items-start gap-1 text-gray-500 text-xs mb-2">
                            <Icon icon="zi-location" size={14} className="mt-0.5" />
                            <span className="line-clamp-2">{club.address}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <Text className="text-[#006442] font-bold text-sm">{club.priceRange}</Text>
                            <div className="flex gap-2">
                                <div 
                                    className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 cursor-pointer"
                                    onClick={() => handleEdit(club)}
                                >
                                    <Icon icon="zi-edit" size={18} />
                                </div>
                                <div 
                                    className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 cursor-pointer"
                                    onClick={() => handleDelete(club.id)}
                                >
                                    <Icon icon="zi-delete" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* List of Courts */}
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                        <div className="flex justify-between items-center mb-2">
                            <Text size="xSmall" className="font-bold text-gray-700">DANH SÁCH SÂN ({courts.filter(c => c.clubId === club.id).length})</Text>
                            <div 
                                className="text-blue-600 text-xs font-bold cursor-pointer"
                                onClick={() => {
                                    setEditingCourtId(null);
                                    setCourtForm({
                                        clubId: club.id,
                                        name: "",
                                        pricePerHour: 0,
                                        openTime: "06:00 - 22:00",
                                        status: "active",
                                    });
                                    setShowCourtModal(true);
                                }}
                            >
                                + Thêm sân
                            </div>
                        </div>
                        <div className="space-y-2">
                            {courts.filter(c => c.clubId === club.id).length === 0 && (
                                <Text size="xxSmall" className="text-gray-400 italic">Chưa có sân con nào</Text>
                            )}
                            {courts.filter(c => c.clubId === club.id).map(court => (
                                <div key={court.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                                    <div>
                                        <Text size="small" className="font-medium">{court.name}</Text>
                                        <Text size="xxSmall" className="text-gray-500">
                                            {court.pricePerHour?.toLocaleString()}đ/h • {court.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                                        </Text>
                                    </div>
                                    <div className="flex gap-2">
                                        <Icon icon="zi-edit" className="text-blue-500" onClick={() => handleEditCourt(court)} />
                                        <Icon icon="zi-delete" className="text-red-500" onClick={() => handleDeleteCourt(court.id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        )}
      </Box>

      <Modal
        visible={showModal}
        title={editingId ? "Chỉnh sửa Câu lạc bộ" : "Thêm Câu lạc bộ mới"}
        onClose={() => setShowModal(false)}
        actions={[
            { text: "Hủy", onClick: () => setShowModal(false) },
            { text: "Lưu", highLight: true, onClick: handleSave }
        ]}
      >
        <div className="space-y-4 py-2 h-[60vh] overflow-y-auto no-scrollbar">
            <div>
                <Text size="small" className="font-medium mb-1">Tên Câu lạc bộ</Text>
                <Input 
                    value={formData.name || ""} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nhập tên CLB..."
                />
            </div>

            <div>
                <Text size="small" className="font-medium mb-1">Môn thể thao</Text>
                <select 
                    className="w-full p-2 border border-[#e5e7eb] rounded-lg bg-white outline-none focus:border-[#006442]"
                    value={formData.categoryId || "1"}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                >
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <Text size="small" className="font-medium mb-1">Địa chỉ</Text>
                <Input 
                    value={formData.address || ""} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Nhập địa chỉ..."
                />
            </div>

            <div>
                <Text size="small" className="font-medium mb-1">Khoảng cách (VD: 2.5km)</Text>
                <Input 
                    value={formData.distance || ""} 
                    onChange={(e) => setFormData({...formData, distance: e.target.value})}
                    placeholder="2.5km"
                />
            </div>

            <div>
                <Text size="small" className="font-medium mb-1">Link Ảnh (URL)</Text>
                <Input 
                    value={formData.image || ""} 
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://..."
                />
            </div>
            <div>
                <Text size="small" className="font-medium mb-1">Giá thuê (Text)</Text>
                <Input 
                    value={formData.priceRange || ""} 
                    onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                    placeholder="Ví dụ: 50.000đ/h"
                />
            </div>
            <div>
                <Text size="small" className="font-medium mb-1">Giờ mở cửa</Text>
                <Input 
                    value={formData.openTime || ""} 
                    onChange={(e) => setFormData({...formData, openTime: e.target.value})}
                    placeholder="06:00 - 22:00"
                />
            </div>

            <div>
                <Text size="small" className="font-medium mb-1">Mô tả</Text>
                <textarea 
                    className="w-full p-2 border border-[#e5e7eb] rounded-lg bg-white outline-none focus:border-[#006442] min-h-[80px]"
                    value={formData.description || ""} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Mô tả chi tiết về sân..."
                />
            </div>
        </div>
      </Modal>
      
      <Modal
        visible={showCourtModal}
        title={editingCourtId ? "Chỉnh sửa sân (Court)" : "Thêm sân (Court)"}
        onClose={() => setShowCourtModal(false)}
        actions={[
          { text: "Hủy", onClick: () => setShowCourtModal(false) },
          { text: "Lưu", highLight: true, onClick: handleSaveCourt }
        ]}
      >
        <div className="space-y-4 py-2">
          <div>
            <Text size="small" className="font-medium mb-1">Thuộc Câu lạc bộ</Text>
            <select
              className="w-full p-2 border border-[#e5e7eb] rounded-lg bg-white outline-none focus:border-[#006442]"
              value={courtForm.clubId || (facilities[0]?.id || "")}
              onChange={(e) => setCourtForm({ ...courtForm, clubId: e.target.value })}
            >
              {facilities.map(f => (
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
      
      <div 
        className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-[#006442] shadow-lg flex items-center justify-center text-white cursor-pointer active:scale-95"
        onClick={handleAddNew}
        aria-label="Thêm Câu lạc bộ"
      >
        <Icon icon="zi-plus" size={24} />
      </div>
    </Page>
  );
};

export default FacilityManager;
