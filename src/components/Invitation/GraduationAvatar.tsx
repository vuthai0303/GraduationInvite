"use client";

import { AnimatePresence, motion, useAnimation, type Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ===== GraduationAvatar - Nhân vật cử nhân tương tác =====
 *
 * Component render một nhân vật cử nhân vui nhộn có thể tương tác:
 * - Idle: nhân vật nhẹ nhàng bay lên xuống (floating)
 * - Hover: kính thug life trượt xuống + bong bóng quote xuất hiện
 * - Click: xoay mặt 360° + đổi quote ngẫu nhiên
 * - Click nhanh liên tục: rung lắc (wiggle effect)
 *
 * Props:
 * - quotes: Mảng các câu nói hài hước để hiển thị ngẫu nhiên
 */

/* ===== KIỂU DỮ LIỆU PROPS ===== */
interface GraduationAvatarProps {
  quotes: string[];
}

/* ===== FRAMER MOTION VARIANTS ===== */

/** Hiệu ứng bay lên xuống nhẹ nhàng cho toàn bộ avatar */
const floatingVariants: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/** Hiệu ứng gật đầu nhẹ cho khuôn mặt */
const headBobVariants: Variants = {
  animate: {
    y: [0, -3, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/** Hiệu ứng lắc lư quả tua mũ (pendulum) */
const tasselSwingVariants: Variants = {
  animate: {
    rotate: [0, 15, -15, 10, -10, 5, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/** Hiệu ứng kính thug life trượt xuống với spring */
const glassesVariants: Variants = {
  hidden: {
    y: -40,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
  exit: {
    y: -40,
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

/** Hiệu ứng bong bóng hội thoại bật lên với spring */
const bubbleVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
    y: 10,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

/** Hiệu ứng nhấp nháy cho sparkle ✨ */
const sparkleVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: [0, 1, 0],
    scale: [0, 1.2, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      delay: i * 0.3,
      ease: "easeInOut",
    },
  }),
};

export default function GraduationAvatar({ quotes }: GraduationAvatarProps) {
  /* ===== STATE QUẢN LÝ TƯƠNG TÁC ===== */
  const [showGlasses, setShowGlasses] = useState(false); // Hiển thị kính thug life
  const [currentQuote, setCurrentQuote] = useState(() => (quotes.length > 0 ? quotes[0] : "")); // Câu quote đang hiển thị
  const [showBubble, setShowBubble] = useState(false); // Hiển thị bong bóng hội thoại
  const [isSpinning, setIsSpinning] = useState(false); // Đang xoay mặt 360°
  const [isWiggling, setIsWiggling] = useState(false); // Đang rung lắc nhanh

  /** Ref đếm số click liên tục */
  const clickCountRef = useRef(0);
  /** Ref theo dõi thời gian click cuối cùng để phát hiện click nhanh liên tục */
  const lastClickTimeRef = useRef(0);
  /** Ref lưu timeout ID để reset click count */
  const clickResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Controls cho animation xoay/rung mặt */
  const faceControls = useAnimation();

  /**
   * Lấy một câu quote ngẫu nhiên từ mảng quotes
   * Đảm bảo không trùng với quote đang hiển thị (nếu có nhiều hơn 1 quote)
   */
  const getRandomQuote = useCallback(() => {
    if (quotes.length === 0) return "";
    if (quotes.length === 1) return quotes[0];

    let newQuote = currentQuote;
    while (newQuote === currentQuote) {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    }
    return newQuote;
  }, [quotes, currentQuote]);

  /**
   * Xử lý khi hover vào avatar
   * - Hiện kính thug life
   * - Hiện bong bóng hội thoại với quote ngẫu nhiên
   */
  const handleHoverStart = useCallback(() => {
    setShowGlasses(true);
    setShowBubble(true);
    if (!currentQuote) {
      setCurrentQuote(getRandomQuote());
    }
  }, [currentQuote, getRandomQuote]);

  /**
   * Xử lý khi rời chuột khỏi avatar
   * - Ẩn kính và bong bóng
   */
  const handleHoverEnd = useCallback(() => {
    setShowGlasses(false);
    setShowBubble(false);
  }, []);

  /**
   * Xử lý click vào avatar
   * - Click đơn: xoay mặt 360° + đổi quote
   * - Click nhanh liên tục (>= 3 lần trong 800ms): rung lắc mạnh
   */
  const handleClick = useCallback(() => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    lastClickTimeRef.current = now;

    /* Hiển thị kính và bong bóng khi click (cho mobile) */
    setShowGlasses(true);
    setShowBubble(true);

    /* Đổi quote ngẫu nhiên */
    setCurrentQuote(getRandomQuote());

    /* Đếm click nhanh liên tục (trong vòng 800ms) */
    if (timeSinceLastClick < 800) {
      clickCountRef.current += 1;
      /* Nếu click >= 3 lần liên tục -> kích hoạt wiggle */
      if (clickCountRef.current >= 3) {
        setIsWiggling(true);
        faceControls.start({
          rotate: [0, -10, 10, -10, 10, -5, 5, 0],
          transition: { duration: 0.5 },
        });
        /* Reset wiggle sau 600ms */
        setTimeout(() => setIsWiggling(false), 600);
      }
    } else {
      /* Reset đếm click nếu quá lâu giữa các lần click */
      clickCountRef.current = 1;
    }

    /* Xoay mặt 360° với hiệu ứng spring */
    if (!isSpinning && !isWiggling) {
      setIsSpinning(true);
      faceControls
        .start({
          rotate: [0, 360],
          transition: {
            duration: 0.6,
            ease: "easeInOut",
          },
        })
        .then(() => {
          setIsSpinning(false);
          /* Reset rotation về 0 để tránh tích lũy */
          faceControls.set({ rotate: 0 });
        });
    }

    /* Auto-reset click count sau 1.5 giây không click */
    if (clickResetTimerRef.current) {
      clearTimeout(clickResetTimerRef.current);
    }
    clickResetTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);
  }, [getRandomQuote, faceControls, isSpinning, isWiggling]);

  /**
   * Cleanup timeout khi component unmount
   */
  useEffect(() => {
    return () => {
      if (clickResetTimerRef.current) {
        clearTimeout(clickResetTimerRef.current);
      }
    };
  }, []);

  return (
    /* ===== CONTAINER CHÍNH ===== */
    /* Bao bọc toàn bộ avatar + bong bóng hội thoại */
    <div className="relative flex flex-col items-center select-none">
      {/* ===== BONG BÓNG HỘI THOẠI (SPEECH BUBBLE) ===== */}
      {/* Hiện phía trên avatar khi hover/click */}
      <AnimatePresence>
        {showBubble && currentQuote && (
          <motion.div
            key="speech-bubble"
            variants={bubbleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute -top-4 left-1/2 z-20 mb-3 w-48 -translate-x-1/2 -translate-y-full sm:w-56"
          >
            {/* Nội dung bong bóng */}
            <div className="relative rounded-2xl border-2 border-pink-light bg-white px-4 py-3 shadow-lg">
              {/* Text quote */}
              <p className="text-center text-xs font-medium text-navy sm:text-sm">
                {currentQuote}
              </p>
              {/* Tam giác trỏ xuống (pointer) */}
              <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
              {/* Viền tam giác bên ngoài */}
              <div className="absolute -bottom-[11px] left-1/2 h-0 w-0 -translate-x-1/2 border-l-[9px] border-r-[9px] border-t-[9px] border-l-transparent border-r-transparent border-t-pink-light" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== AVATAR CHÍNH ===== */}
      {/* Container có hiệu ứng floating, nhận sự kiện hover/click */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onClick={handleClick}
        className="relative cursor-pointer"
        /* Tăng vùng tap cho mobile */
        style={{ touchAction: "manipulation" }}
      >
        {/* ===== LỚP 1: MŨ CỬ NHÂN (MORTARBOARD) ===== */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Bảng mũ - hình vuông xoay 45° thành hình thoi */}
          <div className="relative">
            <div
              className="h-10 w-10 rotate-45 bg-navy shadow-md sm:h-14 sm:w-14"
              style={{
                /* Gradient nhẹ cho chiều sâu */
                background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
              }}
            />
            {/* Nút tròn trung tâm (nơi tua mũ gắn vào) */}
            <div className="absolute left-1/2 top-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-sm sm:h-3 sm:w-3" />

            {/* ===== TUA MŨ (TASSEL) ===== */}
            {/* Lắc lư theo hiệu ứng con lắc */}
            <motion.div
              variants={tasselSwingVariants}
              animate="animate"
              className="absolute left-1/2 top-1/2 z-10"
              style={{ originX: 0, originY: 0 }}
            >
              {/* Dây tua - đường thẳng vàng */}
              <div className="ml-0.5 h-8 w-[2px] bg-gold sm:h-10" />
              {/* Quả tua tròn ở cuối */}
              <div className="ml-[-3px] h-2.5 w-2.5 rounded-full bg-gold shadow-sm sm:ml-[-2px] sm:h-3 sm:w-3" />
            </motion.div>
          </div>

          {/* ===== LỚP 2: KHUÔN MẶT ===== */}
          {/* Hình tròn với mặt emoji đơn giản */}
          <motion.div
            variants={headBobVariants}
            animate={isSpinning || isWiggling ? faceControls : "animate"}
            className="relative -mt-1 z-10"
          >
            <div
              className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full shadow-md sm:h-[68px] sm:w-[68px]"
              style={{
                /* Màu da pastel ấm */
                background:
                  "radial-gradient(circle at 35% 35%, #ffe0c2, #f5c99f)",
              }}
            >
              {/* Hai chấm mắt */}
              <div className="absolute top-[35%] flex w-full justify-center gap-3 sm:gap-4">
                <div className="h-1.5 w-1.5 rounded-full bg-navy sm:h-2 sm:w-2" />
                <div className="h-1.5 w-1.5 rounded-full bg-navy sm:h-2 sm:w-2" />
              </div>

              {/* Đường cười - sử dụng border-bottom tạo cung tròn */}
              <div
                className="absolute top-[52%] h-3 w-5 rounded-b-full border-b-2 border-navy sm:h-4 sm:w-6 sm:border-b-[2.5px]"
              />

              {/* ===== LỚP 3: KÍNH THUG LIFE ===== */}
              {/* Trượt xuống khi hover/click */}
              <AnimatePresence>
                {showGlasses && (
                  <motion.div
                    key="glasses"
                    variants={glassesVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-[28%] flex items-center gap-[2px] sm:top-[30%]"
                  >
                    {/* Mắt kính trái - hình chữ nhật đen pixel style */}
                    <div className="h-2.5 w-4 rounded-[1px] bg-black sm:h-3 sm:w-5" />
                    {/* Cầu nối kính */}
                    <div className="h-[2px] w-1.5 bg-black sm:w-2" />
                    {/* Mắt kính phải */}
                    <div className="h-2.5 w-4 rounded-[1px] bg-black sm:h-3 sm:w-5" />
                    {/* Gọng kính trái */}
                    <div className="absolute -left-1 top-1/2 h-[1.5px] w-1.5 -translate-y-1/2 bg-black" />
                    {/* Gọng kính phải */}
                    <div className="absolute -right-1 top-1/2 h-[1.5px] w-1.5 -translate-y-1/2 bg-black" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ===== SPARKLE ✨ KHI ĐANG ĐEO KÍNH ===== */}
            <AnimatePresence>
              {showGlasses && (
                <>
                  {/* Sparkle ở các vị trí khác nhau xung quanh mặt */}
                  {[
                    { top: "-4px", right: "-8px" },
                    { top: "6px", left: "-10px" },
                    { bottom: "-2px", right: "-6px" },
                  ].map((pos, i) => (
                    <motion.span
                      key={`sparkle-${i}`}
                      custom={i}
                      variants={sparkleVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute text-xs sm:text-sm"
                      style={pos}
                    >
                      ✨
                    </motion.span>
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ===== LỚP 4: ÁO CHOÀNG CỬ NHÂN (GOWN) ===== */}
          {/* Hình thang - rộng dần xuống dưới */}
          <div
            className="-mt-3 h-[100px] w-[90px] rounded-b-2xl sm:-mt-4 sm:h-[140px] sm:w-[120px]"
            style={{
              /* Clip-path tạo hình thang */
              clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
              /* Gradient tối cho áo choàng */
              background:
                "linear-gradient(180deg, #1e1b4b 0%, #0f0a2e 60%, #1a1145 100%)",
            }}
          >
            {/* Đường viền áo choàng ở giữa */}
            <div className="mx-auto mt-2 h-full w-[2px] bg-navy-light opacity-40" />
          </div>
        </div>

        {/* ===== HIỆU ỨNG BÓNG ĐỔ DƯỚI CHÂN ===== */}
        <div className="mx-auto mt-1 h-2 w-16 rounded-full bg-navy/10 blur-sm sm:w-20" />
      </motion.div>
    </div>
  );
}
