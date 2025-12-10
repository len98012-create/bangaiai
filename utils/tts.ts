// Configuration for Fish Audio (External TTS)
const FISH_API_KEY = process.env.FISH_API_KEY;
const MODEL_ID = "acc8237220d8470985ec9be6c4c480a9"; // Miku/Loli voice model ID

let currentAudio: HTMLAudioElement | null = null;

export const speakText = async (text: string, onStart: () => void, onEnd: () => void) => {
  // 1. Stop any currently playing audio or speech
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  // 2. Try Fish Audio API if Key is available
  if (FISH_API_KEY) {
    try {
      const response = await fetch("https://api.fish.audio/v1/tts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${FISH_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text,
          reference_id: MODEL_ID,
          format: "mp3",
          mp3_bitrate: 128
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        currentAudio = audio;

        audio.onplay = () => onStart();
        audio.onended = () => {
          onEnd();
          URL.revokeObjectURL(url);
          if (currentAudio === audio) currentAudio = null;
        };
        audio.onerror = (e) => {
          console.error("Audio Playback Error:", e);
          onEnd();
          if (currentAudio === audio) currentAudio = null;
        };

        await audio.play();
        return; // Success, exit function
      } else {
        console.warn(`Fish Audio API error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.warn("Fish Audio fetch failed, falling back to Web Speech API", err);
    }
  }

  // 3. Fallback: Web Speech API (Tuned for Loli Voice)
  if (!window.speechSynthesis) {
    onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();

  // Voice Selection Strategy:
  // 1. Google Tiếng Việt (usually best quality)
  // 2. Any Vietnamese voice
  let selectedVoice = voices.find(v => v.lang === 'vi-VN' && v.name.includes('Google'));
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.lang.includes('vi'));
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  } else {
    utterance.lang = 'vi-VN';
  }

  // Loli Voice Settings (Cute & Gentle)
  utterance.pitch = 1.6; // High pitch for younger/cuter sound
  utterance.rate = 1.15; // Slightly faster
  utterance.volume = 1.0;

  utterance.onstart = () => onStart();
  utterance.onend = () => onEnd();
  utterance.onerror = (e) => {
    console.error("TTS Error:", e);
    onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

// Preload voices
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}