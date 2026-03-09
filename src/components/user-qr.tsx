import React from "react";
import { Box, Text } from "zmp-ui";
import QRCode from "qrcode.react";

interface UserQRProps {
  userId: string;
  name: string;
  packageId?: string;
  remainingDays?: number;
}

export const UserQR: React.FC<UserQRProps> = ({ userId, name, packageId, remainingDays }) => {
  // Data to encode in QR
  const qrData = JSON.stringify({
    uid: userId,
    n: name,
    pid: packageId || "none",
    d: remainingDays || 0,
    ts: Date.now()
  });

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="border-4 border-black p-2 rounded-lg mb-4">
        <QRCode 
          value={qrData} 
          size={200}
          level={"H"}
          includeMargin={true}
        />
      </div>
      <Text.Title size="small" className="font-bold mb-1">{name}</Text.Title>
      <Text size="xSmall" className="text-gray-500 text-center">
        Đưa mã này cho nhân viên để check-in
      </Text>
      {remainingDays !== undefined && (
        <div className="mt-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
          Còn {remainingDays} ngày
        </div>
      )}
    </div>
  );
};
