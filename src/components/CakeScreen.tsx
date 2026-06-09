import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Volume2, Sparkles, Heart, RefreshCw } from "lucide-react";

interface CakeScreenProps {
  recipientName: string;
  onBlown: () => void;
}

export default function CakeScreen({ recipientName, onBlown }: CakeScreenProps) {
  const [isBlown, setIsBlown] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isConnectingMic, setIsConnectingMic] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  
  // Refs to clean up microhpone listeners
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const handleBlowOut = () => {
    if (isBlown) return;
    setIsBlown(true);
    setMicVolume(0);
    
    // Stop mic if active
    stopMic();

    // Trigger parent callback after a brief delightful animation
    setTimeout(() => {
      onBlown();
    }, 1500);
  };

  const startMic = async () => {
    setMicError(null);
    setIsConnectingMic(true);
    try {
      // In iframes, permission might need requestFramePermissions matching
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setIsMicActive(true);
      setIsConnectingMic(false);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioCtxRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let blowThresholdTimes = 0;

      const checkVolume = () => {
        if (!micStreamRef.current || isBlown) return;
        
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        setMicVolume(average);

        // Blow threshold (rumble, heavy air volume hits higher frequency / base average)
        if (average > 65) {
          blowThresholdTimes++;
          // Require steady blow for a few ticks to prevent casual click spikes
          if (blowThresholdTimes >= 4) {
            handleBlowOut();
            return;
          }
        } else {
          blowThresholdTimes = Math.max(0, blowThresholdTimes - 1);
        }

        requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err: any) {
      console.warn("MediaDevices microphone failure:", err);
      setIsConnectingMic(false);
      setMicError(
        "Izin mik tidak aktif atau tidak didukung di peramban ini. Klik tombol atau lilin untuk meniup! 💕"
      );
    }
  };

  const stopMic = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsMicActive(false);
    setMicVolume(0);
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-between min-h-[85vh] w-full max-w-lg mx-auto p-4 z-10 text-center">
      {/* Title greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mt-6 space-y-2 select-none"
      >
        <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-semibold uppercase tracking-wider text-shadow-pink">
          Sweet 17th Celebration
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-rose-600 leading-tight">
          HAPPY BIRTHDAY SAYANG💗
        </h1>
        <p className="text-gray-600 font-sans text-sm max-w-sm mx-auto">
          Happy Birthday, my beautiful girl. Wishing you all the happiness in the world today and always.💗
        </p>
      </motion.div>

      {/* Interactive Birthday Cake and Candle */}
      <div className="relative my-8 py-4 flex flex-col items-center justify-center h-72 w-full">
        {/* Glow behind cake */}
        <div className="absolute inset-x-0 bottom-12 h-36 bg-pink-200/40 rounded-full blur-3xl -z-10 animate-pulse" />

        {/* SVG Cake Container and Animations */}
        <div className="relative cursor-pointer select-none" onClick={handleBlowOut}>
          
          {/* Flame element */}
          <AnimatePresence>
            {!isBlown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: [1, 1.1, 0.95, 1], y: [0, -1, 0, -2] }}
                exit={{ opacity: 0, scale: 0, y: -20 }}
                transition={{
                  scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                  y: { repeat: Infinity, duration: 0.8, ease: "easeInOut" }
                }}
                className="absolute top-[-36px] left-[50%] translate-x-[-50%] flex flex-col items-center pointer-events-none"
              >
                {/* Outer Flame (Yellow Glow) */}
                <span className="w-5 h-8 bg-amber-400 rounded-full rounded-t-full filter blur-[1px] opacity-90 animate-pulse" />
                {/* Inner Flame (Orange-Red Hot Core) */}
                <span className="absolute bottom-1 w-3 h-5 bg-rose-500 rounded-full rounded-t-full" />
                {/* Blue Root */}
                <span className="absolute bottom-0 w-2 h-2 bg-blue-400 rounded-full opacity-70" />
                
                {/* Floating spark particles */}
                <span className="absolute top-[-5px] right-2 w-1 h-1 bg-yellow-300 rounded-full ring-2 ring-yellow-200 animate-ping" />
                <span className="absolute top-2 left-3 w-0.5 h-0.5 bg-yellow-200 rounded-full animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Smoke particle when blown out */}
          <AnimatePresence>
            {isBlown && (
              <motion.div
                initial={{ opacity: 0, y: -25, scale: 0.8 }}
                animate={{ opacity: [0, 0.5, 0.2, 0], y: -80, scale: 1.5, x: [-5, 8, -10, 5] }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute top-[-40px] left-[50%] translate-x-[-50%] pointer-events-none"
              >
                {/* Smoke Vector cloud */}
                <svg className="w-8 h-8 text-slate-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a4 4 0 00-4 4h1a3 3 0 116 0h1a4 4 0 00-4-4zm0 6a3 3 0 00-3 3h1a2 2 0 114 0h1a3 3 0 00-3-3zm0 5a2 2 0 00-2 2h1a1 1 0 112 0h1a2 2 0 00-2-2z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Candle wick */}
          <div className="absolute top-[-10px] left-[103px] w-1 h-3 bg-neutral-600 rounded-full" />

          {/* 17 Candley structure */}
          <div className="absolute top-[-2px] left-[93px] flex items-end space-x-1">
            {/* Number 1 */}
            <div className="w-1.5 h-10 bg-gradient-to-t from-pink-500 to-amber-300 rounded-full shadow-inner flex justify-center border border-white/20">
              <div className="w-0.5 h-full bg-white/40" />
            </div>
            {/* Number 7 */}
            <div className="w-1.5 h-10 bg-gradient-to-t from-pink-500 to-amber-300 rounded-full shadow-inner flex justify-center border border-white/20 transform rotate-12">
              <div className="w-0.5 h-full bg-white/40" />
            </div>
          </div>

          <div className="absolute top-[8px] left-[100px] text-[10px] font-bold text-shadow-pink text-pink-700 bg-white/80 px-1.5 py-0.2 rounded-full border border-pink-200 select-none scale-95 pointer-events-none">
            17
          </div>

          {/* THE SVG CAKE */}
          <svg
            width="210"
            height="180"
            viewBox="0 0 210 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-xl hover:scale-105 transition-all duration-300 ease-out"
          >
            {/* Cake Plate Stand */}
            <path d="M15 150 C 15 165, 195 165, 195 150 L 160 170 C 160 170, 160 175, 140 175 C 120 175, 90 175, 70 175 C 50 175, 50 170, 50 170 Z" fill="#E2E8F0" />
            <ellipse cx="105" cy="150" rx="90" ry="12" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="2" />

            {/* Cake Layer 1 (Bottom - Strawberry Chocolate) */}
            <rect x="35" y="100" width="140" height="42" rx="6" fill="#F472B6" />
            {/* Cake Layer 1 Top Cream Ellipse */}
            <ellipse cx="105" cy="100" rx="70" ry="8" fill="#FBCFE8" />
            
            {/* Cream Drips on Bottom Layer */}
            <path d="M 35 100 Q 42 118 49 100 Q 56 122 63 100 Q 70 114 77 100 Q 84 125 91 100 Q 98 116 105 100 Q 112 121 119 100 Q 126 113 133 100 Q 140 123 147 100 Q 154 115 161 100 Q 168 119 175 100 L 175 110 Q 150 115 105 115 Q 60 115 35 110 Z" fill="#FBCFE8" />

            {/* Sparkles / Candies on Bottom Layer */}
            <circle cx="50" cy="122" r="2.5" fill="#FCD34D" />
            <circle cx="80" cy="128" r="2.5" fill="#38BDF8" className="animate-pulse" />
            <circle cx="110" cy="125" r="2" fill="#A78BFA" />
            <circle cx="135" cy="129" r="2.5" fill="#4ADE80" />
            <circle cx="160" cy="122" r="2" fill="#F472B6" />

            {/* Cake Layer 2 (Top - Choco Frosting with Pink Swirls) */}
            <rect x="50" y="55" width="110" height="38" rx="6" fill="#EC4899" />
            {/* Cake Layer 2 Top Cream Ellipse */}
            <ellipse cx="105" cy="55" rx="55" ry="6" fill="#F472B6" />
            {/* Cream drips on middle layer */}
            <path d="M 50 55 Q 56 68 62 55 Q 68 72 74 55 Q 80 66 86 55 Q 92 73 98 55 Q 104 64 110 55 Q 116 71 122 55 Q 128 66 134 55 Q 140 73 146 55 Q 152 64 158 55 Q 160 55 160 55 L 160 62 Q 135 66 105 66 Q 75 66 50 62 Z" fill="#F472B6" />

            {/* Little Whipped Cream Swirls on Top */}
            <circle cx="60" cy="53" r="5" fill="#FFF" stroke="#FFD1DC" strokeWidth="1" />
            <circle cx="82" cy="51" r="5" fill="#FFF" stroke="#FFD1DC" strokeWidth="1" />
            <circle cx="105" cy="49" r="5" fill="#FFF" stroke="#FFD1DC" strokeWidth="1" />
            <circle cx="128" cy="51" r="5" fill="#FFF" stroke="#FFD1DC" strokeWidth="1" />
            <circle cx="150" cy="53" r="5" fill="#FFF" stroke="#FFD1DC" strokeWidth="1" />

            {/* Glowing Cheery Strawberry */}
            <g transform="translate(100, 31)">
              <ellipse cx="5" cy="5" rx="6" ry="7" fill="#E11D48" />
              <path d="M 5 0 Q 7 -6 10 -8" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
              {/* Strawberry light reflection */}
              <circle cx="3" cy="3" r="1.5" fill="#FFF" opacity="0.6" />
            </g>
          </svg>

          {/* Prompt banner under cake */}
          <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
            <span className="text-xs bg-white/70 hover:bg-white/90 text-rose-500 px-3 py-1 rounded-full border border-rose-100 font-sans shadow-sm inline-flex items-center space-x-1 transition-all duration-300">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>{isBlown ? "JENG JENG JENG" : "make a wish sayang"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Blowing controls (Microphone Integration / Interactive Clicker) */}
      <div className="w-full max-w-sm bg-white/65 backdrop-blur-md p-4 rounded-3xl border border-rose-100 shadow-lg pink-glow space-y-4 select-none mb-4">
        
        {/* Toggle option header */}
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
          PILIH KISS ATAU TIUP🤭
        </div>

        <div className="flex space-x-2">
          {/* Mic Button */}
          <button
            onClick={isMicActive ? stopMic : startMic}
            disabled={isBlown || isConnectingMic}
            className={`flex-1 py-3 px-4 rounded-2xl font-medium text-sm flex items-center justify-center space-x-2 border transition-all duration-300 ${
              isMicActive
                ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-500 shadow-md transform active:scale-95 animate-pulse"
                : "bg-white hover:bg-pink-50 text-rose-600 border-pink-200 hover:border-pink-300 active:bg-pink-100"
            }`}
          >
            {isConnectingMic ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
                <span>Menghubungkan...</span>
              </>
            ) : isMicActive ? (
              <>
                <Mic className="w-4 h-4" />
                <span>Matikan Mik</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-rose-400" />
                <span>TIUP PAKE MIC</span>
              </>
            )}
          </button>

          {/* Simple Button to Blow immediately */}
          <button
            onClick={handleBlowOut}
            disabled={isBlown}
            className="px-5 py-3 rounded-2xl font-medium text-sm bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md shadow-pink-200 hover:from-pink-500 hover:to-rose-500 transition-all duration-300 flex items-center space-x-1.5 transform active:scale-95 disabled:opacity-50"
          >
            <Volume2 className="w-4 h-4" />
            <span>KISS</span>
          </button>
        </div>

        {/* Microphone feedback bar / Error prompt */}
        <AnimatePresence mode="wait">
          {isMicActive && !isBlown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-1"
            >
              <div className="flex justify-between items-center text-xs text-rose-500 px-1 font-sans">
                <span className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                  <span>Mendeteksi suara tiupan...</span>
                </span>
                <span className="font-semibold">{Math.min(100, Math.round(micVolume * 1.3))}%</span>
              </div>
              {/* Mic volume bar indication */}
              <div className="w-full h-3 bg-pink-100/60 rounded-full overflow-hidden border border-pink-50/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-rose-500 rounded-full shadow-inner"
                  style={{ width: `${Math.min(100, micVolume * 1.3)}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </div>
              <p className="text-[10px] text-gray-400 italic text-center mt-1">
                Dekatkan mulut ke mikrofon lalu tiup/bersuara keras untuk memadamkan api! 🌬️
              </p>
            </motion.div>
          )}

          {micError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-left"
            >
              {micError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative prompt */}
      <div className="text-gray-400 text-xs font-sans select-none pb-2 flex items-center justify-center space-x-1.5">
        <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
        <span>Semoga Kamu Suka Yaaaa!</span>
      </div>
    </div>
  );
}
