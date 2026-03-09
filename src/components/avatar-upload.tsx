import React, { useState, useRef } from "react";
import { Box, Button, Icon, Slider, Modal } from "zmp-ui";

export interface AvatarUploadProps {
  currentAvatar: string;
  onSave: (newAvatar: string) => void;
  isAdmin?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatar, onSave, isAdmin }) => {
  const [image, setImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showCrop, setShowCrop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setShowCrop(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    // In a real app, we would crop the image using canvas here based on zoom and position
    // For mock, we just return the original image
    if (image) {
      onSave(image);
      setShowCrop(false);
      setImage(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <img 
          src={currentAvatar} 
          alt="Avatar" 
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <div 
          className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Icon icon="zi-camera" className="text-white" />
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />

      <Modal
        visible={showCrop}
        title="Chỉnh sửa ảnh đại diện"
        onClose={() => setShowCrop(false)}
        actions={[
          { text: "Hủy", onClick: () => setShowCrop(false) },
          { text: "Lưu", highLight: true, onClick: handleSave }
        ]}
      >
        <div className="p-4 flex flex-col items-center">
          <div className="w-64 h-64 overflow-hidden rounded-full border-2 border-primary relative mb-4">
            {image && (
              <img 
                src={image} 
                style={{ transform: `scale(${zoom})` }}
                className="w-full h-full object-cover transition-transform"
                alt="Crop preview"
              />
            )}
          </div>
          <div className="w-full px-4">
            <Slider 
              min={1} 
              max={3} 
              step={0.1} 
              value={zoom} 
              onChange={(val) => setZoom(val as number)} 
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
