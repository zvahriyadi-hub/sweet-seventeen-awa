import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Music, 
  Heart, 
  Sparkles, 
  Send, 
  Calendar,
  Instagram,
  Compass,
  Smile,
  Play,
  Pause
} from "lucide-react";
import { Slide, AppConfig } from "../types";

interface SlideScreenProps {
  config: AppConfig;
  onReset: () => void;
}

export default function SlideScreen({ config, onReset }: SlideScreenProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [replyMessage, setReplyMessage] = useState("i'll kiss u 999x, dari website abang tampan");
  const [loveCount, setLoveCount] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  // Auto transition variables
  const totalSlides = config.slides.length + 1; // slides + letter slide

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Launch cute floating heart clicks on slide images
  const triggerLoveBurst = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newLove = { id: Date.now(), x, y };
    setLoveCount((prev) => [...prev, newLove]);
    
    // Auto clear particle to save DOM resources
    setTimeout(() => {
      setLoveCount((prev) => prev.filter((item) => item.id !== newLove.id));
    }, 1000);
  };

  // Format WhatsApp Link
  const handleSendReply = () => {
    if (!replyMessage.trim()) return;
    const cleanNumber = config.whatsappNumber.replace(/[^0-9]/g, "");
    
    // Default reply if empty text
    const textStr = replyMessage;
    const encodedText = encodeURIComponent(textStr);
    
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`;
    window.open(waUrl, "_blank");
  };

  // Keep background music running smoothly
  useEffect(() => {
    // Autoplay trigger happens on mount because user already interacted on CakeScreen
    setIsPlaying(true);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-[85vh] w-full max-w-2xl mx-auto p-4 md:p-6 z-10 font-sans">
      
      {/* Invisible YouTube Player to play Bazzi - Beautiful safely */}
      {config.musicUrl && isPlaying && (
        <div className="absolute top-0 left-0 w-0 h-0 overflow-hidden opacity-0 pointer-events-none">
          {config.musicType === "youtube" ? (
            <iframe
              id="youtube-player"
              width="1"
              height="1"
              src={`https://www.youtube.com/embed/${config.musicUrl}?autoplay=1&mute=0&loop=1&playlist=${config.musicUrl}&enablejsapi=1`}
              title="Romantic Birthday Music"
              allow="autoplay; encrypted-media"
              referrerPolicy="no-referrer"
            />
          ) : (
            <audio
              src={config.musicUrl}
              autoPlay
              loop
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      )}

      {/* Top Bar (Music Disk + Indicators) */}
      <div className="w-full flex justify-between items-center mb-6 select-none bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-100/50">
        {/* Floating CD Song Art Indicator */}
        <div className="flex items-center space-x-2">
          <motion.div
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 bg-gradient-to-tr from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white shadow-md relative group shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all"
            title={isPlaying ? "Klik untuk Jeda Musik" : "Klik untuk Putar Musik"}
          >
            <Music className="w-5 h-5 opacity-40 group-hover:opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white drop-shadow-sm" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5 drop-shadow-sm" />
              )}
            </div>
          </motion.div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-rose-600 truncate max-w-[120px] md:max-w-[180px]">Bazzi - Beautiful</h4>
            <p className="text-[10px] text-gray-500 font-sans tracking-wide">Song</p>
          </div>
        </div>

        {/* Music Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
              isPlaying
                ? "bg-rose-50 text-rose-500 border border-rose-200"
                : "bg-gray-100 text-gray-400 border border-gray-200"
            }`}
            title={isPlaying ? "Matikan Musik" : "Putar Musik"}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 animate-bounce" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Reset App Trigger to show cake again */}
          <button
            onClick={onReset}
            className="text-xs text-rose-400 hover:text-rose-600 bg-white hover:bg-pink-50 px-3.5 py-1.5 rounded-full border border-pink-100 hover:border-pink-200 transition-all duration-200 font-medium"
          >
            Tiup Ulang 🎂
          </button>
        </div>
      </div>

      {/* Main Slide Carousel container */}
      <div className="w-full relative flex-1 flex flex-col justify-center items-center min-h-[550px]">
        <AnimatePresence mode="wait">
          {currentIdx < config.slides.length ? (
            /* STANDARD PHOTO SLIDE */
            <motion.div
              key={`slide-${currentIdx}`}
              initial={{ opacity: 0, x: 50, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-white/85 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-xl pink-glow border border-rose-100/50 w-full flex flex-col justify-between space-y-6"
            >
              {/* Photo Box styled like Polaroid */}
              <div 
                className="relative overflow-hidden rounded-2xl bg-pink-50/50 aspect-video md:h-64 flex items-center justify-center border-4 border-white shadow-md cursor-pointer select-none group"
                onClick={triggerLoveBurst}
                title="Ketuk gambar untuk kirim cinta! ❤️"
              >
                {/* Default placeholder/Generated/Uploaded Photo */}
                <img
                  src={config.slides[currentIdx].imageUrl}
                  alt={config.slides[currentIdx].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Sparkling overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/10 to-transparent pointer-events-none" />
                <Sparkles className="absolute top-3 right-3 w-5 h-5 text-amber-200 animate-sparkle" />
                <Heart className="absolute bottom-3 left-3 w-5 h-5 text-rose-400 opacity-6 w-5 h-5 hover:scale-110 transition-transform" />

                {/* Floating Love Particles Emitter inside the photo frame */}
                <AnimatePresence>
                  {loveCount.map((love) => (
                    <motion.div
                      key={love.id}
                      className="absolute text-rose-500 pointer-events-none"
                      style={{ left: love.x - 12, top: love.y - 12 }}
                      initial={{ scale: 0, opacity: 1, y: 0 }}
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.8, 0], y: -50, x: Math.random() * 20 - 10 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 drop-shadow-md">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Polaroid-style caption strip */}
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-medium text-rose-600/90 border border-pink-100 flex items-center space-x-1">
                  <Smile className="w-3.5 h-3.5 text-rose-400" />
                  <span>Ketuk Gambar! 👆</span>
                </div>
              </div>

              {/* Text Description Box */}
              <div className="space-y-3 text-left">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest font-sans flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" />
                  <span>{currentIdx === 1 ? "FROM MY HEART" : currentIdx === 2 ? "MY HOPE FOR YOU" : currentIdx === 3 ? "MY FOREVER WISH FOR YOU" : "A Wish For You"}</span>
                </span>
                <h2 className="text-2xl font-serif font-semibold text-rose-600 leading-tight">
                  {config.slides[currentIdx].title}
                </h2>
                <div className="w-12 h-1 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full" />
                <p className="text-gray-600 font-sans text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {config.slides[currentIdx].description}
                </p>
                <div className="pt-2 text-rose-400/90 font-handwritten text-lg italic md:text-xl text-right">
                  ~ {config.slides[currentIdx].caption}
                </div>
              </div>
            </motion.div>
          ) : (
            /* LETTER BOX SLIDE (THE MAJESTIC FINALE) */
            <motion.div
              key="slide-letter"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full flex flex-col items-center"
            >
              {/* Outer Envelope Wrapper */}
              <div className="bg-white/85 backdrop-blur-md rounded-[32px] p-6 md:p-8 shadow-xl pink-glow border border-rose-100/50 w-full text-center space-y-6">
                
                {/* Visual Envelope Opening Animation */}
                <div className="relative flex flex-col items-center py-2 select-none">
                  <motion.div
                    animate={isLetterOpen ? { y: -10 } : { y: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="cursor-pointer"
                    onClick={() => setIsLetterOpen(!isLetterOpen)}
                  >
                    <svg
                      width="100"
                      height="80"
                      viewBox="0 0 100 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="drop-shadow-lg filter hover:scale-105 transition-all duration-300"
                    >
                      {/* Envelope Back */}
                      <path d="M5 20 L95 20 L95 75 L5 75 Z" fill="#FBCFE8" stroke="#F472B6" strokeWidth="2" />
                      {/* Envelope Paper coming out */}
                      <AnimatePresence>
                        {isLetterOpen && (
                          <motion.path
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            d="M15 5 L85 5 L85 50 L15 50 Z"
                            fill="#FFFFFF"
                            stroke="#FDA4AF"
                            strokeWidth="1.5"
                          />
                        )}
                      </AnimatePresence>
                      {/* Envelope Front Cap Fold */}
                      {isLetterOpen ? (
                        <path d="M5 20 L50 2 L95 20" stroke="#F472B6" strokeWidth="2.5" fill="#FFE4E6" />
                      ) : (
                        <path d="M5 20 L50 55 L95 20" stroke="#F472B6" strokeWidth="2.5" fill="#FFE4E6" />
                      )}
                      {/* Left/Right Envelope seams */}
                      <path d="M5 75 L40 45" stroke="#F472B6" strokeWidth="1.5" />
                      <path d="M95 75 L60 45" stroke="#F472B6" strokeWidth="1.5" />
                      {/* Seal sticker heart */}
                      <circle cx="50" cy="45" r="8" fill="#F43F5E" />
                      <path d="M50 48.5 L47.5 45 Q45 42 47.5 40 Q50 39.5 50 41 Q50 39.5 52.5 40 Q55 42 52.5 45 Z" fill="#FFFFFF" />
                    </svg>
                  </motion.div>
                  <p className="text-[11px] text-pink-500 font-sans mt-2 tracking-wide font-medium">
                    {isLetterOpen ? "Tap The Letter Back💌" : "Tap The Letter To Open🌟"}
                  </p>
                </div>

                {/* Love Letter Interior Sheet */}
                <AnimatePresence>
                  {isLetterOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden w-full"
                    >
                      <div className="bg-rose-50/40 border border-dashed border-rose-200 rounded-2xl p-5 md:p-6 text-left space-y-4">
                        <h3 className="text-xl font-serif text-rose-600 font-semibold text-center pb-2 border-b border-rose-100/60 flex items-center justify-center space-x-1.5">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                          <span>Sweet Seventeen Love Letter </span>
                        </h3>
                        
                        <div className="space-y-3 font-sans text-xs md:text-sm text-gray-700 leading-relaxed max-h-52 overflow-auto pr-1">
                          <p className="font-semibold text-rose-500">For My Favorite Human</p>
                          <p>
                            Hari ini kamu resmi jadi 17 tahun, sayang🤍. sweet seventeen menurut aku salah satu fase paling spesial, karena menurut aku lebih banyak hal baru mulai datang, lebih banyak cerita, dan banyak mimpi yang pelan-pelan mulai kamu kejar. Aku harap di usia ini kamu bisa menikmati tiap prosesnya yaa sayang, dan dipertemukan dengan banyak hal indah yang bikin pacal aku semakin bahagia.💖
                          </p>
                          <p>
                            semua hal kecil tentang diri kamu bikin aku ngerasa beruntung karena bisa kenal kamu lebih sejauh ini sayanggg. Semoga di umur yang baru ini kamu selalu dikelilingi orang orang baik, punya banyak alasan buat bahagia terus, dan mendapatkan semua hal yang selama ini kamu pengen. Aku cuma mau kamu ingat satu hal, jangan pernah takut atau ngerasa diri kamu kurang ya sayangg. Kamu jauh lebih hebat, lebih kuat dari apa yang kamu pikirin. MY LOVE AND PROUD ALWAYS WITH U, my angel💗
                          </p>
                          <p className="pt-2 italic text-rose-500 font-medium">
                            I hope happiness follows you not just today, but forever. Happy birthday, my beautiful girl. I'm really really grateful to have you in my life. 🤍
                          </p>
                        </div>

                        <div className="font-handwritten text-xl text-rose-500 text-right font-bold flex flex-col pr-2 pt-1">
                          <span className="text-2xl text-rose-600 font-bold">I love you more than words can say💖</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Partner Reply Form interface (Generates direct WhatsApp deep link!) */}
                <div className="bg-pink-50/50 rounded-2xl p-4 border border-pink-100 space-y-3 text-left">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1 font-sans">
                    <span>Kirim Balasan Singkat ke Orang Tampan💌</span>
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Tulis ucapan terima kasihmu atau pesan sayang balasan di sini..."
                    rows={2}
                    className="w-full text-xs md:text-sm bg-white p-3 rounded-xl border border-pink-100 focus:border-rose-300 focus:outline-none focus:ring-1 focus:ring-rose-200 transition-colors font-sans"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-sans">Dapet WhatsApp orang ganteng</span>
                    <button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim()}
                      className="px-4 py-2 text-xs font-semibold bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl shadow transition-colors flex items-center space-x-1 border border-green-500/10"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Balasan</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slide Navigation Pagination and Progress */}
      <div className="w-full select-none mt-6 flex justify-between items-center bg-white/40 backdrop-blur-sm p-3 rounded-full border border-pink-100/50">
        <button
          onClick={handlePrev}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-pink-100 hover:border-pink-300 text-rose-500 hover:bg-pink-50 transition-colors active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel indicators */}
        <div className="flex space-x-2 items-center">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIdx === idx
                  ? "w-6 bg-rose-500 shadow-sm"
                  : "w-2 bg-pink-200 hover:bg-pink-300"
              }`}
              title={`Buka Halaman ${idx + 1}`}
            />
          ))}
          <span className="text-[10px] font-bold text-rose-500 font-sans ml-1">
            ({currentIdx + 1}/{totalSlides})
          </span>
        </div>

        <button
          onClick={handleNext}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-pink-100 hover:border-pink-300 text-rose-500 hover:bg-pink-50 transition-colors active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
