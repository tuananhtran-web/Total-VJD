import React, { useState } from "react";
import { Page, Header, Box, Text, Input, Button, Radio, useSnackbar } from "zmp-ui";
import { sendNotification } from "../../../services/notification-service";
import { useNavigate } from "react-router-dom";

const SendNotificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState<'all' | 'selected'>('all');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!title || !body) {
      openSnackbar({ text: "Vui lòng nhập tiêu đề và nội dung", type: "warning" });
      return;
    }

    setLoading(true);
    try {
      await sendNotification(title, body, target);
      openSnackbar({ text: "Gửi thông báo thành công!", type: "success" });
      navigate(-1);
    } catch (error) {
      openSnackbar({ text: "Gửi thất bại", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="bg-white">
      <Header title="Gửi thông báo" />
      
      <Box className="p-4">
        <div className="mb-4">
          <Text className="font-bold mb-2">Tiêu đề</Text>
          <Input 
            placeholder="Nhập tiêu đề..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <Text className="font-bold mb-2">Nội dung</Text>
          <Input.TextArea 
            placeholder="Nhập nội dung thông báo..." 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
          />
        </div>

        <div className="mb-6">
          <Text className="font-bold mb-2">Đối tượng gửi</Text>
          <div className="flex flex-col gap-2">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setTarget('all')}
            >
              <input type="radio" checked={target === 'all'} readOnly />
              <Text>Tất cả người dùng</Text>
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setTarget('selected')}
            >
              <input type="radio" checked={target === 'selected'} readOnly />
              <Text>Chọn người dùng cụ thể (Demo)</Text>
            </div>
          </div>
        </div>

        <Button 
          fullWidth 
          onClick={handleSend}
          loading={loading}
        >
          Gửi thông báo
        </Button>
      </Box>
    </Page>
  );
};

export default SendNotificationPage;
