import React, { useState } from "react";
import { X, Settings, Link, Check, RefreshCw, Upload, Eye, Compass, Heart } from "lucide-react";
import { AppConfig, Slide } from "../types";
import { encodeConfigToUrl } from "../data";

interface SettingsModalProps {
  config: AppConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: AppConfig) => void;
}

export default function SettingsModal({ config, isOpen, onClose, onSave }: SettingsModalProps) {
  const [recipientName, setRecipientName] = useState(config.recipientName);
  const [senderName, setSenderName] = useState(config.senderName);
  const [whatsappNumber, setWhatsappNumber] = useState(config.whatsappNumber);
  const [slides, setSlides] = useState<Slide[]>([...config.slides]);
  const [musicUrl, setMusicUrl] = useState(config.musicUrl);
  
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSlideChange = (id: number, key: keyof Slide, value: string) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: value } : s))
    );
  };

  const handleSave = () => {
    const updated: AppConfig = {
      ...config,
      recipientName,
      senderName,
      whatsappNumber,
      musicUrl,
      slides
    };
    onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleGenerateAndCopyLink = () => {
    const updated: AppConfig = {
      ...config,
      recipientName,
      senderName,
      whatsappNumber,
      musicUrl,
      slides
    };
    
    const encoded = encodeConfigToUrl(updated);
    // Build full absolute URL with parameter
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?gift=${encoded}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }).catch(err => {
      console.error("Could not copy link:", err);
      alert(`Gagal menyalin otomatis! Berikut link kadomu:\n\n${shareUrl}`);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto select-none font-sans">
      <div className="bg-white/95 rounded-[32px] w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl border border-pink-100 flex flex-col justify-between p-6 md:p-8 animate-float-in">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-pink-100 mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-pink-100 rounded-xl text-pink-600">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Visual Gift Builder 💖</h3>
              <p className="text-xs text-gray-400">Atur konten ucapan dan foto khusus pasanganmu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2.5 py-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Builder Panel Fields */}
        <div className="flex-1 space-y-6 text-left pr-1">
          {/* Section: basic names */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-pink-500 uppercase tracking-wider block border-l-2 border-pink-400 pl-2">
              Identitas Utama
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Nama Lengkap/Panggilan Pacar</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Misal: Salsa, Cantik, dsb."
                  className="w-full text-sm bg-pink-50/30 p-3 rounded-xl border border-pink-100 focus:border-rose-400 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Nama Kamu (Pemberi Kado)</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Misal: Cowokmu tercinta"
                  className="w-full text-sm bg-pink-50/30 p-3 rounded-xl border border-pink-100 focus:border-rose-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">No WhatsApp Kamu (Untuk Balasan)</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Misal: +62812345678"
                  className="w-full text-sm bg-pink-50/30 p-3 rounded-xl border border-pink-100 focus:border-rose-400 focus:outline-none transition-colors"
                />
                <p className="text-[10px] text-gray-400">Harap menggunakan format kode negara, misal: 628xxx</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Lagu Bazzi (YouTube Video ID)</label>
                <input
                  type="text"
                  value={musicUrl}
                  onChange={(e) => setMusicUrl(e.target.value)}
                  placeholder="Official Audio: QYh6mYI-mG8"
                  className="w-full text-sm bg-pink-50/30 p-3 rounded-xl border border-pink-100 focus:border-rose-400 focus:outline-none transition-colors"
                />
                <p className="text-[10px] text-gray-400">ID setelah 'v=' di tautan YouTube. Default Bazzi.</p>
              </div>
            </div>
          </div>

          {/* Section: Slide Customizer */}
          <div className="space-y-4 pt-2">
            <span className="text-xs font-bold text-pink-500 uppercase tracking-wider block border-l-2 border-pink-400 pl-2">
              Kustomisasi Lembaran Slide
            </span>

            {slides.map((slide, idx) => (
              <div key={slide.id} className="p-4 bg-rose-50/35 border border-pink-100 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-rose-500 bg-pink-100/50 px-2.5 py-0.5 rounded-full">
                    Slide Ke-{idx + 1}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Photo URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500">Tautan Gambar / Foto (URL)</label>
                    <input
                      type="text"
                      value={slide.imageUrl}
                      onChange={(e) => handleSlideChange(slide.id, "imageUrl", e.target.value)}
                      placeholder="Masukkan link gambar atau tetap biarkan default"
                      className="w-full text-xs bg-white p-2.5 rounded-xl border border-pink-100 focus:border-rose-400 focus:outline-none"
                    />
                    <p className="text-[9px] text-zinc-400 italic">Kamu bisa menggunakan link foto pacarmu dari hosting medsos/disk atau gunakan default ilustrasi kami yang sudah cantik.</p>
                  </div>

                  {/* Slide Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500">Judul Ucapan</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => handleSlideChange(slide.id, "title", e.target.value)}
                      className="w-full text-xs bg-white p-2.5 rounded-xl border border-pink-100 focus:border-rose-400 focus:outline-none"
                    />
                  </div>

                  {/* Slide Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500">Isi Kalimat Ucapan Romantis</label>
                    <textarea
                      value={slide.description}
                      onChange={(e) => handleSlideChange(slide.id, "description", e.target.value)}
                      rows={3}
                      className="w-full text-xs bg-white p-2.5 rounded-xl border border-pink-100 focus:border-rose-400 focus:outline-none"
                    />
                  </div>

                  {/* Caption */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 font-handwritten text-sm">Catatan kaki / Tanda Kasih</label>
                    <input
                      type="text"
                      value={slide.caption}
                      onChange={(e) => handleSlideChange(slide.id, "caption", e.target.value)}
                      className="w-full text-xs bg-white p-2.5 rounded-xl border border-pink-100 focus:border-rose-400 focus:outline-none font-handwritten text-sm text-pink-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-pink-100 mt-6 space-y-3 flex flex-col">
          <div className="flex space-x-2">
            {/* Save directly */}
            <button
              onClick={handleSave}
              className="flex-1 py-3 font-semibold text-sm bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-2xl flex items-center justify-center space-x-1.5 transition-colors border border-pink-200/55"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 animate-ping" />
                  <span>Berhasil Tersimpan!</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 text-pink-500 fill-pink-505" />
                  <span>Simpan di Peramban ini</span>
                </>
              )}
            </button>

            {/* Share link generator */}
            <button
              onClick={handleGenerateAndCopyLink}
              className={`flex-1 py-3 font-semibold text-sm rounded-2xl flex items-center justify-center space-x-1.5 transition-all duration-300 text-white shadow-md shadow-pink-150 ${
                copiedLink
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 active:scale-95"
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Link Kado Sudah Tersalin! 💕</span>
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 animate-pulse" />
                  <span>Salin Link Kado untuk Dia 🔗</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-gray-400 text-center italic">
            * Tips share: Klik "Salin Link Kado untuk Dia" lalu kirimkan tautan tersebut ke WhatsAppnya agar dia bisa membukanya langsung lengkap dengan isian kustomisasi darimu!
          </p>
        </div>

      </div>
    </div>
  );
}
