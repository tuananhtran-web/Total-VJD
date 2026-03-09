import React, { useRef, useEffect } from 'react';
import { Box } from 'zmp-ui';

export interface BannerMedia {
  type: 'image' | 'video';
  url: string;
  poster?: string; // For video
}

interface HomeBannerProps {
  media: BannerMedia;
}

export const HomeBanner: React.FC<HomeBannerProps> = ({ media }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (media.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, [media]);

  return (
    <Box className="w-full h-48 sm:h-64 bg-gray-200 relative overflow-hidden mb-4">
      {media.type === 'video' ? (
        <video
          ref={videoRef}
          src={media.url}
          poster={media.poster}
          className="w-full h-full object-cover"
          playsInline
          muted
          loop
          autoPlay
        />
      ) : (
        <img
          src={media.url}
          alt="Home Banner"
          className="w-full h-full object-cover"
        />
      )}
    </Box>
  );
};
