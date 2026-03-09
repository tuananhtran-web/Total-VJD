import React, { useState } from 'react';
import { Page, Icon, Text, Header, useNavigate } from 'zmp-ui';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ClubDetailSheet } from '../components/club-detail-sheet';
import { clubs, Club } from '../mock/data';

// Fix for Leaflet default icon not showing
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapMarkerProps {
  id: number;
  lat: number;
  lng: number;
  name: string;
  type: string;
}

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const markers: MapMarkerProps[] = [
    { id: 1, lat: 10.6865, lng: 106.7025, name: 'Sân Cầu Lông & Pickleballs B&B Đào Sư Tích', type: 'badminton' },
    { id: 2, lat: 10.6880, lng: 106.7040, name: 'Nhà Bè Badminton Pickleball - Sân mái che', type: 'pickleball' },
    { id: 3, lat: 10.7300, lng: 106.7250, name: 'CLB Cầu Lông Phú Mỹ', type: 'badminton' },
    { id: 4, lat: 10.7450, lng: 106.7350, name: 'Trung tâm Thể thao Huỳnh Tấn Phát', type: 'football' },
    { id: 5, lat: 10.7200, lng: 106.7100, name: 'Sân Tennis Hồ Thiên Nga', type: 'tennis' },
  ];

  const handleMarkerClick = (markerName: string) => {
    // Find club in mock data by name, or use first one as fallback for demo
    const club = clubs.find(c => c.name === markerName) || clubs[0];
    setSelectedClub(club);
    setIsSheetVisible(true);
  };

  return (
    <Page className="h-full flex flex-col">
      <Header title="Bản đồ sân" className="bg-[#283b91] text-white" textColor="white" showBackIcon={false} />
      
      <div className="flex-1 relative z-0">
        <MapContainer 
            center={[10.762622, 106.660172]} 
            zoom={14} 
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {markers.map((marker) => (
            <Marker 
              key={marker.id} 
              position={[marker.lat, marker.lng]}
              eventHandlers={{
                click: () => handleMarkerClick(marker.name),
              }}
            >
            </Marker>
          ))}
        </MapContainer>

        {/* Overlay Search & Filter */}
        <div className="absolute top-4 left-4 right-4 z-[1000]">
           <div className="bg-white rounded-lg shadow-lg p-2 flex items-center gap-2 mb-2">
             <Icon icon="zi-search" className="text-gray-400" />
             <input 
               placeholder="Tìm kiếm khu vực..." 
               className="flex-1 outline-none text-sm"
             />
           </div>
           
           <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <div className="bg-white px-3 py-1 rounded-full shadow-md text-xs font-medium text-[#283b91]">
                 Tất cả
              </div>
              <div className="bg-white px-3 py-1 rounded-full shadow-md text-xs font-medium text-gray-600">
                 Pickleball
              </div>
              <div className="bg-white px-3 py-1 rounded-full shadow-md text-xs font-medium text-gray-600">
                 Cầu lông
              </div>
           </div>
        </div>
      </div>

      <ClubDetailSheet 
        club={selectedClub}
        visible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
      />
    </Page>
  );
};

export default MapPage;