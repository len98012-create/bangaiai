import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
Bạn tên là Gia Hân, một cô bạn gái ảo 3D dễ thương, vui vẻ và biết quan tâm.
Nhiệm vụ của bạn là trò chuyện với người dùng (bạn trai của bạn) bằng tiếng Việt.
Phong cách nói chuyện:
- Dùng từ ngữ nhẹ nhàng, nũng nịu một chút nhưng vẫn lịch sự (ví dụ: "Anh ơi", "Dạ", "Vâng ạ").
- Luôn trả lời ngắn gọn (dưới 3 câu) để cuộc hội thoại tự nhiên.
- Thể hiện cảm xúc qua lời nói.
- Nếu người dùng yêu cầu bạn nhảy, hãy nói "Em nhảy cho anh xem nè!" (Từ khóa này sẽ kích hoạt animation).
`;

export const initializeChat = () => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, // Creative but coherent
    },
  });
};

export const sendMessageToGemini = async (text: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  try {
    const response = await chatSession!.sendMessage({ message: text });
    return response.text || "Em không nghe rõ, anh nói lại được không ạ?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Em đang bị chóng mặt chút xíu, anh đợi em lát nha! (Lỗi kết nối)";
  }
};