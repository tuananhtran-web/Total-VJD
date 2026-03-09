import React, { useState } from "react";
import { Icon, useNavigate } from "zmp-ui";
import { useLocation } from "react-router-dom";

export const FloatingActions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isBooking =
    location.pathname.startsWith("/booking") ||
    location.pathname.startsWith("/booking-summary") ||
    location.pathname.startsWith("/payment");
  if (!isBooking) {
    return null;
  }

  const handleExit = () => {
    // In real ZMP app:
    // import { closeApp } from "zmp-sdk/apis";
    // closeApp({});
    console.log("Exit App");
    // For web mock, we can't really close the tab reliably, so just alert or redirect
    alert("Đóng ứng dụng (Mock)");
  };

  const handleHome = () => {
    navigate('/');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <>
          <div 
            className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleHome}
          >
            <span className="text-xs font-medium text-gray-700">Trang chủ</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Icon icon="zi-home" size={20} />
            </div>
          </div>

          <div 
            className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleExit}
          >
            <span className="text-xs font-medium text-gray-700">Thoát</span>
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <Icon icon="zi-close" size={20} />
            </div>
          </div>
        </>
      )}

      <div 
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer transition-all duration-300 ${isOpen ? 'bg-gray-500 rotate-45' : 'bg-primary'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon icon="zi-plus" size={24} />
      </div>
    </div>
  );
};
