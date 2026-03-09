import React, { useEffect, useState } from "react";
import { Page, Header, Box, Text, Button, Icon, useSnackbar } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { wait } from "../../utils/async";

const FaceIDRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [step, setStep] = useState<'intro' | 'scanning' | 'success'>('intro');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep('success');
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleStart = () => {
    setStep('scanning');
  };

  return (
    <Page className="bg-black">
      <Header title="Đăng ký FaceID" className="bg-transparent text-white" textColor="white" />
      
      <Box className="flex flex-col items-center justify-center h-[80vh] text-white p-4">
        {step === 'intro' && (
          <>
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/50 flex items-center justify-center mb-8">
              <Icon icon="zi-user" size={48} />
            </div>
            <Text.Title size="large" className="mb-4">Đăng ký khuôn mặt</Text.Title>
            <Text className="text-center text-gray-300 mb-8">
              Sử dụng khuôn mặt để đăng nhập nhanh chóng và bảo mật hơn.
            </Text>
            <Button onClick={handleStart} fullWidth className="rounded-full">
              Bắt đầu quét
            </Button>
          </>
        )}

        {step === 'scanning' && (
          <>
            <div className="relative w-64 h-64">
               {/* Scanner Overlay */}
               <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Icon icon="zi-user" size={80} className="opacity-50" />
               </div>
               {/* Progress Ring */}
               <svg className="w-full h-full transform -rotate-90">
                 <circle
                   cx="128"
                   cy="128"
                   r="120"
                   stroke="currentColor"
                   strokeWidth="4"
                   fill="transparent"
                   className="text-gray-700"
                 />
                 <circle
                   cx="128"
                   cy="128"
                   r="120"
                   stroke="currentColor"
                   strokeWidth="4"
                   fill="transparent"
                   className="text-primary transition-all duration-100 ease-linear"
                   strokeDasharray={2 * Math.PI * 120}
                   strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                 />
               </svg>
            </div>
            <Text className="mt-8 font-medium">Đang quét khuôn mặt... {progress}%</Text>
            <Text size="small" className="text-gray-400 mt-2">Vui lòng giữ yên thiết bị</Text>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-6 animate-bounce">
              <Icon icon="zi-check" size={48} className="text-white" />
            </div>
            <Text.Title size="large" className="mb-2">Hoàn tất!</Text.Title>
            <Text className="text-center text-gray-300 mb-8">
              Khuôn mặt của bạn đã được đăng ký thành công.
            </Text>
            <Button onClick={() => navigate(-1)} fullWidth className="rounded-full bg-green-600">
              Quay lại
            </Button>
          </>
        )}
      </Box>
    </Page>
  );
};

export default FaceIDRegisterPage;
