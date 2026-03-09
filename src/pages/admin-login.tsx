import React, { useState } from "react";
import { Page, Box, Text, Input, Button, useNavigate, Icon } from "zmp-ui";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleAdminLogin = () => {
    if (password === "admin123") {
      // Mock admin dashboard navigation or success
      console.log("Admin logged in");
      navigate("/pages/admin/dashboard"); 
    } else {
      console.log("Wrong password");
    }
  };

  return (
    <Page className="bg-gray-100 flex flex-col justify-center p-6 h-full">
      <Box className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 bg-red-600 rounded-lg flex items-center justify-center mb-4 shadow-lg rotate-3">
          <Icon icon="zi-lock" className="text-white text-3xl" />
        </div>
        <Text.Title size="large" className="font-bold text-red-600">Admin Portal</Text.Title>
        <Text size="normal" className="text-gray-500 mt-2">Khu vực quản trị viên</Text>
      </Box>

      <Box className="w-full bg-white p-6 rounded-xl shadow-sm space-y-4">
        <Input 
          type="password" 
          label="Mật khẩu quản trị" 
          placeholder="Nhập mật khẩu" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button 
          fullWidth 
          size="large"
          className="rounded-lg font-bold shadow-md bg-red-600 mt-4"
          onClick={handleAdminLogin}
        >
          Truy cập
        </Button>
      </Box>
      
      <Button 
        variant="tertiary" 
        fullWidth 
        className="mt-4 text-gray-500"
        onClick={() => navigate(-1)}
      >
        Quay lại
      </Button>
    </Page>
  );
};

export default AdminLoginPage;
