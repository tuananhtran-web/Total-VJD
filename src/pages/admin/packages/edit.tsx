import React, { useEffect, useState } from "react";
import { Page, Header, Box, Input, Button, Select, useSnackbar, useNavigate } from "zmp-ui";
import { useLocation } from "react-router-dom";
import { PackageService, Package, PackageCategory } from "../../../services/package-service";

const { Option } = Select;

const AdminPackageEditPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSnackbar } = useSnackbar();
  
  const editingPkg = (location.state as any)?.pkg as Package | undefined;
  
  const [categories, setCategories] = useState<PackageCategory[]>([]);
  const [formData, setFormData] = useState<Partial<Package>>({
    name: '',
    categoryId: 'gym',
    durationMonths: 1,
    originalPrice: 0,
    currentPrice: 0,
    image: '',
    saleBadge: '',
    description: '',
    isHot: false
  });

  useEffect(() => {
    PackageService.getCategories().then(setCategories);
    if (editingPkg) {
      setFormData(editingPkg);
    }
  }, [editingPkg]);

  const handleChange = (field: keyof Package, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.currentPrice) {
        openSnackbar({ text: "Vui lòng nhập tên và giá", type: "warning" });
        return;
      }

      if (editingPkg) {
        await PackageService.updatePackage(editingPkg.id, formData);
        openSnackbar({ text: "Cập nhật thành công", type: "success" });
      } else {
        await PackageService.createPackage(formData as Package);
        openSnackbar({ text: "Tạo mới thành công", type: "success" });
      }
      navigate(-1);
    } catch (error) {
      openSnackbar({ text: "Có lỗi xảy ra", type: "error" });
    }
  };

  return (
    <Page className="bg-gray-50">
      <Header title={editingPkg ? "Chỉnh sửa gói tập" : "Thêm gói tập mới"} />
      
      <Box className="p-4 bg-white m-4 rounded-lg shadow-sm space-y-4">
        <div className="form-group">
          <div className="label mb-1 text-sm font-medium">Tên gói tập</div>
          <Input 
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="VD: Gói Gym 1 Tháng"
          />
        </div>

        <div className="form-group">
          <div className="label mb-1 text-sm font-medium">Danh mục</div>
          <Select
            value={formData.categoryId}
            onChange={(val) => handleChange('categoryId', val)}
            label="Chọn danh mục"
          >
            {categories.map(cat => (
              <Option key={cat.id} value={cat.id} title={cat.name} />
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
             <div className="label mb-1 text-sm font-medium">Giá gốc</div>
             <Input 
               type="number"
               value={formData.originalPrice}
               onChange={(e) => handleChange('originalPrice', Number(e.target.value))}
             />
          </div>
          <div className="form-group">
             <div className="label mb-1 text-sm font-medium">Giá khuyến mãi</div>
             <Input 
               type="number"
               value={formData.currentPrice}
               onChange={(e) => handleChange('currentPrice', Number(e.target.value))}
             />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="form-group">
             <div className="label mb-1 text-sm font-medium">Thời hạn (tháng)</div>
             <Input 
               type="number"
               value={formData.durationMonths}
               onChange={(e) => handleChange('durationMonths', Number(e.target.value))}
             />
          </div>
          <div className="form-group">
             <div className="label mb-1 text-sm font-medium">Badge giảm giá</div>
             <Input 
               value={formData.saleBadge}
               onChange={(e) => handleChange('saleBadge', e.target.value)}
               placeholder="VD: 50%"
             />
          </div>
        </div>

        <div className="form-group">
          <div className="label mb-1 text-sm font-medium">Link hình ảnh</div>
          <Input 
            value={formData.image}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="https://..."
          />
        </div>

         <div className="form-group">
          <div className="label mb-1 text-sm font-medium">Mô tả ngắn</div>
          <Input.TextArea 
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            checked={formData.isHot}
            onChange={(e) => handleChange('isHot', e.target.checked)}
            className="w-5 h-5"
          />
          <span>Đánh dấu là gói HOT</span>
        </div>

        <Button 
          fullWidth 
          className="mt-6 bg-primary font-bold"
          onClick={handleSubmit}
        >
          {editingPkg ? "Lưu thay đổi" : "Tạo gói tập"}
        </Button>
      </Box>
    </Page>
  );
};

export default AdminPackageEditPage;
