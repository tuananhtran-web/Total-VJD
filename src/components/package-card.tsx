import React from 'react';
import { Box, Text, Icon, useNavigate } from 'zmp-ui';
import { Package } from '../services/package-service';

interface PackageCardProps {
  pkg: Package;
  onClick?: () => void;
  isAdmin?: boolean;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onClick, isAdmin }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (!isAdmin) {
      navigate('/pages/packages/detail', { state: { pkg } });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <Box 
      className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 relative cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Sale Badge - Shopee Style */}
      {pkg.saleBadge && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-red-600 text-xs font-bold px-2 py-1 z-10">
          <div className="flex flex-col items-center leading-3">
            <span>GIẢM</span>
            <span>{pkg.saleBadge}</span>
          </div>
          {/* Triangle effect */}
          <div className="absolute top-full right-0 border-l-[24px] border-l-transparent border-t-[4px] border-t-yellow-400"></div>
        </div>
      )}

      {/* Hot Badge */}
      {pkg.isHot && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold z-10 shadow-sm">
          Yêu thích
        </div>
      )}

      {/* Image */}
      <div 
        className="w-full h-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${pkg.image})`, backgroundColor: '#f0f0f0' }}
      />

      {/* Content */}
      <div className="p-3">
        <Text.Title size="small" className="font-bold line-clamp-2 mb-2 h-10">{pkg.name}</Text.Title>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Text size="xxSmall" className="text-gray-400 line-through decoration-gray-400">
              {formatCurrency(pkg.originalPrice)}
            </Text>
            {pkg.saleBadge && (
               <span className="text-[10px] text-red-500 border border-red-500 px-1 rounded-sm">
                 -{pkg.saleBadge}
               </span>
            )}
          </div>
          
          <div className="flex justify-between items-end mt-1">
            <Text size="large" className="text-primary font-bold">
              {formatCurrency(pkg.currentPrice)}
            </Text>
            
            {!isAdmin && (
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform">
                <Icon icon="zi-plus" size={20} />
              </div>
            )}
          </div>
        </div>
        
        {pkg.description && (
          <div className="mt-2 pt-2 border-t border-gray-100">
             <Text size="xxSmall" className="text-gray-500 line-clamp-1">
               <Icon icon="zi-check-circle-solid" size={10} className="text-green-500 mr-1 inline" />
               {pkg.description}
             </Text>
          </div>
        )}
      </div>
    </Box>
  );
};
