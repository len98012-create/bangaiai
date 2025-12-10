import React, { useRef, useEffect } from 'react';
import { Message } from '../types';

interface ChatUIProps {
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  isLoading: boolean;
  onSend: () => void;
}

export const ChatUI: React.FC<ChatUIProps> = ({ 
  messages, 
  inputText, 
  setInputText, 
  isLoading, 
  onSend 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-0 top-auto z-10 flex flex-col justify-end p-4 pointer-events-none sm:p-6 md:w-1/2 md:mx-auto lg:w-1/3">
      {/* Messages Area */}
      <div className="flex flex-col space-y-3 max-h-[50vh] overflow-y-auto mb-4 p-2 pointer-events-auto scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm text-sm sm:text-base ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white/90 backdrop-blur-md text-gray-800 rounded-bl-none border border-white/50'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl rounded-bl-none px-4 py-2 text-gray-500 text-sm animate-pulse">
              Gia Hân đang suy nghĩ...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pointer-events-auto bg-white/80 backdrop-blur-lg border border-white/40 p-2 rounded-full shadow-lg flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nói gì đó với Gia Hân đi..."
          disabled={isLoading}
          className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-gray-800 placeholder-gray-500 outline-none"
        />
        <button
          onClick={onSend}
          disabled={isLoading || !inputText.trim()}
          className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full transition-colors shadow-md flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
};