import React, { useState, useRef } from "react";
import { Page, Box, Text, Input, Button, Icon, Header, useNavigate, useSnackbar } from "zmp-ui";
import { getUserInfo } from "zmp-sdk/apis";
import { UserService } from "../services/user-service";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [phoneNumber, setPhoneNumber] = useState("0912345678");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);

  // Hidden admin trigger logic
  const tapCountRef = useRef(0);
  const firstTapTimeRef = useRef(0);
  const RESET_TIME_MS = 10000;
  const REQUIRED_TAPS = 5;

  const handleLoginTap = async () => {
    // Hidden Admin Logic
    const now = Date.now();
    if (tapCountRef.current > 0 && now - firstTapTimeRef.current > RESET_TIME_MS) {
      tapCountRef.current = 0;
      firstTapTimeRef.current = 0;
    }
    if (tapCountRef.current === 0) {
      firstTapTimeRef.current = now;
    }
    tapCountRef.current += 1;

    if (tapCountRef.current >= REQUIRED_TAPS) {
      if (now - firstTapTimeRef.current <= RESET_TIME_MS) {
        navigate("/admin-login");
        tapCountRef.current = 0;
        firstTapTimeRef.current = 0;
        return;
      }
    }

    // Normal Login Logic
    if (tapCountRef.current < REQUIRED_TAPS) {
        // Prevent multiple clicks while loading
        if (loading) return;

        if (!phoneNumber) {
            openSnackbar({ text: "Vui lòng nhập số điện thoại", type: "error" });
            return;
        }
        if (!password) {
            openSnackbar({ text: "Vui lòng nhập mật khẩu", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const user = await UserService.login(phoneNumber, password);
            
            if (user) {
                // Save to local storage for app state
                localStorage.setItem("user", JSON.stringify(user));
                openSnackbar({ text: "Đăng nhập thành công", type: "success" });
                navigate("/");
            } else {
                openSnackbar({ text: "Số điện thoại hoặc mật khẩu không đúng", type: "error" });
            }
        } catch (error) {
            console.error("Login error:", error);
            openSnackbar({ text: "Đăng nhập thất bại. Vui lòng thử lại.", type: "error" });
        } finally {
            setLoading(false);
        }
    }
  };

  const handleZaloLogin = async () => {
    try {
      setLoading(true);
      const { userInfo } = await getUserInfo({
        avatarType: "normal",
      });
      
      // Create or sync Zalo user
      const zaloUser = {
          id: `zalo-${userInfo.id}`,
          displayName: userInfo.name,
          phoneNumber: "", // Zalo might not provide phone without special permission
          avatar: userInfo.avatar,
          isLocked: false,
          package: {
              name: 'Thành viên Zalo',
              expiryDate: Date.now() + 86400000 * 30,
              status: 'active'
          },
          user_metadata: {
              ...userInfo,
              source: 'zalo'
          }
      };
      
      // Sync to Firestore
      await UserService.syncUserToFirestore(zaloUser as any);
      
      localStorage.setItem("user", JSON.stringify(zaloUser));
      openSnackbar({ text: `Xin chào, ${userInfo.name}!`, type: "success" });
      navigate("/");
    } catch (error) {
      console.error(error);
      openSnackbar({ text: "Đăng nhập Zalo thất bại", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="bg-[#283b91] flex flex-col h-full relative">
       <Header title="Đăng nhập" showBackIcon={true} textColor="white" className="bg-transparent shadow-none" />
       
       <div className="flex-1 bg-white rounded-t-[30px] mt-4 overflow-hidden flex flex-col">
          <div className="p-6 flex-1 overflow-y-auto">
             {/* Inputs */}
             <div className="space-y-4 mb-6">
                  <div>
                    <Text.Title size="small" className="font-bold mb-2 text-[#1a2b70]">Số điện thoại của bạn?</Text.Title>
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

                <div>
                  <Text.Title size="small" className="font-bold mb-2 text-[#1a2b70]">Mật khẩu</Text.Title>
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
             </div>

             {/* Login Button */}
             <Button 
                fullWidth 
                size="large"
                className="bg-[#283b91] hover:bg-[#1a2b70] rounded-lg font-bold text-lg mb-2 shadow-lg"
                onClick={handleLoginTap}
                loading={loading}
             >
                ĐĂNG NHẬP
             </Button>
             
             {/* Admin Login Link */}
             <div className="flex justify-center mb-4">
                <div 
                    onClick={() => navigate('/admin-login')}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                >
                    <Icon icon="zi-user-settings" size={18} className="text-[#283b91]" />
                    <Text className="text-sm font-medium text-[#283b91]">Đăng nhập quản trị viên</Text>
                </div>
             </div>

             {/* Zalo Login Button */}
             <Button 
                fullWidth 
                size="large"
                className="bg-[#0068ff] hover:bg-[#0054cc] rounded-lg font-bold text-lg mb-4 shadow-lg flex items-center justify-center gap-2"
                onClick={handleZaloLogin}
             >
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png" className="w-6 h-6 rounded-full bg-white p-0.5" alt="Zalo" />
                Đăng nhập bằng Zalo
             </Button>

             {/* QR Login Button */}
             <Button 
                fullWidth 
                variant="secondary"
                size="large"
                className="border-[#283b91] text-[#283b91] bg-blue-50 hover:bg-blue-100 rounded-lg font-bold text-lg mb-4 shadow-sm flex items-center justify-center gap-2"
                onClick={() => navigate("/qr-scanner")}
             >
                <Icon icon="zi-qrline" />
                Quét mã QR đặt sân
             </Button>

             {/* FaceID Button */}
             <div 
               className="border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-2 cursor-pointer active:bg-blue-50 mb-6"
               onClick={() => console.log("Biometric login")}
             >
                <Icon icon="zi-unlock" className="text-[#283b91]" />
                <Text className="font-bold text-[#283b91] text-sm">Đăng nhập với sinh trắc học</Text>
             </div>

             {/* Links */}
             <div className="flex justify-center items-center gap-1 mb-10">
                <Text size="small" className="text-gray-500">Bạn quên mật khẩu?</Text>
                <Text size="small" className="font-bold text-gray-700 underline cursor-pointer">Quên mật khẩu</Text>
             </div>

             <div className="flex justify-center items-center gap-1 mb-8">
                <Text size="small" className="text-gray-500">Bạn chưa có tài khoản?</Text>
                <Text size="small" className="font-bold text-gray-700 cursor-pointer" onClick={() => navigate("/register")}>Đăng ký</Text>
             </div>

             {/* Footer Partner Link */}
             <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-auto">
                <Text size="small" className="text-center text-yellow-700">
                  Nếu bạn là <span className="font-bold">CHỦ SÂN</span> hoặc <span className="font-bold">NHÂN VIÊN</span>, Bấm vào đây để tải ứng dụng <span className="font-bold">VJD Sports</span>
                </Text>
             </div>
          </div>
       </div>
    </Page>
  );
};

export default LoginPage;
