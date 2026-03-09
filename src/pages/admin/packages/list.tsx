import React, { useEffect, useState } from "react";
import { Page, Header, Box, Button, Icon, Text, Modal, useSnackbar, useNavigate } from "zmp-ui";
import { PackageService, Package } from "../../../services/package-service";
import { PackageCard } from "../../../components/package-card";

const AdminPackageListPage: React.FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const data = await PackageService.getAllPackages();
      setPackages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // In a real app, show confirmation dialog first
    try {
      await PackageService.deletePackage(id);
      openSnackbar({ text: "Đã xóa gói tập", type: "success" });
      loadPackages();
    } catch (error) {
      openSnackbar({ text: "Lỗi khi xóa", type: "error" });
    }
  };

  return (
    <Page className="bg-gray-50 pb-20">
      <Header title="Quản lý gói tập" />
      
      <Box className="p-4">
        <Button 
          fullWidth 
          prefixIcon={<Icon icon="zi-plus" />}
          className="mb-4 shadow-md bg-green-600"
          onClick={() => navigate('/pages/admin/packages/edit')}
        >
          Thêm gói tập mới
        </Button>

        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="relative group" onClick={() => navigate('/pages/admin/packages/edit', { state: { pkg } })}>
                <PackageCard pkg={pkg} isAdmin />
                
                {/* Admin Actions Overlay */}
                <div className="absolute top-2 right-2 flex gap-2 z-20">
                  <div 
                    className="bg-white p-2 rounded-full shadow-md text-blue-600 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); navigate('/pages/admin/packages/edit', { state: { pkg } }); }}
                  >
                    <Icon icon="zi-edit" size={18} />
                  </div>
                  <div 
                    className="bg-white p-2 rounded-full shadow-md text-red-600 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); handleDelete(pkg.id); }}
                  >
                    <Icon icon="zi-delete" size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Box>
    </Page>
  );
};

export default AdminPackageListPage;
