"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCw, Camera } from "lucide-react";
import type { PolaroidPhoto } from "@/constants/eventDetails";

interface PolaroidGalleryProps {
  photos: PolaroidPhoto[];
}

// Bảng màu gradient nghệ thuật cho placeholder ảnh polaroid
const PHOTO_GRADIENTS = [
  "from-pink-300 via-purple-300 to-indigo-300",
  "from-amber-200 via-rose-300 to-pink-300",
  "from-sky-200 via-indigo-200 to-purple-300",
  "from-emerald-200 via-teal-200 to-cyan-300",
  "from-violet-300 via-fuchsia-300 to-pink-300",
  "from-orange-200 via-amber-200 to-yellow-200",
  "from-rose-200 via-pink-200 to-purple-200",
  "from-blue-200 via-cyan-200 to-teal-200",
];

// Danh sách emoji theo chủ đề từng ảnh
const EMOJIS = ["🐣", "💻", "😴", "🍜", "📝", "🎓", "🏫", "💐"];

// Băng keo washi dán góc với các màu pastel khác nhau
const WASHI_COLORS = [
  "bg-amber-300/70 border-amber-400/40",
  "bg-pink-300/70 border-pink-400/40",
  "bg-purple-300/70 border-purple-400/40",
  "bg-teal-300/70 border-teal-400/40",
];

export default function PolaroidGallery({ photos }: PolaroidGalleryProps) {
  // Lưu index của các ảnh đang lật mặt sau
  const [flippedIndices, setFlippedIndices] = useState<Record<number, boolean>>({});

  const toggleFlip = (index: number) => {
    setFlippedIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-100/70 px-3 py-1 rounded-full">
          <Camera className="w-3.5 h-3.5" /> Thư viện kỷ niệm
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-navy mt-2">
          Khoảnh Khắc Kế Toán &ldquo;Bất Ổn&rdquo; 📸
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Chạm vào từng tấm ảnh polaroid để lật xem bí mật mặt sau!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-3 pb-6">
        {photos.map((photo, index) => {
          const isFlipped = !!flippedIndices[index];
          // Góc nghiêng so le vui mắt
          const rotationAngle = (index % 4 === 0 ? -2.5 : index % 4 === 1 ? 2 : index % 4 === 2 ? -1.8 : 2.5);
          const washiStyle = WASHI_COLORS[index % WASHI_COLORS.length];
          const gradient = PHOTO_GRADIENTS[index % PHOTO_GRADIENTS.length];
          const emoji = EMOJIS[index % EMOJIS.length];

          return (
            <div
              key={index}
              className="relative cursor-pointer select-none"
              style={{ perspective: 1000 }}
              onClick={() => toggleFlip(index)}
            >
              {/* Băng dính Washi Tape dán trên đầu ảnh */}
              <div
                className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-4 sm:h-5 ${washiStyle} border border-dashed rounded-xs z-30 shadow-xs opacity-90`}
                style={{
                  transform: `translateX(-50%) rotate(${index % 2 === 0 ? -4 : 5}deg)`,
                }}
              />

              {/* KHUNG THẺ POLAROID XOAY LẬT 3D */}
              <motion.div
                className="w-full bg-white rounded-xl shadow-md p-3 pb-4 border border-slate-100 flex flex-col justify-between"
                style={{
                  transformStyle: "preserve-3d",
                  minHeight: "230px",
                }}
                animate={{
                  rotateZ: isFlipped ? 0 : rotationAngle,
                  rotateY: isFlipped ? 180 : 0,
                  y: isFlipped ? -6 : 0,
                  scale: isFlipped ? 1.03 : 1,
                }}
                whileHover={{
                  y: -8,
                  rotateZ: 0,
                  scale: 1.04,
                  boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.15)",
                }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                {/* MẶT TRƯỚC (Front: Ảnh + Caption) */}
                <div
                  className="w-full h-full flex flex-col justify-between"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* Khung ảnh vuông */}
                  <div
                    className={`w-full aspect-square rounded-lg bg-gradient-to-tr ${gradient} flex flex-col items-center justify-center relative overflow-hidden shadow-inner border border-white/60`}
                  >
                    <span className="text-4xl sm:text-5xl drop-shadow-md select-none transform hover:scale-110 transition-transform">
                      {emoji}
                    </span>
                    <span className="absolute bottom-2 right-2 text-[10px] text-slate-600/70 font-mono">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Phần caption chữ viết tay */}
                  <div className="mt-3 text-center">
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug line-clamp-2">
                      {photo.caption}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-pink-500 font-medium mt-1 opacity-70">
                      <RotateCw className="w-2.5 h-2.5" /> Chạm để lật
                    </span>
                  </div>
                </div>

                {/* MẶT SAU (Back: Lời thú tội / Chú thích hài hước) */}
                <div
                  className="absolute inset-0 p-4 bg-amber-50/95 rounded-xl border-2 border-dashed border-amber-300 flex flex-col justify-between"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="text-center">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                      Bí mật đằng sau ảnh 🤫
                    </span>
                    <div className="w-8 h-[1px] bg-amber-400 mx-auto my-2" />
                    <p className="text-xs sm:text-sm text-slate-700 font-medium italic leading-relaxed mt-2">
                      &ldquo;{photo.backCaption}&rdquo;
                    </p>
                  </div>

                  <div className="text-center pt-2 border-t border-amber-200">
                    <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Lật lại mặt trước
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
