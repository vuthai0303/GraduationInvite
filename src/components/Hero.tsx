"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, PartyPopper, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Hero Section - Phần mở đầu trang thiệp mời
 *
 * Bao gồm:
 * - Tiêu đề hài hước + hiệu ứng typing
 * - Pháo giấy tự động bắn khi load trang
 * - Nút CTA pulse/hover với hiệu ứng nảy
 * - Mũ cử nhân bay và emoji rơi
 */
export default function Hero({
  onOpenInvite,
}: {
  onOpenInvite: () => void; // Callback khi người dùng bấm nút mở thiệp
}) {
  const [showContent, setShowContent] = useState(false); // Kiểm soát hiển thị nội dung chính
  const confettiRef = useRef(false); // Đảm bảo confetti chỉ bắn 1 lần (tránh re-render)

  useEffect(() => {
    /* === BẮN PHÁO GIẤY KHI LOAD TRANG === */
    /* Sử dụng ref để tránh bắn lại khi React re-render (StrictMode) */
    if (!confettiRef.current) {
      confettiRef.current = true;

      // Bắn pháo giấy từ 2 bên màn hình, tạo hiệu ứng "nổ" ấn tượng
      const fireConfetti = () => {
        // Pháo giấy bên trái
        confetti({
          particleCount: 80, // Số lượng hạt giấy
          spread: 70, // Góc tán xạ (độ rộng)
          origin: { x: 0.2, y: 0.6 }, // Vị trí bắn (20% từ trái, 60% từ trên)
          colors: ["#ec4899", "#f59e0b", "#8b5cf6", "#10b981", "#fde68a"], // Bảng màu lễ hội
        });
        // Pháo giấy bên phải
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { x: 0.8, y: 0.6 },
          colors: ["#ec4899", "#f59e0b", "#8b5cf6", "#10b981", "#fde68a"],
        });
      };

      // Bắn 3 đợt pháo giấy, mỗi đợt cách nhau 400ms
      setTimeout(fireConfetti, 300);
      setTimeout(fireConfetti, 700);
      setTimeout(fireConfetti, 1100);
    }

    // Hiển thị nội dung chính sau 500ms (cho pháo giấy bắn trước)
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* === BACKGROUND GRADIENT ĐỘNG === */}
      {/* Gradient hồng-tím-vàng xoay liên tục tạo hiệu ứng sinh động */}
      <div className="absolute inset-0 bg-linear-to-br from-pink-200 via-purple-100 to-yellow-100 animate-gradient" />

      {/* === CÁC HÌNH TRANG TRÍ NỀN === */}
      {/* Bong bóng gradient mờ di chuyển nhẹ nhàng phía sau nội dung */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Bong bóng hồng lớn góc phải trên */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl animate-float" />
        {/* Bong bóng tím nhỏ góc trái dưới */}
        <div
          className="absolute -bottom-10 -left-10 w-56 h-56 bg-purple-300/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        {/* Bong bóng vàng giữa */}
        <div
          className="absolute top-1/3 left-1/4 w-40 h-40 bg-yellow-200/30 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* === EMOJI TRANG TRÍ RƠI TỪ TRÊN === */}
      {/* Các emoji liên quan đến kế toán + lễ hội rơi nhẹ nhàng */}
      {["🎓", "📊", "💰", "🧮", "🎉", "📚", "✨", "🎊"].map(
        (emoji, index) => (
          <motion.span
            key={index}
            className="absolute text-2xl md:text-3xl pointer-events-none select-none"
            style={{
              left: `${10 + index * 12}%`, // Phân bố đều từ trái sang phải
              top: `${5 + (index % 3) * 25}%`, // Xếp 3 hàng
            }}
            animate={{
              y: [0, 20, -10, 15, 0], // Di chuyển lên xuống ngẫu nhiên
              rotate: [0, 10, -10, 5, 0], // Xoay nhẹ
              opacity: [0.4, 0.7, 0.5, 0.8, 0.4], // Nhấp nháy mờ/rõ
            }}
            transition={{
              duration: 4 + index * 0.5, // Mỗi emoji có tốc độ khác nhau
              repeat: Infinity, // Lặp vô hạn
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.span>
        )
      )}

      {/* === NỘI DUNG CHÍNH === */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} // Bắt đầu mờ, dịch xuống
            animate={{ opacity: 1, y: 0 }} // Hiện rõ, trượt lên vị trí
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 text-center px-4 max-w-3xl mx-auto"
          >
            {/* Mũ cử nhân nảy lên xuống */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl md:text-8xl mb-6"
            >
              <GraduationCap className="w-20 h-20 md:w-28 md:h-28 mx-auto text-pink-primary drop-shadow-lg" />
            </motion.div>

            {/* Badge "BREAKING NEWS" - phong cách tin tức nóng hổi */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="inline-block mb-4"
            >
              <span className="bg-red-500 text-white text-xs md:text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                ⚡ Tin nóng! Breaking News! ⚡
              </span>
            </motion.div>

            {/* Tiêu đề chính - hài hước */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-navy leading-tight mb-4"
            >
              Cảnh báo:{" "}
              <span className="text-pink-primary">Một Kế toán viên</span> sắp
              thoát khỏi{" "}
              <span className="text-purple italic">ma trận nợ môn!</span>
            </motion.h1>

            {/* Mô tả phụ */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-base md:text-xl text-navy/70 mb-8 max-w-xl mx-auto"
            >
              Sau 4 năm chiến đấu với bảng cân đối kế toán, nợ có = nợ
              phải trả + vốn chủ sở hữu... cuối cùng cũng đến ngày
              &ldquo;giải ngân&rdquo; tấm bằng! 🎉
            </motion.p>

            {/* Nút CTA chính - hiệu ứng pulse + nảy khi hover */}
            <motion.button
              onClick={onOpenInvite}
              whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }} // Phóng to + lắc nhẹ
              whileTap={{ scale: 0.95 }} // Thu nhỏ khi bấm
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="relative group bg-linear-to-r from-pink-primary to-purple text-white font-bold text-base md:text-xl px-8 md:px-12 py-4 md:py-5 rounded-full shadow-2xl animate-pulse-glow cursor-pointer transition-all duration-300"
            >
              {/* Icon sparkle bên trái */}
              <Sparkles className="inline w-5 h-5 md:w-6 md:h-6 mr-2 animate-wiggle" />
              Mở thiệp giải cứu Quỳnh Nhiên ngay!
              {/* Icon party bên phải */}
              <PartyPopper className="inline w-5 h-5 md:w-6 md:h-6 ml-2 animate-wiggle" />

              {/* Hiệu ứng shine chạy qua khi hover */}
              <span className="absolute inset-0 rounded-full overflow-hidden">
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </span>
            </motion.button>

            {/* Gợi ý cuộn xuống */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              transition={{
                delay: 1.5,
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mt-12 text-navy/50 text-sm"
            >
              ↓ Kéo xuống để khám phá hành trình &ldquo;sống sót&rdquo; ↓
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
