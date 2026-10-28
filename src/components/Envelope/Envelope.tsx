"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import StarParticles from "./StarParticles";
import WaxSeal from "./WaxSeal";

/**
 * Envelope Props
 * @property onOpen - Callback kích hoạt khi thiệp mở xong
 * @property guestName - Tên khách mời hiển thị bên ngoài phong bì (nếu có)
 */
interface EnvelopeProps {
  onOpen: () => void;
  guestName?: string;
}

/**
 * Envelope Component - Phong bì 3D niêm phong bí mật
 *
 * Các giai đoạn:
 * 1. 'sealed': Phong bì đóng kín, nắp gập xuống, con dấu sáp đỏ niêm phong ở giữa
 * 2. 'opening': Con dấu vỡ, pháo giấy nổ tung, nắp lật mở 3D (-180deg), thiệp trồi lên
 * 3. 'opened': Thiệp bay ra toàn màn hình, gọi onOpen()
 */
export default function Envelope({ onOpen, guestName }: EnvelopeProps) {
  // Trạng thái của phong bì: 'sealed' | 'opening' | 'opened'
  const [envelopeState, setEnvelopeState] = useState<"sealed" | "opening" | "opened">("sealed");

  /**
   * Kích hoạt bắn pháo giấy kim tuyến rực rỡ từ vị trí con dấu
   */
  const triggerConfetti = useCallback(() => {
    // Đợt 1: Bắn pháo trung tâm
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#ec4899", "#f59e0b", "#8b5cf6", "#fde68a", "#10b981"],
      ticks: 200,
      gravity: 0.9,
      scalar: 1.1,
    });

    // Đợt 2: Pháo hai cánh bay xòe ra sau 200ms
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0.3, y: 0.6 },
        colors: ["#ec4899", "#f59e0b", "#fde68a"],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 0.7, y: 0.6 },
        colors: ["#8b5cf6", "#ec4899", "#10b981"],
      });
    }, 200);
  }, []);

  /**
   * Xử lý khi người dùng ấn vào con dấu sáp
   */
  const handleBreakSeal = useCallback(() => {
    if (envelopeState !== "sealed") return;

    // Bắn pháo giấy chúc mừng
    triggerConfetti();

    // Chuyển sang trạng thái mở phong bì
    setEnvelopeState("opening");

    // Sau khi nắp lật và lá thư trồi lên (khoảng 1.4s), chuyển sang 'opened' và kích hoạt onOpen
    setTimeout(() => {
      setEnvelopeState("opened");
      setTimeout(() => {
        onOpen();
      }, 1000);
    }, 1000);
  }, [envelopeState, triggerConfetti, onOpen]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-[#1e1435] to-[#2d1238] px-4 select-none">
      {/* Hiệu ứng bụi sao lấp lánh nền */}
      <StarParticles />

      {/* Ánh sáng ambient mờ ảo sau phong bì */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-pink-500/20 blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute w-60 h-60 md:w-80 md:h-80 rounded-full bg-purple-600/20 blur-[90px] pointer-events-none" />

      {/* Header hướng dẫn nhẹ nhàng */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 mb-8 md:mb-12"
      >
        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-pink-300 text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
          MẬT THƯ TỐT NGHIỆP ĐẶC BIỆT
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-white mt-3 tracking-wide drop-shadow-md">
          {guestName ? (
            <>
              Gửi riêng cho <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-amber-200 to-purple-300">{guestName}</span> 💌
            </>
          ) : (
            <>
              Bạn có 1 bức thư niêm phong từ <span className="text-pink-400">Quỳnh Nhiên</span> 🎓
            </>
          )}
        </h1>
        <p className="text-white/60 text-xs md:text-sm mt-1.5 font-medium">
          Chạm vào con dấu sáp đỏ bên dưới để giải mã phong thư
        </p>
      </motion.div>

      {/* KHUNG BAO BỌC PHONG BÌ 3D */}
      <div
        className="relative z-20 flex items-center justify-center"
        style={{ perspective: 1200 }}
      >
        <motion.div
          animate={
            { scale: 1, opacity: 1, y: 0 }
          }
          transition={{ duration: 0.6 }}
          className="relative w-[320px] h-[210px] sm:w-[420px] sm:h-[270px] md:w-[480px] md:h-[300px]"
        >
          {/* LỚP 1: MẶT SAU PHONG BÌ (Inside Back Wall) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#6b1f35] to-[#401222] shadow-2xl border border-pink-900/40 overflow-hidden">
            {/* Lớp lót họa tiết hoa văn sọc nhạt bên trong bao thư */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, #fbcfe8 0, #fbcfe8 2px, transparent 0, transparent 16px)`,
              }}
            />
          </div>

          {/* LỚP 2: TẤM THIỆP BÊN TRONG (Trồi lên khi mở thư) */}
          <motion.div
            initial={false}
            animate={
              envelopeState === "sealed"
                ? { y: 0, scale: 0.95, zIndex: 10 }
                : envelopeState === "opening"
                ? { y: -400, scale: 1, zIndex: 10 }
                : { y: 0, scale: 1, zIndex: 30 }
            }
            transition={{
              duration: 1,
              delay: envelopeState === "opening" ? 0.35 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-x-4 top-4 bottom-4 rounded-xl bg-linear-to-br from-amber-50 via-white to-pink-50 p-4 shadow-xl border border-amber-200/80 flex flex-col justify-between"
          >
            {/* Viền đôi vintage cho tấm thiệp bên trong */}
            <div className="h-full w-full border border-pink-300/40 rounded-lg p-3 flex flex-col items-center justify-around text-center">
              <span className="text-2xl sm:text-6xl mb-1">🎓</span>
              <p className="text-[10px] sm:text-xl font-bold uppercase tracking-widest text-pink-600">
                Official Graduation Invite
              </p>
              <h3 className="text-sm sm:text-xl font-extrabold text-slate-800 mt-1 line-clamp-1">
                Nguyễn Ngọc Quỳnh Nhiên
              </h3>
              <p className="text-[10px] sm:text-base text-slate-500 italic mt-0.5">
                {guestName ? `Trân trọng kính mời: ${guestName}` : "Đang mở toàn bộ nội dung..."}
              </p>
              <div className="mt-2 flex items-center gap-1 text-[9px] sm:text-base text-pink-500 font-semibold bg-pink-100/60 px-2 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5" /> Mừng tốt nghiệp 2026
              </div>
            </div>
          </motion.div>

          {/* LỚP 3: MẶT TRƯỚC PHONG BÌ (Túi bao thư gấp - 2 cánh hông & đáy) */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 20 }}
          >
            {/* Cánh gập bên trái */}
            <div
              className="absolute left-0 bottom-0 top-0 w-1/2 bg-linear-to-r from-[#992546] to-[#801b37]"
              style={{
                clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                boxShadow: "inset 2px 0 6px rgba(0,0,0,0.3)",
              }}
            />
            {/* Cánh gập bên phải */}
            <div
              className="absolute right-0 bottom-0 top-0 w-1/2 bg-linear-to-l from-[#992546] to-[#801b37]"
              style={{
                clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
                boxShadow: "inset -2px 0 6px rgba(0,0,0,0.3)",
              }}
            />
            {/* Cánh gập đáy từ dưới lên */}
            <div
              className="absolute inset-x-0 bottom-0 h-[60%]"
              style={{ filter: "drop-shadow(0 -2px 2px rgba(0,0,0,0.2))" }}
            >
              <div
                className="w-full h-full bg-linear-to-t from-[#b02c52] to-[#992546]"
                style={{
                  clipPath: "polygon(0 100%, 45% 8%, 55% 8%, 100% 100%)",
                }}
              />
            </div>

            {/* Tem mạ vàng trang trí góc dưới */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-70">
              <div className="h-[1px] w-8 bg-amber-300/60" />
              <Mail className="w-3.5 h-3.5 text-amber-200" />
              <div className="h-[1px] w-8 bg-amber-300/60" />
            </div>
          </div>

          {/* LỚP 4: NẮP PHONG BÌ 3D (Flap lật mở rotateX -180deg) */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[60%] rounded-t-2xl origin-top"
            style={{
              transformStyle: "preserve-3d",
              zIndex: envelopeState === "sealed" ? 25 : 5,
            }}
            initial={false}
            animate={
              envelopeState === "sealed"
                ? { rotateX: 0 }
                : { rotateX: -180 }
            }
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Mặt ngoài nắp (Tam giác úp xuống) */}
            <div
              className="absolute inset-0"
              style={{
                filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.2))",
              }}
            >
              <div
                className="w-full h-full bg-linear-to-b from-[#c0345d] to-[#9e2648]"
                style={{
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  backfaceVisibility: "hidden",
                }}
              />
            </div>

            {/* Mặt trong nắp (Khi lật ngược ra sau) */}
            <div
              className="absolute inset-0 bg-linear-to-t from-[#6b1f35] to-[#4f1325]"
              style={{
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                transform: "rotateY(180deg) rotateZ(0deg)",
                backfaceVisibility: "hidden",
              }}
            />

            {/* CON DẤU SÁP TRÒN (Nằm ở đỉnh nhọn nắp phong bì) */}
            {envelopeState === "sealed" && (
              <div
                className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-2/7 pointer-events-auto"
                style={{ zIndex: 40 }}
              >
                <WaxSeal onBreak={handleBreakSeal} />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Dòng chữ gợi ý dưới đáy */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-white/40 text-xs text-center mt-12 z-10 flex items-center gap-1.5"
      >
        <span>✨</span> Chạm để mở - Niềm vui nhân đôi <span>✨</span>
      </motion.p>
    </div>
  );
}
