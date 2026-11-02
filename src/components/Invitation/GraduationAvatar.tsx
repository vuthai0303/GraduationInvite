"use client";

import { GRADUATE_AVATAR_IMAGE } from "@/constants/eventDetails";
import { AnimatePresence, motion, useAnimation, type Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * =========================================================================
 * GRADUATION AVATAR - CỬ NHÂN NỮ TƯƠNG TÁC (QUỲNH NHIÊN)
 * =========================================================================
 *
 * Tính năng chính:
 * 1. Tóc dài bồng bềnh nữ tính, mặc váy tốt nghiệp thắt dải lụa cử nhân.
 * 2. Cánh tay trái ôm bó hoa tươi rực rỡ (hoa hướng dương, hoa hồng, baby).
 * 3. Cánh tay phải giơ cao bằng tốt nghiệp cuộn lại thắt nơ đỏ, vẫy lắc lắc vui nhộn.
 * 4. Khuôn mặt hình bầu dục được thiết kế sẵn để chèn ảnh mặt người thật:
 *    - Copy ảnh chân dung vào thư mục public (vd: public/quynh-nhien.jpg)
 *    - Và gán đường dẫn vào `GRADUATE_AVATAR_IMAGE` trong src/constants/eventDetails.ts
 *      hoặc biến `DEFAULT_AVATAR_IMAGE` bên dưới.
 *    - Nếu chưa có ảnh, avatar sẽ hiển thị khuôn bầu placeholder cực kỳ dễ thương.
 * 5. Bỏ kính thug life, giữ trọn vẹn animation lắc lư đầu vui nhộn, click xoay 360° & rung lắc.
 */

/**
 * Đường dẫn ảnh chân dung mặt thật mặc định (dự phòng).
 * Bạn có thể điền trực tiếp ở đây, truyền qua prop `avatarSrc`,
 * hoặc cấu hình tại `GRADUATE_AVATAR_IMAGE` trong `src/constants/eventDetails.ts`.
 */
export const DEFAULT_AVATAR_IMAGE = "";

/* ===== KIỂU DỮ LIỆU PROPS ===== */
interface GraduationAvatarProps {
  quotes: string[];
  avatarSrc?: string;
}

/* ===== FRAMER MOTION VARIANTS ===== */

/** Hiệu ứng bay lên xuống nhẹ nhàng cho toàn bộ nhân vật */
const floatingVariants: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/** Hiệu ứng lắc lư đầu vui nhộn (nghiêng nhẹ hai bên và gật gù) */
const headBobVariants: Variants = {
  animate: {
    rotate: [-3.5, 3.5, -3.5],
    y: [0, -3, 0],
    transition: {
      duration: 2.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/** Hiệu ứng quả tua mũ cử nhân lắc lư hình con lắc */
const tasselSwingVariants: Variants = {
  animate: {
    rotate: [0, 18, -14, 12, -8, 4, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/** Hiệu ứng cánh tay giơ bằng cử nhân lắc lắc vui nhộn trên không */
const diplomaArmVariants: Variants = {
  animate: {
    rotate: [-8, 20, -4, 24, -8],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/** Hiệu ứng cánh tay ôm bó hoa đung đưa nhịp nhàng theo nhịp thở */
const bouquetArmVariants: Variants = {
  animate: {
    rotate: [0, -3, 0, 3, 0],
    y: [0, -2, 0],
    transition: {
      duration: 2.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
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

export default function GraduationAvatar({
  quotes,
  avatarSrc,
}: GraduationAvatarProps) {
  /* ===== XÁC ĐỊNH ẢNH MẶT THẬT ===== */
  const effectiveImage = avatarSrc || GRADUATE_AVATAR_IMAGE || DEFAULT_AVATAR_IMAGE;

  /* ===== STATE QUẢN LÝ TƯƠNG TÁC ===== */
  const [currentQuote, setCurrentQuote] = useState(() => (quotes.length > 0 ? quotes[0] : ""));
  const [showBubble, setShowBubble] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);

  /** Ref đếm số click liên tục */
  const clickCountRef = useRef(0);
  /** Ref theo dõi thời gian click cuối cùng để kích hoạt wiggle */
  const lastClickTimeRef = useRef(0);
  /** Ref lưu timeout ID để reset click count */
  const clickResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Controls cho animation xoay/rung mặt */
  const faceControls = useAnimation();

  /**
   * Lấy một câu quote ngẫu nhiên từ mảng quotes
   * Đảm bảo không trùng lặp với quote đang hiển thị (nếu mảng > 1 câu)
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

  /** Xử lý khi hover vào avatar */
  const handleHoverStart = useCallback(() => {
    setShowBubble(true);
    if (!currentQuote) {
      setCurrentQuote(getRandomQuote());
    }
  }, [currentQuote, getRandomQuote]);

  /** Xử lý khi rời chuột khỏi avatar */
  const handleHoverEnd = useCallback(() => {
    setShowBubble(false);
  }, []);

  /**
   * Xử lý click vào avatar:
   * - Đổi câu quote ngẫu nhiên
   * - Xoay mặt 360° vui nhộn
   * - Nếu click dồn dập (>= 3 lần / 800ms): rung lắc (wiggle) phấn khích
   */
  const handleClick = useCallback(() => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    lastClickTimeRef.current = now;

    setShowBubble(true);
    setCurrentQuote(getRandomQuote());

    /* Phát hiện click dồn dập */
    if (timeSinceLastClick < 800) {
      clickCountRef.current += 1;
      if (clickCountRef.current >= 3) {
        setIsWiggling(true);
        faceControls.start({
          rotate: [0, -12, 12, -12, 12, -6, 6, 0],
          transition: { duration: 0.5 },
        });
        setTimeout(() => setIsWiggling(false), 600);
      }
    } else {
      clickCountRef.current = 1;
    }

    /* Xoay mặt 360° */
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
          faceControls.set({ rotate: 0 });
        });
    }

    /* Tự động reset bộ đếm click */
    if (clickResetTimerRef.current) {
      clearTimeout(clickResetTimerRef.current);
    }
    clickResetTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);
  }, [getRandomQuote, faceControls, isSpinning, isWiggling]);

  /** Dọn dẹp timer khi unmount */
  useEffect(() => {
    return () => {
      if (clickResetTimerRef.current) {
        clearTimeout(clickResetTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* ===== BONG BÓNG HỘI THOẠI (SPEECH BUBBLE) ===== */}
      <AnimatePresence>
        {showBubble && currentQuote && (
          <motion.div
            key="speech-bubble"
            variants={bubbleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute -top-6 left-1/2 z-40 mb-3 w-52 -translate-x-1/2 -translate-y-full sm:w-60 pointer-events-none"
          >
            <div className="relative rounded-2xl border-2 border-pink-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-xs">
              <p className="text-center text-xs font-bold text-navy sm:text-sm leading-relaxed">
                {currentQuote}
              </p>
              {/* Mũi tên chỉ xuống */}
              <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
              <div className="absolute -bottom-[10px] left-1/2 h-0 w-0 -translate-x-1/2 border-l-[9px] border-r-[9px] border-t-[9px] border-l-transparent border-r-transparent border-t-pink-200" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== AVATAR CỬ NHÂN NỮ CHÍNH ===== */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onClick={handleClick}
        className="relative cursor-pointer px-4 pt-2 pb-1"
        style={{ touchAction: "manipulation" }}
      >
        {/* VÙNG NHÂN VẬT TRUNG TÂM */}
        <div className="relative flex flex-col items-center">
          {/* ======================================================== */}
            {/* LỚP 1: MŨ CỬ NHÂN (MORTARBOARD) & QUẢ TUA VÀNG 3D         */}
            {/* Góc nhìn trực diện chuẩn anime: Chóp hình thoi + Vòm mũ  */}
            {/* ôm trán + Quả tua hạt tròn & chùm sợi tơ vàng đung đưa    */}
            {/* ======================================================== */}
            <div className="relative z-30 w-[80px] sm:w-[96px] pointer-events-none drop-shadow-md">
              <svg
                viewBox="0 0 220 170"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto overflow-visible"
              >
                <defs>
                  {/* Gradient bề mặt phẳng hình thoi chóp mũ */}
                  <linearGradient id="capBoardGrad" x1="110" y1="10" x2="110" y2="88" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#232a3b" />
                    <stop offset="45%" stopColor="#141824" />
                    <stop offset="100%" stopColor="#090b12" />
                  </linearGradient>

                  {/* Gradient mép vát 3D dưới đáy chóp mũ */}
                  <linearGradient id="capEdgeLeftGrad" x1="14" y1="54" x2="110" y2="90" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#080a10" />
                    <stop offset="100%" stopColor="#182030" />
                  </linearGradient>
                  <linearGradient id="capEdgeRightGrad" x1="110" y1="90" x2="206" y2="54" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#182030" />
                    <stop offset="100%" stopColor="#05070a" />
                  </linearGradient>

                  {/* Gradient vòm mũ vải ôm đầu (trái & phải) */}
                  <linearGradient id="capSkullLeftGrad" x1="65" y1="68" x2="105" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2e384d" />
                    <stop offset="35%" stopColor="#1a2233" />
                    <stop offset="100%" stopColor="#0a0d16" />
                  </linearGradient>
                  <linearGradient id="capSkullRightGrad" x1="155" y1="68" x2="115" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#273042" />
                    <stop offset="35%" stopColor="#161c2b" />
                    <stop offset="100%" stopColor="#070910" />
                  </linearGradient>

                  {/* Gradient dây tua vàng rủ */}
                  <linearGradient id="capTasselCordGrad" x1="0" y1="0" x2="4" y2="35" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="60%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>

                  {/* Gradient hạt ngọc vàng quả tua */}
                  <radialGradient id="capTasselBeadGrad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#fffbeb" />
                    <stop offset="30%" stopColor="#fde047" />
                    <stop offset="65%" stopColor="#f59e0b" />
                    <stop offset="90%" stopColor="#b45309" />
                    <stop offset="100%" stopColor="#78350f" />
                  </radialGradient>

                  {/* Gradient chùm sợi tơ vàng */}
                  <linearGradient id="capTasselBrushGrad" x1="0" y1="42" x2="14" y2="95" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="25%" stopColor="#f59e0b" />
                    <stop offset="60%" stopColor="#fbbf24" />
                    <stop offset="85%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#92400e" />
                  </linearGradient>
                </defs>

                {/* 1. VÒM MŨ VẢI ÔM ĐẦU (SKULLCAP) */}
                <g id="cap-skullcap">
                  {/* Múi mũ trái */}
                  <path
                    d="M 110 70 C 85 70 64 80 50 102 C 66 107 88 111 110 120 Z"
                    fill="url(#capSkullLeftGrad)"
                    stroke="#090c14"
                    strokeWidth="1.2"
                  />
                  {/* Múi mũ phải */}
                  <path
                    d="M 110 70 C 135 70 156 80 170 102 C 154 107 132 111 110 120 Z"
                    fill="url(#capSkullRightGrad)"
                    stroke="#090c14"
                    strokeWidth="1.2"
                  />

                  {/* Vệt sáng bóng 3D anime trên 2 múi mũ */}
                  <path
                    d="M 68 84 C 80 78 95 80 104 87"
                    stroke="#475569"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <path
                    d="M 152 84 C 140 78 125 80 116 87"
                    stroke="#374151"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    opacity="0.5"
                  />

                  {/* Đường may gân giữa mũ */}
                  <path d="M 110 70 L 110 120" stroke="#3b4861" strokeWidth="1.2" strokeLinecap="round" />

                  {/* Đường viền mũ ôm trán lượn sóng đỉnh nhọn ở giữa (widow's peak) */}
                  <path
                    d="M 49 102 C 66 107 88 111 110 120 C 132 111 154 107 171 102"
                    fill="none"
                    stroke="#05070a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 52 103 C 68 108 89 112 110 120 C 131 112 152 108 168 103"
                    fill="none"
                    stroke="#1e2638"
                    strokeWidth="0.8"
                    opacity="0.7"
                  />
                </g>

                {/* 2. CHÓP MŨ HÌNH THOI (MORTARBOARD) */}
                <g id="cap-mortarboard">
                  {/* Mép vát 3D dưới đáy chóp mũ tạo độ dày */}
                  <path
                    d="M 14 54 L 110 88 L 110 93 L 14 59 Z"
                    fill="url(#capEdgeLeftGrad)"
                    stroke="#05070a"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M 110 88 L 206 54 L 206 59 L 110 93 Z"
                    fill="url(#capEdgeRightGrad)"
                    stroke="#05070a"
                    strokeWidth="0.8"
                  />

                  {/* Mặt trên hình thoi góc nhìn trực diện */}
                  <path
                    d="M 110 10 L 206 54 L 110 88 L 14 54 Z"
                    fill="url(#capBoardGrad)"
                    stroke="#0a0d14"
                    strokeWidth="1.2"
                  />

                  {/* Viền sáng góc cạnh chóp mũ (anime edge highlight) */}
                  <path
                    d="M 14 54 L 110 10 L 206 54"
                    stroke="#64748b"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  <path
                    d="M 16 54 L 110 87 L 204 54"
                    stroke="#2a3447"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.9"
                  />

                  {/* Nút tròn vàng ở đỉnh mũ */}
                  <ellipse cx="110" cy="50" rx="4.5" ry="3.5" fill="#1e2433" stroke="#475569" strokeWidth="0.8" />
                  <ellipse cx="110" cy="50" rx="2.5" ry="2" fill="#fbbf24" />

                  {/* Dây tua vàng vắt ngang mặt mũ sang mép phải */}
                  <path
                    d="M 110 50 Q 146 54 176 65"
                    fill="none"
                    stroke="#b45309"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 110 50 Q 146 54 176 65"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </g>

                {/* 3. QUẢ TUA VÀNG LẮC LƯ (SWINGING TASSEL) */}
                <g transform="translate(176, 65)">
                  <motion.g
                    variants={tasselSwingVariants}
                    animate="animate"
                    style={{ originX: 0, originY: 0 }}
                  >
                    {/* Đoạn dây rủ xuống từ mép mũ */}
                    <path
                      d="M 0 0 C 2 11, 4 23, 4 32"
                      fill="none"
                      stroke="url(#capTasselCordGrad)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 0 0 C 2 11, 4 23, 4 32"
                      fill="none"
                      stroke="#fef08a"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      opacity="0.6"
                    />

                    {/* Khuyên kẹp trên & Hạt ngọc quả tua tròn & Khuyên kẹp dưới */}
                    <rect x="1" y="31" width="6" height="2" rx="0.8" fill="#b45309" stroke="#78350f" strokeWidth="0.4" />
                    <circle cx="4" cy="36" r="4.2" fill="url(#capTasselBeadGrad)" stroke="#b45309" strokeWidth="0.6" />
                    <rect x="0.5" y="40" width="7" height="2.2" rx="0.8" fill="#b45309" stroke="#78350f" strokeWidth="0.4" />

                    {/* Chùm sợi tơ vàng rủ mềm mại */}
                    <path
                      d="M 1 42 Q -1 60 2 90 Q 7 95 17 92 Q 16 63 7 42 Z"
                      fill="url(#capTasselBrushGrad)"
                      stroke="#b45309"
                      strokeWidth="0.6"
                    />
                    {/* Từng sợi chỉ tơ vàng óng ánh */}
                    <path d="M 2.5 43 Q 1 62 3 88" stroke="#fef08a" strokeWidth="0.8" fill="none" />
                    <path d="M 4 43 Q 3 63 7 90" stroke="#ffffff" strokeWidth="0.7" opacity="0.9" fill="none" />
                    <path d="M 5.5 43 Q 7 65 12 88" stroke="#fef08a" strokeWidth="0.8" fill="none" />
                    <path d="M 1.5 51 Q 0 70 2 84" stroke="#b45309" strokeWidth="0.5" fill="none" />
                    <path d="M 6 51 Q 9 72 14 85" stroke="#b45309" strokeWidth="0.5" fill="none" />
                    {/* Đuôi tua rua tỉa sợi tự nhiên */}
                    <path
                      d="M 2 88 L 3 91 L 4.5 89 L 6 91 L 8 89 L 10 92 L 12 89 L 14 91 L 16 89"
                      stroke="#92400e"
                      strokeWidth="0.6"
                      fill="none"
                    />
                  </motion.g>
                </g>
              </svg>
            </div>

          {/* ======================================================== */}
          {/* LỚP 2: TÓC DÀI SAU LƯNG (BACK HAIR LAYER)                 */}
          {/* ======================================================== */}
          <div
            className="absolute top-7 left-1/2 -translate-x-1/2 z-0 h-[112px] w-[82px] sm:top-9 sm:h-[138px] sm:w-[102px] rounded-t-full rounded-b-[32px] shadow-sm"
            style={{
              background: "linear-gradient(180deg, #181513 0%, #29231f 65%, #181513 100%)",
            }}
          >
            {/* Vệt sáng óng ả trên tóc */}
            <div className="mx-auto mt-4 h-14 w-8 rounded-full bg-stone-700/20 blur-xs" />
          </div>

          {/* ======================================================== */}
          {/* LỚP 3: KHUÔN MẶT BẦU DỤC (HỖ TRỢ MẶT NGƯỜI THẬT)         */}
          {/* ======================================================== */}
          <motion.div
            variants={headBobVariants}
            animate={isSpinning || isWiggling ? faceControls : "animate"}
            className="relative z-20 -mt-2 flex flex-col items-center"
          >
            {/* Khung bầu dục tỉ lệ mặt nữ: bo tròn mềm mại chuẩn hình bầu */}
            <div
              className="relative -top-3 h-[72px] w-[64px] sm:h-[96px] sm:w-[80px] overflow-hidden rounded-[50%/55%_55%_45%_45%] shadow-md ring-2 ring-pink-200/80 transition-transform group-hover:scale-105"
            >
              {effectiveImage ? (
                /* ẢNH MẶT NGƯỜI THẬT: khớp hoàn hảo vào khung bầu dục */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={effectiveImage}
                  alt="Cử nhân Quỳnh Nhiên"
                  className="h-full w-full object-cover"
                />
              ) : (
                /* PLACEHOLDER KHUÔN BẦU CỬ NHÂN NỮ DỄ THƯƠNG */
                <div
                  className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 35%, #fff7f2 0%, #feddc7 65%, #f7c39f 100%)",
                  }}
                >
                  {/* Tóc mái mềm rủ dưới mũ */}
                  <div className="absolute top-0 inset-x-0 h-3 bg-[#181513] rounded-b-xl opacity-90" />

                  {/* Mắt cười cong hình trăng khuyết nữ tính */}
                  <div className="absolute top-[37%] flex w-full justify-center gap-3 sm:gap-3.5">
                    <div className="relative">
                      <div className="h-1.5 w-2.5 sm:h-2 sm:w-3 rounded-t-full border-t-2 border-stone-800" />
                    </div>
                    <div className="relative">
                      <div className="h-1.5 w-2.5 sm:h-2 sm:w-3 rounded-t-full border-t-2 border-stone-800" />
                    </div>
                  </div>

                  {/* Đôi má ửng hồng phấn ngọt ngào */}
                  <div className="absolute top-[50%] flex w-full justify-between px-2 sm:px-2.5">
                    <div className="h-2 w-2.5 sm:h-2.5 sm:w-3 rounded-full bg-pink-400/40 blur-[1px]" />
                    <div className="h-2 w-2.5 sm:h-2.5 sm:w-3 rounded-full bg-pink-400/40 blur-[1px]" />
                  </div>

                  {/* Nụ cười duyên dáng */}
                  <div className="absolute top-[58%] h-2 w-3 sm:h-2.5 sm:w-3.5 rounded-b-full bg-rose-400/90 overflow-hidden flex items-start justify-center">
                    <div className="h-0.5 w-2 bg-white rounded-b-xs" />
                  </div>
                </div>
              )}
            </div>

            {/* ===== SPARKLE ✨ KHI ĐANG ĐEO KÍNH ===== */}
            <AnimatePresence>
              {
                <>
                  {/* Sparkle ở các vị trí khác nhau xung quanh mặt */}
                  {[
                    { top: "-4px", right: "-15px" },
                    { top: "6px", left: "-15px" },
                    { bottom: "-2px", right: "-10px" },
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
              }
            </AnimatePresence>
          </motion.div>

          {/* ======================================================== */}
          {/* LỚP 4: HAI LỌN TÓC DÀI PHÍA TRƯỚC VAI (FRONT STRANDS)     */}
          {/* ======================================================== */}
          {/* Lọn tóc trái buông trước ngực */}
          <div
            className="absolute top-14 -left-0.5 sm:top-18 sm:-left-1 z-25 h-16 w-3.5 sm:h-20 sm:w-4.5 rounded-full shadow-xs pointer-events-none"
            style={{
              background: "linear-gradient(180deg, #241e1a 0%, #181513 100%)",
              transform: "rotate(6deg)",
            }}
          />
          {/* Lọn tóc phải buông trước ngực */}
          <div
            className="absolute top-14 -right-0.5 sm:top-18 sm:-right-1 z-25 h-16 w-3.5 sm:h-20 sm:w-4.5 rounded-full shadow-xs pointer-events-none"
            style={{
              background: "linear-gradient(180deg, #241e1a 0%, #181513 100%)",
              transform: "rotate(-6deg)",
            }}
          />

          {/* ======================================================== */}
          {/* LỚP 5: VÁY TỐT NGHIỆP CỬ NHÂN NỮ (GRADUATION GOWN)       */}
          {/* ======================================================== */}
          <div className="relative -mt-3.5 z-10 flex flex-col items-center">
            {/* Thân váy A-line xòe nhẹ duyên dáng */}
            <div
              className="relative h-[105px] w-[86px] sm:h-[135px] sm:w-[108px] rounded-b-3xl overflow-hidden shadow-lg"
              style={{
                clipPath: "polygon(14% 0%, 86% 0%, 100% 100%, 0% 100%)",
                background:
                  "linear-gradient(180deg, #1e1b4b 0%, #0f0a2e 60%, #1a1145 100%)",
              }}
            >
              {/* Cổ áo sơ mi trắng tinh khôi hình chữ V */}
              <div
                className="mx-auto h-7 w-8 bg-white shadow-xs"
                style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
              />

              {/* Dải lụa cử nhân (Stole) màu đỏ mận viền vàng kim vắt qua 2 vai */}
              <div className="absolute top-0 inset-x-0 flex justify-between px-3">
                <div className="h-24 w-3.5 bg-gradient-to-b from-rose-600 to-rose-700 border-x border-amber-300 shadow-xs" />
                <div className="h-24 w-3.5 bg-gradient-to-b from-rose-600 to-rose-700 border-x border-amber-300 shadow-xs" />
              </div>

              {/* Đường ly váy ở giữa */}
              <div className="mx-auto mt-1 h-full w-[1.5px] bg-indigo-300/30" />
            </div>
          </div>

          {/* ======================================================== */}
          {/* LỚP 6: TAY PHẢI - GIƠ BẰNG TỐT NGHIỆP CÓ NƠ ĐỎ LẮC LẮC   */}
          {/* ======================================================== */}
          <motion.div
            variants={diplomaArmVariants}
            animate="animate"
            className="absolute top-8 -right-8 sm:top-20 sm:-right-10 z-20"
            style={{ originX: 0.15, originY: 0.85 }}
          >
            <div className="relative flex flex-col items-center">
              {/* Bằng tốt nghiệp cuộn lại thắt nơ đỏ */}
              <svg
                width="40"
                height="56"
                viewBox="0 0 40 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-md -rotate-45 translate-1"
              >
                {/* Cuộn giấy bằng tốt nghiệp màu kem */}
                <rect
                  x="11"
                  y="5"
                  width="18"
                  height="44"
                  rx="3"
                  fill="#fffbeb"
                  stroke="#d97706"
                  strokeWidth="0.8"
                />
                {/* Cuộn nếp giấy trên và dưới */}
                <ellipse cx="20" cy="5" rx="9" ry="3" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" />
                <path d="M11 49 C11 52, 29 52, 29 49" stroke="#d97706" strokeWidth="0.8" fill="#fef3c7" />

                {/* Dải ruy băng nhung đỏ cuốn ngang */}
                <rect x="10.5" y="23" width="19" height="7" rx="1.5" fill="#dc2626" />
                <path d="M10.5 26.5 H29.5" stroke="#ef4444" strokeWidth="0.8" />

                {/* Chiếc nơ đỏ thắm */}
                <circle cx="20" cy="26.5" r="3" fill="#b91c1c" />
                {/* Cánh nơ trái & phải */}
                <path d="M20 26.5 C15 22, 12 25, 17 28 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.5" />
                <path d="M20 26.5 C25 22, 28 25, 23 28 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.5" />
                {/* Hai dải ruy băng buông xuống */}
                <path d="M18 29 Q14 39 12 43 Q15 40 19 30 Z" fill="#dc2626" />
                <path d="M22 29 Q26 39 28 43 Q25 40 21 30 Z" fill="#dc2626" />
                <circle cx="20" cy="26.5" r="1.2" fill="#fca5a5" />
              </svg>

              {/* Bàn tay nhỏ nắm bằng */}
              <div className="absolute top-15 right-0 h-3.5 w-3.5 -mt-3 rounded-full bg-[#feddc7] shadow-xs border border-amber-200" />

              {/* Ống tay áo cử nhân hướng lên */}
              <div
                className="h-9 w-6 -mt-1 rounded-b-xl shadow-md"
                style={{
                  background: "linear-gradient(135deg, #1e1b4b 0%, #0f0a2e 100%)",
                  transform: "rotate(35deg)",
                }}
              />
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* LỚP 7: TAY TRÁI - ÔM BÓ HOA TỐT NGHIỆP TƯƠI TẮN         */}
          {/* ======================================================== */}
          <motion.div
            variants={bouquetArmVariants}
            animate="animate"
            className="absolute top-27 -left-8 sm:top-35 z-25"
            style={{ originX: 0.85, originY: 0.2 }}
          >
            <div className="relative">
              {/* Bó hoa tốt nghiệp tươi tắn */}
              <svg
                width="64"
                height="68"
                viewBox="0 0 64 68"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-md absolute left-12"
              >
                {/* Lá xanh cành hoa */}
                <path d="M18 26 C12 18, 20 10, 26 16 C28 20, 24 25, 18 26 Z" fill="#16a34a" />
                <path d="M46 26 C52 18, 44 10, 38 16 C36 20, 40 25, 46 26 Z" fill="#15803d" />
                <path d="M32 16 C32 8, 38 6, 40 12 C38 16, 34 18, 32 16 Z" fill="#22c55e" />

                {/* Giấy gói hoa màu hồng pastel / kem be */}
                <path
                  d="M10 26 L32 64 L54 26 Q46 22 32 24 Q18 22 10 26 Z"
                  fill="#fbcfe8"
                  stroke="#f472b6"
                  strokeWidth="1.2"
                />
                <path d="M16 28 L32 64 L48 28 Z" fill="#fdf2f8" opacity="0.6" />

                {/* Hoa hướng dương ở trung tâm bó hoa */}
                <g transform="translate(32, 22)">
                  <circle cx="0" cy="0" r="10" fill="#f59e0b" />
                  <circle cx="0" cy="0" r="5.5" fill="#78350f" />
                  <circle cx="0" cy="-8.5" r="3" fill="#fbbf24" />
                  <circle cx="0" cy="8.5" r="3" fill="#fbbf24" />
                  <circle cx="-8.5" cy="0" r="3" fill="#fbbf24" />
                  <circle cx="8.5" cy="0" r="3" fill="#fbbf24" />
                  <circle cx="-6" cy="-6" r="3" fill="#fbbf24" />
                  <circle cx="6" cy="-6" r="3" fill="#fbbf24" />
                  <circle cx="-6" cy="6" r="3" fill="#fbbf24" />
                  <circle cx="6" cy="6" r="3" fill="#fbbf24" />
                  <circle cx="0" cy="0" r="4" fill="#451a03" />
                </g>

                {/* Hoa hồng đỏ bên trái */}
                <g transform="translate(18, 18)">
                  <circle cx="0" cy="0" r="7.5" fill="#f43f5e" />
                  <circle cx="-1" cy="-1" r="4.5" fill="#fb7185" />
                  <circle cx="0" cy="0" r="2.5" fill="#fda4af" />
                </g>

                {/* Hoa hồng phấn bên phải */}
                <g transform="translate(46, 18)">
                  <circle cx="0" cy="0" r="7" fill="#ec4899" />
                  <circle cx="0" cy="0" r="4" fill="#f472b6" />
                  <circle cx="0" cy="0" r="2" fill="#fbcfe8" />
                </g>

                {/* Hoa baby trắng điểm xuyết */}
                <circle cx="12" cy="16" r="2.2" fill="#ffffff" />
                <circle cx="26" cy="11" r="1.8" fill="#ffffff" />
                <circle cx="52" cy="15" r="2.2" fill="#ffffff" />
                <circle cx="38" cy="9" r="1.8" fill="#ffffff" />

                {/* Dải nơ thắt trên giấy gói */}
                <rect x="24" y="44" width="16" height="4.5" rx="1.8" fill="#e11d48" />
                <circle cx="32" cy="46" r="2.8" fill="#be123c" />
                <path d="M32 46 Q24 42 24 47 Q28 49 32 46" fill="#f43f5e" />
                <path d="M32 46 Q40 42 40 47 Q36 49 32 46" fill="#f43f5e" />
                {/* Đuôi nơ */}
                <path d="M30 47 L26 58 L31 55 L32 47 Z" fill="#e11d48" />
                <path d="M34 47 L38 58 L33 55 L32 47 Z" fill="#e11d48" />
              </svg>

              {/* Bàn tay nhỏ ôm giữ bó hoa */}
              <div className="absolute top-11 -right-18 h-3.5 w-4 rounded-full bg-[#feddc7] shadow-xs border border-amber-200" />

              {/* Ống tay áo cử nhân ôm cong */}
              <div
                className="absolute top-4 -right-15 h-11 w-6 rounded-2xl shadow-md"
                style={{
                  background: "linear-gradient(135deg, #1e1b4b 0%, #0f0a2e 100%)",
                  transform: "rotate(-40deg)",
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* ===== HIỆU ỨNG BÓNG ĐỔ DƯỚI CHÂN ===== */}
        <div className="mx-auto mt-2 h-2.5 w-24 rounded-full bg-indigo-950/15 blur-sm sm:w-28" />
      </motion.div>
    </div>
  );
}
