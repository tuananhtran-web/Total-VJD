import React, { useState } from "react";
import { Page, Text, Icon, Button, Box, useNavigate, Modal } from "zmp-ui";
import { featuredDeals } from "../mock/data";

interface PromoCardProps {
  title: string;
  subtitle: string;
  promoText: string;
  price?: string;
  address?: string;
  phone?: string;
  imageColor: string;
  buttonText?: string;
  theme?: 'swin' | 'coco' | 'yellow';
  onBook?: () => void;
}

const PromoCard: React.FC<PromoCardProps> = ({ 
  title, subtitle, promoText, price, address, phone, imageColor, buttonText = "ĐẶT LỊCH NGAY", theme = 'swin', onBook
}) => {
  return (
    <div 
      className="mx-4 mb-4 rounded-2xl overflow-hidden shadow-lg relative bg-white active:scale-95 transition-transform duration-200 ease-in-out cursor-pointer"
    >
      <div className={`h-48 relative ${imageColor} flex`}>
        <div className="w-1/2 p-3 flex flex-col justify-center relative z-10 bg-white/90" 
             style={{clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)'}}>
          <div className="mb-1">
             {theme === 'swin' && (
               <div className="flex items-center gap-1 mb-1">
                 <Icon icon="zi-star-solid" className="text-red-600" size={24} />
                 <Text className="font-black text-xl text-gray-800 leading-none">SWIN</Text>
               </div>
             )}
             <Text className="font-bold text-lg leading-tight uppercase">{title}</Text>
             <Text className="font-bold text-lg leading-tight text-red-600 uppercase">{subtitle}</Text>
          </div>
          <div className="mt-1">
            <Text className="text-blue-900 font-bold text-xs uppercase opacity-80">Ưu đãi</Text>
            <Text className="text-red-600 font-black text-3xl leading-none">{promoText}</Text>
            {price && <Text className="text-red-600 font-bold text-sm">{price}</Text>}
          </div>
          {(address || phone) && (
            <div className="mt-2 text-[10px] text-gray-600 font-medium">
               {phone && <div className="flex items-center gap-1"><Icon icon="zi-call" size={10} /> {phone}</div>}
               {address && <div className="flex items-center gap-1 line-clamp-1"><Icon icon="zi-location" size={10} /> {address}</div>}
            </div>
          )}
        </div>
        <div className="w-1/2 relative">
           {theme === 'swin' && (
             <>
               <div className="absolute top-0 right-0 w-full h-full opacity-20 bg-gradient-to-br from-blue-400 to-blue-600"></div>
               <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
                  <Icon icon="zi-more-grid" className="text-blue-800" size={20} />
               </div>
             </>
           )}
           <div className="absolute bottom-3 right-3">
             <button 
               className="bg-yellow-500 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 active:bg-yellow-700 transition-colors"
               onClick={(e) => {
                 e.stopPropagation();
                 onBook && onBook();
               }}
             >
               {buttonText}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedPage: React.FC = () => {
  const navigate = useNavigate();
  const [showBookingType, setShowBookingType] = useState(false);
  const [selectedClub, setSelectedClub] = useState("");

  const handleBook = (clubName: string) => {
    setSelectedClub(clubName);
    setShowBookingType(true);
  };

  const navigateToBooking = (mode: string) => {
    setShowBookingType(false);
    if (mode === 'visual') {
      navigate("/booking/visual", { state: { clubName: selectedClub, mode: 'visual' } });
    } else {
      navigate("/booking", { state: { clubName: selectedClub, mode } });
    }
  };

  return (
    <Page className="bg-white pb-20">
      <div className="pt-4 px-4 pb-2">
        <Text.Title size="large" className="text-[#283b91] font-black italic uppercase text-2xl">
          NỔI BẬT
        </Text.Title>
      </div>

      {featuredDeals.map((deal) => (
        <PromoCard 
          key={deal.id}
          title={deal.title}
          subtitle={deal.subtitle}
          promoText={deal.promoText}
          price={deal.price}
          imageColor={deal.imageColor}
          address={deal.address}
          phone={deal.phone}
          theme={deal.theme}
          onBook={() => handleBook(deal.title)}
        />
      ))}

      <Modal
        visible={showBookingType}
        title="Chọn hình thức đặt"
        onClose={() => setShowBookingType(false)}
        verticalActions
        actions={[
          { text: "Đặt theo ngày", onClick: () => navigateToBooking('daily') },
          { text: "Đặt lịch cố định", onClick: () => navigateToBooking('fixed') },
          { text: "Xem lịch trực quan", highLight: true, onClick: () => navigateToBooking('visual') },
          { text: "Đóng", onClick: () => setShowBookingType(false) },
        ]}
      >
        <div className="p-4 text-center">
           Bạn muốn đặt lịch cho <b>{selectedClub}</b> theo hình thức nào?
        </div>
      </Modal>

      <div className="fixed bottom-24 right-4 z-50">
        <Button
           icon={<Icon icon="zi-plus" size={24} />}
           className="rounded-full w-12 h-12 shadow-lg bg-[#283b91] p-0 flex items-center justify-center"
        />
      </div>
    </Page>
  );
};

export default FeaturedPage;
