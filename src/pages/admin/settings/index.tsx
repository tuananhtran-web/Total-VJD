import React, { useEffect, useState } from "react";
import { Page, Header, Box, Text, Input, Button, Switch, useSnackbar, Icon } from "zmp-ui";
import { SystemSettingsService, SystemSettings } from "../../../services/system-settings-service";

const AdminSettingsPage: React.FC = () => {
  const { openSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    homeBanners: [],
    maintenanceMode: false,
    contactInfo: {
      hotline: '',
      email: '',
      address: ''
    }
  });

  const [newBanner, setNewBanner] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await SystemSettingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await SystemSettingsService.saveSettings(settings);
      if (success) {
        openSnackbar({ text: "Đã lưu cài đặt", type: "success" });
      } else {
        openSnackbar({ text: "Lưu thất bại", type: "error" });
      }
    } catch (error) {
      openSnackbar({ text: "Lỗi khi lưu", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const addBanner = () => {
    if (newBanner) {
      setSettings(prev => ({
        ...prev,
        homeBanners: [...prev.homeBanners, newBanner]
      }));
      setNewBanner("");
    }
  };

  const removeBanner = (index: number) => {
    setSettings(prev => ({
      ...prev,
      homeBanners: prev.homeBanners.filter((_, i) => i !== index)
    }));
  };

  return (
    <Page className="bg-gray-50 pb-20">
      <Header title="Cấu hình hệ thống" />
      
      {loading ? (
        <Box className="p-4 text-center">Đang tải...</Box>
      ) : (
        <Box className="p-4 space-y-6">
          
          {/* General Settings */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <Text.Title size="small" className="mb-4 font-bold text-blue-800">Chung</Text.Title>
            <div className="flex items-center justify-between">
              <Text>Chế độ bảo trì</Text>
              <Switch 
                checked={settings.maintenanceMode}
                onChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
            </div>
            <Text size="xSmall" className="text-gray-500 mt-2">
              Khi bật, người dùng sẽ thấy màn hình bảo trì khi truy cập app.
            </Text>
          </div>

          {/* Contact Info */}
          <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
            <Text.Title size="small" className="font-bold text-blue-800">Thông tin liên hệ</Text.Title>
            <div>
              <Text size="xSmall" className="text-gray-500 mb-1">Hotline</Text>
              <Input 
                value={settings.contactInfo.hotline}
                onChange={(e) => setSettings({...settings, contactInfo: {...settings.contactInfo, hotline: e.target.value}})}
              />
            </div>
            <div>
              <Text size="xSmall" className="text-gray-500 mb-1">Email</Text>
              <Input 
                value={settings.contactInfo.email}
                onChange={(e) => setSettings({...settings, contactInfo: {...settings.contactInfo, email: e.target.value}})}
              />
            </div>
            <div>
              <Text size="xSmall" className="text-gray-500 mb-1">Địa chỉ</Text>
              <Input 
                value={settings.contactInfo.address}
                onChange={(e) => setSettings({...settings, contactInfo: {...settings.contactInfo, address: e.target.value}})}
              />
            </div>
          </div>

          {/* Banners */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <Text.Title size="small" className="mb-4 font-bold text-blue-800">Banner Trang chủ</Text.Title>
            
            <div className="flex gap-2 mb-4">
              <Input 
                placeholder="Nhập URL hình ảnh..." 
                value={newBanner}
                onChange={(e) => setNewBanner(e.target.value)}
              />
              <Button size="small" onClick={addBanner} icon={<Icon icon="zi-plus" />} />
            </div>

            <div className="space-y-3">
              {settings.homeBanners.map((url, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <img src={url} alt="Banner" className="w-16 h-10 object-cover rounded" />
                  <div className="flex-1 truncate text-xs text-gray-600">{url}</div>
                  <div 
                    className="p-2 text-red-500 cursor-pointer"
                    onClick={() => removeBanner(index)}
                  >
                    <Icon icon="zi-delete" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            fullWidth 
            onClick={handleSave} 
            loading={saving}
            className="mt-4"
          >
            Lưu cấu hình
          </Button>

        </Box>
      )}
    </Page>
  );
};

export default AdminSettingsPage;
