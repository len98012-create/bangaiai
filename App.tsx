import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Loader, ContactShadows } from '@react-three/drei';
import { Avatar } from './components/Avatar';
import { ChatUI } from './components/ChatUI';
import { sendMessageToGemini, initializeChat } from './services/geminiService';
import { speakText } from './utils/tts';
import { Message, CharacterAnimation } from './types';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Chào anh! Em là Gia Hân đây. Hôm nay anh thế nào?', timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<string>(CharacterAnimation.IDLE);

  // Initialize Chat on mount
  useEffect(() => {
    initializeChat();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText(''); // Clear input immediately
    setIsLoading(true);

    // 1. Add User Message
    setMessages(prev => [...prev, { role: 'user', text: userText, timestamp: Date.now() }]);

    // 2. Get AI Response
    const responseText = await sendMessageToGemini(userText);
    
    setIsLoading(false);
    setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);

    // 3. Determine Animation & Speak
    // Simple keyword detection for 'Dance' intent
    const lowerRes = responseText.toLowerCase();
    if (lowerRes.includes("nhảy") || lowerRes.includes("dance")) {
      handleSpeech(responseText, CharacterAnimation.DANCE);
    } else {
      handleSpeech(responseText, CharacterAnimation.TALKING);
    }
  };

  const handleSpeech = (text: string, activeAnim: string) => {
    speakText(
      text,
      () => {
        // On Start Speech
        setCurrentAnimation(activeAnim);
      },
      () => {
        // On End Speech
        setCurrentAnimation(CharacterAnimation.IDLE);
      }
    );
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-purple-50 to-pink-100">
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 1.5, 5], fov: 50 }}>
          <Suspense fallback={null}>
            <Environment preset="sunset" />
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            
            <Avatar animation={currentAnimation} />
            
            {/* ContactShadows moved to -1 to match Avatar feet */}
            <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#000000" />
            
            <OrbitControls 
              enablePan={false} 
              enableZoom={false} // Disable zoom to keep frame fixed
              minPolarAngle={Math.PI / 2.5} 
              maxPolarAngle={Math.PI / 1.8}
              target={[0, 1, 0]} // CRITICAL: Look at Y=1 (Upper body/Chest) instead of feet
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Loading Overlay for 3D Assets */}
      <Loader 
        containerStyles={{
            backgroundColor: '#fce7f3', // Light pink background
        }}
        innerStyles={{
            backgroundColor: '#ec4899', // Pink bar
            height: '10px'
        }}
        barStyles={{
            backgroundColor: '#831843' // Dark pink progress
        }}
        dataInterpolation={(p) => `Loading Gia Hân... ${p.toFixed(0)}%`} 
      />

      {/* Header / Instructions */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none z-10">
        <div className="bg-white/40 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white/50">
          <h1 className="text-xl font-bold text-gray-800">Bạn gái ảo Gia Hân 🐰</h1>
          <p className="text-xs text-gray-600">Sử dụng tai nghe để nghe giọng nói.</p>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatUI 
        messages={messages} 
        inputText={inputText} 
        setInputText={setInputText} 
        isLoading={isLoading} 
        onSend={handleSend} 
      />
    </div>
  );
}
