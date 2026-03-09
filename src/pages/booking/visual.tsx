import React, { useState } from "react";
import { Page, Header, Text, Box, Button, Icon, useNavigate } from "zmp-ui";
import { useLocation } from "react-router-dom";

// Mock data for grid
const COURTS = [
  { id: "court-1", name: "Pickleball 1" },
  { id: "court-2", name: "Pickleball 2" },
  { id: "court-3", name: "Pickleball 3" },
];

const HOURS = Array.from({ length: 10 }, (_, i) => 7 + i); // 7:00 to 16:00

// Randomly book some slots for demo
const INITIAL_BOOKED = [
  "court-1-12", "court-1-13",
  "court-2-9", "court-2-10", "court-2-14", "court-2-15",
  "court-3-15",
];

const PRICE_PER_HOUR = 140000; // 140k/hour

const VisualBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clubName = (location.state as any)?.clubName || "Coco Pickle Club";
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggleSlot = (courtId: string, hour: number) => {
    const slotId = `${courtId}-${hour}`;
    if (INITIAL_BOOKED.includes(slotId)) return;

    if (selectedSlots.includes(slotId)) {
      setSelectedSlots(selectedSlots.filter((id) => id !== slotId));
    } else {
      setSelectedSlots([...selectedSlots, slotId]);
    }
  };

  const totalHours = selectedSlots.length; // Each slot is 1 hour in this grid
  const totalPrice = totalHours * PRICE_PER_HOUR;

  const handleNext = () => {
    // Convert selected slots to a format suitable for summary
    const slotsForSummary = selectedSlots.map(slotId => {
      const [courtId, hourStr] = slotId.split('-');
      const court = COURTS.find(c => c.id === courtId);
      const hour = parseInt(hourStr);
      return {
        id: slotId,
        court: court?.name || "Sân",
        time: `${hour}h00 - ${hour + 1}h00`,
        price: PRICE_PER_HOUR
      };
    });

    navigate("/booking-summary", {
      state: {
        summary: {
          clubName,
          date: selectedDate,
          slots: slotsForSummary,
          mode: "visual",
          total: totalPrice
        }
      }
    });
  };

  return (
    <Page className="bg-white flex flex-col h-[100dvh] pb-safe overflow-hidden">
      <Header title="Đặt lịch ngày trực quan" className="bg-[#283b91] text-white" textColor="white" />

      {/* Date Picker & Legend */}
      <div className="bg-[#283b91] p-4 pb-2">
        <div className="flex gap-2 mb-4">
          <div className="bg-white/20 rounded-lg p-2 flex-1 flex justify-between items-center text-white">
            <Text className="font-medium">29/01/2026</Text>
            <Icon icon="zi-calendar" />
          </div>
          <div className="flex bg-white/20 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${viewMode === 'grid' ? 'bg-white text-[#283b91]' : 'text-white'}`}
            >
              Lưới
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${viewMode === 'list' ? 'bg-white text-[#283b91]' : 'text-white'}`}
            >
              Danh sách
            </button>
          </div>
        </div>

        <div className="flex justify-between text-white text-xs mb-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-white rounded border border-gray-200"></div>
            <span>Trống</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-[#d32829] rounded"></div>
            <span>Đã đặt</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span>Khoá</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-purple-400 rounded flex items-center justify-center text-[10px] font-bold">!</div>
            <span>Sự kiện</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#eef2ff] p-2 text-center">
        <Text size="xSmall" className="text-[#283b91]">
          Lưu ý: Nếu bạn cần đặt lịch cố định vui lòng liên hệ: 0868.697.779 để được hỗ trợ.
        </Text>
      </div>

      {/* Grid or List View */}
      <div className="flex-1 overflow-auto p-2">
        {viewMode === 'grid' ? (
          <>
            {/* Time Header */}
            <div className="flex ml-[80px] mb-2 sticky top-0 bg-white z-10">
              {HOURS.map((hour) => (
                <div key={hour} className="flex-1 text-center text-xs text-gray-500 min-w-[50px]">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Rows */}
            <div className="space-y-2">
              {COURTS.map((court) => (
                <div key={court.id} className="flex h-16">
                  {/* Row Header */}
                  <div className="w-[80px] flex-shrink-0 bg-[#eef2ff] text-[#283b91] text-xs font-bold flex items-center justify-center p-1 border-r border-white">
                    {court.name}
                  </div>
                  
                  {/* Cells */}
                  <div className="flex flex-1">
                    {HOURS.map((hour) => {
                      const slotId = `${court.id}-${hour}`;
                      const isBooked = INITIAL_BOOKED.includes(slotId);
                      const isSelected = selectedSlots.includes(slotId);

                      return (
                        <div
                          key={slotId}
                          className={`flex-1 border-r border-b border-gray-100 min-w-[50px] cursor-pointer transition-colors
                            ${isBooked ? 'bg-red-500' : isSelected ? 'bg-[#283b91]' : 'bg-white'}
                          `}
                          onClick={() => toggleSlot(court.id, hour)}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {COURTS.map((court) => (
              <Box key={court.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <Text className="font-bold text-[#283b91]">{court.name}</Text>
                  <Text className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                    {HOURS.filter(h => !INITIAL_BOOKED.includes(`${court.id}-${h}`)).length} sân trống
                  </Text>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {HOURS.map((hour) => {
                    const slotId = `${court.id}-${hour}`;
                    const isBooked = INITIAL_BOOKED.includes(slotId);
                    const isSelected = selectedSlots.includes(slotId);
                    
                    return (
                      <div
                        key={slotId}
                        onClick={() => toggleSlot(court.id, hour)}
                        className={`py-2 text-center rounded-lg text-xs font-bold transition-all
                          ${isBooked 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : isSelected 
                              ? 'bg-[#283b91] text-white shadow-md scale-95' 
                              : 'bg-white text-gray-700 border border-gray-200 shadow-sm active:bg-gray-100'}
                        `}
                      >
                        {hour}:00
                      </div>
                    );
                  })}
                </div>
              </Box>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-[#283b91] text-white">
        <div className="flex justify-between items-center mb-4">
          <Text className="font-bold">Tổng giờ: {totalHours}h00</Text>
          <Text className="font-bold">Tổng tiền: {new Intl.NumberFormat('vi-VN').format(totalPrice)} đ</Text>
        </div>
        
        <div className="bg-white rounded-full h-1 mb-4 w-1/2 mx-auto relative">
           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#283b91] rounded-full border-2 border-white"></div>
        </div>

        <Button 
          fullWidth 
          className="bg-[#d32829] text-white font-bold rounded-lg"
          onClick={handleNext}
          disabled={selectedSlots.length === 0}
        >
          TIẾP THEO
        </Button>
      </div>
    </Page>
  );
};

export default VisualBookingPage;
