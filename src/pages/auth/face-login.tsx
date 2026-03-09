import React, { useEffect, useState } from "react";
import { Page, Box, Text, Icon, useSnackbar } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { wait } from "../../utils/async";

const FaceIDLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [status, setStatus] = useState<'scanning' | 'verifying' | 'success' | 'failed'>('scanning');

  useEffect(() => {
    simulateFaceID();
  }, []);

  const simulateFaceID = async () => {
    // 1. Scanning UI
    await wait(1500);
    setStatus('verifying');
    
    // 2. Mock Verification
    await wait(1000);
    const isMatch = Math.random() > 0.1; // 90% success rate

    if (isMatch) {
      setStatus('success');
      await wait(800);
      navigate('/pages/index');
    } else {
      setStatus('failed');
      openSnackbar({ text: "Không nhận diện được khuôn mặt", type: "error" });
    }
  };

  return (
    <Page className="bg-black flex flex-col items-center justify-center h-screen">
      <div className="relative mb-8">
        <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-colors duration-300
          ${status === 'scanning' ? 'border-blue-500' : 
            status === 'verifying' ? 'border-yellow-500' :
            status === 'success' ? 'border-green-500' : 'border-red-500'}
        `}>
          <Icon 
            icon={status === 'success' ? "zi-check" : status === 'failed' ? "zi-close" : "zi-user"} 
            size={48} 
            className="text-white" 
          />
        </div>
        
        {status === 'scanning' && (
           <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-20"></div>
        )}
      </div>

      <Text.Title className="text-white mb-2">
        {status === 'scanning' ? "Đang quét..." :
         status === 'verifying' ? "Đang xác thực..." :
         status === 'success' ? "Xin chào, Minh Tuấn!" : "Thử lại"}
      </Text.Title>
      
      {status === 'failed' && (
        <div 
          className="mt-8 text-blue-400 cursor-pointer underline"
          onClick={() => setStatus('scanning')} // Retry
        >
          Quét lại
        </div>
      )}

      <div 
        className="fixed bottom-8 text-gray-500 text-sm cursor-pointer"
        onClick={() => navigate('/pages/login')}
      >
        Đăng nhập bằng mật khẩu
      </div>
    </Page>
  );
};

export default FaceIDLoginPage;
