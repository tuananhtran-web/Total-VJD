import React, { useState } from "react";
import { Sheet, Button, Text, Box, Radio } from "zmp-ui";

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
  categories: { id: string; name: string }[];
}

export interface FilterState {
  sportType: string | null;
  maxDistance: number;
  bookingType: 'all' | 'daily' | 'event';
}

export const FilterSheet: React.FC<FilterSheetProps> = ({ 
  visible, 
  onClose, 
  onApply, 
  initialFilters,
  categories 
}) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const distances = [2, 5, 10, 20];

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      mask
      handler
      swipeToClose
      height="auto"
    >
      <Box className="p-4 pb-8">
        <div className="flex justify-between items-center mb-6">
          <Text.Title size="large">Bộ lọc tìm kiếm</Text.Title>
          <div onClick={onClose} className="text-gray-500 font-medium text-sm">Đóng</div>
        </div>

        {/* Sport Type */}
        <div className="mb-6">
          <Text.Title size="small" className="mb-3 font-bold">Môn thể thao</Text.Title>
          <div className="flex flex-wrap gap-2">
            <div 
              onClick={() => setFilters({ ...filters, sportType: null })}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                filters.sportType === null 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              Tất cả
            </div>
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setFilters({ ...filters, sportType: cat.id })}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                  filters.sportType === cat.id 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {cat.name}
              </div>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div className="mb-6">
          <Text.Title size="small" className="mb-3 font-bold">Khoảng cách</Text.Title>
          <div className="flex flex-wrap gap-2">
             {distances.map((dist) => (
               <div
                key={dist}
                onClick={() => setFilters({ ...filters, maxDistance: dist })}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                  filters.maxDistance === dist
                    ? 'bg-secondary text-black border-secondary' 
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                &lt; {dist}km
              </div>
             ))}
             <div
                onClick={() => setFilters({ ...filters, maxDistance: 100 })}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                  filters.maxDistance === 100
                    ? 'bg-secondary text-black border-secondary' 
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                Tất cả
              </div>
          </div>
        </div>

        {/* Booking Type */}
        <div className="mb-8">
          <Text.Title size="small" className="mb-3 font-bold">Loại hình</Text.Title>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'daily', label: 'Đặt sân ngày' },
              { id: 'event', label: 'Sự kiện / Giải đấu' }
            ].map((type) => (
              <div
                key={type.id}
                onClick={() => setFilters({ ...filters, bookingType: type.id as any })}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                  filters.bookingType === type.id
                    ? 'bg-accent text-white border-accent' 
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {type.label}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <Button 
          fullWidth 
          onClick={handleApply}
          className="bg-primary text-white rounded-full font-bold h-12"
        >
          Áp dụng bộ lọc
        </Button>
      </Box>
    </Sheet>
  );
};
