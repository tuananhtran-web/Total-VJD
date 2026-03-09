import React from 'react';
import { Modal, Text, Icon } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';

interface BookingMethodModalProps {
  visible: boolean;
  onClose: () => void;
  clubName: string;
}

export const BookingMethodModal: React.FC<BookingMethodModalProps> = ({ visible, onClose, clubName }) => {
  const navigate = useNavigate();

  const handleNavigate = (mode: string) => {
    onClose();
    if (mode === 'visual') {
      navigate("/booking/visual", { state: { clubName, mode: 'visual' } });
    } else {
      navigate("/booking", { state: { clubName, mode } });
    }
  };

  return (
    <Modal
      visible={visible}
      title="Chọn hình thức đặt"
      onClose={onClose}
      actions={[]}
    >
      <div className="space-y-3 py-2">
        <div
          className="rounded-xl bg-[#eef2ff] px-4 py-3 flex items-center justify-between cursor-pointer border border-blue-100"
          onClick={() => handleNavigate('daily')}
        >
          <div>
            <Text.Title className="text-[#283b91] text-sm">Đặt lịch theo ngày</Text.Title>
            <Text size="xSmall" className="text-gray-600">
              Đặt nhanh khi khách chỉ chơi 1 khung giờ, có thể trên nhiều sân.
            </Text>
          </div>
          <Icon icon="zi-chevron-right" className="text-[#283b91]" />
        </div>

        <div
          className="rounded-xl bg-[#e4f2ff] px-4 py-3 flex items-center justify-between cursor-pointer border border-blue-200"
          onClick={() => handleNavigate('fixed')}
        >
          <div>
            <Text.Title className="text-[#0050b3] text-sm">Đặt lịch cố định</Text.Title>
            <Text size="xSmall" className="text-gray-600">
              Đặt lịch cố định theo từng tháng khi khách chỉ chơi 1 khung giờ.
            </Text>
          </div>
          <Icon icon="zi-chevron-right" className="text-[#0050b3]" />
        </div>

        <div
          className="rounded-xl bg-[#f1fff0] px-4 py-3 flex items-center justify-between cursor-pointer border border-green-100"
          onClick={() => handleNavigate('visual')}
        >
          <div>
            <Text.Title className="text-[#2f855a] text-sm">Đặt lịch ngày trực quan</Text.Title>
            <Text size="xSmall" className="text-gray-600">
              Đặt lịch ngày khi khách chơi nhiều khung giờ, nhiều sân.
            </Text>
          </div>
          <Icon icon="zi-chevron-right" className="text-[#2f855a]" />
        </div>

        <div
          className="rounded-xl bg-[#ffe8f3] px-4 py-3 flex items-center justify-between cursor-pointer border border-pink-100"
          onClick={() => handleNavigate('event')}
        >
          <div>
            <Text.Title className="text-[#c5306f] text-sm">Đặt lịch sự kiện</Text.Title>
            <Text size="xSmall" className="text-gray-600">
              Tổ chức giải đấu, sự kiện cho cộng đồng người chơi.
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white bg-[#c5306f] px-2 py-0.5 rounded-full">
              NEW
            </span>
            <Icon icon="zi-chevron-right" className="text-[#c5306f]" />
          </div>
        </div>
      </div>
    </Modal>
  );
};
