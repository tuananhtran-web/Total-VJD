import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Icon, Button, Input } from 'zmp-ui';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Xin chào! Tôi là VJD - Sports. Tôi có thể giúp bạn tìm sân và đặt lịch nhanh chóng. Bạn muốn đặt sân ở đâu?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastRequestRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (retryCount = 0) => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    if (retryCount === 0) {
        setInput('');
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
    }
    setLoading(true);

    try {
      const now = Date.now();
      const diff = now - (lastRequestRef.current || 0);
      if (diff < 1500) {
        await new Promise(r => setTimeout(r, 1500 - diff));
      }
      console.log("Calling Gemini API (Attempt " + (retryCount + 1) + ")");
      
      // Optimize history: only take the last 5 messages to save tokens
      const recentMessages = messages.slice(-4); // Last 4 + the new message = 5
      const currentMessages = retryCount === 0 ? [...recentMessages, { role: 'user', content: userMessage }] : messages.slice(-5);

      const contents = currentMessages
        .filter((msg, index) => !(index === 0 && msg.role === 'assistant'))
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));

      const systemInstruction = `Bạn là trợ lý ảo VJD - Sports.
Nhiệm vụ: Giải đáp thắc mắc và giúp người dùng đặt sân thể thao.

Dữ liệu ngữ cảnh:
- Các môn thể thao: Pickleball, Cầu lông, Bóng đá, Tennis, Bóng rổ.
- Hành động đặc biệt:
  Nếu người dùng muốn đặt sân, hãy trả về văn bản phản hồi bình thường và kết thúc bằng chuỗi JSON: {"action": "NAVIGATE_BOOKING", "clubName": "Tên CLB khách muốn", "sport": "Tên môn thể thao"}.`;

      const body = {
        contents: [
          {
            role: 'user',
            parts: [{ text: systemInstruction }]
          },
          ...contents
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 256, // Reduced to save tokens on free tier
        }
      };

      lastRequestRef.current = Date.now();
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (response.status === 429 && retryCount < 2) {
        const delay = Math.min(1500 * Math.pow(2, retryCount + 1), 8000);
        await new Promise(r => setTimeout(r, delay));
        setLoading(false);
        return handleSend(retryCount + 1);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Lỗi HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Gemini API Success Response:", data);
      
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tôi không nhận được phản hồi từ trí tuệ nhân tạo. Vui lòng thử lại.";
      
      // Check for actions in AI text
      if (aiText.includes('{"action":')) {
        try {
          const actionPart = aiText.match(/\{"action":.*\}/)?.[0];
          if (actionPart) {
            const actionData = JSON.parse(actionPart);
            // We'll handle navigation logic here or emit an event
            console.log("AI Action Triggered:", actionData);
            
            // Clean the text to show to user
            const cleanText = aiText.replace(actionPart, "").trim();
            setMessages(prev => [...prev, { role: 'assistant', content: cleanText || "Đang chuyển hướng bạn đến trang đặt sân..." }]);
            
            // Execute action (simulation for now, can be expanded with event emitter)
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('AI_ACTION', { detail: actionData }));
            }, 1500);
            
          } else {
            setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
          }
        } catch (e) {
          setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-36 right-4 z-[100]">
      {isOpen ? (
        <Box className="bg-white rounded-2xl shadow-2xl w-[320px] h-[450px] flex flex-col overflow-hidden border border-gray-100">
          <div className="bg-[#283b91] p-3 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Icon icon="zi-chat" size={20} />
              </div>
              <Text className="font-bold">VJD - Sports</Text>
            </div>
            <Icon icon="zi-close" onClick={() => setIsOpen(false)} className="cursor-pointer" />
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#283b91] text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(0)}
                placeholder="Nhập yêu cầu..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#283b91]"
              />
              <div 
                onClick={() => handleSend(0)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${
                  input.trim() ? 'bg-[#283b91] scale-100' : 'bg-gray-300 scale-90'
                }`}
              >
                <Icon icon="zi-send-solid" size={20} />
              </div>
            </div>
          </div>
        </Box>
      ) : (
        <div 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#283b91] rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform relative border-2 border-white"
        >
          <Icon icon="zi-chat" size={28} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        </div>
      )}
    </div>
  );
};
