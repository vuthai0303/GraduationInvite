"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  Send,
  PartyPopper,
  Ban,
  MessageCircle,
  Smartphone,
  X,
  Gift,
  Check,
} from "lucide-react";

/**
 * RSVP Section - Xác nhận tham dự & Lưu bút
 *
 * Bao gồm:
 * - Form gửi lời chúc (tên + lời nhắn)
 * - Hai nút xác nhận siêu lầy lội:
 *   + Nút Đồng ý: "Chắc chắn có mặt, mang bụng đói đi ăn cỗ!"
 *   + Nút Từ chối: chạy trốn khi hover (trên desktop) / đổi text (trên mobile)
 * - Popup Momo khi bấm nút từ chối
 * - Pháo giấy khi bấm xác nhận tham dự
 */

export default function RSVPSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  /* State quản lý form */
  const [name, setName] = useState(""); // Tên người gửi
  const [message, setMessage] = useState(""); // Lời chúc
  const [isSubmitted, setIsSubmitted] = useState(false); // Đã gửi form chưa
  const [showMomoPopup, setShowMomoPopup] = useState(false); // Hiển thị popup Momo
  const [isAttending, setIsAttending] = useState<boolean | null>(null); // Trạng thái tham dự

  /* State cho nút "chạy trốn" */
  const [declinePosition, setDeclinePosition] = useState({ x: 0, y: 0 }); // Vị trí nút từ chối
  const [declineAttempts, setDeclineAttempts] = useState(0); // Số lần cố bấm nút từ chối
  const [isMobile, setIsMobile] = useState(false); // Phát hiện thiết bị mobile

  /* Danh sách text thay thế khi hover nút từ chối (trên mobile sẽ đổi text) */
  const declineTexts = [
    "Bận đếm tiền, gửi quà qua Momo nha!",
    "Ơ kìa, sao lại bấm đây?! 😱",
    "Đùa thôi, đi mà! Có đồ ăn free!",
    "Nút này hỏng rồi, bấm nút kia đi!",
    "Quỳnh Nhiên sẽ buồn lắm đó... 🥺",
    "Bấm lần nữa là mình block nha! 😤",
  ];

  /* Phát hiện thiết bị mobile */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /**
   * Xử lý khi di chuột vào nút từ chối (desktop)
   * Nút sẽ "chạy trốn" sang vị trí ngẫu nhiên
   */
  const handleDeclineHover = useCallback(() => {
    if (isMobile) return; // Không chạy trốn trên mobile

    // Tính vị trí ngẫu nhiên trong phạm vi hợp lý
    const maxX = 200;
    const maxY = 100;
    const newX = (Math.random() - 0.5) * maxX * 2;
    const newY = (Math.random() - 0.5) * maxY * 2;

    setDeclinePosition({ x: newX, y: newY });
    setDeclineAttempts((prev) => prev + 1);
  }, [isMobile]);

  /**
   * Xử lý khi bấm nút từ chối
   * Hiển thị popup Momo để "gửi quà" thay vì tham dự
   */
  const handleDeclineClick = useCallback(() => {
    setShowMomoPopup(true);
    setDeclineAttempts((prev) => prev + 1);
  }, []);

  /**
   * Xử lý khi bấm nút đồng ý tham dự
   * Bắn pháo giấy ăn mừng
   */
  const handleAttend = useCallback(() => {
    setIsAttending(true);

    // Bắn pháo giấy ăn mừng khi xác nhận tham dự
    const duration = 2000;
    const end = Date.now() + duration;

    /* Bắn pháo giấy liên tục trong 2 giây */
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#ec4899", "#f59e0b", "#8b5cf6"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#ec4899", "#f59e0b", "#8b5cf6"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  /**
   * Xử lý gửi form lời chúc
   */
  const handleSubmitMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (name.trim() && message.trim()) {
        setIsSubmitted(true);
        // Ở đây có thể tích hợp API gửi dữ liệu lên server
        // Ví dụ: fetch('/api/wishes', { method: 'POST', body: JSON.stringify({ name, message }) })
      }
    },
    [name, message]
  );

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4 bg-gradient-to-b from-white via-pink-pastel/30 to-pink-pastel relative overflow-hidden"
    >
      {/* Hình trang trí */}
      <div className="absolute top-10 right-10 text-6xl md:text-8xl opacity-5 pointer-events-none select-none">
        💌
      </div>
      <div className="absolute bottom-10 left-10 text-6xl md:text-8xl opacity-5 pointer-events-none select-none">
        🎊
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Tiêu đề section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="text-sm md:text-base font-bold text-pink-primary uppercase tracking-widest">
            💌 R.S.V.P
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy mt-2">
            Xác Nhận{" "}
            <span className="text-pink-primary">Tham Dự</span>
          </h2>
          <p className="text-navy/60 mt-3 text-sm md:text-base max-w-lg mx-auto">
            Đừng bỏ lỡ ngày trọng đại của Quỳnh Nhiên! Hãy xác nhận và gửi lời
            chúc nha! 🎉
          </p>
        </motion.div>

        {/* === PHẦN XÁC NHẬN THAM DỰ === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-5 md:p-8 border border-pink-100 mb-8"
        >
          <AnimatePresence mode="wait">
            {isAttending === null ? (
              /* === TRẠNG THÁI: CHƯA XÁC NHẬN === */
              <motion.div
                key="buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl md:text-2xl font-extrabold text-navy text-center mb-6">
                  Bạn sẽ đến chứ? 🥹
                </h3>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center relative">
                  {/* === NÚT ĐỒNG Ý === */}
                  <motion.button
                    whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAttend}
                    className="w-full sm:w-auto bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold px-6 md:px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-sm md:text-base"
                  >
                    <PartyPopper className="w-5 h-5 inline mr-2" />
                    Chắc chắn có mặt, mang bụng đói đi ăn cỗ!
                    <span className="block text-xs mt-1 opacity-80">
                      (Free đồ ăn, ai mà bỏ!)
                    </span>
                  </motion.button>

                  {/* === NÚT TỪ CHỐI - CHẠY TRỐN KHI HOVER === */}
                  <motion.button
                    animate={{
                      x: declinePosition.x,
                      y: declinePosition.y,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    onMouseEnter={handleDeclineHover} // Chạy trốn khi di chuột vào
                    onClick={handleDeclineClick} // Hiện popup Momo nếu bấm được
                    className="w-full sm:w-auto bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 font-bold px-6 md:px-8 py-4 rounded-2xl shadow cursor-pointer text-sm md:text-base relative"
                  >
                    <Ban className="w-5 h-5 inline mr-2" />
                    {/* Trên mobile: đổi text khi cố bấm nhiều lần */}
                    {isMobile
                      ? declineTexts[
                          Math.min(declineAttempts, declineTexts.length - 1)
                        ]
                      : declineAttempts > 0
                      ? declineTexts[
                          Math.min(
                            declineAttempts - 1,
                            declineTexts.length - 1
                          )
                        ]
                      : "Bận đếm tiền, gửi quà qua Momo nha!"}
                    <span className="block text-xs mt-1 opacity-60">
                      {declineAttempts > 2
                        ? "(Nút này không hoạt động đâu 😏)"
                        : "(Nhưng mà...)"}
                    </span>
                  </motion.button>
                </div>

                {/* Hiển thị thông báo hài hước khi cố bấm từ chối nhiều lần */}
                {declineAttempts >= 3 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm text-pink-primary font-medium mt-4"
                  >
                    💡 Gợi ý: Nút &ldquo;Đồng ý&rdquo; ở ngay bên cạnh kìa!
                    Dễ bấm hơn nhiều! 😄
                  </motion.p>
                )}
              </motion.div>
            ) : (
              /* === TRẠNG THÁI: ĐÃ XÁC NHẬN THAM DỰ === */
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-2xl font-extrabold text-navy mb-2">
                  Tuyệt vời! Hẹn gặp bạn tại lễ tốt nghiệp!
                </h3>
                <p className="text-navy/60 mb-4">
                  Quỳnh Nhiên rất vui vì bạn sẽ đến! Nhớ mang theo nụ cười và
                  bụng đói nhé! 😋
                </p>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-bold px-6 py-2 rounded-full">
                  <Check className="w-5 h-5" />
                  Đã xác nhận tham dự
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* === FORM GỬI LỜI CHÚC === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-5 md:p-8 border border-pink-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-6 h-6 text-pink-primary" />
            <h3 className="text-xl md:text-2xl font-extrabold text-navy">
              Gửi Lời Chúc 💝
            </h3>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmitMessage}
                className="space-y-4"
              >
                {/* Input tên */}
                <div>
                  <label className="block text-sm font-bold text-navy/70 mb-1.5">
                    Tên của bạn ✨
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên bạn tại đây..."
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-primary focus:ring-2 focus:ring-pink-primary/20 outline-none transition-all text-navy placeholder:text-navy/30 bg-pink-pastel/20"
                  />
                </div>

                {/* Textarea lời chúc */}
                <div>
                  <label className="block text-sm font-bold text-navy/70 mb-1.5">
                    Lời chúc đến Quỳnh Nhiên 💌
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Viết gì đó hay ho, hài hước, hoặc xúc động... tùy bạn! 😊"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-primary focus:ring-2 focus:ring-pink-primary/20 outline-none transition-all text-navy placeholder:text-navy/30 bg-pink-pastel/20 resize-none"
                  />
                </div>

                {/* Nút gửi */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-pink-primary to-purple text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Gửi Lời Chúc
                  <Heart className="w-4 h-4" />
                </motion.button>
              </motion.form>
            ) : (
              /* === TRẠNG THÁI: ĐÃ GỬI LỜI CHÚC === */
              <motion.div
                key="submitted"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-4"
                >
                  💖
                </motion.div>
                <h3 className="text-xl font-extrabold text-navy mb-2">
                  Cảm ơn {name}! 🥰
                </h3>
                <p className="text-navy/60">
                  Lời chúc của bạn đã được ghi nhận. Quỳnh Nhiên sẽ rất vui khi
                  đọc được! ✨
                </p>

                {/* Hiển thị lại lời chúc đã gửi */}
                <div className="mt-4 bg-pink-pastel/50 rounded-xl p-4 text-left">
                  <p className="text-xs text-navy/40 uppercase font-bold mb-1">
                    Lời chúc từ {name}:
                  </p>
                  <p className="text-navy italic text-sm">
                    &ldquo;{message}&rdquo;
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* === POPUP MOMO === */}
      {/* Hiển thị khi bấm nút từ chối - để gửi quà qua Momo */}
      <AnimatePresence>
        {showMomoPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowMomoPopup(false)} // Bấm ngoài popup để đóng
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              onClick={(e) => e.stopPropagation()} // Ngăn đóng popup khi bấm trong
              className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 max-w-sm w-full relative"
            >
              {/* Nút đóng popup */}
              <button
                onClick={() => setShowMomoPopup(false)}
                className="absolute top-3 right-3 text-navy/30 hover:text-navy/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                {/* Icon quà */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-5xl mb-4"
                >
                  <Gift className="w-14 h-14 mx-auto text-pink-primary" />
                </motion.div>

                <h3 className="text-xl font-extrabold text-navy mb-2">
                  Gửi Quà Qua Momo! 💸
                </h3>
                <p className="text-navy/60 text-sm mb-4">
                  Không đến được cũng không sao, gửi quà qua Momo cho Quỳnh
                  Nhiên nha! 😘
                </p>

                {/* Số Momo */}
                <div className="bg-gradient-to-r from-pink-100 to-purple-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Smartphone className="w-5 h-5 text-pink-primary" />
                    <span className="text-sm font-bold text-navy/60">
                      Số Momo
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold text-pink-primary tracking-wider">
                    0123 456 789
                  </p>
                  <p className="text-xs text-navy/40 mt-1">
                    NGUYỄN NGỌC QUỲNH NHIÊN
                  </p>
                </div>

                <p className="text-xs text-navy/40 italic">
                  (Đùa thôi, nhưng mà gửi thiệt cũng được nha 😂)
                </p>

                {/* Nút "Thôi đi, tui đến" */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowMomoPopup(false);
                    handleAttend(); // Tự động xác nhận tham dự
                  }}
                  className="mt-4 w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg cursor-pointer text-sm"
                >
                  😅 Thôi thôi, để tui đi cho rồi!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
