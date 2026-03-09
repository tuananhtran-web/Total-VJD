import React, { useState } from "react";
import { Page, Header, Text, Box, Button, Icon, useNavigate } from "zmp-ui";
import { useLocation } from "react-router-dom";

const SERVICES = [
  { id: 1, name: "Monster (Lon)", price: 30000, type: "Nước" },
  { id: 2, name: "Nước suối (Chai)", price: 10000, type: "Nước" },
  { id: 3, name: "Nước suối lớn (Chai)", price: 20000, type: "Nước" },
  { id: 4, name: "Pocari (chai)", price: 20000, type: "Nước" },
  { id: 5, name: "Pocari Lớn (chai)", price: 35000, type: "Nước" },
  { id: 6, name: "Thuê vợt", price: 50000, type: "Dụng cụ" },
];

const ServiceSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const previousState = (location.state as any) || {};
  
  const [selectedItems, setSelectedItems] = useState<Record<number, number>>(
    previousState.services || {}
  );

  const handleUpdate = (id: number, delta: number) => {
    const current = selectedItems[id] || 0;
    const next = Math.max(0, current + delta);
    if (next === 0) {
      const { [id]: _, ...rest } = selectedItems;
      setSelectedItems(rest);
    } else {
      setSelectedItems({ ...selectedItems, [id]: next });
    }
  };

  const totalItems = Object.values(selectedItems).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(selectedItems).reduce((sum, [id, qty]) => {
    const item = SERVICES.find(s => s.id === Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleConfirm = () => {
    // Navigate back to summary with updated services
    navigate("/booking-summary", {
      state: {
        ...previousState,
        services: selectedItems
      },
      replace: true
    });
  };

  return (
    <Page className="bg-white flex flex-col h-screen">
      <Header title="Dịch vụ dành cho bạn" className="bg-[#283b91] text-white" textColor="white" />

      {/* Search */}
      <div className="p-4 bg-white sticky top-0 z-10">
        <div className="bg-gray-100 rounded-lg flex items-center p-3">
          <Icon icon="zi-search" className="text-gray-500 mr-2" />
          <input 
            placeholder="Nhập tên sản phẩm" 
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>
        
        <div className="flex gap-2 mt-3">
          <span className="bg-[#eef2ff] text-[#283b91] px-4 py-1 rounded-full text-xs font-bold">Nước</span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <Text.Title size="small" className="font-bold">Nước</Text.Title>
        
        {SERVICES.filter(s => s.type === "Nước").map((item) => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                 {/* Placeholder for product image */}
                 <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-400"></div>
              </div>
              <div>
                <Text className="font-bold text-[#283b91]">{item.name}</Text>
                <Text size="small" className="text-gray-500">{new Intl.NumberFormat('vi-VN').format(item.price)} đ / {item.name.includes('Lon') ? 'Lon' : 'Chai'}</Text>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               {selectedItems[item.id] ? (
                 <>
                   <div 
                     className="w-6 h-6 rounded-full border border-[#283b91] text-[#283b91] flex items-center justify-center cursor-pointer"
                     onClick={() => handleUpdate(item.id, -1)}
                   >
                     -
                   </div>
                   <Text className="font-bold w-4 text-center">{selectedItems[item.id]}</Text>
                   <div 
                     className="w-6 h-6 rounded-full bg-[#283b91] text-white flex items-center justify-center cursor-pointer"
                     onClick={() => handleUpdate(item.id, 1)}
                   >
                     +
                   </div>
                 </>
               ) : (
                 <div 
                   className="w-6 h-6 rounded-full bg-[#00b050] text-white flex items-center justify-center cursor-pointer shadow-md"
                   onClick={() => handleUpdate(item.id, 1)}
                 >
                   <Icon icon="zi-plus" size={14} />
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-[#283b91]">
        <Button 
          fullWidth 
          className="bg-[#d32829] text-white font-bold rounded-xl h-12"
          onClick={handleConfirm}
        >
          Thêm dịch vụ
          <div className="text-xs font-normal opacity-90 mt-0.5">
            {totalItems} món | Tổng cộng: {new Intl.NumberFormat('vi-VN').format(totalPrice)} đ
          </div>
        </Button>
      </div>
    </Page>
  );
};

export default ServiceSelectionPage;
