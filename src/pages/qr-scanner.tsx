import React, { useEffect, useRef, useState } from 'react';
import { Page, Header, Text, Icon, Button, useNavigate } from 'zmp-ui';

const QRScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(true);

  // Mock camera stream setup
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    if (isScanning) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isScanning]);

  const handleScan = () => {
    // Simulate a successful scan
    setIsScanning(false);
    
    // Simulate Login from QR
    const user = {
        id: "qr-user-01",
        email: "qr-user@apolo.vn", 
        user_metadata: {
            full_name: "Khách QR",
            avatar: ""
        }
    };
    localStorage.setItem("user", JSON.stringify(user));
    
    // alert("Quét mã thành công! Đang đăng nhập...");
    navigate("/");
  };

  return (
    <Page className="bg-black h-full flex flex-col">
      <Header title="Quét mã QR" showBackIcon textColor="white" className="bg-transparent absolute top-0 left-0 right-0 z-10" />
      
      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Camera View (Mock or Real) */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/80 rounded-lg bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#283b91] -mt-1 -ml-1"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#283b91] -mt-1 -mr-1"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#283b91] -mb-1 -ml-1"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#283b91] -mb-1 -mr-1"></div>
            
            {/* Scanning Line Animation */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-[#283b91] animate-[scan_2s_infinite]"></div>
          </div>
        </div>

        <div className="relative z-10 mt-80 text-center">
          <Text className="text-white text-sm mb-4">Di chuyển camera đến vùng chứa mã QR</Text>
          <div className="flex gap-4 justify-center">
             <Button 
               size="small" 
               className="bg-white/20 hover:bg-white/30 text-white rounded-full w-12 h-12 flex items-center justify-center p-0"
               onClick={() => console.log("Toggle Flash")}
             >
               <Icon icon="zi-lightning" />
             </Button>
             <Button 
               size="small" 
               className="bg-white/20 hover:bg-white/30 text-white rounded-full w-12 h-12 flex items-center justify-center p-0"
               onClick={() => console.log("Image from gallery")}
             >
               <Icon icon="zi-photo" />
             </Button>
          </div>
          
          {/* Mock Trigger for Demo */}
          <Button onClick={handleScan} className="mt-8 bg-[#283b91]">
            Giả lập Quét thành công
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default QRScannerPage;
