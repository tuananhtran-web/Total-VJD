import React, { useState } from "react";
import { Page, Box, Text, Input, Button, Icon, Header, useNavigate, useSnackbar } from "zmp-ui";
import { UserService } from "../services/user-service";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!phoneNumber || !password || !displayName) {
        openSnackbar({ text: "Vui lòng nhập đầy đủ thông tin bắt buộc", type: "error" });
        return;
    }
    if (password !== confirmPassword) {
        openSnackbar({ text: "Mật khẩu nhập lại không khớp", type: "error" });
        return;
    }

    setLoading(true);
    try {
        const newUser = {
            id: "", // Will be generated
            displayName,
            phoneNumber,
            avatar: "", // Default empty
            isLocked: false,
            package: {
                name: 'Thành viên mới',
                expiryDate: Date.now() + 86400000 * 30,
                status: 'active'
            },
            password, // Save password
        };

        await UserService.register(newUser as any);
        
        openSnackbar({ text: "Đăng ký thành công! Vui lòng đăng nhập.", type: "success" });
        navigate("/login");
    } catch (error: any) {
        console.error("Register error:", error);
        openSnackbar({ text: error.message || "Đăng ký thất bại. Vui lòng thử lại.", type: "error" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Page className="bg-white flex flex-col h-full">
      <Header title="Đăng ký" showBackIcon textColor="white" className="bg-[#283b91]" />
      
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {/* Phone Input */}
        <div className="mb-4">
          <Text.Title size="small" className="font-bold mb-2 text-[#283b91]">Số điện thoại của bạn? (*)</Text.Title>
          <div className="flex items-center border border-gray-200 rounded-lg p-1">
             <div className="flex items-center px-3 border-r border-gray-200">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" alt="VN" className="w-5 h-5 mr-1" />
                <Text className="font-medium text-gray-700">+ 84</Text>
                <Icon icon="zi-chevron-down" size={16} className="text-gray-400 ml-1" />
             </div>
             <input 
               type="text" 
               className="flex-1 p-2.5 outline-none text-gray-700 font-medium bg-transparent"
               placeholder="Nhập số điện thoại" 
               value={phoneNumber}
               onChange={(e) => setPhoneNumber(e.target.value)}
             />
          </div>
        </div>

        {/* Full Name Input */}
        <div className="mb-4">
          <Text.Title size="small" className="font-bold mb-2 text-[#283b91]">Tên đầy đủ (*)</Text.Title>
          <Input 
             type="text"
             placeholder="Nhập họ và tên"
             clearable
             className="border-gray-200"
             value={displayName}
             onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <Text.Title size="small" className="font-bold mb-2 text-[#283b91]">Mật khẩu (*)</Text.Title>
          <div className="relative">
             <Input 
               type={showPassword ? "text" : "password"}
               placeholder="Nhập mật khẩu"
               className="border-gray-200"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
             />
             <div 
               className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-10"
               onClick={() => setShowPassword(!showPassword)}
             >
                <Icon icon={showPassword ? "zi-eye" : "zi-eye-slash"} className="text-gray-400" />
             </div>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="mb-6">
          <Text.Title size="small" className="font-bold mb-2 text-[#283b91]">Nhập lại mật khẩu (*)</Text.Title>
          <div className="relative">
             <Input 
               type={showConfirmPassword ? "text" : "password"}
               placeholder="Nhập lại mật khẩu"
               className="border-gray-200"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
             />
             <div 
               className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-10"
               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
             >
                <Icon icon={showConfirmPassword ? "zi-eye" : "zi-eye-slash"} className="text-gray-400" />
             </div>
          </div>
        </div>

        {/* Register Button */}
        <Button 
          fullWidth 
          size="large"
          className="bg-[#283b91] hover:bg-blue-800 rounded-lg font-bold text-lg mb-6"
          onClick={handleRegister}
          loading={loading}
        >
          ĐĂNG KÝ
        </Button>


        {/* Login Link */}
        <div className="flex justify-center items-center gap-1">
           <Text size="small" className="text-gray-500">Bạn đã có tài khoản?</Text>
           <Text size="small" className="font-bold text-[#283b91] cursor-pointer" onClick={() => navigate("/login")}>Đăng nhập</Text>
        </div>

      </div>
    </Page>
  );
};

export default RegisterPage;
