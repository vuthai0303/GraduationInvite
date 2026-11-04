"use client";

import { GOOGLE_SHEET_SCRIPT_URL } from "@/constants/eventDetails";
import { isExistInviteCode } from "@/constants/guests";
import confetti from "canvas-confetti";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Ban,
  Check,
  Gift,
  Heart,
  Loader2,
  MessageCircle,
  Send,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface RSVPSectionProps {
  guestName?: string;
  guestCode?: string;
}

interface SendRSVPOptions {
  code: string;
  name: string;
  attending: boolean | null;
  message?: string;
}

/**
 * Gửi thông tin RSVP lên Google Sheet thông qua API Route /api/rsvp
 * hoặc fallback trực tiếp sang Google Apps Script nếu cần.
 */
async function recordRSVP(options: SendRSVPOptions): Promise<boolean> {
  const payload = {
    code: options.code || "Vãng lai",
    name: options.name || "Ẩn danh",
    attending: options.attending,
    message: options.message || "",
  };

  // 1. Ưu tiên gọi API Route nội bộ Next.js
  try {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn("API route /api/rsvp không phản hồi, chuyển sang fallback:", err);
  }

  // 2. Dự phòng trực tiếp tới Google Apps Script (no-cors để tránh chặn CORS trên browser)
  try {
    await fetch(GOOGLE_SHEET_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (err) {
    console.error("Gửi trực tiếp đến Google Apps Script thất bại:", err);
    return false;
  }
}

/**
 * RSVP Section - Xác nhận tham dự & Lưu bút
 *
 * Bao gồm:
 * - Hai nút xác nhận siêu lầy lội (Đồng ý & Từ chối chạy trốn)
 * - Tự động đồng bộ và lưu kết quả vào Google Sheet của Quỳnh Nhiên
 * - Form gửi lời chúc kèm lưu bút tức thì
 * - Popup Momo khi bấm nút từ chối
 * - Pháo giấy chúc mừng
 */
export default function RSVPSection({
  guestName = "",
  guestCode = "DEFAULT",
}: RSVPSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const momoPopupRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  /* State quản lý form */
  const defaultDisplayName =
    isExistInviteCode(guestCode) && guestName ? guestName : "";
  const [name, setName] = useState(defaultDisplayName); // Tên người gửi
  const [message, setMessage] = useState(""); // Lời chúc
  const [isSubmitted, setIsSubmitted] = useState(false); // Đã gửi form chưa
  const [showMomoPopup, setShowMomoPopup] = useState(false); // Hiển thị popup Momo
  const [isAttending, setIsAttending] = useState<boolean | null>(null); // Trạng thái tham dự

  /* Loading states khi gửi dữ liệu lên Google Sheet */
  const [isSubmittingAttend, setIsSubmittingAttend] = useState(false);
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);

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
   * Đóng popup Momo và cuộn mượt về lại RSVPSection
   */
  const handleCloseMomoPopup = useCallback(() => {
    setShowMomoPopup(false);
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }, []);

  /**
   * Tự động cuộn đến popup khi popup Momo mở ra
   */
  useEffect(() => {
    if (showMomoPopup) {
      const timer = setTimeout(() => {
        momoPopupRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showMomoPopup]);

  /**
   * Đóng popup khi nhấn phím Escape
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showMomoPopup) {
        handleCloseMomoPopup();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showMomoPopup, handleCloseMomoPopup]);

  /**
   * Xử lý khi bấm nút đồng ý tham dự:
   * 1. Bắn pháo giấy ăn mừng
   * 2. Lưu vào Google Sheet ngay lập tức
   */
  const handleAttend = useCallback(async () => {
    setIsSubmittingAttend(true);
    const guestDisplayName =
      name.trim() || (guestCode !== "DEFAULT" ? guestName : "Khách mời");

    // Bắn pháo giấy ăn mừng khi xác nhận tham dự
    const duration = 2000;
    const end = Date.now() + duration;

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

    // Gửi thông tin lên Google Sheet
    await recordRSVP({
      code: guestCode,
      name: guestDisplayName,
      attending: true,
      message: message.trim() || "",
    });

    setIsSubmittingAttend(false);
    setIsAttending(true);
  }, [guestCode, guestName, message, name]);

  /**
   * Xác nhận không đến được từ popup Momo
   */
  const handleDeclineConfirm = useCallback(async () => {
    handleCloseMomoPopup();
    setIsAttending(false);
    const guestDisplayName =
      name.trim() || (guestCode !== "DEFAULT" ? guestName : "Khách mời");

    await recordRSVP({
      code: guestCode,
      name: guestDisplayName,
      attending: false,
      message: "Bận không đến được, gửi quà qua Momo",
    });
  }, [guestCode, guestName, handleCloseMomoPopup, name]);

  /**
   * Xử lý gửi form lời chúc:
   * Lưu lời chúc và thông tin vào Google Sheet
   */
  const handleSubmitMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !message.trim()) return;

      setIsSubmittingMessage(true);

      await recordRSVP({
        code: guestCode,
        name: name.trim(),
        attending: isAttending,
        message: message.trim(),
      });

      // Pháo hoa nhẹ chúc mừng gửi lời chúc thành công
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.75 },
        colors: ["#ec4899", "#a855f7", "#f59e0b"],
      });

      setIsSubmittingMessage(false);
      setIsSubmitted(true);
    },
    [guestCode, isAttending, message, name]
  );

  return (
    <section
      ref={sectionRef}
      className="px-4 relative overflow-hidden pb-6 scroll-mt-6"
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
                    whileHover={{ scale: isSubmittingAttend ? 1 : 1.08, rotate: isSubmittingAttend ? 0 : [0, -2, 2, 0] }}
                    whileTap={{ scale: isSubmittingAttend ? 1 : 0.95 }}
                    onClick={handleAttend}
                    disabled={isSubmittingAttend}
                    className="w-full sm:w-auto bg-linear-to-r from-green-400 to-emerald-500 text-white font-bold px-6 md:px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-sm md:text-base flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmittingAttend ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang lưu vào danh sách...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Chắc chắn có mặt! 💝</span>
                      </>
                    )}
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
                    className="w-full sm:w-auto bg-linear-to-r from-gray-300 to-gray-400 text-gray-700 font-bold px-6 md:px-8 py-4 rounded-2xl shadow cursor-pointer text-sm md:text-base relative"
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
            ) : isAttending ? (
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
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-bold px-6 py-2.5 rounded-full text-sm">
                  <Check className="w-5 h-5 text-green-600" />
                    <span>Quỳnh Nhiên đã ghi nhận vào danh sách tham dự, cấm có được trốn đó 😒</span>
                </div>
              </motion.div>
            ) : (
              /* === TRẠNG THÁI: BẬN / TỪ CHỐI === */
              <motion.div
                key="declined"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="text-5xl mb-4">🥺</div>
                <h3 className="text-xl font-extrabold text-navy mb-2">
                  Quỳnh Nhiên sẽ nhớ bạn lắm!
                </h3>
                <p className="text-navy/60 mb-4 text-sm">
                  Dù bạn không thể đến dự trực tiếp, cảm ơn bạn rất nhiều vì đã chia vui từ xa! 💖
                </p>
                <button
                  type="button"
                  onClick={() => setIsAttending(null)}
                  className="text-xs text-pink-primary font-bold underline hover:opacity-80 cursor-pointer"
                >
                  Đổi ý rồi, tôi muốn tham dự! 🙋‍♀️
                </button>
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
                    disabled={isExistInviteCode(guestCode)}
                    placeholder="Nhập tên bạn tại đây..."
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-primary focus:ring-2 focus:ring-pink-primary/20 outline-none transition-all text-navy placeholder:text-navy/30 bg-pink-pastel/20 disabled:opacity-75 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:border-slate-200"
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
                  disabled={isSubmittingMessage}
                  whileHover={{ scale: isSubmittingMessage ? 1 : 1.03 }}
                  whileTap={{ scale: isSubmittingMessage ? 1 : 0.97 }}
                  className="w-full bg-linear-to-r from-pink-primary to-purple text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmittingMessage ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang lưu vào sổ lưu bút...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Gửi Lời Chúc</span>
                      <Heart className="w-4 h-4" />
                    </>
                  )}
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
                  Lời chúc của bạn đã được lưu vào Google Sheet của Quỳnh Nhiên! ✨
                </p>

                {/* Hiển thị lại lời chúc đã gửi */}
                <div className="mt-4 bg-pink-pastel/50 rounded-xl p-4 text-left border border-pink-100">
                  <p className="text-xs text-navy/40 uppercase font-bold mb-1">
                    Lời chúc từ {name}:
                  </p>
                  <p className="text-navy italic text-sm">
                    &ldquo;{message}&rdquo;
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage("");
                  }}
                  className="mt-4 text-xs text-pink-primary font-bold hover:underline cursor-pointer"
                >
                  Gửi thêm lời chúc khác ✍️
                </button>
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
            onClick={handleCloseMomoPopup} // Bấm ngoài popup để đóng
          >
            <motion.div
              ref={momoPopupRef}
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              onClick={(e) => e.stopPropagation()} // Ngăn đóng popup khi bấm trong
              className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 max-w-sm w-full relative"
            >
              {/* Nút đóng popup */}
              <button
                onClick={handleCloseMomoPopup}
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
                    0918648475
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
                    handleCloseMomoPopup();
                    handleAttend(); // Tự động xác nhận tham dự
                  }}
                  className="mt-4 w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg cursor-pointer text-sm"
                >
                  😅 Thôi thôi, để tui đi cho rồi!
                </motion.button>

                {/* Tùy chọn xác nhận bận thật sự */}
                <button
                  type="button"
                  onClick={handleDeclineConfirm}
                  className="mt-3 text-xs text-navy/50 hover:text-navy/80 underline cursor-pointer"
                >
                  Bận thật sự, xin lỗi Quỳnh Nhiên nha 🥺
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
