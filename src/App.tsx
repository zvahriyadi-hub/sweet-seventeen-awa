/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Gift, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AppConfig, Slide } from "./types";
import { DEFAULT_CONFIG, decodeConfigFromUrl, encodeConfigToUrl, migrateConfig } from "./data";
import FloatingHearts from "./components/FloatingHearts";
import CakeScreen from "./components/CakeScreen";
import SlideScreen from "./components/SlideScreen";
import SettingsModal from "./components/SettingsModal";

interface ConfettiSparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  angle: number;
  velocity: number;
}

export default function App() {
  const [isBlown, setIsBlown] = useState(false);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [burstConfetti, setBurstConfetti] = useState<ConfettiSparkle[]>([]);

  // Load configuration from URL search parameter or LocalStorage on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const giftParam = params.get("gift");

    if (giftParam) {
      const decoded = decodeConfigFromUrl(giftParam);
      if (decoded) {
        setConfig(decoded);
        return;
      }
    }

    // Fallback to local storage if no URL parameter is provided
    try {
      const saved = localStorage.getItem("sweet_17_birthday_config");
      if (saved) {
        let parsed = JSON.parse(saved) as AppConfig;
        
        let hasChanges = false;
        
        // Run general image path migration
        const migrated = migrateConfig(parsed);
        if (JSON.stringify(migrated) !== JSON.stringify(parsed)) {
          hasChanges = true;
          parsed = migrated;
        }
        
        if (hasChanges) {
          localStorage.setItem("sweet_17_birthday_config", JSON.stringify(parsed));
        }
        
        setConfig(parsed);
      }
    } catch (e) {
      console.error("Failed to load local storage config:", e);
    }
  }, []);

  // Handler to persist edits in LocalStorage
  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem("sweet_17_birthday_config", JSON.stringify(newConfig));
    } catch (e) {
      console.error("Failed to save local storage config:", e);
    }
  };

  // Sound/Confetti Burst upon blowing out candle
  const triggerConfettiExplosion = () => {
    const colors = ["#fb7185", "#f43f5e", "#fda4af", "#f472b6", "#ec4899", "#fbbf24", "#38bdf8", "#4ade80"];
    const sparkles: ConfettiSparkle[] = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: 50, // center on screen (cake area)
      y: 40,
      size: Math.random() * 12 + 6,
      color: colors[i % colors.length],
      delay: Math.random() * 0.3,
      angle: Math.random() * 360,
      velocity: Math.random() * 12 + 8
    }));
    
    setBurstConfetti(sparkles);

    // Auto-clean burst debris
    setTimeout(() => {
      setBurstConfetti([]);
    }, 3500);
  };

  const handleCandleBlown = () => {
    setIsBlown(true);
    triggerConfettiExplosion();
  };

  const handleResetCake = () => {
    setIsBlown(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-rose-50/70 to-pink-100 text-slate-800 flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* Decorative Sweet Hearts/Ribbons Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffe4e6_1px,transparent_1px)] [background-size:20px_20px] opacity-70 pointer-events-none" />

      {/* Floaty heart canvas engine */}
      <FloatingHearts active={true} />

      {/* Floating Sparkle explosion wrapper */}
      <AnimatePresence>
        {burstConfetti.map((c) => {
          const rad = (c.angle * Math.PI) / 180;
          const targetX = Math.cos(rad) * c.velocity * 30;
          const targetY = Math.sin(rad) * c.velocity * 30 + 150; // gravity drops it gently

          return (
            <motion.div
              key={c.id}
              className="absolute pointer-events-none rounded-full z-40 shadow-sm"
              style={{
                left: `calc(50% + ${Math.cos(rad) * 15}px)`,
                top: `calc(40% + ${Math.sin(rad) * 15}px)`,
                width: `${c.size}px`,
                height: `${c.size}px`,
                backgroundColor: c.color,
              }}
              initial={{ scale: 0.1, opacity: 1, x: 0, y: 0 }}
              animate={{
                scale: [0.1, 1, 0.4],
                opacity: [1, 1, 0],
                x: targetX,
                y: targetY
              }}
              transition={{
                duration: 2.2 + Math.random() * 0.5,
                delay: c.delay,
                ease: "easeOut"
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Header bar / Title Area */}
      <header className="w-full flex justify-between items-center px-6 py-4 z-20 select-none">
        
        {/* Cute logo signature */}
        <div className="flex items-center space-x-1.5 cursor-pointer" onClick={handleResetCake}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center text-white shadow-md shadow-pink-100">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <span className="text-sm font-serif font-semibold text-rose-600">Sweet17✨</span>
        </div>

        {/* Visual Builder Access Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center space-x-1 px-3 py-1.5 bg-white/70 hover:bg-white backdrop-blur-sm border border-pink-200/50 hover:border-pink-300 text-rose-500 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          title="Atur Konten & Nomor WhatsApp"
        >
          <Settings className="w-3.5 h-3.5 animate-spin-slow text-rose-400" />
          <span>Edit Kado 🛠️</span>
        </button>

      </header>

      {/* Main Core View Area */}
      <main className="flex-1 w-full flex items-center justify-center relative px-4 z-10 py-2">
        <AnimatePresence mode="wait">
          {!isBlown ? (
            /* LAYER 1: CANDLE BLOWING CAKE */
            <motion.div
              key="blow-candle-stage"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <CakeScreen
                recipientName={config.recipientName}
                onBlown={handleCandleBlown}
              />
            </motion.div>
          ) : (
            /* LAYER 2: ROMANTIC SLIDESHOW SLIDER */
            <motion.div
              key="slideshow-gift-stage"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full"
            >
              <SlideScreen
                config={config}
                onReset={handleResetCake}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Romantic Customizing Modal */}
      <SettingsModal
        config={config}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveConfig}
      />



    </div>
  );
}
